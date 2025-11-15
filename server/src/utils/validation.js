// utils/validation.js - Validation utility functions

/**
 * Validates bug title
 * @param {string} title - Bug title
 * @returns {Object} - Validation result with isValid and error message
 */
const validateTitle = (title) => {
  if (!title || typeof title !== 'string') {
    return { isValid: false, error: 'Title is required and must be a string' };
  }

  const trimmedTitle = title.trim();
  
  if (trimmedTitle.length === 0) {
    return { isValid: false, error: 'Title cannot be empty' };
  }

  if (trimmedTitle.length > 200) {
    return { isValid: false, error: 'Title cannot exceed 200 characters' };
  }

  return { isValid: true };
};

/**
 * Validates bug description
 * @param {string} description - Bug description
 * @returns {Object} - Validation result with isValid and error message
 */
const validateDescription = (description) => {
  if (!description || typeof description !== 'string') {
    return { isValid: false, error: 'Description is required and must be a string' };
  }

  const trimmedDescription = description.trim();
  
  if (trimmedDescription.length === 0) {
    return { isValid: false, error: 'Description cannot be empty' };
  }

  return { isValid: true };
};

/**
 * Validates bug status
 * @param {string} status - Bug status
 * @returns {Object} - Validation result with isValid and error message
 */
const validateStatus = (status) => {
  const validStatuses = ['open', 'in-progress', 'resolved', 'closed'];
  
  if (!status || typeof status !== 'string') {
    return { isValid: false, error: 'Status is required and must be a string' };
  }

  if (!validStatuses.includes(status.toLowerCase())) {
    return { 
      isValid: false, 
      error: `Status must be one of: ${validStatuses.join(', ')}` 
    };
  }

  return { isValid: true };
};

/**
 * Validates bug priority
 * @param {string} priority - Bug priority
 * @returns {Object} - Validation result with isValid and error message
 */
const validatePriority = (priority) => {
  const validPriorities = ['low', 'medium', 'high', 'critical'];
  
  if (priority && typeof priority !== 'string') {
    return { isValid: false, error: 'Priority must be a string' };
  }

  if (priority && !validPriorities.includes(priority.toLowerCase())) {
    return { 
      isValid: false, 
      error: `Priority must be one of: ${validPriorities.join(', ')}` 
    };
  }

  return { isValid: true };
};

/**
 * Validates reporter name
 * @param {string} reporter - Reporter name
 * @returns {Object} - Validation result with isValid and error message
 */
const validateReporter = (reporter) => {
  if (!reporter || typeof reporter !== 'string') {
    return { isValid: false, error: 'Reporter is required and must be a string' };
  }

  const trimmedReporter = reporter.trim();
  
  if (trimmedReporter.length === 0) {
    return { isValid: false, error: 'Reporter name cannot be empty' };
  }

  if (trimmedReporter.length > 100) {
    return { isValid: false, error: 'Reporter name cannot exceed 100 characters' };
  }

  return { isValid: true };
};

/**
 * Validates a complete bug object
 * @param {Object} bugData - Bug data object
 * @returns {Object} - Validation result with isValid and errors array
 */
const validateBug = (bugData) => {
  const errors = [];

  // Validate title
  const titleValidation = validateTitle(bugData.title);
  if (!titleValidation.isValid) {
    errors.push(titleValidation.error);
  }

  // Validate description
  const descriptionValidation = validateDescription(bugData.description);
  if (!descriptionValidation.isValid) {
    errors.push(descriptionValidation.error);
  }

  // Validate status (optional for creation, but if provided must be valid)
  if (bugData.status) {
    const statusValidation = validateStatus(bugData.status);
    if (!statusValidation.isValid) {
      errors.push(statusValidation.error);
    }
  }

  // Validate priority (optional, but if provided must be valid)
  if (bugData.priority) {
    const priorityValidation = validatePriority(bugData.priority);
    if (!priorityValidation.isValid) {
      errors.push(priorityValidation.error);
    }
  }

  // Validate reporter
  if (bugData.reporter) {
    const reporterValidation = validateReporter(bugData.reporter);
    if (!reporterValidation.isValid) {
      errors.push(reporterValidation.error);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  validateTitle,
  validateDescription,
  validateStatus,
  validatePriority,
  validateReporter,
  validateBug,
};

