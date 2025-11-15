// cypress/support/commands.js - Custom Cypress commands

// Example: Custom command to create a bug
Cypress.Commands.add('createBug', (bugData) => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:5000/api/bugs',
    body: bugData,
  });
});

// Example: Custom command to delete a bug
Cypress.Commands.add('deleteBug', (bugId) => {
  cy.request({
    method: 'DELETE',
    url: `http://localhost:5000/api/bugs/${bugId}`,
  });
});

