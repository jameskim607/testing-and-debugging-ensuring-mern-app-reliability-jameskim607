// controllers/bugsController.js - Bug controller with CRUD operations

const Bug = require('../models/Bug');
const { validateBug } = require('../utils/validation');

/**
 * Get all bugs with optional filtering and pagination
 */
const getAllBugs = async (req, res, next) => {
  try {
    const { status, priority, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;

    // Build filter object
    const filter = {};
    if (status) {
      filter.status = status;
    }
    if (priority) {
      filter.priority = priority;
    }

    // Calculate pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build sort object
    const sort = {};
    sort[sortBy] = order === 'asc' ? 1 : -1;

    // Execute query
    const bugs = await Bug.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Get total count for pagination
    const total = await Bug.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: bugs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single bug by ID
 */
const getBugById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const bug = await Bug.findById(id);

    if (!bug) {
      return res.status(404).json({
        success: false,
        error: 'Bug not found',
      });
    }

    res.status(200).json({
      success: true,
      data: bug,
    });
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid bug ID format',
      });
    }
    next(error);
  }
};

/**
 * Create a new bug
 */
const createBug = async (req, res, next) => {
  try {
    const bugData = req.body;

    // Validate bug data
    const validation = validateBug(bugData);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors: validation.errors,
      });
    }

    // Create bug
    const bug = await Bug.create(bugData);

    res.status(201).json({
      success: true,
      data: bug,
      message: 'Bug created successfully',
    });
  } catch (error) {
    // Handle validation errors from Mongoose
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors,
      });
    }
    next(error);
  }
};

/**
 * Update a bug by ID
 */
const updateBug = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate update data if provided
    if (updateData.title || updateData.description || updateData.status || updateData.priority) {
      const validation = validateBug(updateData);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          errors: validation.errors,
        });
      }
    }

    const bug = await Bug.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!bug) {
      return res.status(404).json({
        success: false,
        error: 'Bug not found',
      });
    }

    res.status(200).json({
      success: true,
      data: bug,
      message: 'Bug updated successfully',
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid bug ID format',
      });
    }
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors,
      });
    }
    next(error);
  }
};

/**
 * Delete a bug by ID
 */
const deleteBug = async (req, res, next) => {
  try {
    const { id } = req.params;

    const bug = await Bug.findByIdAndDelete(id);

    if (!bug) {
      return res.status(404).json({
        success: false,
        error: 'Bug not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Bug deleted successfully',
      data: bug,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid bug ID format',
      });
    }
    next(error);
  }
};

/**
 * Update bug status
 */
const updateBugStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required',
      });
    }

    const bug = await Bug.findById(id);

    if (!bug) {
      return res.status(404).json({
        success: false,
        error: 'Bug not found',
      });
    }

    bug.status = status;
    await bug.save();

    res.status(200).json({
      success: true,
      data: bug,
      message: 'Bug status updated successfully',
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid bug ID format',
      });
    }
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors,
      });
    }
    next(error);
  }
};

module.exports = {
  getAllBugs,
  getBugById,
  createBug,
  updateBug,
  deleteBug,
  updateBugStatus,
};

