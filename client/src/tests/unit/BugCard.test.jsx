// BugCard.test.jsx - Unit tests for BugCard component

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BugCard from '../../components/BugCard';

describe('BugCard Component', () => {
  const mockBug = {
    _id: '123',
    title: 'Test Bug',
    description: 'This is a test bug description',
    status: 'open',
    priority: 'high',
    reporter: 'John Doe',
    createdAt: '2024-01-01T00:00:00.000Z',
  };

  const mockOnDelete = jest.fn();
  const mockOnStatusUpdate = jest.fn();
  const mockOnEdit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.confirm
    window.confirm = jest.fn(() => true);
  });

  it('renders bug information correctly', () => {
    render(
      <BugCard
        bug={mockBug}
        onDelete={mockOnDelete}
        onStatusUpdate={mockOnStatusUpdate}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('Test Bug')).toBeInTheDocument();
    expect(screen.getByText('This is a test bug description')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText(/reporter/i)).toBeInTheDocument();
  });

  it('displays correct status in select', () => {
    render(
      <BugCard
        bug={mockBug}
        onDelete={mockOnDelete}
        onStatusUpdate={mockOnStatusUpdate}
        onEdit={mockOnEdit}
      />
    );

    const statusSelect = screen.getByTestId(`status-select-${mockBug._id}`);
    expect(statusSelect).toHaveValue('open');
  });

  it('calls onStatusUpdate when status is changed', () => {
    render(
      <BugCard
        bug={mockBug}
        onDelete={mockOnDelete}
        onStatusUpdate={mockOnStatusUpdate}
        onEdit={mockOnEdit}
      />
    );

    const statusSelect = screen.getByTestId(`status-select-${mockBug._id}`);
    fireEvent.change(statusSelect, { target: { value: 'resolved' } });

    expect(mockOnStatusUpdate).toHaveBeenCalledWith(mockBug._id, 'resolved');
  });

  it('calls onEdit when edit button is clicked', () => {
    render(
      <BugCard
        bug={mockBug}
        onDelete={mockOnDelete}
        onStatusUpdate={mockOnStatusUpdate}
        onEdit={mockOnEdit}
      />
    );

    const editButton = screen.getByLabelText(/edit bug/i);
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockBug);
  });

  it('calls onDelete when delete button is clicked and confirmed', () => {
    render(
      <BugCard
        bug={mockBug}
        onDelete={mockOnDelete}
        onStatusUpdate={mockOnStatusUpdate}
        onEdit={mockOnEdit}
      />
    );

    const deleteButton = screen.getByLabelText(/delete bug/i);
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalled();
    expect(mockOnDelete).toHaveBeenCalledWith(mockBug._id);
  });

  it('does not call onDelete when delete is not confirmed', () => {
    window.confirm = jest.fn(() => false);

    render(
      <BugCard
        bug={mockBug}
        onDelete={mockOnDelete}
        onStatusUpdate={mockOnStatusUpdate}
        onEdit={mockOnEdit}
      />
    );

    const deleteButton = screen.getByLabelText(/delete bug/i);
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalled();
    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  it('displays priority badge with correct text', () => {
    render(
      <BugCard
        bug={mockBug}
        onDelete={mockOnDelete}
        onStatusUpdate={mockOnStatusUpdate}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('displays formatted date', () => {
    render(
      <BugCard
        bug={mockBug}
        onDelete={mockOnDelete}
        onStatusUpdate={mockOnStatusUpdate}
        onEdit={mockOnEdit}
      />
    );

    // Check that date is displayed (format may vary by locale)
    const dateElement = screen.getByText(/1\/1\/2024|2024-01-01|Jan 1, 2024/i);
    expect(dateElement).toBeInTheDocument();
  });

  it('has correct data-testid attribute', () => {
    render(
      <BugCard
        bug={mockBug}
        onDelete={mockOnDelete}
        onStatusUpdate={mockOnStatusUpdate}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByTestId(`bug-card-${mockBug._id}`)).toBeInTheDocument();
  });
});

