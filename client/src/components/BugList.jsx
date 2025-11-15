// BugList.jsx - Component to display list of bugs

import React from 'react';
import BugCard from './BugCard';
import './BugList.css';

const BugList = ({ bugs, onDelete, onStatusUpdate, onEdit }) => {
  if (!bugs || bugs.length === 0) {
    return (
      <div className="empty-state" data-testid="empty-state">
        <p>No bugs reported yet. Click "Report New Bug" to get started!</p>
      </div>
    );
  }

  return (
    <div className="bug-list" data-testid="bug-list">
      <h2>Bugs ({bugs.length})</h2>
      <div className="bug-grid">
        {bugs.map(bug => (
          <BugCard
            key={bug._id}
            bug={bug}
            onDelete={onDelete}
            onStatusUpdate={onStatusUpdate}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
};

export default BugList;

