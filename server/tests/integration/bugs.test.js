// bugs.test.js - Integration tests for bugs API endpoints

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../src/app');
const Bug = require('../../src/models/Bug');

let mongoServer;
let bugId;

// Setup in-memory MongoDB server before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Create a test bug
  const bug = await Bug.create({
    title: 'Test Bug',
    description: 'This is a test bug description',
    status: 'open',
    priority: 'medium',
    reporter: 'Test User',
  });
  bugId = bug._id;
});

// Clean up after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clean up database between tests
afterEach(async () => {
  // Keep the initial bug, but clean up any other created data
  const bugs = await Bug.find({ _id: { $ne: bugId } });
  for (const bug of bugs) {
    await Bug.findByIdAndDelete(bug._id);
  }
});

describe('POST /api/bugs', () => {
  it('should create a new bug with valid data', async () => {
    const newBug = {
      title: 'New Test Bug',
      description: 'This is a new test bug description',
      status: 'open',
      priority: 'high',
      reporter: 'John Doe',
    };

    const res = await request(app)
      .post('/api/bugs')
      .send(newBug);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id');
    expect(res.body.data.title).toBe(newBug.title);
    expect(res.body.data.description).toBe(newBug.description);
    expect(res.body.data.status).toBe(newBug.status);
    expect(res.body.data.priority).toBe(newBug.priority);
    expect(res.body.data.reporter).toBe(newBug.reporter);
  });

  it('should return 400 if required fields are missing', async () => {
    const invalidBug = {
      description: 'This bug is missing a title',
    };

    const res = await request(app)
      .post('/api/bugs')
      .send(invalidBug);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBeDefined();
  });

  it('should return 400 if title is empty', async () => {
    const invalidBug = {
      title: '',
      description: 'This is a description',
      reporter: 'John Doe',
    };

    const res = await request(app)
      .post('/api/bugs')
      .send(invalidBug);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should use default status and priority if not provided', async () => {
    const newBug = {
      title: 'Bug with defaults',
      description: 'This bug uses default values',
      reporter: 'Jane Doe',
    };

    const res = await request(app)
      .post('/api/bugs')
      .send(newBug);

    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe('open');
    expect(res.body.data.priority).toBe('medium');
  });
});

describe('GET /api/bugs', () => {
  it('should return all bugs', async () => {
    const res = await request(app).get('/api/bugs');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBeTruthy();
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.pagination).toBeDefined();
  });

  it('should filter bugs by status', async () => {
    // Create a bug with specific status
    await Bug.create({
      title: 'In Progress Bug',
      description: 'This bug is in progress',
      status: 'in-progress',
      priority: 'high',
      reporter: 'Test User',
    });

    const res = await request(app)
      .get('/api/bugs?status=in-progress');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBeTruthy();
    res.body.data.forEach(bug => {
      expect(bug.status).toBe('in-progress');
    });
  });

  it('should filter bugs by priority', async () => {
    // Create a bug with specific priority
    await Bug.create({
      title: 'Critical Bug',
      description: 'This is a critical bug',
      status: 'open',
      priority: 'critical',
      reporter: 'Test User',
    });

    const res = await request(app)
      .get('/api/bugs?priority=critical');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBeTruthy();
    res.body.data.forEach(bug => {
      expect(bug.priority).toBe('critical');
    });
  });

  it('should paginate results', async () => {
    // Create multiple bugs
    const bugs = [];
    for (let i = 0; i < 15; i++) {
      bugs.push({
        title: `Pagination Bug ${i}`,
        description: `Description for bug ${i}`,
        reporter: 'Test User',
      });
    }
    await Bug.insertMany(bugs);

    const page1 = await request(app)
      .get('/api/bugs?page=1&limit=10');
    
    const page2 = await request(app)
      .get('/api/bugs?page=2&limit=10');

    expect(page1.status).toBe(200);
    expect(page2.status).toBe(200);
    expect(page1.body.data.length).toBe(10);
    expect(page2.body.data.length).toBeGreaterThan(0);
    expect(page1.body.pagination.page).toBe(1);
    expect(page2.body.pagination.page).toBe(2);
  });

  it('should sort bugs by createdAt descending by default', async () => {
    // Create bugs with delays to ensure different timestamps
    await Bug.create({
      title: 'Older Bug',
      description: 'This is an older bug',
      reporter: 'Test User',
    });

    await new Promise(resolve => setTimeout(resolve, 10));

    await Bug.create({
      title: 'Newer Bug',
      description: 'This is a newer bug',
      reporter: 'Test User',
    });

    const res = await request(app).get('/api/bugs');

    expect(res.status).toBe(200);
    // The newest bug should be first (descending order)
    expect(res.body.data[0].title).toBe('Newer Bug');
  });
});

describe('GET /api/bugs/:id', () => {
  it('should return a bug by ID', async () => {
    const res = await request(app)
      .get(`/api/bugs/${bugId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBe(bugId.toString());
    expect(res.body.data.title).toBe('Test Bug');
  });

  it('should return 404 for non-existent bug', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/bugs/${nonExistentId}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Bug not found');
  });

  it('should return 400 for invalid ID format', async () => {
    const res = await request(app)
      .get('/api/bugs/invalid-id');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('PUT /api/bugs/:id', () => {
  it('should update a bug when valid data is provided', async () => {
    const updates = {
      title: 'Updated Test Bug',
      description: 'This description has been updated',
      status: 'in-progress',
      priority: 'high',
    };

    const res = await request(app)
      .put(`/api/bugs/${bugId}`)
      .send(updates);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(updates.title);
    expect(res.body.data.description).toBe(updates.description);
    expect(res.body.data.status).toBe(updates.status);
    expect(res.body.data.priority).toBe(updates.priority);
  });

  it('should return 404 for non-existent bug', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const updates = {
      title: 'Updated Title',
    };

    const res = await request(app)
      .put(`/api/bugs/${nonExistentId}`)
      .send(updates);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 for invalid status', async () => {
    const updates = {
      status: 'invalid-status',
    };

    const res = await request(app)
      .put(`/api/bugs/${bugId}`)
      .send(updates);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should allow partial updates', async () => {
    const updates = {
      status: 'resolved',
    };

    const res = await request(app)
      .put(`/api/bugs/${bugId}`)
      .send(updates);

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('resolved');
    // Other fields should remain unchanged
    expect(res.body.data.title).toBe('Test Bug');
  });
});

describe('PATCH /api/bugs/:id/status', () => {
  it('should update bug status', async () => {
    const res = await request(app)
      .patch(`/api/bugs/${bugId}/status`)
      .send({ status: 'resolved' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('resolved');
  });

  it('should return 400 if status is missing', async () => {
    const res = await request(app)
      .patch(`/api/bugs/${bugId}/status`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 404 for non-existent bug', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .patch(`/api/bugs/${nonExistentId}/status`)
      .send({ status: 'resolved' });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe('DELETE /api/bugs/:id', () => {
  it('should delete a bug when valid ID is provided', async () => {
    // Create a bug to delete
    const bugToDelete = await Bug.create({
      title: 'Bug to Delete',
      description: 'This bug will be deleted',
      reporter: 'Test User',
    });

    const res = await request(app)
      .delete(`/api/bugs/${bugToDelete._id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('deleted');
    
    // Verify bug is deleted
    const deletedBug = await Bug.findById(bugToDelete._id);
    expect(deletedBug).toBeNull();
  });

  it('should return 404 for non-existent bug', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/api/bugs/${nonExistentId}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 for invalid ID format', async () => {
    const res = await request(app)
      .delete('/api/bugs/invalid-id');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

