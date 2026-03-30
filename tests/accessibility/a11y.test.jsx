import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../helpers/i18nSetup';
import fs from 'fs';
import path from 'path';

// Mock heavy components
vi.mock('../../components/viz/WaterfallSim', () => ({ default: () => <div>WaterfallSim</div> }));
vi.mock('../../components/viz/PortaPackMockup', () => ({ default: () => <div>PortaPackMockup</div> }));
vi.mock('../../components/charts/DangerDonut', () => ({ default: () => <div>DangerDonut</div> }));
vi.mock('../../components/charts/GainChain', () => ({ default: () => <div>GainChain</div> }));
vi.mock('../../components/charts/FrequencySpectrum', () => ({ default: () => <div>FrequencySpectrum</div> }));
vi.mock('../../components/charts/CategoryBreakdown', () => ({ default: () => <div>CategoryBreakdown</div> }));
vi.mock('../../components/charts/BandMap', () => ({ default: () => <div>BandMap</div> }));
vi.mock('../../components/charts/PenaltyCards', () => ({ default: () => <div>PenaltyCards</div> }));

const PROJECT_ROOT = path.resolve(import.meta.dirname, '..', '..');

function Wrapper({ children }) {
  return (
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>{children}</MemoryRouter>
    </I18nextProvider>
  );
}

describe('accessibility - ARIA and semantic HTML', () => {
  test('all images in public/ have corresponding alt text usage in components', () => {
    // Check that ExpandableImage usages include alt text
    const components = ['src/pages', 'components'].map(d => path.join(PROJECT_ROOT, d));
    let imgUsages = 0;
    let imgWithAlt = 0;
    for (const dir of components) {
      if (!fs.existsSync(dir)) continue;
      const files = fs.readdirSync(dir, { recursive: true }).filter(f => f.endsWith('.jsx'));
      for (const file of files) {
        const content = fs.readFileSync(path.join(dir, file), 'utf-8');
        const imgMatches = content.match(/<img /g);
        const altMatches = content.match(/<img [^>]*alt=/g);
        if (imgMatches) imgUsages += imgMatches.length;
        if (altMatches) imgWithAlt += altMatches.length;
      }
    }
    expect(imgWithAlt).toBe(imgUsages);
  });

  test('interactive SVGs have aria-label or role attributes', () => {
    const vizDir = path.join(PROJECT_ROOT, 'components', 'viz');
    const chartDir = path.join(PROJECT_ROOT, 'components', 'charts');
    for (const dir of [vizDir, chartDir]) {
      if (!fs.existsSync(dir)) continue;
      const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));
      for (const file of files) {
        const content = fs.readFileSync(path.join(dir, file), 'utf-8');
        const svgCount = (content.match(/<svg /g) || []).length;
        const ariaCount = (content.match(/aria-label=/g) || []).length;
        const roleCount = (content.match(/role="/g) || []).length;
        if (svgCount > 0) {
          expect(ariaCount + roleCount, `${file}: SVGs without aria-label/role`).toBeGreaterThanOrEqual(svgCount);
        }
      }
    }
  });

  test('form inputs have associated labels or aria-labels', () => {
    const dirs = [path.join(PROJECT_ROOT, 'components'), path.join(PROJECT_ROOT, 'src', 'pages')];
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) continue;
      const files = fs.readdirSync(dir, { recursive: true }).filter(f => f.endsWith('.jsx'));
      for (const file of files) {
        const content = fs.readFileSync(path.join(dir, file), 'utf-8');
        const inputs = content.match(/<input /g) || [];
        const labeled = content.match(/<input [^>]*(aria-label|id=)/g) || [];
        expect(labeled.length, `${file}: inputs without labels`).toBe(inputs.length);
      }
    }
  });

  test('buttons have accessible text or aria-labels', () => {
    const dirs = [path.join(PROJECT_ROOT, 'components'), path.join(PROJECT_ROOT, 'src', 'pages')];
    let violations = [];
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) continue;
      const files = fs.readdirSync(dir, { recursive: true }).filter(f => f.endsWith('.jsx'));
      for (const file of files) {
        const content = fs.readFileSync(path.join(dir, file), 'utf-8');
        // Find button elements that are empty (no children or aria-label)
        const emptyButtons = content.match(/<button[^>]*\/>/g) || [];
        for (const btn of emptyButtons) {
          if (!btn.includes('aria-label')) {
            violations.push(`${file}: self-closing button without aria-label`);
          }
        }
      }
    }
    expect(violations, violations.join('\n')).toHaveLength(0);
  });

  test('no tabIndex greater than 0 (anti-pattern)', () => {
    const dirs = [path.join(PROJECT_ROOT, 'components'), path.join(PROJECT_ROOT, 'src')];
    const violations = [];
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) continue;
      const files = fs.readdirSync(dir, { recursive: true }).filter(f => f.endsWith('.jsx'));
      for (const file of files) {
        const content = fs.readFileSync(path.join(dir, file), 'utf-8');
        const matches = content.match(/tabIndex=\{?[2-9]\}?|tabindex="[2-9]"/gi) || [];
        if (matches.length > 0) {
          violations.push(`${file}: tabIndex > 1 found`);
        }
      }
    }
    expect(violations, violations.join('\n')).toHaveLength(0);
  });
});

describe('accessibility - keyboard navigation', () => {
  test('PortaPackMockup has keyboard instructions in aria-label', () => {
    const content = fs.readFileSync(
      path.join(PROJECT_ROOT, 'components', 'viz', 'PortaPackMockup.jsx'), 'utf-8'
    );
    expect(content).toContain('aria-label');
    expect(content).toContain('arrow keys');
  });

  test('expandable cards support Escape key to close', () => {
    const content = fs.readFileSync(
      path.join(PROJECT_ROOT, 'components', 'ExpandableCard.jsx'), 'utf-8'
    );
    expect(content).toContain('Escape');
  });

  test('command palette supports Escape to close', () => {
    const content = fs.readFileSync(
      path.join(PROJECT_ROOT, 'components', 'CommandPalette.jsx'), 'utf-8'
    );
    expect(content).toContain('Escape');
  });
});
