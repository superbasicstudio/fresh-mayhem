import { useState, useCallback, useEffect, useRef } from 'react';
import ContextPanel from './ContextPanel';

/* ── Menu tree (mirrors real Mayhem v2.3.2 structure) ── */
const MENUS = {
  main: {
    title: 'MAYHEM v2.3.2',
    items: [
      { label: 'Receive', color: '#7fff00', sub: 'receive' },
      { label: 'Transmit', color: '#f43f5e', sub: 'transmit' },
      { label: 'Capture', color: '#facc15', info: 'Record raw IQ data at a set frequency. Saves .C16 (16-bit) or .C8 (8-bit) files to the SD card. Match sample rate to your target signal bandwidth.' },
      { label: 'Replay', color: '#4ade80', info: 'Replay a previously captured .C16 or .C8 file. Sample rate must match the original capture. Antenna/dummy load required.' },
      { label: 'Scanner', color: '#a78bfa', info: 'Automated frequency scanning. Squelch-based stop. ~20 frequencies/second. Color-coded signal strength: grey → yellow → green.' },
      { label: 'Tools', color: '#fb923c', sub: 'tools' },
      { label: 'Settings', color: '#888', sub: 'settings' },
      { label: 'Debug', color: '#666', info: 'System diagnostics: memory usage, SD card info, peripheral status, temperature sensor, button/touch test.' },
      { label: 'HackRF Mode', color: '#4ade80', info: 'Switches to PC-tethered USB SDR mode. The PortaPack screen goes blank and HackRF appears as USB device 1d50:6089 on your computer.' },
    ],
  },
  receive: {
    title: 'Receive',
    items: [
      { label: 'ADS-B', color: '#7fff00', info: 'Aircraft transponder tracking at 1090 MHz. Decodes ICAO ID, callsign, altitude, position, and speed in real-time.' },
      { label: 'ACARS', color: '#7fff00', info: 'Aircraft Communication Addressing and Reporting System. Decodes data link messages between aircraft and ground stations.' },
      { label: 'Audio', color: '#7fff00', info: 'General analog receiver: AM, NFM, WFM, SSB (USB/LSB). Can record to WAV. Your go-to app for listening to any signal.' },
      { label: 'BLE RX', color: '#7fff00', info: 'Bluetooth Low Energy advertisement sniffer on channels 37, 38, 39 (2.402/2.426/2.480 GHz). MAC vendor lookup.' },
      { label: 'Looking Glass', color: '#7fff00', info: 'Wideband spectrum waterfall. Three modes: SPECTR (spectrum), LIVE-V (live vertical), PEAK-V (peak vertical). Great for finding signals.' },
      { label: 'NRF', color: '#7fff00', info: 'Nordic nRF24L01 protocol decoder. Captures wireless keyboard, mouse, and IoT device communications at 2.4 GHz.' },
      { label: 'POCSAG RX', color: '#7fff00', info: 'POCSAG pager message decoder. Decodes both numeric and alphanumeric messages. Manual baud rate: 512/1200/2400.' },
      { label: 'SubGhzD', color: '#7fff00', info: 'Sub-GHz protocol decoder for 300-928 MHz ISM band. Decodes key fobs, garage remotes, weather stations. Recommended: AMP 0, LNA 32, VGA 20.' },
      { label: 'TPMS RX', color: '#7fff00', info: 'Tire Pressure Monitoring System decoder. Reads sensor IDs, tire pressure, and temperature at 315/433 MHz.' },
      { label: 'Weather', color: '#7fff00', info: 'Wireless weather station decoder. Reads temperature, humidity, and sensor ID at 433/868/915 MHz ISM bands.' },
    ],
  },
  transmit: {
    title: 'Transmit ⚠',
    items: [
      { label: 'BLE TX', color: '#facc15', info: 'BLE advertisement packet transmitter. Configurable MAC and payload. Legal for testing your own devices only.' },
      { label: 'FlipperTX', color: '#facc15', info: 'Replays Flipper Zero .sub files directly from the SD card. Legal for your own devices only.' },
      { label: 'Morse TX', color: '#facc15', info: 'Transmit Morse code via FM tone or CW. Requires amateur radio license on appropriate frequencies.' },
      { label: 'OOK TX', color: '#facc15', info: 'On-Off Keying for PT2262 remotes, doorbells, garage doors. Legal for your own devices only.' },
      { label: 'POCSAG TX', color: '#f43f5e', info: 'Pager message transmission. Unauthorized transmission on licensed pager frequencies.' },
      { label: 'Jammer', color: '#f43f5e', info: '⛔ EXTREME — Broadband RF jammer. RF jamming is a federal crime in virtually all countries. Up to $112,500 fine + prison.' },
      { label: 'GPS Sim', color: '#f43f5e', info: '⛔ EXTREME — Generates fake GPS satellite signals. Federal crime that endangers aviation, shipping, and emergency services.' },
      { label: 'ADS-B TX', color: '#f43f5e', info: '⛔ EXTREME — Fake aircraft transponder data. Federal crime that directly endangers air safety. Up to 20 years prison.' },
    ],
  },
  tools: {
    title: 'Tools',
    items: [
      { label: 'Freq Manager', color: '#fb923c', info: 'Save, load, and manage frequency lists stored on the SD card. Import .csv frequency files for scanner/recon.' },
      { label: 'File Manager', color: '#fb923c', info: 'Browse, rename, delete, and manage all files on the SD card. View file sizes and folder structure.' },
      { label: 'Signal Gen', color: '#fb923c', info: 'Generate test signals at a specified frequency. Useful for testing receivers and antenna setups.' },
      { label: 'Antenna Calc', color: '#fb923c', info: 'Quarter-wave antenna length calculator. Enter frequency, get optimal antenna length for best reception.' },
      { label: 'Notepad', color: '#fb923c', info: 'Simple text editor for notes stored on the SD card. Handy for field notes during testing.' },
      { label: 'Wipe SD', color: '#f43f5e', info: 'Securely wipe SD card contents. Destructive — all captures, settings, and app data will be erased.' },
    ],
  },
  settings: {
    title: 'Settings',
    items: [
      { label: 'App Manager', color: '#888', info: 'Show or hide apps from the main menu. Set an autostart app that launches on power-on. Toggle app visibility.' },
      { label: 'Audio', color: '#888', info: 'Volume control, tone settings, speaker vs headphone output selection.' },
      { label: 'Radio', color: '#888', info: 'Frequency correction offset, TCXO calibration for accurate tuning.' },
      { label: 'UI', color: '#888', info: 'Encoder dial sensitivity (low/normal/high), back button in menus, icon visibility in title bar, touch enable/disable.' },
      { label: 'Date/Time', color: '#888', info: 'Set the real-time clock for accurate timestamps on captures and logs.' },
      { label: 'Theme', color: '#888', info: 'Change the UI color theme. Multiple themes available.' },
      { label: 'Touch Cal', color: '#888', info: 'Calibrate the touchscreen alignment. Hold each target for 1+ second.' },
    ],
  },
};

