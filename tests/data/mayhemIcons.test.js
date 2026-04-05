import { describe, test, expect } from 'vitest';
import ICON_PATHS from '../../data/mayhemIcons';
import { MENUS, TITLE_BAR_ICONS } from '../../data/mayhemMenus';

describe('mayhemIcons - basic structure', () => {
  const iconNames = Object.keys(ICON_PATHS);

  test('has at least 45 icons', () => {
    expect(iconNames.length).toBeGreaterThanOrEqual(45);
  });

  test('all values are non-empty strings', () => {
    for (const name of iconNames) {
      expect(typeof ICON_PATHS[name], `${name} is not a string`).toBe('string');
      expect(ICON_PATHS[name].length, `${name} is empty`).toBeGreaterThan(0);
    }
  });

  test('has all critical menu icons', () => {
    const required = ['receivers', 'transmit', 'transceivers', 'capture', 'replay', 'looking', 'utilities', 'games', 'setup', 'hackrf'];
    for (const name of required) {
      expect(ICON_PATHS[name], `missing critical icon: ${name}`).toBeDefined();
    }
  });

  test('has all critical app icons', () => {
    const required = ['adsb', 'ais', 'aprs', 'speaker', 'btle', 'pocsag', 'sonde', 'search', 'remote', 'thermometer', 'microphone'];
    for (const name of required) {
      expect(ICON_PATHS[name], `missing app icon: ${name}`).toBeDefined();
    }
  });

  test('has title bar icons', () => {
    const required = ['camera', 'sleep', 'stealth', 'brightness', 'battery', 'sdcard', 'previous'];
    for (const name of required) {
      expect(ICON_PATHS[name], `missing title bar icon: ${name}`).toBeDefined();
    }
  });

  test('has external app fallback icon', () => {
    expect(ICON_PATHS.ext).toBeDefined();
  });
});

describe('mayhemIcons - SVG path validation', () => {
  test('all paths start with M (moveto command)', () => {
    for (const [name, path] of Object.entries(ICON_PATHS)) {
      expect(path[0], `${name} path does not start with M`).toBe('M');
    }
  });

  test('all paths contain only valid SVG path characters', () => {
    // Valid SVG path commands and numeric characters
    const validPattern = /^[MmLlHhVvZz0-9,.\-\s]+$/;
    for (const [name, path] of Object.entries(ICON_PATHS)) {
      expect(path, `${name} has invalid SVG path characters`).toMatch(validPattern);
    }
  });

  test('all paths end with z (close path)', () => {
    for (const [name, path] of Object.entries(ICON_PATHS)) {
      expect(path[path.length - 1], `${name} path does not end with z`).toBe('z');
    }
  });

  test('paths have reasonable length (16x16 bitmap = non-trivial)', () => {
    for (const [name, path] of Object.entries(ICON_PATHS)) {
      // A 16x16 bitmap icon with any visible pixels should produce at least 10 chars
      expect(path.length, `${name} path suspiciously short`).toBeGreaterThan(10);
    }
  });
});

describe('mayhemIcons - cross-references with menus', () => {
  test('every icon referenced in MENUS exists in ICON_PATHS', () => {
    const missing = [];
    for (const [menuId, menu] of Object.entries(MENUS)) {
      for (const item of menu.items) {
        if (item.icon && !ICON_PATHS[item.icon]) {
          missing.push(`${menuId}/${item.label} -> ${item.icon}`);
        }
      }
    }
    expect(missing, `Icons referenced but not defined:\n${missing.join('\n')}`).toHaveLength(0);
  });

  test('back arrow icon (previous) exists for title bar', () => {
    expect(ICON_PATHS.previous).toBeDefined();
  });

  test('bias tee on/off icons both exist', () => {
    expect(ICON_PATHS.biast_on).toBeDefined();
    expect(ICON_PATHS.biast_off).toBeDefined();
  });

  test('speaker state icons all exist', () => {
    expect(ICON_PATHS.speaker).toBeDefined();
    expect(ICON_PATHS.speaker_mute).toBeDefined();
    expect(ICON_PATHS.speaker_headphones).toBeDefined();
    expect(ICON_PATHS.speaker_headphones_mute).toBeDefined();
  });
});
