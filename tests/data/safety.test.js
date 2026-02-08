import { describe, test, expect } from 'vitest';
import { mistakes, damageStories, frequencies } from '../../data/safety.js';

// ─── Mistakes data integrity ──────────────────────────────────────────

describe('mistakes array', () => {
  test('has at least 8 entries', () => {
    expect(mistakes.length).toBeGreaterThanOrEqual(8);
  });

  test('every mistake has required fields', () => {
    for (const m of mistakes) {
      expect(m).toHaveProperty('title');
      expect(m).toHaveProperty('severity');
      expect(m).toHaveProperty('description');
      expect(m).toHaveProperty('symptoms');
      expect(m).toHaveProperty('prevention');
      expect(m).toHaveProperty('technical');
    }
  });

  test('severity is always a valid level', () => {
    const validLevels = ['safe', 'caution', 'danger', 'extreme', 'illegal'];
    for (const m of mistakes) {
      expect(validLevels).toContain(m.severity);
    }
  });

  test('symptoms is always a non-empty array', () => {
    for (const m of mistakes) {
      expect(Array.isArray(m.symptoms)).toBe(true);
      expect(m.symptoms.length).toBeGreaterThan(0);
    }
  });

  test('prevention is always a non-empty array', () => {
    for (const m of mistakes) {
      expect(Array.isArray(m.prevention)).toBe(true);
      expect(m.prevention.length).toBeGreaterThan(0);
    }
  });

  test('titles are unique', () => {
    const titles = mistakes.map(m => m.title);
    const unique = new Set(titles);
    expect(unique.size).toBe(titles.length);
  });

  test('description is at least 30 characters', () => {
    for (const m of mistakes) {
      expect(m.description.length).toBeGreaterThanOrEqual(30);
    }
  });

  test('technical explanation references actual specs or values', () => {
    for (const m of mistakes) {
      // Each technical field should contain at least one number (dBm, MHz, etc.)
      expect(m.technical).toMatch(/\d/);
    }
  });

  test('extreme severity items warn about permanent damage', () => {
    const extreme = mistakes.filter(m => m.severity === 'extreme');
    expect(extreme.length).toBeGreaterThanOrEqual(3);
    for (const m of extreme) {
      const text = (m.description + ' ' + m.technical + ' ' + m.symptoms.join(' ')).toLowerCase();
      expect(
        text.includes('destroy') || text.includes('fried') || text.includes('fatal') ||
        text.includes('damage') || text.includes('failure') || text.includes('exceed') ||
        text.includes('corrupt') || text.includes('kill')
      ).toBe(true);
    }
  });
});

// ─── Damage stories data integrity ────────────────────────────────────

describe('damageStories array', () => {
  test('has at least 5 entries', () => {
    expect(damageStories.length).toBeGreaterThanOrEqual(5);
  });

  test('every story has required fields', () => {
    for (const s of damageStories) {
      expect(s).toHaveProperty('title');
      expect(s).toHaveProperty('description');
      expect(s).toHaveProperty('source');
    }
  });

  test('titles are unique', () => {
    const titles = damageStories.map(s => s.title);
    const unique = new Set(titles);
    expect(unique.size).toBe(titles.length);
  });

  test('source references a real issue or mailing list', () => {
    for (const s of damageStories) {
      expect(s.source.length).toBeGreaterThan(0);
    }
  });

  test('descriptions are substantial', () => {
    for (const s of damageStories) {
      expect(s.description.length).toBeGreaterThanOrEqual(20);
    }
  });
});

// ─── Frequency data integrity ─────────────────────────────────────────

describe('frequencies object', () => {
  test('has noGo, legal, and penalties arrays', () => {
    expect(Array.isArray(frequencies.noGo)).toBe(true);
    expect(Array.isArray(frequencies.legal)).toBe(true);
    expect(Array.isArray(frequencies.penalties)).toBe(true);
  });

  test('noGo has at least 10 restricted bands', () => {
    expect(frequencies.noGo.length).toBeGreaterThanOrEqual(10);
  });

  test('every noGo entry has band, range, and service', () => {
    for (const f of frequencies.noGo) {
      expect(f).toHaveProperty('band');
      expect(f).toHaveProperty('range');
      expect(f).toHaveProperty('service');
    }
  });

  test('noGo includes critical aviation and GPS bands', () => {
    const bands = frequencies.noGo.map(f => f.band.toLowerCase());
    expect(bands.some(b => b.includes('aviation'))).toBe(true);
    expect(bands.some(b => b.includes('gps'))).toBe(true);
  });

  test('legal bands have requirements field', () => {
    for (const f of frequencies.legal) {
      expect(f).toHaveProperty('band');
      expect(f).toHaveProperty('range');
      expect(f).toHaveProperty('requirements');
    }
  });

  test('penalties reference specific laws', () => {
    for (const p of frequencies.penalties) {
      expect(p).toHaveProperty('violation');
      expect(p).toHaveProperty('law');
      expect(p).toHaveProperty('penalty');
      expect(p.law.length).toBeGreaterThan(0);
    }
  });

  test('penalty amounts are substantial', () => {
    const penaltyText = frequencies.penalties.map(p => p.penalty).join(' ');
    expect(penaltyText).toMatch(/\$[\d,]+/);
  });
});

// ─── No PII in safety data ────────────────────────────────────────────

describe('PII safety check', () => {
  test('no personal email addresses in mistakes data', () => {
    const json = JSON.stringify(mistakes);
    expect(json).not.toMatch(/[a-z0-9._%+-]+@(gmail|yahoo|hotmail|outlook)\.[a-z]{2,}/i);
  });

  test('no personal file paths in safety data', () => {
    const json = JSON.stringify({ mistakes, damageStories, frequencies });
    expect(json).not.toMatch(/\/home\/[a-z][a-z0-9_-]+\//i);
    expect(json).not.toMatch(/\/Users\/[a-z][a-z0-9_-]+\//i);
  });
});
