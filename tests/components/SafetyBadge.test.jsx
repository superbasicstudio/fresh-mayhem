import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '../helpers/i18nSetup.js';
import SafetyBadge from '../../components/SafetyBadge.jsx';

describe('SafetyBadge component', () => {
  test('renders RX ONLY badge for safe level', () => {
    render(<SafetyBadge level="safe" />);
    expect(screen.getByText('RX ONLY')).toBeInTheDocument();
  });

  test('renders CAUTION badge for caution level', () => {
    render(<SafetyBadge level="caution" />);
    expect(screen.getByText('CAUTION')).toBeInTheDocument();
  });

  test('renders HIGH RISK badge for danger level', () => {
    render(<SafetyBadge level="danger" />);
    expect(screen.getByText('HIGH RISK')).toBeInTheDocument();
  });

  test('renders EXTREME RISK badge for extreme level', () => {
    render(<SafetyBadge level="extreme" />);
    expect(screen.getByText('EXTREME RISK')).toBeInTheDocument();
  });

  test('renders RESTRICTED badge for illegal level', () => {
    render(<SafetyBadge level="illegal" />);
    expect(screen.getByText('RESTRICTED')).toBeInTheDocument();
  });

  test('defaults to RX ONLY for unknown level', () => {
    render(<SafetyBadge level="unknown" />);
    expect(screen.getByText('RX ONLY')).toBeInTheDocument();
  });

  test('defaults to RX ONLY when level is undefined', () => {
    render(<SafetyBadge />);
    expect(screen.getByText('RX ONLY')).toBeInTheDocument();
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

  test('badges have cursor-help class for tooltips', () => {
    const { container } = render(<SafetyBadge level="safe" />);
    expect(container.querySelector('.cursor-help')).not.toBeNull();
  });
});
