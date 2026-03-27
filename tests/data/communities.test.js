import { describe, test, expect } from 'vitest';
import { communities } from '../../data/communities.js';

describe('communities array', () => {
  test('has at least 8 communities', () => {
    expect(communities.length).toBeGreaterThanOrEqual(8);
  });

  test('every community has required fields', () => {
    for (const c of communities) {
      expect(c).toHaveProperty('name');
      expect(c).toHaveProperty('url');
      expect(c).toHaveProperty('members');
      expect(c).toHaveProperty('description');
      expect(c).toHaveProperty('tags');
      expect(c).toHaveProperty('relevance');
    }
  });

  test('URLs are valid Reddit or forum links', () => {
    for (const c of communities) {
      expect(c.url).toMatch(/^https?:\/\//);
    }
  });

  test('tags is a non-empty array', () => {
    for (const c of communities) {
      expect(Array.isArray(c.tags)).toBe(true);
      expect(c.tags.length).toBeGreaterThan(0);
    }
  });

  test('includes r/hackrf and r/RTLSDR', () => {
    const names = communities.map(c => c.name);
    expect(names).toContain('r/hackrf');
    expect(names).toContain('r/RTLSDR');
  });
});
