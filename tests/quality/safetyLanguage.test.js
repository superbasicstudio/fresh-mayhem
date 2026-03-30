import { describe, test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const PROJECT_ROOT = path.resolve(import.meta.dirname, '..', '..');

describe('safety and legal language compliance', () => {
  test('no declarative "is legal" or "is illegal" statements in user-facing text', () => {
    const files = [
      'data/txApps.js',
      'data/safety.js',
      'data/appDetails.js',
      'locales/en.json',
    ].map(f => path.join(PROJECT_ROOT, f));

    const violations = [];
    const dangerousPatterns = [
      /\bis completely legal\b/i,
      /\bis totally safe\b/i,
      /\bwe guarantee\b/i,
      /\bthis is legal\b/i,
      /\byou are allowed\b/i,
      /\bno laws prevent\b/i,
      /\balways legal\b/i,
      /\b100% safe\b/i,
      /\bperfectly safe\b/i,
      /\bnothing illegal\b/i,
    ];

    for (const file of files) {
      if (!fs.existsSync(file)) continue;
      const content = fs.readFileSync(file, 'utf-8');
      for (const pattern of dangerousPatterns) {
        if (pattern.test(content)) {
          violations.push(`${path.relative(PROJECT_ROOT, file)}: contains "${content.match(pattern)?.[0]}"`);
        }
      }
    }
    expect(violations, `Declarative legal statements found:\n${violations.join('\n')}`).toHaveLength(0);
  });

  test('safety badge labels do not use the word SAFE on its own', () => {
    const enJson = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, 'locales', 'en.json'), 'utf-8'));
    const badges = enJson.badges;
    expect(badges.rx).not.toBe('SAFE');
    expect(badges.rx.toUpperCase()).not.toBe('SAFE');
  });

  test('safety badge labels do not use the word ILLEGAL as a standalone label', () => {
    const enJson = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, 'locales', 'en.json'), 'utf-8'));
    const badges = enJson.badges;
    expect(badges.illegal).not.toBe('ILLEGAL');
    expect(badges.illegal.toUpperCase()).not.toBe('ILLEGAL');
  });

  test('safety tooltips contain region-aware language', () => {
    const enJson = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, 'locales', 'en.json'), 'utf-8'));
    const badges = enJson.badges;
    const regionTerms = /check|local|region|verify|area|jurisdiction|laws/i;
    expect(badges.rxTooltip).toMatch(regionTerms);
    expect(badges.cautionTooltip).toMatch(regionTerms);
    expect(badges.dangerTooltip).toMatch(regionTerms);
    expect(badges.extremeTooltip).toMatch(regionTerms);
    expect(badges.illegalTooltip).toMatch(regionTerms);
  });

  test('no TX app is rated as "safe"', async () => {
    const { txApps } = await import('../../data/txApps.js');
    for (const app of txApps) {
      expect(app.danger, `${app.name} rated as safe - TX apps should never be "safe"`).not.toBe('safe');
    }
  });

  test('extreme/illegal TX apps have legal field with strong warnings', async () => {
    const { txApps } = await import('../../data/txApps.js');
    const highRisk = txApps.filter(a => a.danger === 'extreme' || a.danger === 'illegal');
    for (const app of highRisk) {
      expect(app.legal, `${app.name} missing legal warning`).toBeDefined();
      expect(app.legal.length, `${app.name} legal warning too short`).toBeGreaterThan(20);
    }
  });

  test('ContextPanel safety styles use advisory labels not declarative', () => {
    const content = fs.readFileSync(
      path.join(PROJECT_ROOT, 'components', 'viz', 'ContextPanel.jsx'), 'utf-8'
    );
    // Should not have plain "SAFE" or "ILLEGAL" as label values
    expect(content).not.toMatch(/label:\s*['"]SAFE['"]/);
    expect(content).not.toMatch(/label:\s*['"]ILLEGAL['"]/);
    expect(content).not.toMatch(/label:\s*['"]LEGAL['"]/);
  });
});
