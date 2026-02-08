// Numeric frequency ranges for D3 spectrum chart
// All values in MHz

export const rxBands = [
  { app: "ADS-B", startMHz: 1088, endMHz: 1092, category: "aviation" },
  { app: "ACARS", startMHz: 129, endMHz: 137, category: "aviation" },
  { app: "AFSK", startMHz: 1, endMHz: 1000, category: "decode", wide: true },
  { app: "AIS Boats", startMHz: 161.9, endMHz: 162.1, category: "maritime" },
  { app: "Analog TV", startMHz: 47, endMHz: 862, category: "broadcast", wide: true },
  { app: "APRS RX", startMHz: 144, endMHz: 145, category: "amateur" },
  { app: "Audio", startMHz: 1, endMHz: 6000, category: "general", wide: true },
  { app: "BLE RX", startMHz: 2400, endMHz: 2484, category: "wireless" },
  { app: "Detector", startMHz: 1, endMHz: 6000, category: "general", wide: true },
  { app: "ERT Meter", startMHz: 900, endMHz: 928, category: "ism" },
  { app: "Flex RX", startMHz: 137, endMHz: 930, category: "pager", wide: true },
  { app: "Fox Hunt", startMHz: 1, endMHz: 6000, category: "general", wide: true },
  { app: "gfxEQ", startMHz: 87.5, endMHz: 108, category: "broadcast" },
  { app: "Level", startMHz: 1, endMHz: 6000, category: "general", wide: true },
  { app: "Looking Glass", startMHz: 1, endMHz: 6000, category: "general", wide: true },
  { app: "Morse RX", startMHz: 1, endMHz: 6000, category: "decode", wide: true },
  { app: "NOAA", startMHz: 137, endMHz: 138, category: "satellite" },
  { app: "NRF", startMHz: 2400, endMHz: 2525, category: "wireless" },
  { app: "POCSAG RX", startMHz: 137, endMHz: 930, category: "pager", wide: true },
  { app: "ProtoView", startMHz: 300, endMHz: 928, category: "ism" },
  { app: "Radiosonde", startMHz: 400, endMHz: 406, category: "weather" },
  { app: "Scanner", startMHz: 1, endMHz: 6000, category: "general", wide: true },
  { app: "Search", startMHz: 1, endMHz: 6000, category: "general", wide: true },
  { app: "SSTV RX", startMHz: 1, endMHz: 6000, category: "decode", wide: true },
  { app: "SubCar", startMHz: 87.5, endMHz: 108, category: "broadcast" },
  { app: "SubGhzD", startMHz: 300, endMHz: 928, category: "ism" },
  { app: "TPMS RX", startMHz: 315, endMHz: 433.92, category: "automotive" },
  { app: "Weather", startMHz: 433, endMHz: 915, category: "weather" },
  { app: "WeFax", startMHz: 2, endMHz: 25, category: "weather" },
];

export const noGoBands = [
  { name: "Aviation VOR/ILS", startMHz: 108, endMHz: 117.975, service: "Aircraft navigation" },
  { name: "Aviation Voice", startMHz: 118, endMHz: 136.975, service: "Air Traffic Control" },
  { name: "Aviation Emergency", startMHz: 121.4, endMHz: 121.6, service: "International distress" },
  { name: "Aviation ELT", startMHz: 242.9, endMHz: 243.1, service: "Military emergency" },
  { name: "GPS L5", startMHz: 1176, endMHz: 1177, service: "Aviation/maritime GPS" },
  { name: "GPS L2", startMHz: 1227, endMHz: 1228, service: "Precision GPS" },
  { name: "GLONASS L2", startMHz: 1246, endMHz: 1247, service: "Russian GNSS" },
  { name: "GPS L1", startMHz: 1575, endMHz: 1576, service: "Civilian GPS" },
  { name: "Galileo E1", startMHz: 1575, endMHz: 1576, service: "EU GNSS" },
  { name: "GLONASS L1", startMHz: 1602, endMHz: 1603, service: "Russian GNSS" },
  { name: "Cellular Low", startMHz: 698, endMHz: 894, service: "All cellular carriers" },
  { name: "Public Safety", startMHz: 764, endMHz: 806, service: "FirstNet, police, fire, EMS" },
  { name: "Cellular High", startMHz: 1710, endMHz: 2155, service: "All cellular carriers" },
  { name: "Marine VHF", startMHz: 156, endMHz: 162.025, service: "Ship-to-ship/shore" },
  { name: "NOAA Weather", startMHz: 162.4, endMHz: 162.55, service: "Emergency alerts" },
  { name: "Radar L-band", startMHz: 960, endMHz: 1215, service: "ATC radar" },
  { name: "Radar S-band", startMHz: 2700, endMHz: 3100, service: "Weather radar" },
  { name: "Radar C-band", startMHz: 5250, endMHz: 5925, service: "Military radar" },
];

export const legalBands = [
  { name: "ISM 433 MHz", startMHz: 433.05, endMHz: 434.79, requirements: "Region 1 (EU) only" },
  { name: "ISM 902 MHz", startMHz: 902, endMHz: 928, requirements: "US; spread spectrum" },
  { name: "ISM 2.4 GHz", startMHz: 2400, endMHz: 2483.5, requirements: "Worldwide" },
  { name: "ISM 5.8 GHz", startMHz: 5725, endMHz: 5875, requirements: "Power limits vary" },
];

// Category colors for charts (match hackrf theme)
export const categoryColors = {
  aviation: '#4ade80',    // accent green
  maritime: '#38bdf8',    // info blue
  decode: '#a78bfa',      // secondary violet
  broadcast: '#facc15',   // warning gold
  amateur: '#f43f5e',     // error rose
  general: '#737373',     // neutral gray
  wireless: '#7fff00',    // primary cyan
  ism: '#fb923c',         // orange
  pager: '#e879f9',       // fuchsia
  satellite: '#4ade80',   // accent green
  weather: '#38bdf8',     // info blue
  automotive: '#facc15',  // warning gold
};
