export const mistakes = [
  {
    title: "Leaving the internal amp ON near strong signal sources",
    severity: "extreme",
    description: "The HackRF's front-end amplifier (MGA-81563) has no bandpass filter before it — it amplifies the entire 1 MHz to 6 GHz range simultaneously, regardless of what frequency you're tuned to.",
    symptoms: ["Amp ON makes signals weaker instead of stronger", "Reduced sensitivity across all bands", "No visible damage — failure is silent"],
    prevention: ["Keep AMP OFF unless you specifically need it", "Use an external bandpass filter before the HackRF input", "Add a 10-20 dB inline attenuator near strong transmitters"],
    technical: "Max safe input with AMP ON is -5 dBm. A cell tower at 900 MHz 100m away delivers approximately +5 to +10 dBm — enough to destroy the MGA-81563 even when tuned to 433 MHz."
  },
  {
    title: "Using a 5W handheld radio within inches",
    severity: "extreme",
    description: "The most commonly reported damage scenario in the HackRF community. Handheld radios output 5W (37 dBm) and at close range the signal couples directly into the HackRF antenna port.",
    symptoms: ["Front-end amplifier permanently destroyed", "Receive sensitivity dramatically reduced", "Amp toggle has no effect or inverts behavior"],
    prevention: ["Maintain at least 10 feet (3m) distance from any transmitting radio", "Disconnect the HackRF antenna before keying a nearby radio", "Use a dummy load on the handheld if testing nearby"],
    technical: "A 5W handheld at 1 inch produces ~+7 to +10 dBm at the antenna port due to near-field coupling. The absolute max input is +10 dBm (AMP OFF) or -5 dBm (AMP ON). Even one keyup can be fatal."
  },
  {
    title: "Connecting a satellite LNB directly",
    severity: "extreme",
    description: "Satellite LNBs (Low-Noise Block downconverters) have 50-65 dB of built-in gain and are designed to feed into a satellite receiver, not an SDR. Connecting one directly instantly destroys the input stage.",
    symptoms: ["Immediate and total LNA failure", "Device may appear to work but receive nothing", "No recovery possible without component-level repair"],
    prevention: ["Always use a 20-30 dB attenuator between an LNB and the HackRF", "Check the LNB's gain specification before connecting", "Consider a bias-tee with proper power isolation"],
    technical: "An LNB with 60 dB gain feeds +23 to +26 dBm into a device rated for -5 dBm max (AMP ON). That's 28-31 dB over the absolute maximum — roughly 1000x the safe power level."
  },
  {
    title: "Airport radar exposure",
    severity: "extreme",
    description: "Airport surveillance radars operate at extremely high power levels. Even in receive-only mode with AMP OFF, the electromagnetic field strength near an airport can exceed the HackRF's input limits.",
    symptoms: ["MMIC input amplifier fried", "Broad-spectrum receive degradation", "Device may work on some bands but not others"],
    prevention: ["Never operate within 2 km of known radar installations", "Use external filtering and attenuation in unknown RF environments", "Check local NOTAM/FAA databases for radar locations"],
    technical: "A 17 kW airport radar has an EIRP of several MW with antenna gain. At 2 km, field strength at a resonant antenna can exceed +20 dBm. The HackRF's MAX2837 mixer has an absolute max input of +10 dBm."
  },
  {
    title: "Transmitting without an antenna or load",
    severity: "danger",
    description: "An open SMA port reflects 100% of transmitted power back into the power amplifier. The reflected energy has nowhere to go and dissipates as heat in the PA transistor, destroying it.",
    symptoms: ["TX power drops to near zero permanently", "Device still appears to transmit in software but no signal on air", "Possible damage to the MAX2837 transceiver IC"],
    prevention: ["Always connect a 50-ohm dummy load or matched antenna before any TX operation", "Verify your antenna is connected and SMA is finger-tight", "Keep a dummy load in your kit as a default safe termination"],
    technical: "An open SMA has a VSWR of infinity (return loss 0 dB). At 15 dBm (~32 mW), all power reflects back. The RFFC5072 PA in the HackRF is rated for limited reflected power and has no built-in isolator."
  },
  {
    title: "ESD while connecting antennas",
    severity: "danger",
    description: "Static discharge from your body or a charged antenna goes directly into the RF front-end through the SMA center pin. The damage is often subtle and progressive — you may not notice for weeks.",
    symptoms: ["Amp acts as attenuator instead of providing gain", "Gradual sensitivity loss over time", "Intermittent receive quality issues"],
    prevention: ["Touch a grounded metal surface before handling the SMA connector", "Ground yourself and the antenna before connecting", "Use an anti-static wrist strap in dry environments"],
    technical: "Human body ESD is typically 2-15 kV with peak currents of 10-30A for nanoseconds. The MGA-81563 LNA has an ESD rating of only ~200V (HBM). Even a small static discharge that you can't feel (<3 kV) can degrade the amplifier."
  },
  {
    title: "TX at max gain with mismatched antenna",
    severity: "danger",
    description: "Using full TX gain with an antenna that isn't matched to your frequency causes significant power reflection. While the HackRF only outputs ~15 dBm, repeated stress from reflected power degrades the PA over time.",
    symptoms: ["Gradually decreasing TX output power", "Antenna SWR meter shows high reflected power", "TX works on some frequencies but not others"],
    prevention: ["Use an antenna designed for your target frequency", "Check SWR before transmitting — aim for < 2:1", "Start at low TX gain and increase gradually while monitoring"],
    technical: "At 15 dBm with a 10:1 VSWR mismatch, approximately 70% of power reflects back. The HackRF lacks a circulator or isolator, so reflected power goes directly back into the PA stage."
  },
  {
    title: "Not using a data-capable USB cable",
    severity: "caution",
    description: "Many USB cables are charge-only — they have power wires but no data lines. This is the single most common 'my HackRF doesn't work' issue and wastes hours of debugging time.",
    symptoms: ["'Device not found' or 'No HackRF boards found' errors", "Device powers on (LEDs light) but isn't recognized by software", "Intermittent connection drops"],
    prevention: ["Label your known-good data cables", "Test with 3-5 different cables before suspecting hardware", "Use short cables (< 1m) — USB 2.0 signal quality degrades with length", "USB 3.0 ports and cables tend to be more reliable"],
    technical: "HackRF requires USB 2.0 High Speed (480 Mbps). Charge-only cables lack the D+ and D- data lines entirely. Some cheap data cables have inadequate shielding causing intermittent connections at high speed."
  },
  {
    title: "Connecting signals to CLK_in carelessly",
    severity: "danger",
    description: "The CLK_in SMA port has the HackRF's internal 10 MHz TCXO clock signal always present. Feeding in an external clock without proper isolation connects two oscillators in parallel.",
    symptoms: ["TCXO oscillator damaged or frequency-shifted", "Frequency accuracy degraded across all operations", "Device may fail to lock onto signals properly"],
    prevention: ["Only connect a 10 MHz reference through a proper clock distribution amplifier", "Never connect a signal generator directly to CLK_in", "Disconnect CLK_in when not using an external reference"],
    technical: "The Si5351C clock generator and TCXO output impedance is ~50 ohms. Connecting a 50-ohm signal source creates a direct parallel connection, potentially exceeding the TCXO's maximum output current and causing permanent drift."
  },
  {
    title: "Unplugging during firmware flash",
    severity: "caution",
    description: "Disconnecting USB power during a firmware update corrupts the SPI flash. The good news: the DFU bootloader lives in ROM and can't be corrupted, so the device is always recoverable.",
    symptoms: ["Device boots to DFU mode instead of Mayhem", "Blank or garbled screen on PortaPack", "USB enumerates as DFU device (1fc9:000c) instead of HackRF"],
    prevention: ["Use a reliable USB connection and cable during flashing", "Don't bump or move the device while flashing", "Keep the DFU recovery procedure bookmarked"],
    technical: "Mayhem firmware is stored on external SPI flash (W25Q80). The LPC4320 has a factory ROM bootloader that enters DFU mode on corrupted flash. Recovery: hold DFU button, connect USB, flash via hackrf_spiflash or DFU tool."
  },
];

