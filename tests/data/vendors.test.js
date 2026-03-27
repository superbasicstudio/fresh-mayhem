import { describe, test, expect } from 'vitest';
import { vendors, vendorCategories, vendorRegions, buyingTips } from '../../data/vendors.js';

describe('vendors array', () => {
  test('has at least 10 vendors', () => {
    expect(vendors.length).toBeGreaterThanOrEqual(10);
  });

  test('every vendor has required fields', () => {
    for (const v of vendors) {
      expect(v).toHaveProperty('name');
      expect(v).toHaveProperty('url');
      expect(v).toHaveProperty('region');
      expect(v).toHaveProperty('category');
      expect(v).toHaveProperty('products');
      expect(v).toHaveProperty('description');
    }
  });

  test('vendor names are unique', () => {
    const names = vendors.map(v => v.name);
    expect(new Set(names).size).toBe(names.length);
  });

  test('URLs are valid', () => {
    for (const v of vendors) {
      expect(v.url).toMatch(/^https?:\/\//);
    }
  });

  test('regions are valid', () => {
    const validRegions = vendorRegions.map(r => r.id);
    for (const v of vendors) {
      expect(validRegions).toContain(v.region);
    }
  });

  test('categories are valid', () => {
    const validCats = vendorCategories.map(c => c.id);
    for (const v of vendors) {
      expect(validCats).toContain(v.category);
    }
  });

  test('products is a non-empty array', () => {
    for (const v of vendors) {
      expect(Array.isArray(v.products)).toBe(true);
      expect(v.products.length).toBeGreaterThan(0);
    }
  });
});

describe('buyingTips array', () => {
  test('has at least 5 tips', () => {
    expect(buyingTips.length).toBeGreaterThanOrEqual(5);
  });

  test('every tip has title, description, severity', () => {
    for (const tip of buyingTips) {
      expect(tip).toHaveProperty('title');
      expect(tip).toHaveProperty('description');
      expect(tip).toHaveProperty('severity');
      expect(['tip', 'warning', 'info']).toContain(tip.severity);
    }
  });
});
