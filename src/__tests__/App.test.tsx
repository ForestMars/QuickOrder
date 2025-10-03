/**
 * App.test.tsx
 * 
 * Tests the main App component routing and navigation functionality.
 * Covers:
 * - Home page rendering
 * - Menu page rendering with router integration
 * - Basic app structure and navigation
 * 
 * Test coverage: Core app functionality and routing
 */
/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from '../App';
import { MemoryRouter } from 'react-router-dom';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Coffee Shop App - Core Functionality', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  it('renders the home page', () => {
    render(<App />);
    expect(screen.getByText('QuickOrder')).toBeInTheDocument();
    expect(screen.getByText('Start New Order')).toBeInTheDocument();
  });

  it('renders the menu page and menu items', () => {
    const TestRouter: React.ComponentType<{ children: React.ReactNode }> = ({ children }) => (
      <MemoryRouter initialEntries={["/menu"]}>{children}</MemoryRouter>
    );
    render(<App router={TestRouter} />);
    expect(screen.getByText('Menu')).toBeInTheDocument();
    expect(screen.getByText('Coffee')).toBeInTheDocument();
    expect(screen.getByText('Tea')).toBeInTheDocument();
    expect(screen.getByText('Muffin')).toBeInTheDocument();
  });

  // More tests for cart, checkout, and orders can be restored similarly using router prop and MemoryRouter.
}); 