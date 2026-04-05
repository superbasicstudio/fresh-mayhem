import { describe, test, expect } from 'vitest';
import { lookupDetails, menuOverviews, hardwareDetails } from '../../data/appDetails';

describe('appDetails - lookupDetails', () => {
  test('returns details for known RX apps', () => {
    const adsb = lookupDetails('receive', 'ADS-B');
    expect(adsb).toBeDefined();
    expect(adsb.description).toBeDefined();
    expect(adsb.safety).toBeDefined();
  });

  test('returns details for known TX apps', () => {
    const jammer = lookupDetails('transmit', 'Jammer');
    expect(jammer).toBeDefined();
    expect(jammer.safety).toBe('extreme');
  });

  test('returns null for unknown app', () => {
    const result = lookupDetails('receive', 'NonExistentApp');
    expect(result).toBeNull();
  });

  test('all TX apps with details have safety ratings', () => {
    const txApps = ['Jammer', 'GPS Sim', 'ADS-B TX', 'BLE TX', 'OOK TX', 'POCSAG TX'];
    for (const name of txApps) {
      const details = lookupDetails('transmit', name);
      if (details) {
        expect(details.safety, `${name} missing safety rating`).toBeDefined();
        expect(['safe', 'caution', 'danger', 'extreme', 'illegal']).toContain(details.safety);
      }
    }
  });
});

describe('appDetails - menuOverviews', () => {
  test('has overviews for all menus including new ones', () => {
    const required = ['main', 'receive', 'transmit', 'transceiver', 'tools', 'utilities', 'settings', 'games', 'debug'];
    for (const id of required) {
      expect(menuOverviews[id], `missing overview: ${id}`).toBeDefined();
    }
  });

  test('every overview has title and description', () => {
    for (const [id, overview] of Object.entries(menuOverviews)) {
      expect(overview.title, `${id} missing title`).toBeDefined();
      expect(overview.description, `${id} missing description`).toBeDefined();
      expect(overview.description.length, `${id} description too short`).toBeGreaterThanOrEqual(20);
    }
  });

  test('main overview has stats array with 4 items', () => {
    expect(menuOverviews.main.stats).toBeDefined();
    expect(menuOverviews.main.stats.length).toBe(4);
    for (const stat of menuOverviews.main.stats) {
      expect(stat.label).toBeDefined();
      expect(stat.value).toBeDefined();
      expect(stat.color).toBeDefined();
    }
  });

  test('receive overview has categories array', () => {
    expect(menuOverviews.receive.categories).toBeDefined();
    expect(menuOverviews.receive.categories.length).toBeGreaterThanOrEqual(4);
    for (const cat of menuOverviews.receive.categories) {
      expect(cat.name).toBeDefined();
      expect(cat.count).toBeGreaterThanOrEqual(1);
      expect(cat.apps).toBeDefined();
    }
  });

  test('transmit overview has safety warning and breakdown', () => {
    expect(menuOverviews.transmit.safety).toBe('danger');
    expect(menuOverviews.transmit.warning).toBeDefined();
    expect(menuOverviews.transmit.breakdown).toBeDefined();
    expect(menuOverviews.transmit.breakdown.length).toBeGreaterThanOrEqual(3);
  });

  test('receive overview is marked safe', () => {
    expect(menuOverviews.receive.safety).toBe('safe');
  });
});

describe('appDetails - hardwareDetails', () => {
  test('has details for key hardware zones', () => {
    const zones = ['sma', 'power', 'usbc', 'sd', 'dfu', 'reset'];
    for (const zone of zones) {
      if (hardwareDetails[zone]) {
        expect(hardwareDetails[zone].title, `${zone} missing title`).toBeDefined();
        expect(hardwareDetails[zone].description, `${zone} missing description`).toBeDefined();
      }
    }
  });
});
