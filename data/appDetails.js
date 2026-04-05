// Rich educational details for Mayhem menu items
// Used by ContextPanel when navigating the PortaPack simulator
import { FALLBACK_VERSION } from './firmware';

export const appDetails = {
  // ═══════════════════════════════════════════════
  //  RECEIVE APPS
  // ═══════════════════════════════════════════════

  'ADS-B': {
    type: 'rx', safety: 'safe',
    category: 'Aviation', categoryColor: '#4ade80',
    frequencyMHz: [1090],
    frequencyDisplay: '1090 MHz',
    band: 'UHF',
    signalType: 'Digital pulse',
    protocol: 'Mode S / ADS-B',
    gain: { lna: 32, vga: 32, amp: false },
    antenna: 'GSM/3G/4G (700-2700 MHz)',
    description: 'Real-time aircraft transponder tracking. Decodes Mode S transmissions including ICAO identifier, callsign, altitude, GPS position, ground speed, and heading for every aircraft within range.',
    tips: [
      'Best results outdoors with clear sky view',
      'Range up to ~200 km with good antenna placement',
      'Use dump1090 on your PC for interactive map overlay',
      'ICAO hex codes uniquely identify every aircraft worldwide',
    ],
    didYouKnow: 'ADS-B was mandated worldwide by ICAO in 2020. Every commercial aircraft now broadcasts its position twice per second at 1090 MHz. The signals are completely unencrypted  -  anyone with a receiver can track them.',
    wikiUrl: 'https://github.com/portapack-mayhem/mayhem-firmware/wiki/Automatic-dependent-surveillance%E2%80%93broadcast-(ADS-B)',
  },

  'ACARS': {
    type: 'rx', safety: 'safe',
    category: 'Aviation', categoryColor: '#4ade80',
    frequencyMHz: [131.55, 129.125, 130.025],
    frequencyDisplay: '129 - 132 MHz (VHF airband)',
    band: 'VHF',
    signalType: 'Digital (AM-MSK)',
    protocol: 'ACARS',
    gain: { lna: 24, vga: 24, amp: false },
    antenna: 'Telescopic (tuned to ~130 MHz)',
    description: 'Aircraft Communication Addressing and Reporting System. Decodes short data link messages between aircraft and ground stations  -  flight plans, weather updates, maintenance alerts, gate assignments.',
    tips: [
      'Primary worldwide frequency: 131.550 MHz',
      'Messages are short text bursts  -  watch for them to flash by',
      'Airport proximity dramatically improves reception',
      'Content includes flight numbers, routing, OOOI events',
    ],
    didYouKnow: 'ACARS was introduced in 1978, making it one of the oldest digital data links in aviation. Despite being nearly 50 years old, it\'s still in daily use. Messages are unencrypted plain text  -  a relic of an era before cybersecurity.',
    wikiUrl: 'https://github.com/portapack-mayhem/mayhem-firmware/wiki/ACARS',
  },

  'Audio': {
    type: 'rx', safety: 'safe',
    category: 'General', categoryColor: '#737373',
    frequencyMHz: null,
    frequencyDisplay: '1 MHz - 6 GHz (any frequency)',
    band: 'All bands',
    signalType: 'Analog',
    protocol: 'AM / NFM / WFM / USB / LSB',
    gain: { lna: 16, vga: 20, amp: false },
    antenna: 'Match to target frequency',
    description: 'The universal analog receiver. Demodulates AM, Narrowband FM, Wideband FM, and Single Sideband (USB/LSB). Records audio to WAV. This is your go-to app for listening to any signal.',
    tips: [
      'WFM mode for FM broadcast radio (87.5-108 MHz)',
      'NFM for walkie-talkies, two-way radio, GMRS/FRS',
      'AM for aviation voice and AM broadcast (530-1700 kHz)',
      'SSB (USB/LSB) for amateur radio HF bands',
      'Start with a local FM station to verify your setup works',
    ],
    didYouKnow: 'FM broadcast was invented in 1933 by Edwin Armstrong, who fought a decades-long patent battle with RCA. Today, FM radio remains one of the most reliable ways to receive emergency information during disasters  -  no internet required.',
    wikiUrl: 'https://github.com/portapack-mayhem/mayhem-firmware/wiki/Audio-Receivers',
  },

  'BLE RX': {
    type: 'rx', safety: 'safe',
    category: 'Wireless', categoryColor: '#7fff00',
    frequencyMHz: [2402, 2426, 2480],
    frequencyDisplay: '2.402 / 2.426 / 2.480 GHz',
    band: 'UHF (ISM 2.4 GHz)',
    signalType: 'Digital (GFSK)',
    protocol: 'Bluetooth Low Energy 4.x/5.x',
    gain: { lna: 16, vga: 20, amp: false },
    antenna: '2.4 GHz blade antenna',
    description: 'Bluetooth Low Energy advertisement sniffer. Captures BLE beacon packets on advertising channels 37, 38, and 39. Shows MAC address with vendor OUI lookup, RSSI, and advertisement data.',
    tips: [
      'BLE ads are everywhere  -  phones, fitness bands, AirTags, smart home',
      'Three fixed advertising channels help catch all nearby devices',
      'MAC vendor lookup identifies device manufacturer',
      'Some devices use MAC randomization for privacy',
    ],
    didYouKnow: 'Bluetooth was named after Harald "Bluetooth" Gormsson, a 10th-century Danish king who unified warring factions  -  just as the protocol unified competing wireless standards. The Bluetooth logo combines the Norse runes for H and B.',
    wikiUrl: 'https://github.com/portapack-mayhem/mayhem-firmware/wiki/BLE-RX',
  },

  'Looking Glass': {
    type: 'rx', safety: 'safe',
    category: 'General', categoryColor: '#737373',
    frequencyMHz: null,
    frequencyDisplay: 'Any configurable range',
    band: 'All bands',
    signalType: 'Spectrum visualization',
    protocol: 'N/A (wideband FFT)',
    gain: { lna: 16, vga: 20, amp: false },
    antenna: 'Telescopic (wideband)',
    description: 'Wideband spectrum waterfall display. Three modes: SPECTR (spectrum analyzer), LIVE-V (live vertical waterfall), PEAK-V (peak hold). The best app for discovering unknown signals in a frequency range.',
    tips: [
      'Start wide (e.g., 400-500 MHz) to find signals, then narrow in',
      'PEAK-V shows persistent peaks  -  great for intermittent transmissions',
      'The DC spike at center frequency is normal (direct-conversion artifact)',
      'Combine with Scanner for automated signal detection',
    ],
    didYouKnow: 'The waterfall display was pioneered in sonar systems during WWII, where vertical scrolling spectrograms helped operators distinguish submarine signatures from ocean noise. The same visualization is now fundamental to software-defined radio.',
    wikiUrl: 'https://github.com/portapack-mayhem/mayhem-firmware/wiki/Looking-Glass',
  },

  'NRF': {
    type: 'rx', safety: 'safe',
    category: 'Wireless', categoryColor: '#7fff00',
    frequencyMHz: [2400],
    frequencyDisplay: '2.4 GHz band',
    band: 'UHF (ISM 2.4 GHz)',
    signalType: 'Digital (GFSK)',
    protocol: 'Nordic nRF24L01+',
    gain: { lna: 16, vga: 20, amp: false },
    antenna: '2.4 GHz blade antenna',
    description: 'Nordic Semiconductor nRF24L01+ protocol decoder. Captures wireless keyboard, mouse, and IoT device communications at 2.4 GHz. Many wireless peripherals use this protocol without encryption.',
    tips: [
      'Many cheap wireless keyboards transmit keystrokes in the clear',
      'nRF24 devices hop across channels  -  patience required',
      'Range is typically 10-30 meters for consumer devices',
      'MouseJack vulnerabilities affect many unpatched devices',
    ],
    didYouKnow: 'The nRF24L01+ chip costs under $1 and is in millions of wireless peripherals. Bastille Networks\' MouseJack research (2016) showed many wireless mice and keyboards can be hijacked to inject keystrokes from up to 100 meters away.',
    wikiUrl: 'https://github.com/portapack-mayhem/mayhem-firmware/wiki/NRF',
  },

  'POCSAG RX': {
    type: 'rx', safety: 'safe',
    category: 'Pager', categoryColor: '#e879f9',
    frequencyMHz: [152.48, 157.9, 462.775],
    frequencyDisplay: '137 - 930 MHz (varies by region)',
    band: 'VHF / UHF',
    signalType: 'Digital (FSK)',
    protocol: 'POCSAG (512/1200/2400 baud)',
    gain: { lna: 24, vga: 24, amp: false },
    antenna: 'Telescopic or frequency-matched',
    description: 'POCSAG pager message decoder. Receives numeric and alphanumeric pager messages. Hospitals, fire departments, and emergency services still rely on pagers because they work where cell service fails.',
    tips: [
      'Common US frequencies: 152.480, 157.900, 462.775 MHz',
      'Try all three baud rates (512/1200/2400) if messages look garbled',
      'Hospital and emergency pages often appear in the clear',
      'Pagers are one-way  -  receiving is completely passive',
    ],
    didYouKnow: 'Despite being "1990s technology," over 80% of US hospitals still use pagers. Pager signals penetrate buildings better than cellular, work during network overloads, and have near-100% delivery rates. In 2016, researchers found millions of unencrypted hospital pages.',
    wikiUrl: 'https://github.com/portapack-mayhem/mayhem-firmware/wiki/POCSAG-Receiver',
  },

  'SubGhzD': {
    type: 'rx', safety: 'safe',
    category: 'ISM', categoryColor: '#fb923c',
    frequencyMHz: [433.92, 868, 915],
    frequencyDisplay: '300 - 928 MHz ISM band',
    band: 'UHF',
    signalType: 'Digital (OOK/FSK)',
    protocol: 'Multiple (PT2262, EV1527, etc.)',
    gain: { lna: 32, vga: 20, amp: false },
    antenna: '433 MHz or 915 MHz dedicated',
    description: 'Sub-GHz protocol decoder for the ISM band. Identifies and decodes key fobs, garage remotes, weather stations, tire pressure sensors, and hundreds of other devices. One of the most useful receive apps.',
    tips: [
      'Recommended: AMP OFF, LNA 32, VGA 20',
      '433 MHz antenna for EU devices, 915 MHz for US',
      'Most garage doors and car key fobs: 433.92 MHz',
      'Weather stations commonly transmit at 433 or 915 MHz',
      'Combined with OOK TX for capture-and-replay testing',
    ],
    didYouKnow: '433.92 MHz is the most crowded ISM frequency in Europe. Car remotes, baby monitors, and soil sensors all share this band. The simplest devices use OOK with a fixed code  -  no encryption, no rolling codes, easily replayed.',
    wikiUrl: 'https://github.com/portapack-mayhem/mayhem-firmware/wiki/SubGhzD',
  },

  'TPMS RX': {
    type: 'rx', safety: 'safe',
    category: 'Automotive', categoryColor: '#facc15',
    frequencyMHz: [315, 433.92],
    frequencyDisplay: '315 MHz (US) / 433 MHz (EU)',
    band: 'UHF',
    signalType: 'Digital (FSK/OOK)',
    protocol: 'TPMS (multiple vendors)',
    gain: { lna: 24, vga: 24, amp: false },
    antenna: '433 MHz antenna',
    description: 'Tire Pressure Monitoring System decoder. Reads sensor transmissions from vehicle tires  -  sensor ID, tire pressure, and temperature. Each sensor has a unique ID that can be used to track specific vehicles.',
    tips: [
      'Sensors transmit every 30-60 seconds while driving',
      'Each sensor has a unique 32-bit ID',
      'US vehicles use 315 MHz, European vehicles use 433.92 MHz',
      'TPMS became mandatory: US (2007), EU (2014)',
    ],
    didYouKnow: 'TPMS was mandated after the Firestone tire recall of 2000 that caused 271 fatalities. Each sensor broadcasts a unique ID, meaning TPMS signals can track specific vehicles  -  a privacy concern researchers have demonstrated since 2010.',
    wikiUrl: 'https://github.com/portapack-mayhem/mayhem-firmware/wiki/TPMS',
  },

  'Weather': {
    type: 'rx', safety: 'safe',
    category: 'Weather', categoryColor: '#38bdf8',
    frequencyMHz: [433.92, 868, 915],
    frequencyDisplay: '433 / 868 / 915 MHz ISM',
    band: 'UHF (ISM)',
    signalType: 'Digital (OOK/FSK)',
    protocol: 'Multiple vendor protocols',
    gain: { lna: 24, vga: 24, amp: false },
    antenna: '433 MHz or 915 MHz antenna',
    description: 'Wireless weather station decoder. Reads temperature, humidity, wind speed, rain gauge, and sensor ID from consumer weather stations. Most use unencrypted ISM band transmissions.',
    tips: [
      'Most stations transmit every 30-60 seconds',
      'Oregon Scientific, Acurite, LaCrosse are common protocols',
      'You can passively monitor nearby weather stations',
      'Great for learning ISM protocol decoding basics',
    ],
    didYouKnow: 'Wireless weather stations are among the simplest IoT devices  -  OOK or FSK with no encryption. The protocols were mostly reverse-engineered by the rtl_433 open-source community, which now supports over 200 device types.',
  },

  // ═══════════════════════════════════════════════
  //  TRANSMIT APPS
  // ═══════════════════════════════════════════════

  'BLE TX': {
    type: 'tx', safety: 'caution',
    category: 'Wireless', categoryColor: '#7fff00',
    frequencyMHz: [2402, 2426, 2480],
    frequencyDisplay: '2.4 GHz BLE channels',
    band: 'UHF (ISM 2.4 GHz)',
    signalType: 'Digital (GFSK)',
    protocol: 'BLE advertisements',
    description: 'Transmits BLE advertisement packets with configurable MAC address and payload. Can simulate BLE beacons or custom advertisement data.',
    legal: 'Legal for testing your own devices. Spoofing others\' MACs may violate laws.',
    tips: [
      'Use a dummy load for initial testing',
      'BLE TX power is very low  -  range under 10 meters',
      'Test against your own devices only',
    ],
  },

  'FlipperTX': {
    type: 'tx', safety: 'caution',
    category: 'ISM', categoryColor: '#fb923c',
    frequencyMHz: [433.92],
    frequencyDisplay: 'Sub-GHz (from .sub file)',
    band: 'UHF',
    signalType: 'From captured file',
    protocol: 'Flipper Zero .sub format',
    description: 'Replays Flipper Zero .sub capture files directly from the SD card. No Flipper required  -  HackRF transmits the same signals with more power (~10x). Authorized testing only.',
    legal: 'Legal for your own devices only. Replaying others\' signals is unauthorized access.',
    tips: [
      'Copy .sub files to SUBGHZ folder on SD card',
      'HackRF has ~10x more TX power than Flipper Zero',
      'Always use antenna matched to the .sub file\'s frequency',
    ],
    didYouKnow: 'The Flipper Zero .sub format stores raw signal captures as timing sequences. The PortaPack can replay these directly, essentially making the HackRF a more powerful Flipper Zero for sub-GHz work.',
  },

  'Morse TX': {
    type: 'tx', safety: 'caution',
    category: 'Amateur', categoryColor: '#f43f5e',
    frequencyMHz: null,
    frequencyDisplay: 'Configurable',
    band: 'Any',
    signalType: 'CW / FM tone',
    protocol: 'International Morse Code',
    description: 'Transmits Morse code via FM tone or continuous wave (CW). Type a message, it converts to dots and dashes. Legal on amateur bands with a valid license.',
    legal: 'Requires amateur radio license. Must identify with callsign on designated frequencies only.',
    tips: [
      'CW is the most efficient mode  -  works below voice signal levels',
      'Amateur HF bands have dedicated CW segments',
      'Must transmit callsign at start and end of contact',
    ],
    didYouKnow: 'Morse code (1844) is the oldest electrical communication protocol still in active use. The famous SOS distress signal (···  -  -  -  ···) was standardized in 1906 after the Titanic disaster demonstrated the need for a universal distress call.',
  },

  'OOK TX': {
    type: 'tx', safety: 'caution',
    category: 'ISM', categoryColor: '#fb923c',
    frequencyMHz: [433.92],
    frequencyDisplay: '315 / 433.92 MHz typical',
    band: 'UHF (ISM)',
    signalType: 'Digital (OOK)',
    protocol: 'PT2262 / EV1527',
    description: 'On-Off Keying transmitter for PT2262-compatible devices: garage remotes, doorbells, wireless switches. Enter the code, set frequency, and transmit.',
    legal: 'Legal for your own devices only. Replaying codes to operate others\' property is unauthorized access.',
    tips: [
      'Capture codes with SubGhzD first, then replay with OOK TX',
      'Fixed-code devices are vulnerable to replay attacks',
      'Rolling-code devices (modern cars, Chamberlain) are NOT vulnerable',
      'Start TX power at 0 dB and increase only if needed',
    ],
    didYouKnow: 'PT2262 chips have been used in billions of garage door remotes since the 1990s. The fixed code is only 12-24 bits  -  a brute-force attack trying all codes takes under an hour. Modern remotes use rolling codes to prevent replay.',
  },

  'POCSAG TX': {
    type: 'tx', safety: 'danger',
    category: 'Pager', categoryColor: '#e879f9',
    frequencyMHz: [152.48],
    frequencyDisplay: 'Pager frequencies',
    band: 'VHF',
    signalType: 'Digital (FSK)',
    protocol: 'POCSAG',
    description: 'Transmits spoofed POCSAG pager messages to specific RIC addresses. Can send numeric or alphanumeric messages to any pager within range.',
    legal: 'Unauthorized transmission on licensed frequencies. False emergency pages are a federal crime.',
    whyDangerous: [
      'Pager frequencies are licensed  -  unauthorized TX is always illegal',
      'False emergency pages can trigger real emergency responses',
      'Hospitals rely on pagers for critical care notifications',
    ],
  },

  'Jammer': {
    type: 'tx', safety: 'extreme',
    category: 'Illegal', categoryColor: '#f43f5e',
    frequencyMHz: null,
    frequencyDisplay: 'Configurable (up to 24 MHz bandwidth)',
    band: 'Any',
    signalType: 'Noise',
    protocol: 'N/A (broadband interference)',
    description: 'Broadband RF jammer. Generates noise across up to 24 MHz, overwhelming all legitimate signals within range.',
    legal: 'RF jamming violates 47 USC 333. Up to $112,500 per violation, criminal prosecution, equipment seizure.',
    whyDangerous: [
      'Blocks 911 and emergency communications',
      'Disrupts aviation navigation and communication',
      'FCC direction-finding equipment can locate you',
      'Multiple enforcement actions and arrests every year',
      'Even brief jamming in a confined area is detectable',
    ],
    recommendation: 'Hide this app via Settings > App Manager. There is no legal use case.',
  },

  'GPS Sim': {
    type: 'tx', safety: 'extreme',
    category: 'Illegal', categoryColor: '#f43f5e',
    frequencyMHz: [1575.42],
    frequencyDisplay: '1575.42 MHz (GPS L1)',
    band: 'UHF (L-band)',
    signalType: 'Fake satellite signals',
    protocol: 'GPS L1 C/A',
    description: 'Generates fake GPS satellite signals. Makes GPS receivers report false positions. Affects aviation, maritime, and emergency services.',
    legal: 'Federal crime under 18 USC 32. Up to 20 years imprisonment. Even accidental GPS interference draws FAA/FCC investigation.',
    whyDangerous: [
      'Directly endangers aircraft navigation during approach',
      'Affects emergency service dispatch and 911 location',
      'Maritime navigation relies on GPS for collision avoidance',
      'Military GPS systems trigger automatic investigation',
      'Affects every GPS receiver within transmission range',
    ],
    recommendation: 'Hide this app via Settings > App Manager. No legal use case outside classified military facilities.',
  },

  'ADS-B TX': {
    type: 'tx', safety: 'extreme',
    category: 'Illegal', categoryColor: '#f43f5e',
    frequencyMHz: [1090],
    frequencyDisplay: '1090 MHz',
    band: 'UHF',
    signalType: 'Fake transponder data',
    protocol: 'Mode S / ADS-B',
    description: 'Transmits fake aircraft transponder data. Creates phantom aircraft on ATC radar screens. Among the most serious RF crimes.',
    legal: 'Federal crime under 18 USC 32. Up to 20 years imprisonment. FBI and FAA jointly investigate.',
    whyDangerous: [
      'Creates phantom aircraft on air traffic control displays',
      'Can trigger collision avoidance on real aircraft',
      'ATC may divert real flights to avoid phantoms',
      'Every 1090 MHz transmission is logged and monitored',
      'FAA has automatic rogue transponder detection',
    ],
    recommendation: 'Hide this app via Settings > App Manager. No legal use case.',
  },

  // ═══════════════════════════════════════════════
  //  MAIN MENU STANDALONE ITEMS
  // ═══════════════════════════════════════════════

  'Capture': {
    type: 'tool', safety: 'safe',
    category: 'Recording', categoryColor: '#facc15',
    frequencyMHz: null,
    frequencyDisplay: 'Any frequency',
    description: 'Records raw IQ data at a set frequency and sample rate. Saves .C16 (16-bit) or .C8 (8-bit) files. Essential for capture-and-replay workflows.',
    tips: [
      'C16 has better dynamic range but 2x file size vs C8',
      'Sample rate = captured bandwidth (2 Msps = 2 MHz wide)',
      '32 GB card holds ~15 min at 2 Msps C16',
      'Filenames include timestamp automatically',
    ],
  },

  'Replay': {
    type: 'tool', safety: 'caution',
    category: 'Transmission', categoryColor: '#facc15',
    frequencyMHz: null,
    frequencyDisplay: 'From capture file',
    description: 'Replays a previously captured .C16 or .C8 IQ file. This IS a transmission  -  antenna or dummy load required.',
    tips: [
      'Sample rate must match the original capture exactly',
      'Always connect antenna or dummy load before replay',
      'Start with TX VGA gain at 0 dB, increase if needed',
    ],
  },

  'Scanner': {
    type: 'tool', safety: 'safe',
    category: 'Scanning', categoryColor: '#a78bfa',
    frequencyMHz: null,
    frequencyDisplay: 'Configurable range',
    description: 'Automated frequency scanning with squelch-based stop. Scans ~20 freq/sec. Color-coded: grey (nothing) → yellow (weak) → green (strong).',
    tips: [
      'Set squelch 40-50 to skip noise floor',
      'Import .csv frequency lists for targeted scanning',
      'Combine with Looking Glass to identify ranges first',
    ],
    didYouKnow: 'Police scanner enthusiasts have been monitoring public safety frequencies since the 1960s. In the US, listening to most radio frequencies is legal (with exceptions for cellular and encrypted communications).',
  },

  'Debug': {
    type: 'system', safety: 'safe',
    category: 'System', categoryColor: '#666',
    description: 'System diagnostics: free memory, SD card health, peripheral status, temperature, button/touch test. Useful for troubleshooting.',
    tips: [
      'Check temperature during long sessions',
      'Memory info helps diagnose app crashes',
      'Button test confirms all physical controls work',
    ],
  },

  'HackRF Mode': {
    type: 'system', safety: 'safe',
    category: 'System', categoryColor: '#4ade80',
    description: 'Switches to PC-tethered USB SDR mode. PortaPack screen goes blank, HackRF appears as USB device 1d50:6089. Use with GNU Radio, SDR++, gqrx, or any HackRF software.',
    tips: [
      'Screen goes blank  -  this is normal, not a crash',
      'Device appears as VID:PID 1d50:6089 over USB',
      'Use hackrf_info to verify connection from PC',
      'Press RESET to return to Mayhem',
    ],
  },

  // ═══════════════════════════════════════════════
  //  TOOLS
  // ═══════════════════════════════════════════════

  'Freq Manager': {
    type: 'tool', safety: 'safe',
    category: 'Utility', categoryColor: '#fb923c',
    description: 'Manage frequency preset lists on the SD card. Create, edit, import .csv files for Scanner and Recon apps. Max 150 entries per file.',
    tips: [
      'Pre-built frequency lists on Mayhem wiki',
      'Format: frequency_Hz,description per line',
      'Used by Scanner, Recon, and Looking Glass',
    ],
  },

  'File Manager': {
    type: 'tool', safety: 'safe',
    category: 'Utility', categoryColor: '#fb923c',
    description: 'Browse, rename, delete, copy files on the SD card. View file sizes, folder structure, and free space. Essential for managing captures and app data.',
  },

  'Signal Gen': {
    type: 'tool', safety: 'caution',
    category: 'Utility', categoryColor: '#fb923c',
    description: 'Generate test RF signals: CW carrier, AM, FM, BPSK, QPSK. Useful for testing receivers and antenna setups. This IS a transmission  -  antenna/load required.',
    tips: [
      'Use a dummy load for signal generation tests',
      'CW mode generates a clean carrier for antenna testing',
      'Start with lowest TX gain',
    ],
  },

  'Antenna Calc': {
    type: 'tool', safety: 'safe',
    category: 'Utility', categoryColor: '#fb923c',
    description: 'Quarter-wave antenna length calculator. Enter frequency, get optimal length in mm, cm, and inches. Cut custom wire antennas for any target frequency.',
    tips: [
      'Quarter wavelength = 75 / frequency_MHz (meters)',
      'At 433 MHz: ~17.3 cm (6.8 inches)',
      'At 915 MHz: ~8.2 cm (3.2 inches)',
      'Extend telescopic to approximate calculated length',
    ],
    didYouKnow: 'A quarter-wave antenna is one of the simplest and most effective designs. Combined with a ground plane, it creates an omnidirectional radiation pattern. Most rubber duck antennas are roughly quarter-wave at their design frequency.',
  },

  'Notepad': {
    type: 'tool', safety: 'safe',
    category: 'Utility', categoryColor: '#fb923c',
    description: 'Simple text editor for SD card files. Write field notes, record observations, or store frequency information during testing sessions.',
  },

  'Wipe SD': {
    type: 'tool', safety: 'danger',
    category: 'Destructive', categoryColor: '#f43f5e',
    description: 'Securely erases all SD card contents. Destructive and irreversible  -  all captures, settings, frequency lists, apps, and data permanently deleted.',
    tips: [
      'Back up SD card contents first',
      'All app settings (.ini files) will be lost',
      'Re-copy SD contents from firmware ZIP after wiping',
    ],
  },

  // ═══════════════════════════════════════════════
  //  SETTINGS (prefixed to avoid "Audio" collision)
  // ═══════════════════════════════════════════════

  'settings:App Manager': {
    type: 'setting', safety: 'safe',
    category: 'Configuration', categoryColor: '#888',
    description: 'Show or hide apps from the main menu. Set an autostart app for power-on. First priority: hide dangerous TX apps you don\'t need.',
    tips: [
      'Hide Jammer, GPS Sim, and ADS-B TX immediately',
      'Autostart is useful for dedicated field setups',
      'Changes take effect on next boot',
    ],
  },

  'settings:Audio': {
    type: 'setting', safety: 'safe',
    category: 'Configuration', categoryColor: '#888',
    description: 'CTCSS mixer level, audio beep on/off, speaker and headphone output configuration.',
  },

  'settings:Radio': {
    type: 'setting', safety: 'safe',
    category: 'Configuration', categoryColor: '#888',
    description: 'Frequency correction offset, TCXO calibration, clock output, antenna bias voltage (DC on SMA  -  careful), external TCXO.',
    tips: [
      'R10C has 0.5 ppm TCXO  -  correction usually unnecessary',
      'Bias-T sends DC through SMA port  -  only for powered antennas/LNAs',
    ],
  },

  'settings:UI': {
    type: 'setting', safety: 'safe',
    category: 'Configuration', categoryColor: '#888',
    description: 'Encoder dial sensitivity (Low/Normal/High), rotation rate multiplier, back button in menus, status bar icons, touchscreen enable/disable.',
  },

  'settings:Date/Time': {
    type: 'setting', safety: 'safe',
    category: 'Configuration', categoryColor: '#888',
    description: 'Set the real-time clock for timestamps on captures and logs. DST support. Battery-backed RTC  -  set once and it persists.',
  },

  'settings:Theme': {
    type: 'setting', safety: 'safe',
    category: 'Configuration', categoryColor: '#888',
    description: 'Change the UI color theme. Multiple options including dark mode. Cosmetic only  -  does not affect functionality.',
  },

  'settings:Touch Cal': {
    type: 'setting', safety: 'safe',
    category: 'Configuration', categoryColor: '#888',
    description: 'Calibrate touchscreen alignment. Hold each target crosshair for 1+ second. Run if touch targets feel offset or areas are unresponsive.',
  },
};

