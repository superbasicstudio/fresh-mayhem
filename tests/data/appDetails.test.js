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
  test('has overviews for all main menus', () => {
    expect(menuOverviews.main).toBeDefined();
    expect(menuOverviews.receive).toBeDefined();
    expect(menuOverviews.transmit).toBeDefined();
    expect(menuOverviews.tools).toBeDefined();
    expect(menuOverviews.settings).toBeDefined();
  });

  test('main overview has title and description', () => {
    expect(menuOverviews.main.title).toBeDefined();
    expect(menuOverviews.main.description).toBeDefined();
  });

  test('transmit overview has safety warning', () => {
    expect(menuOverviews.transmit.warning || menuOverviews.transmit.safety).toBeDefined();
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
