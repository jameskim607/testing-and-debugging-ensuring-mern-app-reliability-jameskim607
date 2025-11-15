# 🐛 Bug Tracker - MERN Stack Application

A comprehensive Bug Tracker application built with the MERN (MongoDB, Express, React, Node.js) stack, featuring extensive testing and debugging capabilities.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Debugging](#debugging)
- [API Documentation](#api-documentation)
- [Testing Strategy](#testing-strategy)
- [Coverage](#coverage)

## 🎯 Overview

This Bug Tracker application allows users to:
- **Report new bugs** by filling out a detailed form
- **View a list of all reported bugs** with filtering and pagination
- **Update bug statuses** (open, in-progress, resolved, closed)
- **Edit bug details** (title, description, priority, etc.)
- **Delete bugs** with confirmation

The project demonstrates comprehensive testing practices including:
- Unit testing for utilities, components, and functions
- Integration testing for API endpoints and component interactions
- End-to-end testing with Cypress
- Error handling and debugging techniques

## ✨ Features

### Backend Features
- RESTful API with Express.js
- MongoDB with Mongoose for data persistence
- Input validation and error handling
- Request logging for debugging
- Global error handler middleware
- In-memory MongoDB for testing

### Frontend Features
- React functional components with hooks
- Responsive design with CSS Grid and Flexbox
- Error boundaries for graceful error handling
- Form validation with user feedback
- Real-time status updates
- Loading and error states

### Testing Features
- Jest for unit and integration testing
- React Testing Library for component testing
- Supertest for API endpoint testing
- Cypress for end-to-end testing
- MongoDB Memory Server for isolated tests
- Code coverage reporting

## 🛠 Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Jest** - Testing framework
- **Supertest** - HTTP assertions
- **MongoDB Memory Server** - In-memory MongoDB for tests

### Frontend
- **React 18** - UI library
- **Axios** - HTTP client
- **React Testing Library** - Component testing
- **Jest** - Testing framework
- **Cypress** - End-to-end testing

## 📁 Project Structure

```
mern-bug-tracker/
├── client/                 # React front-end
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── BugCard.jsx
│   │   │   ├── BugForm.jsx
│   │   │   ├── BugList.jsx
│   │   │   ├── Button.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── services/       # API services
│   │   │   └── api.js
│   │   ├── tests/          # Client-side tests
│   │   │   ├── unit/       # Unit tests
│   │   │   └── integration/ # Integration tests
│   │   ├── App.jsx         # Main application component
│   │   └── index.js        # Entry point
│   ├── cypress/            # End-to-end tests
│   │   ├── e2e/
│   │   └── support/
│   └── package.json
├── server/                 # Express.js back-end
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   │   └── bugsController.js
│   │   ├── models/         # Mongoose models
│   │   │   └── Bug.js
│   │   ├── routes/         # API routes
│   │   │   └── bugs.js
│   │   ├── middleware/     # Custom middleware
│   │   │   └── errorHandler.js
│   │   ├── utils/          # Utility functions
│   │   │   └── validation.js
│   │   └── app.js          # Express app setup
│   ├── tests/              # Server-side tests
│   │   ├── unit/           # Unit tests
│   │   │   └── validation.test.js
│   │   └── integration/    # Integration tests
│   │       └── bugs.test.js
│   └── package.json
├── jest.config.js          # Jest configuration
├── package.json            # Root package.json
└── README.md               # This file
```

## 🚀 Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or Atlas account)
- npm or yarn

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd testing-and-debugging-ensuring-mern-app-reliability-jameskim607
```

### Step 2: Install Dependencies

Install all dependencies for both client and server:

```bash
npm run install-all
```

Or install them separately:

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Step 3: Environment Setup

Create a `.env` file in the server directory:

```bash
# server/.env
MONGODB_URI=mongodb://localhost:27017/bug-tracker
PORT=5000
NODE_ENV=development
```

Create a `.env` file in the client directory (optional):

```bash
# client/.env
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 4: Start MongoDB

Make sure MongoDB is running locally:

```bash
# On macOS/Linux
mongod

# On Windows
# Start MongoDB service or run mongod.exe
```

Or use MongoDB Atlas connection string in `.env`.

## 🏃 Running the Application

### Development Mode

Run both client and server concurrently:

```bash
# From root directory
npm run dev
```

Or run them separately:

```bash
# Terminal 1 - Start server
cd server
npm run dev

# Terminal 2 - Start client
cd client
npm start
```

- Server runs on: `http://localhost:5000`
- Client runs on: `http://localhost:3000`

### Production Mode

```bash
# Build client
cd client
npm run build

# Start server (production)
cd ../server
npm start
```

## 🧪 Testing

### Run All Tests

```bash
# From root directory
npm test
```

### Run Specific Test Types

```bash
# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# End-to-end tests
npm run test:e2e
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

Coverage reports are generated in:
- `coverage/server/` - Server coverage
- `coverage/client/` - Client coverage

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Test Scripts Breakdown

#### Server Tests
```bash
cd server
npm test              # Run all server tests
npm run test:unit     # Run unit tests only
npm run test:integration  # Run integration tests only
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

#### Client Tests
```bash
cd client
npm test              # Run all client tests
npm run test:coverage # Run tests with coverage
```

#### Cypress Tests
```bash
cd client
# Open Cypress Test Runner (interactive)
npx cypress open

# Run Cypress tests (headless)
npx cypress run
```

## 🐛 Debugging

### Server-Side Debugging

#### 1. Console Logging
The server uses Morgan for HTTP request logging in development mode. Check server console for:
- Request methods and URLs
- Response status codes
- Error messages with stack traces (in development)

#### 2. Node.js Inspector
Debug server code using Node.js inspector:

```bash
# Start server with inspector
node --inspect server/src/app.js

# Or with nodemon
nodemon --inspect server/src/app.js
```

Then open Chrome DevTools and connect to `chrome://inspect`

#### 3. Environment Variables
Set `NODE_ENV=development` to see detailed error messages and stack traces.

#### 4. MongoDB Debugging
Check MongoDB connection:
- Verify MongoDB is running
- Check connection string in `.env`
- Monitor MongoDB logs

### Client-Side Debugging

#### 1. Browser DevTools
- **Console**: View logs and errors
- **Network Tab**: Inspect API requests/responses
- **React DevTools**: Inspect component state and props

#### 2. Error Boundaries
The app includes an `ErrorBoundary` component that catches React errors and displays user-friendly messages. Check the console for error details in development mode.

#### 3. API Debugging
The API service (`client/src/services/api.js`) includes request/response interceptors that log all API calls in development mode.

#### 4. Component Debugging
- Use `console.log()` in components
- Use React DevTools Profiler for performance debugging
- Check browser console for validation errors

### Common Debugging Scenarios

#### Issue: API Requests Failing
1. Check server is running on correct port
2. Verify CORS settings in `server/src/app.js`
3. Check network tab for error status codes
4. Verify API base URL in `client/src/services/api.js`

#### Issue: Database Connection Errors
1. Verify MongoDB is running
2. Check connection string in `.env`
3. Test connection with MongoDB Compass
4. Check server logs for detailed error messages

#### Issue: Tests Failing
1. Ensure MongoDB Memory Server is properly set up
2. Check test environment variables
3. Verify all dependencies are installed
4. Clear Jest cache: `npm test -- --clearCache`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### GET /api/bugs
Get all bugs with optional filtering and pagination.

**Query Parameters:**
- `status` (optional): Filter by status (open, in-progress, resolved, closed)
- `priority` (optional): Filter by priority (low, medium, high, critical)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `sortBy` (optional): Field to sort by (default: createdAt)
- `order` (optional): Sort order (asc/desc, default: desc)

**Example:**
```bash
GET /api/bugs?status=open&priority=high&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

#### GET /api/bugs/:id
Get a single bug by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "...",
    "description": "...",
    "status": "open",
    "priority": "medium",
    "reporter": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

#### POST /api/bugs
Create a new bug.

**Request Body:**
```json
{
  "title": "Bug Title",
  "description": "Bug Description",
  "status": "open",
  "priority": "medium",
  "reporter": "Reporter Name"
}
```

**Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "Bug created successfully"
}
```

#### PUT /api/bugs/:id
Update a bug.

**Request Body:**
```json
{
  "title": "Updated Title",
  "status": "in-progress",
  "priority": "high"
}
```

#### PATCH /api/bugs/:id/status
Update bug status only.

**Request Body:**
```json
{
  "status": "resolved"
}
```

#### DELETE /api/bugs/:id
Delete a bug.

**Response:**
```json
{
  "success": true,
  "message": "Bug deleted successfully"
}
```

### Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error message",
  "errors": ["Additional error details"] // For validation errors
}
```

## 📊 Testing Strategy

### Unit Tests
- **Purpose**: Test individual functions and components in isolation
- **Tools**: Jest, React Testing Library
- **Coverage Target**: 70%+
- **Examples**:
  - Validation utilities
  - Component rendering
  - Button clicks and form interactions

### Integration Tests
- **Purpose**: Test API endpoints and component interactions
- **Tools**: Jest, Supertest, React Testing Library
- **Examples**:
  - API endpoint CRUD operations
  - Database operations
  - Form submissions with API calls

### End-to-End Tests
- **Purpose**: Test complete user flows
- **Tools**: Cypress
- **Examples**:
  - Creating a bug
  - Updating bug status
  - Deleting a bug
  - Form validation

### Test Organization
- Tests are co-located with source code where appropriate
- Unit tests in `tests/unit/`
- Integration tests in `tests/integration/`
- E2E tests in `cypress/e2e/`

## 📈 Coverage

Run coverage report:

```bash
npm run test:coverage
```

Coverage thresholds (configured in `jest.config.js`):
- Statements: 70%
- Branches: 60%
- Functions: 70%
- Lines: 70%

View detailed coverage:
- Open `coverage/server/index.html` or `coverage/client/index.html` in a browser

## 🔧 Configuration Files

### Jest Configuration
- `jest.config.js` - Root Jest configuration
- Separate configurations for server and client projects

### Environment Variables
- `server/.env` - Server configuration
- `client/.env` - Client configuration (optional)

### Cypress Configuration
- `client/cypress.config.js` - Cypress E2E test configuration

## 🎓 Learning Resources

### Testing
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Cypress Documentation](https://docs.cypress.io/)

### Debugging
- [Node.js Debugging Guide](https://nodejs.org/en/docs/guides/debugging-getting-started/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [React DevTools](https://react.dev/learn/react-developer-tools)

## 📝 Notes

- The application uses MongoDB Memory Server for tests, so no database setup is required for running tests
- Error boundaries catch React errors but don't catch errors in event handlers, async code, or during server-side rendering
- All tests are designed to be independent and can run in any order
- Environment variables should never be committed to version control

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

ISC

## 👨‍💻 Author

Built as part of the Week 6 Assignment: Testing and Debugging MERN Applications

---

**Happy Testing! 🧪**