// Menu-level overviews (shown when highlighting a submenu or viewing main menu)
export const menuOverviews = {
  main: {
    title: 'PortaPack Mayhem v2.4',
    subtitle: 'Portable RF Multi-Tool',
    description: 'Receive, analyze, and transmit across 1 MHz to 6 GHz  -  entirely standalone, no computer required.',
    stats: [
      { label: 'RX Apps', value: '33', color: '#7fff00', desc: 'Passive receive' },
      { label: 'TX Apps', value: '34', color: '#f43f5e', desc: 'Active transmit' },
      { label: 'Tools', value: '19', color: '#fb923c', desc: 'Utilities' },
      { label: 'Games', value: '10', color: '#4ade80', desc: 'Entertainment' },
    ],
    features: [
      'Half-duplex: receive or transmit, not both simultaneously',
      '8-bit ADC / DAC, up to 20 Msps quadrature sample rate',
      'SD card stores captures, frequency lists, settings, and apps',
      'Battery life: 4-8 hours on H4M (2500 mAh LiPo)',
      'Frequency range: 1 MHz - 6 GHz (TX and RX)',
    ],
  },
  receive: {
    title: 'Receive Apps',
    subtitle: 'Passive RF Reception',
    description: 'All receive operations are passive  -  completely safe. Cannot damage hardware, cannot violate laws. Freely explore every frequency.',
    safety: 'safe',
    note: 'The only RX damage vector is an external high-power transmitter overwhelming the input. Your desk equipment poses zero risk.',
    categories: [
      { name: 'Aviation', count: 3, apps: 'ADS-B, ACARS, EPIRB RX', color: '#4ade80' },
      { name: 'Wireless', count: 3, apps: 'BLE RX, NRF, ProtoView', color: '#7fff00' },
      { name: 'ISM / Sub-GHz', count: 3, apps: 'SubGhzD, Scanner, Fox hunt', color: '#fb923c' },
      { name: 'Weather / Auto', count: 4, apps: 'Weather, TPMS, Radiosonde, ERT', color: '#38bdf8' },
      { name: 'Pager', count: 2, apps: 'POCSAG, FLEX RX', color: '#e879f9' },
      { name: 'General', count: 6, apps: 'Audio, Looking Glass, Morse, RTTY...', color: '#737373' },
    ],
  },
  transmit: {
    title: 'Transmit Apps',
    subtitle: 'Active RF Transmission',
    description: 'REQUIRES antenna or dummy load connected. Many apps transmit on licensed frequencies  -  unauthorized use is a federal crime.',
    safety: 'danger',
    warning: 'Never transmit without a load. Never TX on frequencies you aren\'t authorized to use.',
    breakdown: [
      { level: 'EXTREME', count: 4, desc: 'Jammer, GPS Sim, ADS-B TX, EPIRB TX', color: '#f43f5e' },
      { level: 'DANGER', count: 5, desc: 'POCSAG TX, BLESpam, CVS Spam, SAME TX, P25 TX', color: '#f43f5e' },
      { level: 'CAUTION', count: 14, desc: 'OOK, BLE, Flipper, Morse, RDS, KeeLoq...', color: '#facc15' },
      { level: 'Licensed', count: 5, desc: 'APRS TX, RTTY TX, Morse TX, SSTV...', color: '#fb923c' },
    ],
  },
  transceiver: {
    title: 'Transceiver Apps',
    subtitle: 'Two-Way Communication',
    description: 'Apps that both transmit and receive. Mic mode works like a walkie-talkie with push-to-talk. KISS TNC provides packet radio connectivity.',
  },
  tools: {
    title: 'Tools & Utilities',
    subtitle: 'Built-in Utilities',
    description: 'Frequency management, file operations, signal generation, antenna calculation, and more. Signal Gen requires antenna/load.',
  },
  utilities: {
    title: 'Tools & Utilities',
    subtitle: 'Built-in Utilities',
    description: 'Frequency management, file operations, signal generation, antenna calculation, and more. Signal Gen requires antenna/load.',
  },
  settings: {
    title: 'Settings',
    subtitle: 'Device Configuration',
    description: 'Configure audio, radio, UI, touchscreen, themes, and app visibility. First stop: App Manager to hide dangerous TX apps.',
    recommendation: 'Use App Manager to hide Jammer, GPS Sim, and ADS-B TX immediately.',
  },
  games: {
    title: 'Games',
    subtitle: 'Entertainment',
    description: 'Mini-games playable on the PortaPack screen using the D-pad and click wheel. All loaded from the SD card as external apps.',
  },
  debug: {
    title: 'Debug Tools',
    subtitle: 'System Diagnostics',
    description: 'Hardware testing, memory inspection, peripheral status, and system diagnostics. For advanced users and firmware developers.',
  },
};