const MAX_VISIBLE = 7;

function wrapText(text, maxChars) {
  const words = text.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    if (cur.length + w.length + 1 > maxChars) {
      if (cur) lines.push(cur);
      cur = w;
    } else {
      cur = cur ? cur + ' ' + w : w;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

export default function PortaPackMockup({ expanded = false }) {
  const [stack, setStack] = useState(['main']);
  const [cursor, setCursor] = useState(0);
  const [info, setInfo] = useState(null);     // { title, text }
  const [active, setActive] = useState(null); // hovered hardware zone
  const [hovBtn, setHovBtn] = useState(null); // hovered d-pad button
  const [pressBtn, setPressBtn] = useState(null); // pressed d-pad button
  const [powerOn, setPowerOn] = useState(true);   // power switch state
  const containerRef = useRef(null);

  const currentMenuId = stack[stack.length - 1];
  const currentMenu = MENUS[currentMenuId];
  const items = currentMenu?.items || [];

  // Scroll offset to keep cursor visible
  const scrollOffset = Math.max(0, Math.min(cursor - MAX_VISIBLE + 1, items.length - MAX_VISIBLE));
  const visibleItems = items.slice(scrollOffset, scrollOffset + MAX_VISIBLE);

  const navigate = useCallback((dir) => {
    if (info) return; // in info view, no cursor movement
    setCursor(prev => {
      if (dir === 'up') return Math.max(0, prev - 1);
      if (dir === 'down') return Math.min(items.length - 1, prev + 1);
      return prev;
    });
  }, [info, items.length]);

  const select = useCallback(() => {
    if (info) { // back from info
      setInfo(null);
      return;
    }
    const item = items[cursor];
    if (!item) return;
    if (item.sub && MENUS[item.sub]) {
      setStack(prev => [...prev, item.sub]);
      setCursor(0);
    } else if (item.info) {
      setInfo({ title: item.label, text: item.info, color: item.color });
    }
  }, [info, items, cursor]);

  const goBack = useCallback(() => {
    if (info) {
      setInfo(null);
      return;
    }
    if (stack.length > 1) {
      setStack(prev => prev.slice(0, -1));
      setCursor(0);
    }
  }, [info, stack]);

  // Keyboard navigation
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onKey = (e) => {
      switch (e.key) {
        case 'ArrowUp': e.preventDefault(); navigate('up'); break;
        case 'ArrowDown': e.preventDefault(); navigate('down'); break;
        case 'Enter':
        case ' ':
        case 'ArrowRight': e.preventDefault(); select(); break;
        case 'ArrowLeft':
        case 'Backspace': e.preventDefault(); goBack(); break;
        default: break;
      }
    };
    el.addEventListener('keydown', onKey);
    return () => el.removeEventListener('keydown', onKey);
  }, [navigate, select, goBack]);

  // Hardware zone hover helpers
  const ZONES = [
    { id: 'sma', label: 'SMA Antenna Port', desc: 'SMA female — finger-tight only. 500 cycle life. Always connect before TX.' },
    { id: 'power', label: 'Power Switch', desc: 'Slide UP = ON, DOWN = OFF. Hardware disconnect. Must be ON to charge.' },
    { id: 'usbc', label: 'USB-C', desc: 'Data + charging. Use a data cable. Connects to PC for SDR mode.' },
    { id: 'audio', label: '3.5mm Audio', desc: 'Headphone out + headset mic in. Toggle internal/external.' },
    { id: 'sd', label: 'MicroSD', desc: 'FAT32, 16-32 GB. Stores apps, captures, frequency lists.' },
    { id: 'dfu', label: 'DFU Button', desc: 'Hold + RESET → DFU bootloader. ROM-based — never brickable.' },
    { id: 'reset', label: 'RESET', desc: 'Emergency stop. Kills all RF. Reboots instantly.' },
  ];
  const activeHw = ZONES.find(z => z.id === active);
  const lastHwRef = useRef(null);
  if (activeHw) lastHwRef.current = activeHw;
  const displayHw = activeHw || lastHwRef.current;

  const hw = (id) => ({
    className: 'hw-zone',
    style: { cursor: 'pointer' },
    onMouseEnter: () => setActive(id),
    onMouseLeave: () => setActive(null),
  });

  const glow = (id, c) => active === id ? `drop-shadow(0 0 6px ${c})` : 'none';
  const st = (id, c, fb = '#444') => active === id ? c : fb;

  // SVG dimensions
  const vw = 220, vh = 320;
  const sx = 30, sy = 32, sw = 160, sh = 132; // screen bounds
  const barH = 14;
  const itemH = expanded ? 14 : 13;
  const fontSize = expanded ? 8 : 7;
  const infoChars = expanded ? 32 : 26;

  const infoLines = info ? wrapText(info.text, infoChars) : [];

  return (
    <div className={`flex ${expanded ? 'flex-row gap-8 items-center justify-center min-h-[70vh]' : 'flex-col sm:flex-row gap-4 items-start'}`}>
      {/* Interactive device */}
      <div
        ref={containerRef}
        tabIndex={0}
        className={`outline-none shrink-0 ${expanded ? '' : ''}`}
        role="application"
        aria-label="PortaPack H4M simulator. Use arrow keys to navigate menus, Enter to select, Left/Backspace to go back."
      >
        <svg viewBox={`0 0 ${vw} ${vh}`} className={expanded ? 'w-72 md:w-80 lg:w-96' : 'w-56 sm:w-64'}>
          <defs>
            <linearGradient id="bz" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a1a1a" /><stop offset="100%" stopColor="#111" />
            </linearGradient>
          </defs>

          {/* Body */}
          <rect x="16" y="12" width="188" height="296" rx="14" fill="url(#bz)" stroke="#333" strokeWidth="1.5" />

          {/* Screen bezel */}
          <rect x="28" y="28" width="164" height="140" rx="4" fill="#060606" stroke="#222" strokeWidth="0.5" />

          {/* ── SCREEN CONTENT ── */}
          <rect x={sx} y={sy} width={sw} height={sh} rx="2" fill="#080808" />

          {/* Status bar */}
          <rect x={sx} y={sy} width={sw} height={barH} fill="#111" />
          <text x={sx + 4} y={sy + 10} fill="#4ade80" fontSize="6.5" fontFamily="monospace">MAYHEM</text>
          <text x={sx + 42} y={sy + 10} fill="#555" fontSize="6.5" fontFamily="monospace">v2.3.2</text>
          <text x={sx + sw - 4} y={sy + 10} fill="#4ade80" fontSize="6" fontFamily="monospace" textAnchor="end">▮▮▮ SD</text>

          {/* Title / breadcrumb */}
          <rect x={sx} y={sy + barH} width={sw} height={14} fill="#0e0e0e" />
          <line x1={sx} y1={sy + barH + 14} x2={sx + sw} y2={sy + barH + 14} stroke="#1a1a1a" strokeWidth={0.5} />
          {(stack.length > 1 || info) && (
            <text x={sx + 4} y={sy + barH + 10} fill="#7fff00" fontSize="7" fontFamily="monospace"
              style={{ cursor: 'pointer' }} onClick={goBack}>{'←'}</text>
          )}
          <text x={sx + (stack.length > 1 || info ? 16 : 4)} y={sy + barH + 10}
            fill={info ? (info.color || '#ddd') : '#aaa'} fontSize="7" fontFamily="monospace" fontWeight="bold">
            {info ? info.title : currentMenu?.title}
          </text>

          {/* Menu items or Info view */}
          {info ? (
            <>
              {infoLines.map((line, i) => (
                <text key={i} x={sx + 6} y={sy + barH + 28 + i * 12}
                  fill="#bbb" fontSize={fontSize} fontFamily="monospace">{line}</text>
              ))}
              <text x={sx + sw / 2} y={sy + sh - 4} textAnchor="middle"
                fill="#555" fontSize="6" fontFamily="monospace">← back / click to return</text>
            </>
          ) : (
            <>
              {visibleItems.map((item, vi) => {
                const idx = vi + scrollOffset;
                const isSel = idx === cursor;
                const iy = sy + barH + 22 + vi * itemH;
                return (
                  <g key={item.label} style={{ cursor: 'pointer' }} onClick={() => { setCursor(idx); select(); }}>
                    {isSel && <rect x={sx + 2} y={iy - 9} width={sw - 4} height={itemH} rx="2" fill="#7fff00" opacity="0.1" />}
                    <text x={sx + 6} y={iy - 1} fill={isSel ? '#7fff00' : '#666'} fontSize="7" fontFamily="monospace">
                      {isSel ? '▸' : ' '}
                    </text>
                    <text x={sx + 16} y={iy - 1} fill={isSel ? '#fff' : item.color} fontSize={fontSize}
                      fontFamily="monospace" opacity={isSel ? 1 : 0.7} fontWeight={isSel ? 'bold' : 'normal'}>
                      {item.label}
                    </text>
                    {item.sub && <text x={sx + sw - 8} y={iy - 1} fill="#444" fontSize="7" fontFamily="monospace">{'›'}</text>}
                  </g>
                );
              })}
              {/* Scroll indicators */}
              {scrollOffset > 0 && (
                <text x={sx + sw - 6} y={sy + barH + 18} fill="#555" fontSize="7" textAnchor="end">▲</text>
              )}
              {scrollOffset + MAX_VISIBLE < items.length && (
                <text x={sx + sw - 6} y={sy + sh - 4} fill="#555" fontSize="7" textAnchor="end">▼</text>
              )}
              {/* Nav hint */}
              <text x={sx + 6} y={sy + sh - 4} fill="#444" fontSize="5.5" fontFamily="monospace">
                {stack.length > 1 ? '▲▼ navigate  ● select  ← back' : '▲▼ navigate  ● select'}
              </text>
            </>
          )}

          {/* Power-off screen overlay */}
          {!powerOn && (
            <rect x={sx} y={sy} width={sw} height={sh} rx="2" fill="#050505" opacity="0.95" />
          )}

          {/* ── HARDWARE ZONES ── */}

          {/* SMA — antenna port (inside body top edge) */}
          <g {...hw('sma')} style={{ ...hw('sma').style, filter: glow('sma', '#4ade80') }}>
            <circle cx="110" cy="20" r="6" fill="#333" stroke={st('sma', '#4ade80', '#555')} strokeWidth={active === 'sma' ? 2 : 1} />
            <circle cx="110" cy="20" r="2" fill="#555" />
          </g>

          {/* DFU */}
          <g {...hw('dfu')} style={{ ...hw('dfu').style, filter: glow('dfu', '#f43f5e') }}>
            <rect x="36" y="16" width="18" height="10" rx="3" fill={active === 'dfu' ? '#f43f5e' : '#1a1a1a'}
              stroke={st('dfu', '#f43f5e')} strokeWidth="0.5" />
            <text x="45" y="24" textAnchor="middle" fill={active === 'dfu' ? '#fff' : '#555'} fontSize="6" fontWeight="bold">DFU</text>
          </g>

          {/* RESET */}
          <g {...hw('reset')} style={{ ...hw('reset').style, filter: glow('reset', '#f43f5e') }}>
            <rect x="166" y="16" width="18" height="10" rx="3" fill={active === 'reset' ? '#f43f5e' : '#1a1a1a'}
              stroke={st('reset', '#f43f5e')} strokeWidth="0.5" />
            <text x="175" y="24" textAnchor="middle" fill={active === 'reset' ? '#fff' : '#555'} fontSize="6" fontWeight="bold">RST</text>
          </g>

          {/* Power — interactive toggle switch */}
          <g className="hw-zone" style={{ cursor: 'pointer', filter: glow('power', '#4ade80') }}
            onClick={() => setPowerOn(p => !p)}
            onMouseEnter={() => setActive('power')} onMouseLeave={() => setActive(null)}>
            {/* Track (thinner) */}
            <rect x="196" y="68" width="7" height="40" rx="3.5" fill="#111" stroke={st('power', '#4ade80')} strokeWidth="0.5" />
            {/* ON indicator — IEC 5007 line symbol */}
            <line x1="199.5" y1="60" x2="199.5" y2="64" stroke={powerOn ? '#4ade80' : '#333'} strokeWidth="1.5" strokeLinecap="round" />
            {/* OFF indicator — IEC 5008 circle symbol */}
            <circle cx="199.5" cy="115" r="2.5" fill="none" stroke={!powerOn ? '#666' : '#282828'} strokeWidth="1" />
            {/* Sliding thumb */}
            <rect x="197.5" y="70" width="5" height="14" rx="2.5"
              fill={powerOn ? '#4ade80' : '#555'}
              style={{ transform: `translateY(${powerOn ? 0 : 22}px)`, transition: 'transform 0.2s ease, fill 0.2s ease' }} />
          </g>

          {/* ── CLICK WHEEL (interactive navigation) ── */}
          <circle cx="110" cy="230" r="40" fill="#151515" stroke="#2a2a2a" strokeWidth="1.5" />
          <circle cx="110" cy="230" r="38" fill="none" stroke="#1e1e1e" strokeWidth="0.5" />

          {/* UP */}
          <g onClick={() => navigate('up')} style={{ cursor: 'pointer' }}
            onMouseEnter={() => setHovBtn('up')} onMouseLeave={() => setHovBtn(null)}
            onMouseDown={() => setPressBtn('up')} onMouseUp={() => setPressBtn(null)}>
            <circle cx="110" cy="200" r="12" fill={hovBtn === 'up' ? '#7fff0008' : 'transparent'} />
            <polygon points="110,195 103,207 117,207"
              fill={pressBtn === 'up' ? '#7fff00' : hovBtn === 'up' ? '#7fff00' : '#555'}
              opacity={pressBtn === 'up' ? 1 : hovBtn === 'up' ? 0.9 : 0.6}
              style={{ filter: hovBtn === 'up' ? 'drop-shadow(0 0 4px #7fff0060)' : 'none', transition: 'fill 0.12s, opacity 0.12s', transform: pressBtn === 'up' ? 'translateY(1px)' : 'none', transformOrigin: '110px 200px' }} />
          </g>
          {/* DOWN */}
          <g onClick={() => navigate('down')} style={{ cursor: 'pointer' }}
            onMouseEnter={() => setHovBtn('down')} onMouseLeave={() => setHovBtn(null)}
            onMouseDown={() => setPressBtn('down')} onMouseUp={() => setPressBtn(null)}>
            <circle cx="110" cy="260" r="12" fill={hovBtn === 'down' ? '#7fff0008' : 'transparent'} />
            <polygon points="110,265 103,253 117,253"
              fill={pressBtn === 'down' ? '#7fff00' : hovBtn === 'down' ? '#7fff00' : '#555'}
              opacity={pressBtn === 'down' ? 1 : hovBtn === 'down' ? 0.9 : 0.6}
              style={{ filter: hovBtn === 'down' ? 'drop-shadow(0 0 4px #7fff0060)' : 'none', transition: 'fill 0.12s, opacity 0.12s', transform: pressBtn === 'down' ? 'translateY(-1px)' : 'none', transformOrigin: '110px 260px' }} />
          </g>
          {/* LEFT (back) */}
          <g onClick={goBack} style={{ cursor: 'pointer' }}
            onMouseEnter={() => setHovBtn('left')} onMouseLeave={() => setHovBtn(null)}
            onMouseDown={() => setPressBtn('left')} onMouseUp={() => setPressBtn(null)}>
            <circle cx="80" cy="230" r="12" fill={hovBtn === 'left' ? '#7fff0008' : 'transparent'} />
            <polygon points="75,230 87,223 87,237"
              fill={pressBtn === 'left' ? '#7fff00' : hovBtn === 'left' ? '#7fff00' : '#555'}
              opacity={pressBtn === 'left' ? 1 : hovBtn === 'left' ? 0.9 : 0.6}
              style={{ filter: hovBtn === 'left' ? 'drop-shadow(0 0 4px #7fff0060)' : 'none', transition: 'fill 0.12s, opacity 0.12s', transform: pressBtn === 'left' ? 'translateX(1px)' : 'none', transformOrigin: '80px 230px' }} />
          </g>
          {/* RIGHT */}
          <g onClick={select} style={{ cursor: 'pointer' }}
            onMouseEnter={() => setHovBtn('right')} onMouseLeave={() => setHovBtn(null)}
            onMouseDown={() => setPressBtn('right')} onMouseUp={() => setPressBtn(null)}>
            <circle cx="140" cy="230" r="12" fill={hovBtn === 'right' ? '#7fff0008' : 'transparent'} />
            <polygon points="145,230 133,223 133,237"
              fill={pressBtn === 'right' ? '#7fff00' : hovBtn === 'right' ? '#7fff00' : '#555'}
              opacity={pressBtn === 'right' ? 1 : hovBtn === 'right' ? 0.9 : 0.6}
              style={{ filter: hovBtn === 'right' ? 'drop-shadow(0 0 4px #7fff0060)' : 'none', transition: 'fill 0.12s, opacity 0.12s', transform: pressBtn === 'right' ? 'translateX(-1px)' : 'none', transformOrigin: '140px 230px' }} />
          </g>
          {/* CENTER (select) */}
          <g onClick={select} style={{ cursor: 'pointer' }}
            onMouseEnter={() => setHovBtn('center')} onMouseLeave={() => setHovBtn(null)}
            onMouseDown={() => setPressBtn('center')} onMouseUp={() => setPressBtn(null)}>
            <circle cx="110" cy="230" r="13"
              fill={pressBtn === 'center' ? '#7fff0015' : hovBtn === 'center' ? '#1a1a1a' : '#1e1e1e'}
              stroke={hovBtn === 'center' ? '#7fff00' : '#333'}
              strokeWidth={hovBtn === 'center' ? 2 : 1.5}
              style={{ filter: hovBtn === 'center' ? 'drop-shadow(0 0 6px #7fff0040)' : 'none', transition: 'all 0.15s' }} />
            <circle cx="110" cy="230" r="4"
              fill={hovBtn === 'center' ? '#7fff00' : '#444'}
              style={{ transition: 'fill 0.15s' }} />
          </g>

          {/* Bottom ports — inside device body */}
          <g {...hw('usbc')} style={{ ...hw('usbc').style, filter: glow('usbc', '#7fff00') }}>
            <rect x="58" y="286" width="26" height="8" rx="3" fill={active === 'usbc' ? '#7fff00' : '#1a1a1a'}
              stroke={st('usbc', '#7fff00')} strokeWidth="0.5" />
            <text x="71" y="302" textAnchor="middle" fill={active === 'usbc' ? '#7fff00' : '#333'} fontSize="5">USB-C</text>
          </g>
          <g {...hw('audio')} style={{ ...hw('audio').style, filter: glow('audio', '#facc15') }}>
            <circle cx="110" cy="290" r="5" fill={active === 'audio' ? '#facc15' : '#1a1a1a'}
              stroke={st('audio', '#facc15')} strokeWidth="0.5" />
            <text x="110" y="302" textAnchor="middle" fill={active === 'audio' ? '#facc15' : '#333'} fontSize="5">3.5mm</text>
          </g>
          <g {...hw('sd')} style={{ ...hw('sd').style, filter: glow('sd', '#4ade80') }}>
            <rect x="138" y="286" width="24" height="8" rx="2" fill={active === 'sd' ? '#4ade80' : '#1a1a1a'}
              stroke={st('sd', '#4ade80')} strokeWidth="0.5" />
            <text x="150" y="302" textAnchor="middle" fill={active === 'sd' ? '#4ade80' : '#333'} fontSize="5">SD</text>
          </g>
        </svg>
        {/* Compact navigation hints below device in expanded mode */}
        {expanded && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <kbd className="kbd kbd-xs bg-base-300 border-base-content/10">↑↓</kbd>
              <span className="text-[10px] text-base-content/30">Navigate</span>
              <kbd className="kbd kbd-xs bg-base-300 border-base-content/10">Enter</kbd>
              <kbd className="kbd kbd-xs bg-base-300 border-base-content/10">Space</kbd>
              <kbd className="kbd kbd-xs bg-base-300 border-base-content/10">→</kbd>
              <span className="text-[10px] text-base-content/30">Select</span>
              <kbd className="kbd kbd-xs bg-base-300 border-base-content/10">←</kbd>
              <span className="text-[10px] text-base-content/30">Back</span>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              <span className="text-[10px] text-base-content/25"><span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mr-1" />Screen</span>
              <span className="text-[10px] text-base-content/25"><span className="inline-block w-1.5 h-1.5 rounded-full bg-success mr-1" />RF</span>
              <span className="text-[10px] text-base-content/25"><span className="inline-block w-1.5 h-1.5 rounded-full bg-error mr-1" />Emergency</span>
            </div>
          </div>
        )}
      </div>

      {/* Right panel — compact hints or rich ContextPanel */}
      {expanded ? (
        <ContextPanel
          menuId={currentMenuId}
          highlightedItem={items[cursor]}
          activeHardwareId={active}
          breadcrumb={stack}
        />
      ) : (
        <div className="flex-1 min-w-0 grid">
          {/* Default hint — crossfades out when hardware hovered */}
          <div className={`col-start-1 row-start-1 transition-opacity duration-200 ease-out ${activeHw ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="space-y-3">
              <div className="bg-base-300/50 rounded-lg p-4">
                <p className="text-sm text-base-content/50 leading-relaxed">
                  Click the d-pad arrows to navigate menus. Hover hardware components for details.
                </p>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <span className="text-xs text-base-content/40"><span className="inline-block w-2 h-2 rounded-full bg-primary mr-1" />Screen</span>
                <span className="text-xs text-base-content/40"><span className="inline-block w-2 h-2 rounded-full bg-success mr-1" />RF / Power</span>
                <span className="text-xs text-base-content/40"><span className="inline-block w-2 h-2 rounded-full bg-error mr-1" />Emergency</span>
              </div>
            </div>
          </div>
          {/* Hardware zone info — crossfades in when hovered */}
          <div className={`col-start-1 row-start-1 transition-opacity duration-200 ease-out ${activeHw ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            role="status" aria-live="polite">
            <div className="bg-base-300/80 rounded-lg p-4">
              <h4 className="font-semibold text-sm text-primary">{displayHw?.label}</h4>
              <p className="text-sm text-base-content/70 mt-1.5 leading-relaxed">{displayHw?.desc}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
