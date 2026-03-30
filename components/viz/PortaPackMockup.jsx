import { useState, useCallback, useEffect, useRef } from 'react';
import ContextPanel from './ContextPanel';

/* ── Menu tree (mirrors real Mayhem v2.4 structure) ── */
const MENUS = {
  main: {
    title: 'MAYHEM v2.4',
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

export default function PortaPackMockup({ expanded = false, initialMenu = 'main' }) {
  const [stack, setStack] = useState(initialMenu === 'main' ? ['main'] : ['main', initialMenu]);
  const [cursor, setCursor] = useState(0);
  const [info, setInfo] = useState(null);     // { title, text }
  const [active, setActive] = useState(null); // hovered hardware zone
  const [hovBtn, setHovBtn] = useState(null); // hovered d-pad button
  const [pressBtn, setPressBtn] = useState(null); // pressed d-pad button
  const [powerOn, setPowerOn] = useState(true);   // power switch state
  const [powerTransition, setPowerTransition] = useState(null); // 'booting' | 'shutting-down' | null
  const [micMode, setMicMode] = useState(true); // true = MIC, false = EXT
  const containerRef = useRef(null);

  const togglePower = () => {
    if (powerTransition) return; // debounce — no toggling during animation
    if (powerOn) {
      // Shutting down
      setPowerTransition('shutting-down');
      setTimeout(() => { setPowerOn(false); setPowerTransition(null); }, 800);
    } else {
      // Booting up
      setPowerOn(true);
      setPowerTransition('booting');
      setTimeout(() => { setPowerTransition(null); }, 1500);
    }
  };

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
    { id: 'gpio', label: 'GPIO Header', desc: 'General purpose I/O pins. Used for external hardware, add-ons, and debugging. Active low.' },
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

  const glow = (id, c) => active === id ? `drop-shadow(0 0 8px ${c})` : 'none';
  const st = (id, c, fb = '#444') => active === id ? c : fb;

  // SVG dimensions — matched to real HackRF+PortaPack H4M proportions
  const vw = 260, vh = 400;
  const sx = 46, sy = 44, sw = 172, sh = 170; // screen bounds
  const barH = 16;
  const itemH = expanded ? 16 : 15;
  const fontSize = expanded ? 9 : 8;
  const infoChars = expanded ? 26 : 22;

  const infoLines = info ? wrapText(info.text, infoChars) : [];

  // Device body coords — ~12px bezel each side
  const bx = 24, by = 20, bw = 216, bh = 330, br = 12;
  // Click wheel center
  const wcx = bx + bw / 2, wcy = 285, wr = 42;

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

          {/* ── SMA CONNECTORS (drawn first = behind device body) ── */}
          {/* SMA — top-left */}
          <g {...hw('sma')} style={{ ...hw('sma').style, filter: glow('sma', '#fbbf24'), cursor: 'pointer' }}>
            {/* Brass barrel */}
            <rect x={bx + 15} y={by - 12} width="10" height="14" rx="2" fill="#b8860b" stroke={st('sma', '#fbbf24', '#cd9b1d')} strokeWidth={active === 'sma' ? 1.5 : 0.8} />
            {/* Red protective cap — twists away on hover */}
            <rect x={bx + 14} y={by - 13} width="12" height="10" rx="2.5" fill="#dc2626" stroke="#b91c1c" strokeWidth="0.5"
              style={{ transform: active === 'sma' ? 'translate(-4px, -8px) rotate(-25deg)' : 'translate(0, 0) rotate(0deg)', transformOrigin: `${bx + 20}px ${by - 8}px`, transition: 'transform 0.4s ease' }} />
          </g>
          {/* SMA — 2 on bottom-left */}
          {[bx + 30, bx + 58].map((cx, i) => (
            <g key={`sma-bot-${i}`} {...hw('sma')} style={{ ...hw('sma').style, filter: glow('sma', '#fbbf24'), cursor: 'pointer' }}>
              {/* Brass barrel */}
              <rect x={cx - 5} y={by + bh - 2} width="10" height="14" rx="2" fill="#b8860b" stroke={st('sma', '#fbbf24', '#cd9b1d')} strokeWidth={active === 'sma' ? 1.5 : 0.8} />
              {/* Red protective cap — twists away on hover */}
              <rect x={cx - 6} y={by + bh + 3} width="12" height="10" rx="2.5" fill="#dc2626" stroke="#b91c1c" strokeWidth="0.5"
                style={{ transform: active === 'sma' ? `translate(${i === 0 ? '-5px' : '5px'}, 8px) rotate(${i === 0 ? '-30' : '30'}deg)` : 'translate(0, 0) rotate(0deg)', transformOrigin: `${cx}px ${by + bh + 8}px`, transition: 'transform 0.4s ease' }} />
            </g>
          ))}

          {/* Device body — accurate PortaPack proportions */}
          <rect x={bx} y={by} width={bw} height={bh} rx={br} fill="url(#bz)" stroke="#333" strokeWidth="1.5" />
          {/* Inner bezel lip */}
          <rect x={bx + 6} y={by + 6} width={bw - 12} height={bh - 12} rx={br - 3} fill="none" stroke="#222" strokeWidth="0.5" />

          {/* Corner screws — Phillips head (cross pattern) */}
          {[[bx + 14, by + 14], [bx + bw - 14, by + 14], [bx + 14, by + bh - 14], [bx + bw - 14, by + bh - 14]].map(([cx, cy], i) => (
            <g key={`screw-${i}`}>
              <circle cx={cx} cy={cy} r="5" fill="#0e0e0e" stroke="#333" strokeWidth="0.8" />
              <line x1={cx - 2.5} y1={cy} x2={cx + 2.5} y2={cy} stroke="#444" strokeWidth="0.7" />
              <line x1={cx} y1={cy - 2.5} x2={cx} y2={cy + 2.5} stroke="#444" strokeWidth="0.7" />
            </g>
          ))}

          {/* Screen bezel */}
          <rect x={sx - 4} y={sy - 4} width={sw + 8} height={sh + 8} rx="5" fill="#060606" stroke="#222" strokeWidth="0.8" />

          {/* ── SCREEN CONTENT ── */}
          <rect x={sx} y={sy} width={sw} height={sh} rx="3" fill="#080808" />

          {/* Status bar */}
          <rect x={sx} y={sy} width={sw} height={barH} rx="3" fill="#111" />
          <text x={sx + 6} y={sy + 12} fill="#4ade80" fontSize="8" fontFamily="monospace" fontWeight="bold">MAYHEM</text>
          <text x={sx + 52} y={sy + 12} fill="#555" fontSize="8" fontFamily="monospace">v2.4</text>
          <text x={sx + sw - 6} y={sy + 12} fill="#4ade80" fontSize="7" fontFamily="monospace" textAnchor="end">▮▮▮ SD</text>

          {/* Title / breadcrumb */}
          <rect x={sx} y={sy + barH} width={sw} height={16} fill="#0e0e0e" />
          <line x1={sx} y1={sy + barH + 16} x2={sx + sw} y2={sy + barH + 16} stroke="#1a1a1a" strokeWidth={0.5} />
          {(stack.length > 1 || info) && (
            <text x={sx + 6} y={sy + barH + 12} fill="#7fff00" fontSize="8" fontFamily="monospace"
              style={{ cursor: 'pointer' }} onClick={goBack}>{'←'}</text>
          )}
          <text x={sx + (stack.length > 1 || info ? 20 : 6)} y={sy + barH + 12}
            fill={info ? (info.color || '#ddd') : '#aaa'} fontSize="8" fontFamily="monospace" fontWeight="bold">
            {info ? info.title : currentMenu?.title}
          </text>

          {/* Menu items or Info view */}
          {info ? (
            <>
              {infoLines.map((line, i) => (
                <text key={i} x={sx + 8} y={sy + barH + 34 + i * 14}
                  fill="#bbb" fontSize={fontSize} fontFamily="monospace">{line}</text>
              ))}
              <text x={sx + sw / 2} y={sy + sh - 6} textAnchor="middle"
                fill="#555" fontSize="7" fontFamily="monospace">← back / click to return</text>
            </>
          ) : (
            <>
              {visibleItems.map((item, vi) => {
                const idx = vi + scrollOffset;
                const isSel = idx === cursor;
                const iy = sy + barH + 30 + vi * itemH;
                return (
                  <g key={item.label} style={{ cursor: 'pointer' }} onClick={() => { setCursor(idx); select(); }}>
                    {isSel && <rect x={sx + 3} y={iy - 10} width={sw - 6} height={itemH} rx="2" fill="#7fff00" opacity="0.1" />}
                    <text x={sx + 8} y={iy} fill={isSel ? '#7fff00' : '#666'} fontSize="8" fontFamily="monospace">
                      {isSel ? '▸' : ' '}
                    </text>
                    <text x={sx + 20} y={iy} fill={isSel ? '#fff' : item.color} fontSize={fontSize}
                      fontFamily="monospace" opacity={isSel ? 1 : 0.7} fontWeight={isSel ? 'bold' : 'normal'}>
                      {item.label}
                    </text>
                    {item.sub && <text x={sx + sw - 10} y={iy} fill="#444" fontSize="8" fontFamily="monospace">{'›'}</text>}
                  </g>
                );
              })}
              {/* Scroll indicators */}
              {scrollOffset > 0 && (
                <text x={sx + sw - 8} y={sy + barH + 24} fill="#555" fontSize="8" textAnchor="end">▲</text>
              )}
              {scrollOffset + MAX_VISIBLE < items.length && (
                <text x={sx + sw - 8} y={sy + sh - 6} fill="#555" fontSize="8" textAnchor="end">▼</text>
              )}
              {/* Nav hint */}
              <text x={sx + 8} y={sy + sh - 6} fill="#444" fontSize="6" fontFamily="monospace">
                {stack.length > 1 ? '▲▼ navigate  ● select  ← back' : '▲▼ navigate  ● select'}
              </text>
            </>
          )}

          {/* Power-off screen overlay */}
          {!powerOn && !powerTransition && (
            <rect x={sx} y={sy} width={sw} height={sh} rx="3" fill="#050505" opacity="0.95" />
          )}

          {/* Shutdown animation */}
          {powerTransition === 'shutting-down' && (
            <g>
              <rect x={sx} y={sy} width={sw} height={sh} rx="3" fill="#050505" opacity="0.85">
                <animate attributeName="opacity" from="0" to="0.95" dur="0.6s" fill="freeze" />
              </rect>
              <line x1={sx + 12} y1={sy + sh / 2} x2={sx + sw - 12} y2={sy + sh / 2} stroke="#fff" strokeWidth="1.5">
                <animate attributeName="opacity" values="0;0.8;0.6;0" dur="0.8s" fill="freeze" />
              </line>
            </g>
          )}

          {/* Boot animation */}
          {powerTransition === 'booting' && (
            <g>
              <rect x={sx} y={sy} width={sw} height={sh} rx="3" fill="#050505">
                <animate attributeName="opacity" from="0.95" to="0" dur="1.4s" fill="freeze" />
              </rect>
              <text x={sx + sw / 2} y={sy + sh / 2 - 8} textAnchor="middle" fill="#4ade80" fontSize="9" fontFamily="monospace" fontWeight="bold">
                MAYHEM
                <animate attributeName="opacity" values="0;1;1;0" dur="1.4s" fill="freeze" />
              </text>
              <text x={sx + sw / 2} y={sy + sh / 2 + 8} textAnchor="middle" fill="#333" fontSize="6" fontFamily="monospace">
                Loading...
                <animate attributeName="opacity" values="0;0;0.5;0" dur="1.4s" fill="freeze" />
              </text>
            </g>
          )}

          {/* ── HARDWARE ZONES ── */}


          {/* Top-right area: DFU button, RESET button, MicroSD slot — on top edge of device */}
          {/* DFU button (blue) — enlarged hover area */}
          <g {...hw('dfu')} style={{ ...hw('dfu').style, filter: glow('dfu', '#60a5fa') }}>
            <rect x={bx + bw - 68} y={by - 14} width="26" height="20" rx="0" fill="transparent" />
            <rect x={bx + bw - 64} y={by - 8} width="18" height="10" rx="3" fill={active === 'dfu' ? '#93c5fd' : '#60a5fa'}
              stroke={st('dfu', '#bfdbfe', '#93c5fd')} strokeWidth="0.8" />
            <text x={bx + bw - 55} y={by - 1} textAnchor="middle" fill="#000" fontSize="5" fontWeight="bold" dominantBaseline="middle">DFU</text>
          </g>

          {/* RESET button (blue, far right) — enlarged hover area */}
          <g {...hw('reset')} style={{ ...hw('reset').style, filter: glow('reset', '#60a5fa') }}>
            <rect x={bx + bw - 42} y={by - 14} width="26" height="20" rx="0" fill="transparent" />
            <rect x={bx + bw - 38} y={by - 8} width="18" height="10" rx="3" fill={active === 'reset' ? '#93c5fd' : '#60a5fa'}
              stroke={st('reset', '#bfdbfe', '#93c5fd')} strokeWidth="0.8" />
            <text x={bx + bw - 29} y={by - 1} textAnchor="middle" fill="#000" fontSize="5" fontWeight="bold" dominantBaseline="middle">RST</text>
          </g>

          {/* MicroSD slot — below DFU/RST, centered between them */}
          <g {...hw('sd')} style={{ ...hw('sd').style, filter: glow('sd', '#4ade80') }}>
            <rect x={bx + bw - 55} y={by + 6} width="24" height="3" rx="1" fill={active === 'sd' ? '#4ade80' : '#555'}
              stroke={st('sd', '#4ade80', '#777')} strokeWidth="0.8" />
          </g>

          {/* Power — toggle switch in right bezel, vertically centered on screen */}
          {(() => { const rbcx = (sx + sw + bx + bw) / 2; return (
          <g className="hw-zone" style={{ cursor: powerTransition ? 'wait' : 'pointer', filter: glow('power', '#4ade80') }}
            onClick={togglePower}
            onMouseEnter={() => setActive('power')} onMouseLeave={() => setActive(null)}>
            <rect x={rbcx - 3.5} y={sy + sh / 2 - 15} width="7" height="30" rx="3.5" fill="#111" stroke={st('power', '#4ade80')} strokeWidth="0.8" />
            <line x1={rbcx} y1={sy + sh / 2 - 21} x2={rbcx} y2={sy + sh / 2 - 17} stroke={powerOn ? '#4ade80' : '#333'} strokeWidth="1.2" strokeLinecap="round" />
            <circle cx={rbcx} cy={sy + sh / 2 + 21} r="2" fill="none" stroke={!powerOn ? '#666' : '#282828'} strokeWidth="0.8" />
            <rect x={rbcx - 2.5} y={sy + sh / 2 - 13} width="5" height="12" rx="2.5"
              fill={powerOn ? '#4ade80' : '#555'}
              style={{ transform: `translateY(${powerOn ? 0 : 16}px)`, transition: 'transform 0.2s ease, fill 0.2s ease' }} />
          </g>
          ); })()}

          {/* MIC/EXT switch — left bezel, clickable toggle */}
          {(() => { const lbcx = (bx + sx) / 2; return (
          <g style={{ cursor: 'pointer' }} onClick={() => setMicMode(m => !m)}>
            <rect x={lbcx - 3.5} y={sy + sh / 2 - 12} width="7" height="24" rx="3.5" fill="#111" stroke="#444" strokeWidth="0.8" />
            <rect x={lbcx - 2} y={sy + sh / 2 - 8} width="4" height="10" rx="2" fill="#e0e0e0"
              style={{ transform: `translateY(${micMode ? 0 : 10}px)`, transition: 'transform 0.2s ease' }} />
            <text x={lbcx} y={sy + sh / 2 - 16} fill={micMode ? '#e0e0e0' : '#444'} fontSize="4" fontFamily="monospace" textAnchor="middle"
              style={{ transition: 'fill 0.2s' }}>MIC</text>
            <text x={lbcx} y={sy + sh / 2 + 20} fill={!micMode ? '#e0e0e0' : '#444'} fontSize="4" fontFamily="monospace" textAnchor="middle"
              style={{ transition: 'fill 0.2s' }}>EXT</text>
          </g>
          ); })()}

          {/* GPIO port — left side edge */}
          <g {...hw('gpio')} style={{ ...hw('gpio').style, filter: glow('gpio', '#facc15') }}>
            <rect x={bx - 4} y={sy + 20} width="6" height="50" rx="1.5" fill={active === 'gpio' ? '#1a1a1a' : '#0a0a0a'}
              stroke={st('gpio', '#facc15', '#222')} strokeWidth="0.8" />
          </g>

          {/* ── CLICK WHEEL (interactive navigation) ── */}
          <circle cx={wcx} cy={wcy} r={wr} fill="#080808" stroke="#222" strokeWidth="1.5" />
          <circle cx={wcx} cy={wcy} r={wr - 2} fill="none" stroke="#151515" strokeWidth="0.5" />
          {/* Inner ring around dots */}
          <circle cx={wcx} cy={wcy} r={wr - 6} fill="none" stroke="#1a1a1a" strokeWidth="0.8" />
          {/* Clock-like dot markers */}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 15) * Math.PI / 180;
            const dotR = wr - 12;
            return <circle key={`dot-${i}`} cx={wcx + Math.sin(angle) * dotR} cy={wcy - Math.cos(angle) * dotR} r="1" fill="#1a1a1a" />;
          })}
          {/* Inner ring inside dots */}
          <circle cx={wcx} cy={wcy} r={wr - 18} fill="none" stroke="#1a1a1a" strokeWidth="0.8" />

          {/* UP */}
          <g onClick={() => navigate('up')} style={{ cursor: 'pointer' }}
            onMouseEnter={() => setHovBtn('up')} onMouseLeave={() => setHovBtn(null)}
            onMouseDown={() => setPressBtn('up')} onMouseUp={() => setPressBtn(null)}>
            <circle cx={wcx} cy={wcy - 28} r="12" fill={hovBtn === 'up' ? '#7fff0008' : 'transparent'} />
            <polygon points={`${wcx},${wcy - 34} ${wcx - 7},${wcy - 22} ${wcx + 7},${wcy - 22}`}
              fill={pressBtn === 'up' ? '#7fff00' : hovBtn === 'up' ? '#7fff00' : '#444'}
              opacity={pressBtn === 'up' ? 1 : hovBtn === 'up' ? 0.9 : 0.6}
              style={{ filter: hovBtn === 'up' ? 'drop-shadow(0 0 4px #7fff0060)' : 'none', transition: 'fill 0.12s, opacity 0.12s', transform: pressBtn === 'up' ? 'translateY(1px)' : 'none', transformOrigin: `${wcx}px ${wcy - 28}px` }} />
          </g>
          {/* DOWN */}
          <g onClick={() => navigate('down')} style={{ cursor: 'pointer' }}
            onMouseEnter={() => setHovBtn('down')} onMouseLeave={() => setHovBtn(null)}
            onMouseDown={() => setPressBtn('down')} onMouseUp={() => setPressBtn(null)}>
            <circle cx={wcx} cy={wcy + 28} r="12" fill={hovBtn === 'down' ? '#7fff0008' : 'transparent'} />
            <polygon points={`${wcx},${wcy + 34} ${wcx - 7},${wcy + 22} ${wcx + 7},${wcy + 22}`}
              fill={pressBtn === 'down' ? '#7fff00' : hovBtn === 'down' ? '#7fff00' : '#444'}
              opacity={pressBtn === 'down' ? 1 : hovBtn === 'down' ? 0.9 : 0.6}
              style={{ filter: hovBtn === 'down' ? 'drop-shadow(0 0 4px #7fff0060)' : 'none', transition: 'fill 0.12s, opacity 0.12s', transform: pressBtn === 'down' ? 'translateY(-1px)' : 'none', transformOrigin: `${wcx}px ${wcy + 28}px` }} />
          </g>
          {/* LEFT (back) */}
          <g onClick={goBack} style={{ cursor: 'pointer' }}
            onMouseEnter={() => setHovBtn('left')} onMouseLeave={() => setHovBtn(null)}
            onMouseDown={() => setPressBtn('left')} onMouseUp={() => setPressBtn(null)}>
            <circle cx={wcx - 28} cy={wcy} r="12" fill={hovBtn === 'left' ? '#7fff0008' : 'transparent'} />
            <polygon points={`${wcx - 34},${wcy} ${wcx - 22},${wcy - 7} ${wcx - 22},${wcy + 7}`}
              fill={pressBtn === 'left' ? '#7fff00' : hovBtn === 'left' ? '#7fff00' : '#444'}
              opacity={pressBtn === 'left' ? 1 : hovBtn === 'left' ? 0.9 : 0.6}
              style={{ filter: hovBtn === 'left' ? 'drop-shadow(0 0 4px #7fff0060)' : 'none', transition: 'fill 0.12s, opacity 0.12s', transform: pressBtn === 'left' ? 'translateX(1px)' : 'none', transformOrigin: `${wcx - 28}px ${wcy}px` }} />
          </g>
          {/* RIGHT */}
          <g onClick={select} style={{ cursor: 'pointer' }}
            onMouseEnter={() => setHovBtn('right')} onMouseLeave={() => setHovBtn(null)}
            onMouseDown={() => setPressBtn('right')} onMouseUp={() => setPressBtn(null)}>
            <circle cx={wcx + 28} cy={wcy} r="12" fill={hovBtn === 'right' ? '#7fff0008' : 'transparent'} />
            <polygon points={`${wcx + 34},${wcy} ${wcx + 22},${wcy - 7} ${wcx + 22},${wcy + 7}`}
              fill={pressBtn === 'right' ? '#7fff00' : hovBtn === 'right' ? '#7fff00' : '#444'}
              opacity={pressBtn === 'right' ? 1 : hovBtn === 'right' ? 0.9 : 0.6}
              style={{ filter: hovBtn === 'right' ? 'drop-shadow(0 0 4px #7fff0060)' : 'none', transition: 'fill 0.12s, opacity 0.12s', transform: pressBtn === 'right' ? 'translateX(-1px)' : 'none', transformOrigin: `${wcx + 28}px ${wcy}px` }} />
          </g>
          {/* CENTER (select) */}
          <g onClick={select} style={{ cursor: 'pointer' }}
            onMouseEnter={() => setHovBtn('center')} onMouseLeave={() => setHovBtn(null)}
            onMouseDown={() => setPressBtn('center')} onMouseUp={() => setPressBtn(null)}>
            <circle cx={wcx} cy={wcy} r="14"
              fill={pressBtn === 'center' ? '#7fff0015' : hovBtn === 'center' ? '#111' : '#080808'}
              stroke={hovBtn === 'center' ? '#7fff00' : '#222'}
              strokeWidth={hovBtn === 'center' ? 3 : 2.5}
              style={{ filter: hovBtn === 'center' ? 'drop-shadow(0 0 6px #7fff0040)' : 'none', transition: 'all 0.15s' }} />
          </g>


          {/* USB-C — bottom-right of device, on bottom edge right of SMA connectors */}
          <g {...hw('usbc')} style={{ ...hw('usbc').style, filter: glow('usbc', '#4ade80') }}>
            <rect x={bx + bw - 52} y={by + bh - 6} width="20" height="7" rx="3" fill={active === 'usbc' ? '#4ade80' : '#555'}
              stroke={st('usbc', '#4ade80', '#777')} strokeWidth="0.8" />
          </g>

          {/* 3.5mm audio jack — bottom-right of device, next to USB-C */}
          <g {...hw('audio')} style={{ ...hw('audio').style, filter: glow('audio', '#4ade80') }}>
            <circle cx={bx + bw - 20} cy={by + bh - 3} r="4.5" fill={active === 'audio' ? '#4ade80' : '#555'}
              stroke={st('audio', '#4ade80', '#777')} strokeWidth="0.8" />
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
            </div>
          </div>
          {/* Hardware zone info — crossfades in when hovered */}
          <div className={`col-start-1 row-start-1 transition-opacity duration-200 ease-out ${activeHw ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            role="status" aria-live="polite">
            <div className="bg-base-300/80 rounded-lg p-4">
              <h4 className="font-semibold text-sm text-primary">{displayHw?.label}</h4>
              <p className="text-xs text-base-content/70 mt-1.5 leading-relaxed">{displayHw?.desc}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