export const damageStories = [
  { title: "The 50W HF Transmitter", description: "User keyed a 50W HF radio at 18 MHz for one second with antennas within a foot. RX amplifier permanently destroyed. Symptom: enabling amp caused signal to decrease.", source: "hackrf-dev mailing list" },
  { title: "The 17kW Airport Radar", description: "User set up HackRF within 2 km of airport radar at 17 kW. Even in receive-only mode, the MMIC input amplifier was fried.", source: "GitHub Issue #541" },
  { title: "The Satellite LNB", description: "User connected a satellite LNB with ~60 dB gain directly. Signal reaching input was +23 to +26 dBm. LNA instantly destroyed.", source: "GitHub Issue #974" },
  { title: "The Full-Power DAB Transmission", description: "User transmitted on European DAB at full power (TXgain=63) with the ANT500 antenna. Poor impedance match caused reflected power. TX PA failed.", source: "GitHub Issue #1051" },
  { title: "The Invisible Continuing TX", description: "User stopped a TX app but HackRF continued transmitting. Connected/disconnected external PA during phantom TX, killed the PA.", source: "GitHub Issue #1051 comment" },
  { title: "The Amp That Attenuated", description: "Gradually worsening sensitivity over weeks. AMP OFF = clear FM, AMP ON = signal disappeared. ESD-damaged component acting as attenuator.", source: "oneSDR repair guide" },
  { title: "The 5W Handheld at One Inch", description: "5W handheld held an inch from HackRF. ~+7 to +10 dBm at the antenna port. Front-end destroyed.", source: "GitHub Issue #974" },
];

