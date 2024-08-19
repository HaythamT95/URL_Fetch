import { render, screen, fireEvent } from '@testing-library/react';
import Homepage from '../src/components/homepage.js'
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import React from 'react';

test('renders homepage title', () => {
  render(<Homepage />, { wrapper: BrowserRouter });
  expect(screen.getByText(/URLs/i)).toBeInTheDocument();
});

test('adds an input field when clicking "+" button', () => {
  render(<Homepage />, { wrapper: BrowserRouter });
  const addButton = screen.getByText('+');
  fireEvent.click(addButton);
  expect(screen.getAllByPlaceholderText(/Enter URL/i)).toHaveLength(1);
});

test('removes an input field when clicking delete button', () => {
  render(<Homepage />, { wrapper: BrowserRouter });
  const addButton = screen.getByText('+');
  fireEvent.click(addButton);
  const deleteButton = screen.getByText('×');
  fireEvent.click(deleteButton);
  expect(screen.queryByPlaceholderText(/Enter URL/i)).not.toBeInTheDocument();
});

test('displays error message when submitting less than 3 URLs', () => {
  render(<Homepage />, { wrapper: BrowserRouter });
  const addButton = screen.getByText('+');
  fireEvent.click(addButton);
  const submitButton = screen.getByText(/Submit/i);
  fireEvent.click(submitButton);
  expect(screen.getByText(/There should be at least 3 URLs given/i)).toBeInTheDocument();
});
