// routes/bugs.js - Bug routes

const express = require('express');
const router = express.Router();
const bugsController = require('../controllers/bugsController');

// GET /api/bugs - Get all bugs
router.get('/', bugsController.getAllBugs);

// GET /api/bugs/:id - Get bug by ID
router.get('/:id', bugsController.getBugById);

// POST /api/bugs - Create new bug
router.post('/', bugsController.createBug);

// PUT /api/bugs/:id - Update bug
router.put('/:id', bugsController.updateBug);

// PATCH /api/bugs/:id/status - Update bug status
router.patch('/:id/status', bugsController.updateBugStatus);

// DELETE /api/bugs/:id - Delete bug
router.delete('/:id', bugsController.deleteBug);

module.exports = router;