export const frequencies = {
  noGo: [
    { band: "Aviation VOR/ILS", range: "108 - 117.975 MHz", service: "Aircraft navigation" },
    { band: "Aviation Voice", range: "118 - 136.975 MHz", service: "Air Traffic Control" },
    { band: "Aviation Emergency", range: "121.5 MHz", service: "International distress" },
    { band: "Aviation ELT", range: "243 MHz", service: "Military emergency" },
    { band: "GPS L1", range: "1575.42 MHz", service: "Civilian GPS" },
    { band: "GPS L2", range: "1227.60 MHz", service: "Precision GPS" },
    { band: "GPS L5", range: "1176.45 MHz", service: "Aviation/maritime GPS" },
    { band: "GLONASS L1", range: "1602 MHz", service: "Russian GNSS" },
    { band: "GLONASS L2", range: "1246 MHz", service: "Russian GNSS" },
    { band: "Galileo E1", range: "1575.42 MHz", service: "EU GNSS" },
    { band: "Cellular", range: "698-894, 1710-2155 MHz", service: "All cellular carriers" },
    { band: "Public Safety", range: "764-776, 794-806 MHz", service: "FirstNet, police, fire, EMS" },
    { band: "Marine VHF", range: "156.0 - 162.025 MHz", service: "Ship-to-ship/shore" },
    { band: "Marine Distress", range: "156.8 MHz (Ch 16)", service: "International distress" },
    { band: "NOAA Weather", range: "162.400 - 162.550 MHz", service: "Emergency alerts" },
    { band: "Radar", range: "960-1215, 2700-3100, 5250-5925 MHz", service: "ATC, weather, military" },
  ],
  legal: [
    { band: "ISM 433 MHz", range: "433.05-434.79 MHz", requirements: "Region 1 (EU) only; power limits" },
    { band: "ISM 902-928 MHz", range: "902-928 MHz", requirements: "US; up to 1W with spread spectrum" },
    { band: "ISM 2.4 GHz", range: "2400-2483.5 MHz", requirements: "Worldwide; power limits vary" },
    { band: "ISM 5.8 GHz", range: "5725-5875 MHz", requirements: "Power limits vary" },
    { band: "Amateur bands", range: "Various", requirements: "Requires amateur radio license + callsign ID" },
  ],
  penalties: [
    { violation: "Unauthorized transmission", law: "Section 301", penalty: "Equipment seizure + fines + criminal" },
    { violation: "Willful interference", law: "47 USC 333", penalty: "Up to $100,000 fine / 1 year prison" },
    { violation: "GPS/cellular jamming", law: "PIRATE Act", penalty: "Up to $119,555/day, max $2.39M" },
    { violation: "Intercepting comms", law: "18 USC 2511", penalty: "Up to 5 years federal prison" },
    { violation: "Aviation interference", law: "18 USC 32", penalty: "Federal crime, FBI + FAA" },
  ],
};
