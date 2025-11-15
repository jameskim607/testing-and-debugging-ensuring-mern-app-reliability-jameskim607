// bug-tracker.cy.js - End-to-end tests for bug tracker

describe('Bug Tracker E2E Tests', () => {
  beforeEach(() => {
    // Visit the app before each test
    cy.visit('/');
  });

  it('should display the app title and header', () => {
    cy.contains('Bug Tracker').should('be.visible');
    cy.contains('Track and manage bugs efficiently').should('be.visible');
  });

  it('should display empty state when no bugs exist', () => {
    cy.contains('No bugs reported yet').should('be.visible');
    cy.contains('Report New Bug').should('be.visible');
  });

  it('should open and close bug form', () => {
    // Click to open form
    cy.contains('Report New Bug').click();
    cy.get('[data-testid="bug-form"]').should('be.visible');

    // Click to close form
    cy.contains('Cancel').click();
    cy.get('[data-testid="bug-form"]').should('not.exist');
  });

  it('should create a new bug', () => {
    // Open form
    cy.contains('Report New Bug').click();

    // Fill form
    cy.get('[data-testid="title-input"]').type('E2E Test Bug');
    cy.get('[data-testid="description-input"]').type('This is a test bug created via E2E testing');
    cy.get('[data-testid="reporter-input"]').type('E2E Tester');
    cy.get('[data-testid="status-select"]').select('open');
    cy.get('[data-testid="priority-select"]').select('high');

    // Submit form
    cy.get('[data-testid="submit-button"]').click();

    // Verify bug appears in list
    cy.contains('E2E Test Bug').should('be.visible');
    cy.contains('E2E Tester').should('be.visible');
  });

  it('should validate required fields', () => {
    // Open form
    cy.contains('Report New Bug').click();

    // Try to submit without filling required fields
    cy.get('[data-testid="submit-button"]').click();

    // Verify validation errors appear
    cy.contains('Title is required').should('be.visible');
    cy.contains('Description is required').should('be.visible');
    cy.contains('Reporter name is required').should('be.visible');
  });

  it('should update bug status', () => {
    // Create a bug first
    cy.createBug({
      title: 'Status Test Bug',
      description: 'Testing status update',
      status: 'open',
      priority: 'medium',
      reporter: 'E2E Tester',
    });

    // Refresh page
    cy.reload();

    // Find the bug and change its status
    cy.contains('Status Test Bug').should('be.visible');
    cy.get('[data-testid="status-select"]').first().select('resolved');

    // Verify status was updated (may need to wait for API call)
    cy.wait(1000); // Wait for API call to complete
    cy.get('[data-testid="status-select"]').first().should('have.value', 'resolved');
  });

  it('should edit a bug', () => {
    // Create a bug first
    cy.createBug({
      title: 'Edit Test Bug',
      description: 'Original description',
      status: 'open',
      priority: 'low',
      reporter: 'E2E Tester',
    });

    // Refresh page
    cy.reload();

    // Click edit button
    cy.contains('Edit Test Bug').parent().find('[aria-label="Edit bug"]').click();

    // Update form fields
    cy.get('[data-testid="title-input"]').clear().type('Updated Test Bug');
    cy.get('[data-testid="description-input"]').clear().type('Updated description');
    cy.get('[data-testid="priority-select"]').select('high');

    // Submit changes
    cy.get('[data-testid="submit-button"]').click();

    // Verify bug was updated
    cy.contains('Updated Test Bug').should('be.visible');
  });

  it('should delete a bug', () => {
    // Create a bug first
    cy.createBug({
      title: 'Delete Test Bug',
      description: 'This bug will be deleted',
      status: 'open',
      priority: 'medium',
      reporter: 'E2E Tester',
    });

    // Refresh page
    cy.reload();

    // Verify bug exists
    cy.contains('Delete Test Bug').should('be.visible');

    // Click delete button and confirm
    cy.contains('Delete Test Bug').parent().find('[aria-label="Delete bug"]').click();
    cy.on('window:confirm', () => true); // Confirm deletion

    // Wait for deletion
    cy.wait(1000);

    // Verify bug is removed (may need to refresh)
    cy.reload();
    cy.contains('Delete Test Bug').should('not.exist');
  });

  it('should display error message on API failure', () => {
    // Intercept API call and force it to fail
    cy.intercept('GET', '**/api/bugs', { statusCode: 500, body: { error: 'Server Error' } }).as('getBugsError');

    // Reload page to trigger API call
    cy.reload();

    // Wait for error
    cy.wait('@getBugsError');

    // Verify error message is displayed
    cy.contains(/failed to load/i, { timeout: 10000 }).should('be.visible');
  });

  it('should refresh bug list', () => {
    // Create a bug
    cy.createBug({
      title: 'Refresh Test Bug',
      description: 'Testing refresh',
      status: 'open',
      priority: 'medium',
      reporter: 'E2E Tester',
    });

    // Click refresh button
    cy.contains('Refresh').click();

    // Wait for API call
    cy.wait(1000);

    // Verify bug is still visible (or appears if it wasn't before)
    cy.contains('Refresh Test Bug').should('be.visible');
  });
});

