// BugForm.test.jsx - Unit tests for BugForm component

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BugForm from '../../components/BugForm';

describe('BugForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form with all required fields', () => {
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reporter/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
  });

  it('renders with default values for status and priority', () => {
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    expect(screen.getByTestId('status-select')).toHaveValue('open');
    expect(screen.getByTestId('priority-select')).toHaveValue('medium');
  });

  it('renders "Report New Bug" when no initialData is provided', () => {
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    expect(screen.getByText(/report new bug/i)).toBeInTheDocument();
  });

  it('renders "Edit Bug" when initialData is provided', () => {
    const initialData = {
      title: 'Test Bug',
      description: 'Test Description',
      status: 'open',
      priority: 'high',
      reporter: 'John Doe',
    };

    render(
      <BugForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialData={initialData}
      />
    );
    
    expect(screen.getByText(/edit bug/i)).toBeInTheDocument();
    expect(screen.getByTestId('title-input')).toHaveValue('Test Bug');
    expect(screen.getByTestId('description-input')).toHaveValue('Test Description');
    expect(screen.getByTestId('reporter-input')).toHaveValue('John Doe');
  });

  it('updates form fields when user types', () => {
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const titleInput = screen.getByTestId('title-input');
    fireEvent.change(titleInput, { target: { value: 'New Bug Title' } });
    
    expect(titleInput).toHaveValue('New Bug Title');
  });

  it('shows validation error for empty title', async () => {
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows validation error for empty description', async () => {
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const titleInput = screen.getByTestId('title-input');
    fireEvent.change(titleInput, { target: { value: 'Valid Title' } });
    
    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
    });
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows validation error for empty reporter', async () => {
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const titleInput = screen.getByTestId('title-input');
    const descriptionInput = screen.getByTestId('description-input');
    
    fireEvent.change(titleInput, { target: { value: 'Valid Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'Valid Description' } });
    
    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/reporter name is required/i)).toBeInTheDocument();
    });
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows validation error for title exceeding 200 characters', async () => {
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const titleInput = screen.getByTestId('title-input');
    const longTitle = 'a'.repeat(201);
    
    fireEvent.change(titleInput, { target: { value: longTitle } });
    
    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/cannot exceed 200 characters/i)).toBeInTheDocument();
    });
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with form data when form is valid', async () => {
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const titleInput = screen.getByTestId('title-input');
    const descriptionInput = screen.getByTestId('description-input');
    const reporterInput = screen.getByTestId('reporter-input');
    
    fireEvent.change(titleInput, { target: { value: 'Test Bug' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.change(reporterInput, { target: { value: 'John Doe' } });
    
    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Bug',
        description: 'Test Description',
        reporter: 'John Doe',
        status: 'open',
        priority: 'medium',
      });
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const cancelButton = screen.getByText(/cancel/i);
    fireEvent.click(cancelButton);
    
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('clears error when user starts typing in a field with error', async () => {
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
    
    const titleInput = screen.getByTestId('title-input');
    fireEvent.change(titleInput, { target: { value: 'New Title' } });
    
    await waitFor(() => {
      expect(screen.queryByText(/title is required/i)).not.toBeInTheDocument();
    });
  });

  it('disables submit button while submitting', async () => {
    mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const titleInput = screen.getByTestId('title-input');
    const descriptionInput = screen.getByTestId('description-input');
    const reporterInput = screen.getByTestId('reporter-input');
    const submitButton = screen.getByTestId('submit-button');
    
    fireEvent.change(titleInput, { target: { value: 'Test Bug' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.change(reporterInput, { target: { value: 'John Doe' } });
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(screen.getByText(/saving.../i)).toBeInTheDocument();
    });
  });
});

