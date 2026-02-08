import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SafetyBadge from '../../components/SafetyBadge.jsx';

describe('SafetyBadge component', () => {
  test('renders SAFE badge for safe level', () => {
    render(<SafetyBadge level="safe" />);
    expect(screen.getByText('SAFE')).toBeInTheDocument();
  });

  test('renders CAUTION badge for caution level', () => {
    render(<SafetyBadge level="caution" />);
    expect(screen.getByText('CAUTION')).toBeInTheDocument();
  });

  test('renders DANGER badge for danger level', () => {
    render(<SafetyBadge level="danger" />);
    expect(screen.getByText('DANGER')).toBeInTheDocument();
  });

  test('renders EXTREME badge for extreme level', () => {
    render(<SafetyBadge level="extreme" />);
    expect(screen.getByText('EXTREME')).toBeInTheDocument();
  });

  test('renders ILLEGAL badge for illegal level', () => {
    render(<SafetyBadge level="illegal" />);
    expect(screen.getByText('ILLEGAL')).toBeInTheDocument();
  });

  test('defaults to SAFE for unknown level', () => {
    render(<SafetyBadge level="unknown" />);
    expect(screen.getByText('SAFE')).toBeInTheDocument();
  });

  test('defaults to SAFE when level is undefined', () => {
    render(<SafetyBadge />);
    expect(screen.getByText('SAFE')).toBeInTheDocument();
  });

  test('has badge CSS class', () => {
    const { container } = render(<SafetyBadge level="danger" />);
    const badge = container.querySelector('.badge');
    expect(badge).toBeInTheDocument();
  });

  test('has font-mono class for consistent styling', () => {
    const { container } = render(<SafetyBadge level="safe" />);
    const badge = container.querySelector('.font-mono');
    expect(badge).toBeInTheDocument();
  });

  test('all five levels render different text', () => {
    const levels = ['safe', 'caution', 'danger', 'extreme', 'illegal'];
    const labels = new Set();
    for (const level of levels) {
      const { container } = render(<SafetyBadge level={level} />);
      labels.add(container.textContent);
    }
    expect(labels.size).toBe(5);
  });
});
