import { describe, test, expect } from 'vitest';
import { tools, settings, games } from '../../data/tools.js';

// ─── Tools array ──────────────────────────────────────────────────────

describe('tools array', () => {
  test('has at least 15 tools', () => {
    expect(tools.length).toBeGreaterThanOrEqual(15);
  });

  test('every tool has name, description, and tx boolean', () => {
    for (const t of tools) {
      expect(t).toHaveProperty('name');
      expect(t).toHaveProperty('description');
      expect(t).toHaveProperty('tx');
      expect(typeof t.tx).toBe('boolean');
    }
  });

  test('tool names are unique', () => {
    const names = tools.map(t => t.name);
    expect(new Set(names).size).toBe(names.length);
  });

  test('only Signal Generator is marked as tx:true', () => {
    const txTools = tools.filter(t => t.tx === true);
    expect(txTools.length).toBe(1);
    expect(txTools[0].name).toBe('Signal Generator');
  });

  test('includes essential tools', () => {
    const names = tools.map(t => t.name);
    expect(names).toContain('File Manager');
    expect(names).toContain('Flash Utility');
    expect(names).toContain('Antenna Length');
  });

  test('Wipe SD Card is marked as destructive in description', () => {
    const wipe = tools.find(t => t.name === 'Wipe SD Card');
    expect(wipe).toBeDefined();
    expect(wipe.description.toUpperCase()).toContain('DESTRUCTIVE');
  });
});

// ─── Settings array ───────────────────────────────────────────────────

describe('settings array', () => {
  test('has at least 15 settings', () => {
    expect(settings.length).toBeGreaterThanOrEqual(15);
  });

  test('every setting has name and description', () => {
    for (const s of settings) {
      expect(s).toHaveProperty('name');
      expect(s).toHaveProperty('description');
      expect(typeof s.name).toBe('string');
      expect(typeof s.description).toBe('string');
    }
  });

  test('setting names are unique', () => {
    const names = settings.map(s => s.name);
    expect(new Set(names).size).toBe(names.length);
  });

  test('includes key settings', () => {
    const names = settings.map(s => s.name);
    expect(names).toContain('Brightness');
    expect(names).toContain('Theme');
    expect(names).toContain('Calibration');
  });
});

// ─── Games array ──────────────────────────────────────────────────────

describe('games array', () => {
  test('has at least 8 games', () => {
    expect(games.length).toBeGreaterThanOrEqual(8);
  });

  test('every game has name and description', () => {
    for (const g of games) {
      expect(g).toHaveProperty('name');
      expect(g).toHaveProperty('description');
    }
  });

  test('game names are unique', () => {
    const names = games.map(g => g.name);
    expect(new Set(names).size).toBe(names.length);
  });

  test('Battleship mentions RF', () => {
    const battleship = games.find(g => g.name === 'Battleship');
    expect(battleship).toBeDefined();
    expect(battleship.description.toUpperCase()).toContain('RF');
  });
});

// ─── Cross-array consistency ──────────────────────────────────────────

describe('cross-array consistency', () => {
  test('no name collisions between tools, settings, and games', () => {
    const allNames = [
      ...tools.map(t => t.name),
      ...settings.map(s => s.name),
      ...games.map(g => g.name),
    ];
    expect(new Set(allNames).size).toBe(allNames.length);
  });
});
