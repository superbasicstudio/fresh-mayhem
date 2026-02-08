import { describe, test, expect } from 'vitest';
import { txApps } from '../../data/txApps.js';

describe('txApps array', () => {
  test('has at least 20 transmit applications', () => {
    expect(txApps.length).toBeGreaterThanOrEqual(20);
  });

  test('every app has required fields', () => {
    for (const app of txApps) {
      expect(app).toHaveProperty('name');
      expect(app).toHaveProperty('description');
      expect(app).toHaveProperty('danger');
      expect(app).toHaveProperty('legal');
    }
  });

  test('app names are unique', () => {
    const names = txApps.map(a => a.name);
    const unique = new Set(names);
    expect(unique.size).toBe(names.length);
  });

  test('danger level is always valid', () => {
    const validLevels = ['safe', 'caution', 'danger', 'extreme', 'illegal'];
    for (const app of txApps) {
      expect(validLevels).toContain(app.danger);
    }
  });

  test('legal field is a non-empty string', () => {
    for (const app of txApps) {
      expect(typeof app.legal).toBe('string');
      expect(app.legal.trim().length).toBeGreaterThan(0);
    }
  });

  test('extreme danger apps include Jammer, GPS Sim, ADS-B TX', () => {
    const extreme = txApps.filter(a => a.danger === 'extreme');
    const names = extreme.map(a => a.name);
    expect(names).toContain('Jammer');
    expect(names).toContain('GPS Sim');
    expect(names.some(n => n.includes('ADS-B'))).toBe(true);
  });

  test('extreme and illegal apps have strong legal warnings', () => {
    const dangerous = txApps.filter(a => a.danger === 'extreme' || a.danger === 'illegal');
    for (const app of dangerous) {
      const legal = app.legal.toLowerCase();
      expect(
        legal.includes('federal') || legal.includes('crime') || legal.includes('illegal') || legal.includes('unauthorized')
      ).toBe(true);
    }
  });

  test('caution-level apps mention licensing or own-device restrictions', () => {
    const caution = txApps.filter(a => a.danger === 'caution');
    for (const app of caution) {
      const legal = app.legal.toLowerCase();
      expect(
        legal.includes('license') || legal.includes('legal') || legal.includes('own device') ||
        legal.includes('your own') || legal.includes('require') || legal.includes('tolerat') ||
        legal.includes('novelty') || legal.includes('testing')
      ).toBe(true);
    }
  });

  test('screenshot filenames are valid when present', () => {
    for (const app of txApps) {
      if (app.screenshot) {
        expect(app.screenshot).toMatch(/\.(png|jpg|jpeg|webp)$/i);
      }
    }
  });

  test('no TX app is rated "safe"', () => {
    const safe = txApps.filter(a => a.danger === 'safe');
    expect(safe.length).toBe(0);
  });

  test('descriptions are substantial', () => {
    for (const app of txApps) {
      expect(app.description.length).toBeGreaterThanOrEqual(10);
    }
  });
});
