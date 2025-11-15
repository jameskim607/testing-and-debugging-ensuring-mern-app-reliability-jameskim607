// BugCard.jsx - Component to display individual bug card

import React from 'react';
import './BugCard.css';

const BugCard = ({ bug, onDelete, onStatusUpdate, onEdit }) => {
  const statusColors = {
    open: '#007bff',
    'in-progress': '#ffc107',
    resolved: '#28a745',
    closed: '#6c757d',
  };

  const priorityColors = {
    low: '#6c757d',
    medium: '#ffc107',
    high: '#fd7e14',
    critical: '#dc3545',
  };

  const handleStatusChange = (e) => {
    e.stopPropagation();
    onStatusUpdate(bug._id, e.target.value);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this bug?')) {
      onDelete(bug._id);
    }
  };

  const handleEdit = () => {
    onEdit(bug);
  };

  return (
    <div className="bug-card" data-testid={`bug-card-${bug._id}`}>
      <div className="bug-card-header">
        <h3 className="bug-title" title={bug.title}>{bug.title}</h3>
        <div className="bug-actions">
          <button
            onClick={handleEdit}
            className="btn-icon"
            aria-label="Edit bug"
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            className="btn-icon btn-icon-danger"
            aria-label="Delete bug"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>

      <p className="bug-description">{bug.description}</p>

      <div className="bug-meta">
        <div className="bug-info-item">
          <span className="label">Status:</span>
          <select
            value={bug.status}
            onChange={handleStatusChange}
            className="status-select"
            style={{ borderColor: statusColors[bug.status] }}
            data-testid={`status-select-${bug._id}`}
          >
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="bug-info-item">
          <span className="label">Priority:</span>
          <span
            className="priority-badge"
            style={{
              backgroundColor: priorityColors[bug.priority] || '#6c757d',
            }}
          >
            {bug.priority}
          </span>
        </div>
      </div>

      <div className="bug-footer">
        <span className="bug-reporter">Reporter: {bug.reporter}</span>
        <span className="bug-date">
          {new Date(bug.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default BugCard;

