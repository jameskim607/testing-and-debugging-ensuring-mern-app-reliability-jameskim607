// unit/validation.test.js - Unit tests for validation utilities

const {
  validateTitle,
  validateDescription,
  validateStatus,
  validatePriority,
  validateReporter,
  validateBug,
} = require('../../src/utils/validation');

describe('Validation Utilities', () => {
  describe('validateTitle', () => {
    it('should return valid for a valid title', () => {
      const result = validateTitle('Test Bug Title');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return invalid for empty title', () => {
      const result = validateTitle('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should return invalid for whitespace-only title', () => {
      const result = validateTitle('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should return invalid for title exceeding 200 characters', () => {
      const longTitle = 'a'.repeat(201);
      const result = validateTitle(longTitle);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('200 characters');
    });

    it('should return invalid for non-string title', () => {
      const result = validateTitle(null);
      expect(result.isValid).toBe(false);
    });

    it('should return invalid for undefined title', () => {
      const result = validateTitle(undefined);
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateDescription', () => {
    it('should return valid for a valid description', () => {
      const result = validateDescription('This is a bug description');
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for empty description', () => {
      const result = validateDescription('');
      expect(result.isValid).toBe(false);
    });

    it('should return invalid for non-string description', () => {
      const result = validateDescription(123);
      expect(result.isValid).toBe(false);
    });

    it('should return invalid for undefined description', () => {
      const result = validateDescription(undefined);
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateStatus', () => {
    it('should return valid for "open" status', () => {
      const result = validateStatus('open');
      expect(result.isValid).toBe(true);
    });

    it('should return valid for "in-progress" status', () => {
      const result = validateStatus('in-progress');
      expect(result.isValid).toBe(true);
    });

    it('should return valid for "resolved" status', () => {
      const result = validateStatus('resolved');
      expect(result.isValid).toBe(true);
    });

    it('should return valid for "closed" status', () => {
      const result = validateStatus('closed');
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for invalid status', () => {
      const result = validateStatus('invalid-status');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must be one of');
    });

    it('should return invalid for non-string status', () => {
      const result = validateStatus(null);
      expect(result.isValid).toBe(false);
    });
  });

  describe('validatePriority', () => {
    it('should return valid for "low" priority', () => {
      const result = validatePriority('low');
      expect(result.isValid).toBe(true);
    });

    it('should return valid for "medium" priority', () => {
      const result = validatePriority('medium');
      expect(result.isValid).toBe(true);
    });

    it('should return valid for "high" priority', () => {
      const result = validatePriority('high');
      expect(result.isValid).toBe(true);
    });

    it('should return valid for "critical" priority', () => {
      const result = validatePriority('critical');
      expect(result.isValid).toBe(true);
    });

    it('should return valid for undefined priority (optional)', () => {
      const result = validatePriority(undefined);
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for invalid priority', () => {
      const result = validatePriority('invalid-priority');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateReporter', () => {
    it('should return valid for a valid reporter name', () => {
      const result = validateReporter('John Doe');
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for empty reporter', () => {
      const result = validateReporter('');
      expect(result.isValid).toBe(false);
    });

    it('should return invalid for reporter exceeding 100 characters', () => {
      const longName = 'a'.repeat(101);
      const result = validateReporter(longName);
      expect(result.isValid).toBe(false);
    });

    it('should return invalid for non-string reporter', () => {
      const result = validateReporter(null);
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateBug', () => {
    it('should return valid for a complete valid bug', () => {
      const bugData = {
        title: 'Test Bug',
        description: 'This is a test bug',
        status: 'open',
        priority: 'high',
        reporter: 'John Doe',
      };
      const result = validateBug(bugData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return invalid for bug missing title', () => {
      const bugData = {
        description: 'This is a test bug',
      };
      const result = validateBug(bugData);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should return invalid for bug missing description', () => {
      const bugData = {
        title: 'Test Bug',
      };
      const result = validateBug(bugData);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should return invalid for bug with invalid status', () => {
      const bugData = {
        title: 'Test Bug',
        description: 'This is a test bug',
        status: 'invalid-status',
      };
      const result = validateBug(bugData);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should return invalid for bug with invalid priority', () => {
      const bugData = {
        title: 'Test Bug',
        description: 'This is a test bug',
        priority: 'invalid-priority',
      };
      const result = validateBug(bugData);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should accumulate multiple validation errors', () => {
      const bugData = {
        title: '',
        description: '',
        status: 'invalid',
      };
      const result = validateBug(bugData);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });
});

