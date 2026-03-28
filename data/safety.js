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
  {
    title: "The 50W HF Transmitter",
    description: "A user was operating a 50W HF amateur radio transmitter on 18 MHz with the HackRF sitting nearby, antennas less than a foot apart. They keyed the transmitter for approximately one second. The HackRF's receive amplifier (RFFC5072 mixer and MGA-81563 LNA) was permanently destroyed by the RF energy coupling into the SMA port. After the incident, enabling the amp caused the received signal to actually decrease instead of increase, confirming the LNA was burned out. The HackRF still functioned in receive mode with AMP off, but at significantly reduced sensitivity.",
    outcome: "Permanent LNA damage. HackRF usable but with degraded receive performance.",
    prevention: "Never operate the HackRF near active transmitters. At minimum keep 10 feet (3 meters) of separation from any transmitter. Use an inline attenuator if operating near any RF source above 1W.",
    source: "hackrf-dev mailing list",
    sourceUrl: "https://pairlist9.pair.net/mailman/listinfo/hackrf-dev",
    severity: "destroyed",
  },
  {
    title: "The 17kW Airport Radar",
    description: "A user set up their HackRF for receive-only monitoring within approximately 2 km of an airport with a 17 kW S-band surveillance radar. Despite only receiving (no transmission), the radar's signal was powerful enough at that distance to deliver energy well above the HackRF's maximum safe input level of +10 dBm. The MMIC (Monolithic Microwave Integrated Circuit) input amplifier was fried by the accumulated RF energy. The user was not transmitting at all. This demonstrates that the HackRF's front end has no input protection and can be destroyed purely by strong incoming signals.",
    outcome: "Input amplifier destroyed. Board required component-level repair or replacement.",
    prevention: "Be aware of nearby high-power transmitters before deploying. Airport radar, broadcast towers, and cellular base stations can output thousands of watts. Use external bandpass filters and attenuators when operating near known high-power RF sources.",
    source: "GitHub Issue #541",
    sourceUrl: "https://github.com/greatscottgadgets/hackrf/issues/541",
    severity: "destroyed",
  },
  {
    title: "The Satellite LNB Direct Connection",
    description: "A user connected a satellite dish LNB (Low Noise Block downconverter) directly to the HackRF's SMA input without any attenuation. Satellite LNBs have approximately 50-65 dB of built-in gain to amplify the weak satellite signals. The output from the LNB was measured at +23 to +26 dBm, which is more than 10 dB above the HackRF's absolute maximum safe input of +10 dBm. The MGA-81563 LNA chip was instantly and permanently destroyed. This is one of the most commonly reported HackRF damage scenarios because users do not realize how much gain an LNB provides.",
    outcome: "LNA chip destroyed instantly on connection. Receive amplifier permanently non-functional.",
    prevention: "Always check the output power of any active device before connecting to the HackRF. Use a 20-30 dB inline attenuator between the LNB and the HackRF. The HackRF's max safe input is +10 dBm (10 mW). Anything with built-in gain (LNBs, amplified antennas, active probes) should be attenuated first.",
    source: "GitHub Issue #974",
    sourceUrl: "https://github.com/greatscottgadgets/hackrf/issues/974",
    severity: "destroyed",
  },
  {
    title: "The Full-Power DAB Transmission",
    description: "A user in Europe transmitted on DAB (Digital Audio Broadcasting) frequencies using the HackRF with TX gain set to maximum (txgain=63) through the included ANT500 telescopic antenna. The ANT500 is not designed for the DAB band and presented a very poor impedance match, meaning most of the RF energy was reflected back into the HackRF's transmit output stage instead of being radiated. This reflected power exceeded the PA (Power Amplifier) transistor's safe operating limits. The TX output stage failed and the HackRF could no longer transmit, though receive still worked.",
    outcome: "TX power amplifier burned out. HackRF could still receive but could no longer transmit.",
    prevention: "Never transmit at full gain (txgain=63). Start at low power and increase gradually. Always use a frequency-matched antenna or a 50-ohm dummy load when transmitting. The ANT500 is a receive antenna and should not be used for TX above very low power levels. A high SWR (Standing Wave Ratio) from antenna mismatch can destroy the output stage.",
    source: "GitHub Issue #1051",
    sourceUrl: "https://github.com/greatscottgadgets/hackrf/issues/1051",
    severity: "damaged",
  },
  {
    title: "The Invisible Continuing TX",
    description: "A user was testing TX functionality with an external power amplifier (PA) connected to the HackRF output. They stopped the TX app in the Mayhem firmware, but due to a firmware timing issue, the HackRF's RF output did not fully stop. The carrier continued at low level even though the UI showed TX as stopped. While the HackRF was in this phantom transmit state, the user disconnected and reconnected the external PA. The PA received a sudden RF input while powering up, which caused an impedance transient that destroyed the PA's output transistors. The HackRF itself survived but the external amplifier was killed.",
    outcome: "External power amplifier destroyed. HackRF survived but exhibited the phantom TX behavior.",
    prevention: "After stopping any TX app, power cycle the HackRF completely (power switch off, wait 3 seconds, power on) before connecting or disconnecting any external equipment. Never hot-swap amplifiers or antennas while the HackRF might be transmitting. Use the Emergency TX Stop sequence: Stop button, Back arrow, RESET, Power OFF.",
    source: "GitHub Issue #1051 comment",
    sourceUrl: "https://github.com/greatscottgadgets/hackrf/issues/1051",
    severity: "damaged",
  },
  {
    title: "The Slow ESD Death",
    description: "Over a period of several weeks, a user noticed gradually worsening receive sensitivity on their HackRF. FM broadcast stations that were previously strong became weak, and weaker signals disappeared entirely. The unusual symptom: with AMP OFF, FM reception was still acceptable. With AMP ON, the signal actually got worse instead of better. Diagnosis revealed that the MGA-81563 LNA had been damaged by electrostatic discharge (ESD), likely from touching the SMA center pin without grounding first. The damaged component was not completely dead but was acting as an attenuator instead of an amplifier, introducing loss instead of gain when enabled.",
    outcome: "LNA partially damaged by ESD. Amp functioned as attenuator instead of amplifier. Required component replacement to repair.",
    prevention: "Always ground yourself before touching the SMA connector or center pin. ESD damage can be cumulative and may not be immediately obvious. Use the antenna as a handle rather than touching the SMA directly. Store the HackRF in an anti-static bag when not in use.",
    source: "oneSDR repair documentation",
    sourceUrl: "https://onesdr.com",
    severity: "damaged",
  },
  {
    title: "The 5W Handheld at One Inch",
    description: "A user was holding a 5W VHF/UHF handheld radio (walkie-talkie) approximately one inch from their HackRF while the HackRF was receiving. When they transmitted on the handheld, the signal at the HackRF's antenna port was estimated at +7 to +10 dBm based on the distance and power level. This is right at the absolute maximum safe input and likely exceeded it during the transmission peaks. The HackRF's front-end amplifier was destroyed. At 5W and one inch of separation, there is essentially zero path loss between the two antennas, so nearly the full transmitter power couples directly into the receiver input.",
    outcome: "Front-end LNA destroyed. HackRF receive sensitivity permanently degraded.",
    prevention: "Maintain at least 10 feet (3 meters) distance between the HackRF and any active transmitter, even low-power handhelds. A 5W handheld at arm's length can still deliver damaging power levels. If you must operate near a transmitter, disconnect the HackRF antenna or use a through-line attenuator rated for the expected power.",
    source: "GitHub Issue #974",
    sourceUrl: "https://github.com/greatscottgadgets/hackrf/issues/974",
    severity: "destroyed",
  },
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
