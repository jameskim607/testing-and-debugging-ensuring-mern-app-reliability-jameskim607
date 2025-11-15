// BugList.test.jsx - Unit tests for BugList component

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BugList from '../../components/BugList';

describe('BugList Component', () => {
  const mockBugs = [
    {
      _id: '1',
      title: 'Bug 1',
      description: 'Description 1',
      status: 'open',
      priority: 'high',
      reporter: 'John Doe',
    },
    {
      _id: '2',
      title: 'Bug 2',
      description: 'Description 2',
      status: 'in-progress',
      priority: 'medium',
      reporter: 'Jane Doe',
    },
  ];

  const mockOnDelete = jest.fn();
  const mockOnStatusUpdate = jest.fn();
  const mockOnEdit = jest.fn();

  it('renders empty state when no bugs', () => {
    render(
      <BugList
        bugs={[]}
        onDelete={mockOnDelete}
        onStatusUpdate={mockOnStatusUpdate}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText(/no bugs reported yet/i)).toBeInTheDocument();
  });

  it('renders list of bugs', () => {
    render(
      <BugList
        bugs={mockBugs}
        onDelete={mockOnDelete}
        onStatusUpdate={mockOnStatusUpdate}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByTestId('bug-list')).toBeInTheDocument();
    expect(screen.getByText('Bugs (2)')).toBeInTheDocument();
    expect(screen.getByText('Bug 1')).toBeInTheDocument();
    expect(screen.getByText('Bug 2')).toBeInTheDocument();
  });

  it('displays correct bug count', () => {
    render(
      <BugList
        bugs={mockBugs}
        onDelete={mockOnDelete}
        onStatusUpdate={mockOnStatusUpdate}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText(/bugs \(2\)/i)).toBeInTheDocument();
  });

  it('handles null or undefined bugs array', () => {
    render(
      <BugList
        bugs={null}
        onDelete={mockOnDelete}
        onStatusUpdate={mockOnStatusUpdate}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });
});

