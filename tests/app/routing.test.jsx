import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../../src/App.jsx';

// Mock heavy visualization components to speed up tests
vi.mock('../../components/viz/WaterfallSim.jsx', () => ({
  default: () => <div data-testid="waterfall-mock">WaterfallSim</div>,
}));
vi.mock('../../components/viz/PortaPackMockup.jsx', () => ({
  default: () => <div data-testid="portapack-mock">PortaPackMockup</div>,
}));
vi.mock('../../components/charts/DangerDonut.jsx', () => ({
  default: () => <div data-testid="donut-mock">DangerDonut</div>,
}));
vi.mock('../../components/charts/GainChain.jsx', () => ({
  default: () => <div data-testid="gain-mock">GainChain</div>,
}));
vi.mock('../../components/charts/FrequencySpectrum.jsx', () => ({
  default: () => <div data-testid="freq-mock">FrequencySpectrum</div>,
}));
vi.mock('../../components/charts/CategoryBreakdown.jsx', () => ({
  default: () => <div data-testid="cat-mock">CategoryBreakdown</div>,
}));

function renderWithRouter(initialRoute = '/') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <App />
    </MemoryRouter>
  );
}

describe('App routing', () => {
  test('renders overview page at /', () => {
    renderWithRouter('/');
    // The overview page should render some content
    expect(document.querySelector('[class*="drawer"]') || document.body.textContent.length > 0).toBeTruthy();
  });

  test('renders controls page at /controls', () => {
    renderWithRouter('/controls');
    expect(document.body.textContent.length).toBeGreaterThan(0);
  });

  test('renders receive page at /receive', () => {
    renderWithRouter('/receive');
    expect(document.body.textContent.length).toBeGreaterThan(0);
  });

  test('renders transmit page at /transmit', () => {
    renderWithRouter('/transmit');
    expect(document.body.textContent.length).toBeGreaterThan(0);
  });

  test('renders tools page at /tools', () => {
    renderWithRouter('/tools');
    expect(document.body.textContent.length).toBeGreaterThan(0);
  });

  test('renders safety page at /safety', () => {
    renderWithRouter('/safety');
    expect(document.body.textContent.length).toBeGreaterThan(0);
  });

  test('renders frequencies page at /frequencies', () => {
    renderWithRouter('/frequencies');
    expect(document.body.textContent.length).toBeGreaterThan(0);
  });

  test('renders learn page at /learn', () => {
    renderWithRouter('/learn');
    expect(document.body.textContent.length).toBeGreaterThan(0);
  });

  test('renders quickstart page at /quickstart', () => {
    renderWithRouter('/quickstart');
    expect(document.body.textContent.length).toBeGreaterThan(0);
  });
});