// Hardware zone details (shown when hovering device components in expanded mode)
export const hardwareDetails = {
  sma: {
    title: 'SMA Antenna Port',
    icon: 'antenna',
    color: '#4ade80',
    description: 'SMA female connector, 50-ohm impedance. Rated for approximately 500 mating cycles.',
    details: [
      'Finger-tight only  -  never use pliers or wrenches',
      'Always connect antenna or load before TX',
      'Use a connector saver ($3-5) to protect this port',
      'SMA only  -  NOT RP-SMA (different center pin)',
      'Inspect center pin for bends before connecting',
    ],
    warning: 'Transmitting without a load reflects power back into the PA  -  permanent damage.',
  },
  power: {
    title: 'Power Switch',
    icon: 'power',
    color: '#4ade80',
    description: 'Hardware slide switch with true disconnect. UP = ON, DOWN = OFF.',
    details: [
      'Must be ON to charge battery via USB-C',
      'True disconnect prevents accidental activation in a bag',
      'Alternative: double-press SELECT to power off (software)',
      'Preferred over software shutdown for clean disconnect',
    ],
  },
  usbc: {
    title: 'USB-C Port',
    icon: 'usb',
    color: '#7fff00',
    description: 'Combined data + charging. Use a data-capable cable.',
    details: [
      'Connects to PC for HackRF Mode (tethered SDR)',
      'Charges battery when power switch is ON',
      'Charge-only cables cause "device not found" errors',
      'USB 2.0 speed (480 Mbps)  -  sufficient for 20 Msps',
      '5V/2A charger recommended for fastest charging',
    ],
  },
  audio: {
    title: '3.5mm Audio Jack',
    icon: 'audio',
    color: '#facc15',
    description: 'Combined headphone out + headset mic in.',
    details: [
      'Physical toggle selects internal mic/speaker vs headset',
      'Volume controlled in app UI or Audio settings',
      'Essential for Audio RX (demodulated signal output)',
      'Headphones recommended for quiet signal identification',
    ],
  },
  sd: {
    title: 'MicroSD Card Slot',
    icon: 'storage',
    color: '#4ade80',
    description: 'FAT32 formatted, 16-32 GB recommended.',
    details: [
      'Stores apps, captures, frequency lists, settings',
      'Must be FAT32  -  exFAT will NOT work',
      'Green icon in title bar confirms detection',
      'Always sync before removing (or power off first)',
      `Current card: 32 GB with Mayhem v${FALLBACK_VERSION} SD pack`,
    ],
  },
  dfu: {
    title: 'DFU Button',
    icon: 'recovery',
    color: '#f43f5e',
    description: 'Device Firmware Update  -  hold + RESET to enter bootloader.',
    details: [
      'DFU bootloader is stored in read-only ROM',
      'The device can NEVER be permanently bricked',
      'DFU mode: 3V3 LED on, screen blank',
      'Used for firmware recovery only',
      'Normal updates use SD card Flash Utility instead',
    ],
  },
  reset: {
    title: 'RESET Button',
    icon: 'emergency',
    color: '#f43f5e',
    description: 'Hard reset  -  instantly kills all processing and RF transmission.',
    details: [
      'Your PANIC button for accidental transmissions',
      'No confirmation dialog  -  acts immediately',
      'Device reboots to Mayhem main menu',
      'Know where this button is by feel',
      'Unsaved settings and captures are lost',
    ],
    warning: 'This is your emergency TX stop. The most important button on the device.',
  },
};

// Lookup function that handles settings: prefix for duplicate labels
export function lookupDetails(menuId, label) {
  if (!label) return null;
  const contextKey = `${menuId}:${label}`;
  return appDetails[contextKey] || appDetails[label] || null;
}
