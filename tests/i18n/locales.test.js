import { describe, test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const LOCALES_DIR = path.resolve(import.meta.dirname, '..', '..', 'locales');
const enJson = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'en.json'), 'utf-8'));

function flattenKeys(obj, prefix = '') {
  const keys = [];
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
      keys.push(...flattenKeys(v, key));
    } else {
      keys.push(key);
    }
  }
  return keys;
}

const enKeys = flattenKeys(enJson);
const localeFiles = fs.readdirSync(LOCALES_DIR).filter(f => f.endsWith('.json') && f !== 'en.json');

describe('locale file integrity', () => {
  test('English locale has translation keys', () => {
    expect(enKeys.length).toBeGreaterThan(50);
  });

  test('all locale files are valid JSON', () => {
    for (const file of localeFiles) {
      const content = fs.readFileSync(path.join(LOCALES_DIR, file), 'utf-8');
      expect(() => JSON.parse(content), `${file} is not valid JSON`).not.toThrow();
    }
  });

  test.each(localeFiles)('%s has all top-level sections from English', (file) => {
    const locale = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, file), 'utf-8'));
    const enSections = Object.keys(enJson);
    const localeSections = Object.keys(locale);
    const missing = enSections.filter(s => !localeSections.includes(s));
    expect(missing, `${file} missing sections: ${missing.join(', ')}`).toHaveLength(0);
  });

  test('no locale file is empty', () => {
    for (const file of localeFiles) {
      const content = fs.readFileSync(path.join(LOCALES_DIR, file), 'utf-8');
      const parsed = JSON.parse(content);
      expect(Object.keys(parsed).length, `${file} is empty`).toBeGreaterThan(0);
    }
  });

  test('English locale has all required sections', () => {
    const required = ['nav', 'overview', 'controls', 'receive', 'transmit', 'safety', 'frequencies', 'badges', 'common'];
    for (const section of required) {
      expect(enJson, `Missing required section: ${section}`).toHaveProperty(section);
    }
  });

  test('badge translations exist for all safety levels', () => {
    const badges = enJson.badges;
    expect(badges).toBeDefined();
    expect(badges.rx).toBeDefined();
    expect(badges.caution).toBeDefined();
    expect(badges.danger).toBeDefined();
    expect(badges.extreme).toBeDefined();
    expect(badges.illegal).toBeDefined();
  });

  test('navigation labels exist for all pages', () => {
    const nav = enJson.nav;
    expect(nav).toBeDefined();
    const requiredPages = ['overview', 'controls', 'receive', 'transmit', 'tools', 'safety', 'frequencies', 'learn'];
    for (const page of requiredPages) {
      expect(nav[page], `Missing nav label: ${page}`).toBeDefined();
    }
  });
});
