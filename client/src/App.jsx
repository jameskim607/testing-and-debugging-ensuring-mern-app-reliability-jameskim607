// App.jsx - Main React application component

import React, { useState, useEffect } from 'react';
import './App.css';
import BugList from './components/BugList';
import BugForm from './components/BugForm';
import ErrorBoundary from './components/ErrorBoundary';
import { getBugs, createBug, updateBug, deleteBug } from './services/api';

function App() {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBug, setEditingBug] = useState(null);

  // Fetch bugs on component mount
  useEffect(() => {
    fetchBugs();
  }, []);

  const fetchBugs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getBugs();
      setBugs(response.data || []);
    } catch (err) {
      console.error('Error fetching bugs:', err);
      setError('Failed to load bugs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBug = async (bugData) => {
    try {
      const response = await createBug(bugData);
      setBugs([response.data, ...bugs]);
      setShowForm(false);
      setError(null);
    } catch (err) {
      console.error('Error creating bug:', err);
      setError('Failed to create bug. Please try again.');
      throw err;
    }
  };

  const handleUpdateBug = async (id, bugData) => {
    try {
      const response = await updateBug(id, bugData);
      setBugs(bugs.map(bug => bug._id === id ? response.data : bug));
      setEditingBug(null);
      setError(null);
    } catch (err) {
      console.error('Error updating bug:', err);
      setError('Failed to update bug. Please try again.');
      throw err;
    }
  };

  const handleDeleteBug = async (id) => {
    try {
      await deleteBug(id);
      setBugs(bugs.filter(bug => bug._id !== id));
      setError(null);
    } catch (err) {
      console.error('Error deleting bug:', err);
      setError('Failed to delete bug. Please try again.');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await handleUpdateBug(id, { status });
    } catch (err) {
      // Error already handled in handleUpdateBug
    }
  };

  const handleEditClick = (bug) => {
    setEditingBug(bug);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingBug(null);
    setShowForm(false);
  };

  return (
    <ErrorBoundary>
      <div className="App">
        <header className="App-header">
          <h1>🐛 Bug Tracker</h1>
          <p>Track and manage bugs efficiently</p>
        </header>

        <main className="App-main">
          {error && (
            <div className="error-message" role="alert">
              {error}
              <button onClick={() => setError(null)} className="close-btn">
                ×
              </button>
            </div>
          )}

          <div className="action-buttons">
            <button
              onClick={() => {
                setEditingBug(null);
                setShowForm(!showForm);
              }}
              className="btn btn-primary"
            >
              {showForm ? 'Cancel' : 'Report New Bug'}
            </button>
            <button onClick={fetchBugs} className="btn btn-secondary">
              Refresh
            </button>
          </div>

          {showForm && (
            <BugForm
              onSubmit={editingBug ? (data) => handleUpdateBug(editingBug._id, data) : handleCreateBug}
              initialData={editingBug}
              onCancel={handleCancelEdit}
            />
          )}

          {loading ? (
            <div className="loading">Loading bugs...</div>
          ) : (
            <BugList
              bugs={bugs}
              onDelete={handleDeleteBug}
              onStatusUpdate={handleStatusUpdate}
              onEdit={handleEditClick}
            />
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;

