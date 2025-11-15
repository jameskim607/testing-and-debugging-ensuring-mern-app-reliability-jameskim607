// App.test.jsx - Integration tests for App component

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as apiService from '../../services/api';
import App from '../../App';

// Mock API service
jest.mock('../../services/api');

describe('App Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches and displays bugs on mount', async () => {
    const mockBugs = [
      {
        _id: '1',
        title: 'Test Bug 1',
        description: 'Description 1',
        status: 'open',
        priority: 'high',
        reporter: 'John Doe',
      },
    ];

    apiService.getBugs.mockResolvedValue({ data: mockBugs });

    render(<App />);

    // Wait for bugs to load
    await waitFor(() => {
      expect(screen.getByText('Test Bug 1')).toBeInTheDocument();
    });

    expect(apiService.getBugs).toHaveBeenCalled();
  });

  it('creates a new bug and adds it to the list', async () => {
    const mockBugs = [];

    const mockNewBug = {
      data: {
        _id: '1',
        title: 'New Bug',
        description: 'New Description',
        status: 'open',
        priority: 'medium',
        reporter: 'Jane Doe',
      },
    };

    apiService.getBugs.mockResolvedValueOnce({ data: mockBugs });
    apiService.createBug.mockResolvedValue(mockNewBug);

    render(<App />);

    // Wait for initial load
    await waitFor(() => {
      expect(apiService.getBugs).toHaveBeenCalled();
    });

    // Open form
    const reportButton = screen.getByText(/report new bug/i);
    fireEvent.click(reportButton);

    // Fill form
    await waitFor(() => {
      const titleInput = screen.getByTestId('title-input');
      const descriptionInput = screen.getByTestId('description-input');
      const reporterInput = screen.getByTestId('reporter-input');

      fireEvent.change(titleInput, { target: { value: 'New Bug' } });
      fireEvent.change(descriptionInput, { target: { value: 'New Description' } });
      fireEvent.change(reporterInput, { target: { value: 'Jane Doe' } });
    });

    // Submit form
    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    // Wait for bug to be added
    await waitFor(() => {
      expect(apiService.createBug).toHaveBeenCalledWith({
        title: 'New Bug',
        description: 'New Description',
        reporter: 'Jane Doe',
        status: 'open',
        priority: 'medium',
      });
    });
  });

  it('updates bug status when status select is changed', async () => {
    const mockBugs = [
      {
        _id: '1',
        title: 'Test Bug',
        description: 'Description',
        status: 'open',
        priority: 'high',
        reporter: 'John Doe',
      },
    ];

    const mockUpdatedBug = {
      data: {
        ...mockBugs[0],
        status: 'resolved',
      },
    };

    apiService.getBugs.mockResolvedValue({ data: mockBugs });
    apiService.updateBug.mockResolvedValue(mockUpdatedBug);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Test Bug')).toBeInTheDocument();
    });

    const statusSelect = screen.getByTestId('status-select-1');
    fireEvent.change(statusSelect, { target: { value: 'resolved' } });

    await waitFor(() => {
      expect(apiService.updateBug).toHaveBeenCalled();
    });
  });

  it('deletes a bug and removes it from the list', async () => {
    const mockBugs = [
      {
        _id: '1',
        title: 'Bug to Delete',
        description: 'Description',
        status: 'open',
        priority: 'high',
        reporter: 'John Doe',
      },
    ];

    apiService.getBugs.mockResolvedValue({ data: mockBugs });
    apiService.deleteBug.mockResolvedValue({ data: { success: true } });

    // Mock window.confirm
    window.confirm = jest.fn(() => true);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Bug to Delete')).toBeInTheDocument();
    });

    const deleteButton = screen.getByLabelText(/delete bug/i);
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(apiService.deleteBug).toHaveBeenCalledWith('1');
    });
  });

  it('displays error message when API call fails', async () => {
    apiService.getBugs.mockRejectedValue(new Error('Network Error'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load bugs/i)).toBeInTheDocument();
    });
  });

  it('refreshes bugs when refresh button is clicked', async () => {
    const mockBugs = [];

    apiService.getBugs.mockResolvedValue({ data: mockBugs });

    render(<App />);

    await waitFor(() => {
      expect(apiService.getBugs).toHaveBeenCalledTimes(1);
    });

    const refreshButton = screen.getByText(/refresh/i);
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(apiService.getBugs).toHaveBeenCalledTimes(2);
    });
  });
});

