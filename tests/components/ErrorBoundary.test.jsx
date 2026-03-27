import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../../components/ErrorBoundary.jsx';

function ThrowingChild() {
  throw new Error('Test error');
}

function GoodChild() {
  return <div>Content works</div>;
}

describe('ErrorBoundary component', () => {
  // Suppress React error boundary console errors in test output
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });

  test('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <GoodChild />
      </ErrorBoundary>
    );
    expect(screen.getByText('Content works')).toBeInTheDocument();
  });

  test('renders error UI when child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>
    );
    expect(screen.getByText('Signal Lost')).toBeInTheDocument();
  });

  test('shows reload button on error', () => {
    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>
    );
    expect(screen.getByText('Reload')).toBeInTheDocument();
  });

  test('error UI contains helpful message', () => {
    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>
    );
    expect(screen.getByText(/unexpected error/i)).toBeInTheDocument();
  });

  test('reload button is a <button> element', () => {
    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>
    );
    const btn = screen.getByText('Reload');
    expect(btn.tagName).toBe('BUTTON');
  });
});
