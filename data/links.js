export const links = [
  // === Mayhem Firmware (Official) ===
  { category: "mayhem", title: "Mayhem Firmware", url: "https://github.com/portapack-mayhem/mayhem-firmware", description: "Official firmware repo — source, issues, PRs, nightly builds" },
  { category: "mayhem", title: "Mayhem Wiki", url: "https://github.com/portapack-mayhem/mayhem-firmware/wiki", description: "Complete app documentation, settings reference, troubleshooting" },
  { category: "mayhem", title: "Mayhem Releases", url: "https://github.com/portapack-mayhem/mayhem-firmware/releases", description: "Stable releases and nightly firmware builds" },
  { category: "mayhem", title: "MayhemHub (hackrf.app)", url: "https://hackrf.app/", description: "Web-based remote control, screen streaming, OTA firmware updates via WebUSB" },
  { category: "mayhem", title: "Mayhem Freqman Files", url: "https://github.com/portapack-mayhem/mayhem-freqman-files", description: "Community-contributed frequency lists for Scanner/Recon" },
  { category: "mayhem", title: "Mayhem External Apps", url: "https://github.com/portapack-mayhem/mayhem-firmware/wiki/External-Module", description: "Wiki page on building and loading external .ppma apps" },

  // === HackRF Hardware ===
  { category: "hackrf", title: "Great Scott Gadgets — HackRF", url: "https://greatscottgadgets.com/hackrf/", description: "Official HackRF project page — docs, specs, design files" },
  { category: "hackrf", title: "HackRF GitHub (GSG)", url: "https://github.com/greatscottgadgets/hackrf", description: "Official firmware, host tools, schematics (open source)" },
  { category: "hackrf", title: "PortaPack GitHub (jboone)", url: "https://github.com/jboone/portapack-hackrf", description: "Original PortaPack hardware and firmware by Jared Boone" },
  { category: "hackrf", title: "HackRF Hardware Design Files", url: "https://github.com/greatscottgadgets/hackrf/tree/master/hardware", description: "KiCad schematics, BOM, PCB layout — fully open source" },

  // === SDR Learning ===
  { category: "learn", title: "Great Scott Gadgets — SDR Course", url: "https://greatscottgadgets.com/sdr/", description: "Free 11-lesson SDR fundamentals by Michael Ossmann (HackRF creator)" },
  { category: "learn", title: "PySDR — SDR with Python", url: "https://pysdr.org/", description: "Free textbook covering DSP, SDR theory, IQ samples, FFT, filters — with Python examples" },
  { category: "learn", title: "SigIDWiki — Signal Identification", url: "https://www.sigidwiki.com/", description: "Waterfall images + audio samples for hundreds of RF signal types" },
  { category: "learn", title: "RTL-SDR.com", url: "https://www.rtl-sdr.com/", description: "Largest SDR news/tutorial site — covers HackRF, RTL-SDR, PortaPack regularly" },
  { category: "learn", title: "RTL-SDR.com — PortaPack Posts", url: "https://www.rtl-sdr.com/tag/portapack/", description: "Aggregated PortaPack news, tutorials, and project showcases" },
  { category: "learn", title: "GNU Radio Wiki", url: "https://wiki.gnuradio.org/", description: "GNU Radio documentation — signal processing flowgraphs with HackRF source/sink" },

  // === Community Tools & Repos ===
  { category: "tools", title: "hackrf-sweep-webusb", url: "https://github.com/niccokunzmann/hackrf-sweep-webusb", description: "Browser-based spectrum analyzer using WebUSB — no drivers needed" },
  { category: "tools", title: "hackrf-spectrum-analyzer", url: "https://github.com/pavsa/hackrf-spectrum-analyzer", description: "Java-based spectrum analyzer GUI for hackrf_sweep data" },
  { category: "tools", title: "RocketGod HackRF Treasure Chest", url: "https://github.com/RocketGod-git/HackRF-Treasure-Chest", description: "Curated collection of software, captures, and tools for HackRF" },
  { category: "tools", title: "Khanfar — HackRF Tools", url: "https://github.com/khanfar?tab=repositories&q=hackrf", description: "Multiple HackRF utility repos — GPS tools, analyzers, signal generators" },
  { category: "tools", title: "Universal Radio Hacker (URH)", url: "https://github.com/jopohl/urh", description: "Investigate wireless protocols — record, analyze, demodulate, decode signals" },
  { category: "tools", title: "inspectrum", url: "https://github.com/miek/inspectrum", description: "Offline signal analysis tool — visualize and annotate IQ captures" },
  { category: "tools", title: "SatDump", url: "https://github.com/SatDump/SatDump", description: "Weather satellite reception and decoding — NOAA, GOES, Meteor with HackRF" },

  // === Awesome Lists & Collections ===
  { category: "awesome", title: "awesome-sdr", url: "https://github.com/mendel5/awesome-sdr", description: "Curated list of SDR resources, software, hardware, and tutorials" },
  { category: "awesome", title: "awesome-radio", url: "https://github.com/kyleterry/awesome-radio", description: "Radio resources — amateur radio, SDR, digital modes, protocols" },
  { category: "awesome", title: "Nilorea — Ultimate Mayhem Guide", url: "https://www.nilorea.net/2023/12/22/ultimate-hackrf-portapack-mayhem-guide/", description: "Comprehensive step-by-step Mayhem setup and upgrade guide" },

  // === SDR Software (PC) ===
  { category: "software", title: "SDR++ (SDRPlusPlus)", url: "https://github.com/AlexandreRouma/SDRPlusPlus", description: "Modern cross-platform SDR receiver — supports HackRF natively" },
  { category: "software", title: "SDRangel", url: "https://github.com/f4exb/sdrangel", description: "Advanced TX/RX SDR application — demodulators, modulators, channel analyzers" },
  { category: "software", title: "GQRX", url: "https://github.com/gqrx-sdr/gqrx", description: "Popular SDR receiver powered by GNU Radio — simple UI, HackRF support" },
  { category: "software", title: "CubicSDR", url: "https://github.com/cjcliffe/CubicSDR", description: "Cross-platform SDR receiver with waterfall display" },
  { category: "software", title: "dump1090", url: "https://github.com/antirez/dump1090", description: "ADS-B decoder — track aircraft with HackRF or RTL-SDR" },

  // === Legal / Regulatory ===
  { category: "legal", title: "47 CFR 15.205 — Restricted Bands", url: "https://www.ecfr.gov/current/title-47/chapter-I/subchapter-A/part-15/subpart-C/section-15.205", description: "FCC restricted frequency bands — transmitting here is a federal crime" },
  { category: "legal", title: "FCC Enforcement Bureau", url: "https://www.fcc.gov/enforcement/areas", description: "FCC enforcement actions and areas of focus" },
  { category: "legal", title: "ARRL Band Plan", url: "https://www.arrl.org/band-plan", description: "Amateur radio band allocations — useful context for RF landscape" },

  // === Community / Forums ===
  { category: "community", title: "r/hackrf (Reddit)", url: "https://www.reddit.com/r/hackrf/", description: "HackRF community — questions, projects, troubleshooting" },
  { category: "community", title: "r/RTLSDR (Reddit)", url: "https://www.reddit.com/r/RTLSDR/", description: "Broader SDR community — many HackRF users, project ideas" },
  { category: "community", title: "Mayhem Discord", url: "https://discord.gg/tuwVMv3", description: "Official PortaPack Mayhem Discord server" },
  { category: "community", title: "HackRF Mailing List", url: "https://pairlist9.pair.net/mailman/listinfo/hackrf-dev", description: "Developer mailing list for HackRF firmware and hardware" },
];

export const linkCategories = [
  { id: "mayhem", label: "Mayhem Firmware", color: "badge-ghost" },
  { id: "hackrf", label: "HackRF Hardware", color: "badge-ghost" },
  { id: "learn", label: "Learning", color: "badge-ghost" },
  { id: "tools", label: "Tools & Repos", color: "badge-ghost" },
  { id: "software", label: "SDR Software", color: "badge-ghost" },
  { id: "awesome", label: "Collections", color: "badge-ghost" },
  { id: "legal", label: "Regulatory Reference", color: "badge-ghost" },
  { id: "community", label: "Community", color: "badge-ghost" },
];
