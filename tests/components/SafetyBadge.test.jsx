import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '../helpers/i18nSetup.js';
import SafetyBadge from '../../components/SafetyBadge.jsx';

describe('SafetyBadge component', () => {
  test('renders RX badge for safe level', () => {
    render(<SafetyBadge level="safe" />);
    expect(screen.getByText('RX')).toBeInTheDocument();
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

  test('defaults to RX for unknown level', () => {
    render(<SafetyBadge level="unknown" />);
    expect(screen.getByText('RX')).toBeInTheDocument();
  });

  test('defaults to RX when level is undefined', () => {
    render(<SafetyBadge />);
    expect(screen.getByText('RX')).toBeInTheDocument();
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
