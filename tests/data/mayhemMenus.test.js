import { describe, test, expect } from 'vitest';
import { MENUS, THEMES, THEME_ORDER, TITLE_BAR_ICONS, FW_COLORS, LAYOUT } from '../../data/mayhemMenus';
import ICON_PATHS from '../../data/mayhemIcons';

describe('mayhemMenus - menu structure', () => {
  const menuIds = Object.keys(MENUS);

  test('has all expected menus', () => {
    const required = ['main', 'receive', 'transmit', 'transceiver', 'utilities', 'settings', 'games', 'debug'];
    for (const id of required) {
      expect(MENUS[id], `missing menu: ${id}`).toBeDefined();
    }
  });

  test('every menu has required fields', () => {
    for (const id of menuIds) {
      const menu = MENUS[id];
      expect(menu.title, `${id} missing title`).toBeDefined();
      expect(menu.grid, `${id} missing grid`).toBeDefined();
      expect(Array.isArray(menu.items), `${id} items is not array`).toBe(true);
      expect(menu.items.length, `${id} has no items`).toBeGreaterThan(0);
    }
  });

  test('grid values are 2 or 3', () => {
    for (const id of menuIds) {
      expect([2, 3]).toContain(MENUS[id].grid);
    }
  });

  test('main menu uses 2-column grid', () => {
    expect(MENUS.main.grid).toBe(2);
  });

  test('receive and transmit use 3-column grid', () => {
    expect(MENUS.receive.grid).toBe(3);
    expect(MENUS.transmit.grid).toBe(3);
  });

  test('every menu item has label, color, and icon', () => {
    for (const id of menuIds) {
      for (const item of MENUS[id].items) {
        expect(item.label, `${id} item missing label`).toBeDefined();
        expect(typeof item.label).toBe('string');
        expect(item.label.length).toBeGreaterThan(0);
        expect(item.color, `${id}/${item.label} missing color`).toBeDefined();
        expect(item.icon || item.sub, `${id}/${item.label} needs icon or sub`).toBeDefined();
      }
    }
  });

  test('submenu references point to existing menus', () => {
    for (const id of menuIds) {
      for (const item of MENUS[id].items) {
        if (item.sub) {
          expect(MENUS[item.sub], `${id}/${item.label} references missing menu: ${item.sub}`).toBeDefined();
        }
      }
    }
  });

  test('items without submenu have info text', () => {
    for (const id of menuIds) {
      for (const item of MENUS[id].items) {
        if (!item.sub) {
          expect(item.info, `${id}/${item.label} has no sub and no info`).toBeDefined();
          expect(item.info.length, `${id}/${item.label} info too short`).toBeGreaterThanOrEqual(20);
        }
      }
    }
  });

  test('labels are unique within each menu', () => {
    for (const id of menuIds) {
      const labels = MENUS[id].items.map(i => i.label);
      expect(new Set(labels).size, `${id} has duplicate labels`).toBe(labels.length);
    }
  });

  test('main menu has at least 10 items', () => {
    expect(MENUS.main.items.length).toBeGreaterThanOrEqual(10);
  });

  test('receive menu has at least 30 apps', () => {
    expect(MENUS.receive.items.length).toBeGreaterThanOrEqual(30);
  });

  test('transmit menu has at least 30 apps', () => {
    expect(MENUS.transmit.items.length).toBeGreaterThanOrEqual(30);
  });

  test('games menu has at least 8 games', () => {
    expect(MENUS.games.items.length).toBeGreaterThanOrEqual(8);
  });

  test('only main menu has showInfoBar', () => {
    expect(MENUS.main.showInfoBar).toBe(true);
    for (const id of menuIds) {
      if (id !== 'main') {
        expect(MENUS[id].showInfoBar, `${id} should not have showInfoBar`).toBeFalsy();
      }
    }
  });
});

describe('mayhemMenus - icon references', () => {
  test('every menu item icon exists in ICON_PATHS', () => {
    const menuIds = Object.keys(MENUS);
    const missing = [];
    for (const id of menuIds) {
      for (const item of MENUS[id].items) {
        if (item.icon && !ICON_PATHS[item.icon]) {
          missing.push(`${id}/${item.label} -> ${item.icon}`);
        }
      }
    }
    expect(missing, `Missing icons:\n${missing.join('\n')}`).toHaveLength(0);
  });
});

