import { describe, test, expect } from 'vitest';
import { rxApps } from '../../data/rxApps.js';

describe('rxApps array', () => {
  test('has at least 25 receive applications', () => {
    expect(rxApps.length).toBeGreaterThanOrEqual(25);
  });

  test('every app has required fields', () => {
    for (const app of rxApps) {
      expect(app).toHaveProperty('name');
      expect(app).toHaveProperty('description');
      expect(app).toHaveProperty('frequency');
      expect(app).toHaveProperty('category');
    }
  });

  test('app names are unique', () => {
    const names = rxApps.map(a => a.name);
    const unique = new Set(names);
    expect(unique.size).toBe(names.length);
  });

  test('names are non-empty strings', () => {
    for (const app of rxApps) {
      expect(typeof app.name).toBe('string');
      expect(app.name.trim().length).toBeGreaterThan(0);
    }
  });

  test('descriptions are at least 10 characters', () => {
    for (const app of rxApps) {
      expect(app.description.length).toBeGreaterThanOrEqual(10);
    }
  });

  test('frequency is a non-empty string', () => {
    for (const app of rxApps) {
      expect(typeof app.frequency).toBe('string');
      expect(app.frequency.trim().length).toBeGreaterThan(0);
    }
  });

  test('categories are consistent (no typos or one-offs)', () => {
    const categories = rxApps.map(a => a.category);
    const unique = new Set(categories);
    // Should have a reasonable number of categories, not one per app
    expect(unique.size).toBeLessThan(rxApps.length);
    expect(unique.size).toBeGreaterThanOrEqual(3);
  });

  test('includes key apps: ADS-B, Audio, Looking Glass, SubGhzD', () => {
    const names = rxApps.map(a => a.name);
    expect(names).toContain('ADS-B');
    expect(names).toContain('Audio');
    expect(names).toContain('Looking Glass');
    expect(names).toContain('SubGhzD');
  });

  test('wiki links are valid URLs when present', () => {
    for (const app of rxApps) {
      if (app.wiki && app.wiki.length > 0) {
        expect(app.wiki).toMatch(/^https?:\/\//);
      }
    }
  });

  test('screenshot filenames are valid when present', () => {
    for (const app of rxApps) {
      if (app.screenshot) {
        expect(app.screenshot).toMatch(/\.(png|jpg|jpeg|webp)$/i);
      }
    }
  });

  test('no RX app has danger or legal rating (those are TX-only)', () => {
    for (const app of rxApps) {
      expect(app).not.toHaveProperty('danger');
      expect(app).not.toHaveProperty('legal');
    }
  });
});