describe('mayhemMenus - color palette', () => {
  test('FW_COLORS has all expected firmware colors', () => {
    const required = ['black', 'white', 'red', 'green', 'blue', 'cyan', 'yellow', 'orange', 'grey', 'darkGrey', 'darkerGrey', 'lightGrey', 'magenta'];
    for (const name of required) {
      expect(FW_COLORS[name], `missing color: ${name}`).toBeDefined();
    }
  });

  test('all colors are valid hex strings', () => {
    for (const [name, color] of Object.entries(FW_COLORS)) {
      expect(color, `${name} is not hex`).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  test('menu item colors are valid hex strings', () => {
    for (const id of Object.keys(MENUS)) {
      for (const item of MENUS[id].items) {
        expect(item.color, `${id}/${item.label} invalid color`).toMatch(/^#[0-9A-Fa-f]{6}$/);
      }
    }
  });
});

describe('mayhemMenus - themes', () => {
  test('has all 6 firmware themes', () => {
    expect(Object.keys(THEMES).length).toBe(6);
    const required = ['defaultGrey', 'yellow', 'aqua', 'green', 'red', 'dark'];
    for (const name of required) {
      expect(THEMES[name], `missing theme: ${name}`).toBeDefined();
    }
  });

  test('THEME_ORDER matches THEMES keys', () => {
    expect(THEME_ORDER.length).toBe(Object.keys(THEMES).length);
    for (const id of THEME_ORDER) {
      expect(THEMES[id], `${id} in THEME_ORDER but not in THEMES`).toBeDefined();
    }
  });

  test('every theme has required color properties', () => {
    const required = ['name', 'bgDarkest', 'bgDarker', 'bgDark', 'bgMedium', 'bgLight', 'fgLight', 'fgMedium', 'statusActive', 'menuColor'];
    for (const [id, theme] of Object.entries(THEMES)) {
      for (const prop of required) {
        expect(theme[prop], `theme ${id} missing ${prop}`).toBeDefined();
      }
    }
  });

  test('theme colors are valid hex strings', () => {
    const colorProps = ['bgDarkest', 'bgDarker', 'bgDark', 'bgMedium', 'bgLight', 'fgLight', 'fgMedium', 'statusActive', 'menuColor'];
    for (const [id, theme] of Object.entries(THEMES)) {
      for (const prop of colorProps) {
        expect(theme[prop], `theme ${id}.${prop} invalid`).toMatch(/^#[0-9A-Fa-f]{6}$/);
      }
    }
  });

  test('all themes have green status active color', () => {
    for (const [id, theme] of Object.entries(THEMES)) {
      expect(theme.statusActive, `theme ${id} statusActive`).toBe('#00FF00');
    }
  });
});

describe('mayhemMenus - title bar icons', () => {
  test('has at least 10 title bar icons', () => {
    expect(TITLE_BAR_ICONS.length).toBeGreaterThanOrEqual(10);
  });

  test('every icon has required fields', () => {
    for (const icon of TITLE_BAR_ICONS) {
      expect(icon.id, 'icon missing id').toBeDefined();
      expect(icon.label, `${icon.id} missing label`).toBeDefined();
      expect(icon.desc, `${icon.id} missing desc`).toBeDefined();
      expect(icon.type, `${icon.id} missing type`).toBeDefined();
      expect(['button', 'toggle', 'status']).toContain(icon.type);
      expect(icon.width, `${icon.id} missing width`).toBeDefined();
    }
  });

  test('icon IDs are unique', () => {
    const ids = TITLE_BAR_ICONS.map(i => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('toggle icons have activeColor', () => {
    const toggles = TITLE_BAR_ICONS.filter(i => i.type === 'toggle');
    for (const icon of toggles) {
      expect(icon.activeColor, `${icon.id} toggle missing activeColor`).toBeDefined();
    }
  });

  test('icon descriptions are educational (min 20 chars)', () => {
    for (const icon of TITLE_BAR_ICONS) {
      expect(icon.desc.length, `${icon.id} desc too short`).toBeGreaterThanOrEqual(20);
    }
  });
});

describe('mayhemMenus - layout constants', () => {
  test('screen dimensions match firmware specs', () => {
    expect(LAYOUT.screenWidth).toBe(240);
    expect(LAYOUT.screenHeight).toBe(320);
  });

  test('title and info bar heights are 16px', () => {
    expect(LAYOUT.titleBarHeight).toBe(16);
    expect(LAYOUT.infoBarHeight).toBe(16);
  });

  test('content heights are derived correctly', () => {
    expect(LAYOUT.contentHeight).toBe(LAYOUT.screenHeight - LAYOUT.titleBarHeight - LAYOUT.infoBarHeight);
    expect(LAYOUT.contentHeightFull).toBe(LAYOUT.screenHeight - LAYOUT.titleBarHeight);
  });

  test('button height matches firmware default', () => {
    expect(LAYOUT.buttonHeight).toBe(48);
  });
});
