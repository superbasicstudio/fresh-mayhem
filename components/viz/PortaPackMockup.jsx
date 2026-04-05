import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ContextPanel from './ContextPanel';
import { MENUS, TITLE_BAR_ICONS, FW_COLORS, LAYOUT, THEMES, THEME_ORDER } from '../../data/mayhemMenus';
import ICON_PATHS from '../../data/mayhemIcons';

/* ── Text helpers ── */
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

/* ── Truncate label to fit button width ── */
function truncLabel(label, maxChars) {
  return label.length > maxChars ? label.slice(0, maxChars - 1) + '\u2026' : label;
}

export default function PortaPackMockup({ expanded = false, initialMenu = 'main' }) {
  const { t } = useTranslation();
  const [stack, setStack] = useState(initialMenu === 'main' ? ['main'] : ['main', initialMenu]);
  const [cursor, setCursor] = useState(0);
  const [info, setInfo] = useState(null);
  const [active, setActive] = useState(null);
  const [hovBtn, setHovBtn] = useState(null);
  const [pressBtn, setPressBtn] = useState(null);
  const [powerOn, setPowerOn] = useState(true);
  const [powerTransition, setPowerTransition] = useState(null);
  const [micMode, setMicMode] = useState(true);
  const [micNotify, setMicNotify] = useState(null); // temporary on-screen notification
  const [hovIcon, setHovIcon] = useState(null);
  const [page, setPage] = useState(0);
  const [themeId, setThemeId] = useState('dark');

  // Title bar icon toggle states (simulated)
  const [iconStates, setIconStates] = useState({
    stealth: false, converter: false, biasT: false,
    clock: false, mute: false, speaker: true, brightness: 0,
  });

  const theme = THEMES[themeId] || THEMES.dark;

  const containerRef = useRef(null);

  const togglePower = () => {
    if (powerTransition) return;
    if (powerOn) {
      setPowerTransition('shutting-down');
      setTimeout(() => { setPowerOn(false); setPowerTransition(null); }, 800);
    } else {
      setPowerOn(true);
      setPowerTransition('booting');
      setTimeout(() => { setPowerTransition(null); }, 1500);
    }
  };

  const currentMenuId = stack[stack.length - 1];
  const currentMenu = MENUS[currentMenuId];
  const isSubmenu = stack.length > 1;
  const gridCols = currentMenu?.grid || 2;
  const showInfoBar = currentMenu?.showInfoBar && stack.length === 1;

  // Prepend back-arrow tile in submenus (firmware behavior: top-left tile is always the back arrow)
  const backTile = { label: '..', icon: 'previous', color: FW_COLORS.white, isBack: true };
  const items = isSubmenu
    ? [backTile, ...(currentMenu?.items || [])]
    : (currentMenu?.items || []);

  // Grid layout calculations matching firmware
  const btnH = 48; // pixels in firmware coordinate space
  const btnW = LAYOUT.screenWidth / gridCols;
  const contentH = showInfoBar ? LAYOUT.contentHeight : LAYOUT.contentHeightFull;
  const visibleRows = Math.floor(contentH / btnH);
  const itemsPerPage = visibleRows * gridCols;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Reset page when menu changes
  const menuKeyRef = useRef(currentMenuId);
  if (menuKeyRef.current !== currentMenuId) {
    menuKeyRef.current = currentMenuId;
    if (page !== 0) setPage(0);
  }

  const pageItems = items.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  const navigate = useCallback((dir) => {
    if (info) return;
    setCursor(prev => {
      const total = pageItems.length;
      if (total === 0) return 0;
      if (dir === 'up') {
        const next = prev - gridCols;
        return next >= 0 ? next : prev;
      }
      if (dir === 'down') {
        const next = prev + gridCols;
        return next < total ? next : prev;
      }
      if (dir === 'left') {
        return prev > 0 ? prev - 1 : prev;
      }
      if (dir === 'right') {
        return prev < total - 1 ? prev + 1 : prev;
      }
      return prev;
    });
  }, [info, pageItems.length, gridCols]);

  const goBack = useCallback(() => {
    if (info) { setInfo(null); return; }
    if (stack.length > 1) {
      setStack(prev => prev.slice(0, -1));
      setCursor(0);
      setPage(0);
    }
  }, [info, stack]);

  // selectItem: pass item directly (mouse click) or omit to use cursor (keyboard Enter)
  const selectItem = useCallback((targetItem) => {
    if (info) { setInfo(null); return; }
    const item = targetItem || pageItems[cursor];
    if (!item) return;
    if (item.isBack) { goBack(); return; }
    if (item.label === 'Theme' && currentMenuId === 'settings') {
      const idx = THEME_ORDER.indexOf(themeId);
      const nextIdx = (idx + 1) % THEME_ORDER.length;
      setThemeId(THEME_ORDER[nextIdx]);
      const nextTheme = THEMES[THEME_ORDER[nextIdx]];
      setInfo({ title: 'Theme', text: `Theme changed to: ${nextTheme.name}. Press select again to cycle through all 6 themes. Available: Default Grey, Yellow, Aqua, Green, Red, Dark.`, color: item.color });
      return;
    }
    if (item.label === 'Menu Color' && currentMenuId === 'settings') {
      setInfo({ title: 'Menu Color', text: `Current menu button color is set by the active theme (${theme.name}). In the real device, you can pick any custom color for button backgrounds.`, color: item.color });
      return;
    }
    if (item.sub && MENUS[item.sub]) {
      setStack(prev => [...prev, item.sub]);
      setCursor(0);
      setPage(0);
    } else if (item.info) {
      setInfo({ title: item.label, text: item.info, color: item.color });
    }
  }, [info, pageItems, cursor, currentMenuId, themeId, theme.name, goBack]);

  const select = useCallback(() => selectItem(), [selectItem]);

  // Page navigation
  const nextPage = useCallback(() => {
    if (page < totalPages - 1) { setPage(p => p + 1); setCursor(0); }
  }, [page, totalPages]);
  const prevPage = useCallback(() => {
    if (page > 0) { setPage(p => p - 1); setCursor(0); }
  }, [page]);

  // Auto-focus the mockup container when expanded (e.g. modal opens)
  // so keyboard controls work immediately without clicking.
  // Small delay to override ExpandableCard's close-button focus.
  useEffect(() => {
    if (expanded && containerRef.current) {
      const t = setTimeout(() => containerRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [expanded]);

  // Can the mockup handle "go back"? (info panel open or not at root menu)
  const canGoBack = info || stack.length > 1;

  // Keyboard navigation
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onKey = (e) => {
      if (!powerOn || powerTransition) return;
      const key = e.key.toLowerCase();
      switch (key) {
        case 'arrowup': case 'w':
          e.preventDefault(); e.stopPropagation(); navigate('up'); break;
        case 'arrowdown': case 's':
          e.preventDefault(); e.stopPropagation(); navigate('down'); break;
        case 'arrowleft': case 'a':
          e.preventDefault(); e.stopPropagation(); navigate('left'); break;
        case 'arrowright': case 'd':
          e.preventDefault(); e.stopPropagation(); navigate('right'); break;
        case 'enter': case ' ':
          e.preventDefault(); e.stopPropagation(); select(); break;
        case 'backspace':
          e.preventDefault(); e.stopPropagation(); goBack(); break;
        case 'escape':
          // Only consume Escape if mockup has somewhere to go back to.
          // Otherwise let it bubble up so the ExpandableCard modal can close.
          if (canGoBack) {
            e.preventDefault(); e.stopPropagation(); goBack();
          }
          break;
        case 'pagedown':
          e.preventDefault(); e.stopPropagation(); nextPage(); break;
        case 'pageup':
          e.preventDefault(); e.stopPropagation(); prevPage(); break;
        default: break;
      }
    };
    el.addEventListener('keydown', onKey);
    return () => el.removeEventListener('keydown', onKey);
  }, [navigate, select, goBack, nextPage, prevPage, powerOn, powerTransition, canGoBack]);

  // Hardware zones
  const ZONES = [
    { id: 'sma', label: 'SMA Antenna Port', desc: 'SMA female connector. Finger-tight only (no tools). 500 cycle rated life. Always connect antenna or dummy load before transmitting.' },
    { id: 'power', label: 'Power Switch', desc: 'Slide UP = ON, DOWN = OFF. Hardware power disconnect. Must be ON to charge via USB.' },
    { id: 'usbc', label: 'USB-C', desc: 'Combined data and charging. Use a data-capable cable. Connects to PC for HackRF SDR mode and SD Over USB.' },
    { id: 'audio', label: '3.5mm Audio', desc: 'Headphone output and headset microphone input. Toggle internal/external mic with the MIC/EXT switch.' },
    { id: 'sd', label: 'MicroSD', desc: 'FAT32 formatted, 16-32 GB recommended. Stores external apps, captures, frequency lists, and settings.' },
    { id: 'dfu', label: 'DFU Button', desc: 'Hold DFU + press RESET to enter bootloader mode for firmware flashing. ROM-based so the device can never be bricked.' },
    { id: 'reset', label: 'RESET', desc: 'Emergency hard reset. Kills all RF output immediately and reboots. Use if device becomes unresponsive.' },
    { id: 'gpio', label: 'GPIO Header', desc: 'General purpose I/O pins along the left edge. Used for external sensors, add-on modules, and hardware debugging.' },
    { id: 'mic', label: 'MIC / EXT Switch', desc: 'Toggles the audio input source. MIC (up) uses the built-in microphone on the PortaPack board for voice TX. EXT (down) uses an external microphone or line-in via the 3.5mm jack on the bottom of the device. Only affects apps that use microphone input (like the Mic transceiver app).' },
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

  // SVG coordinate system
  // Device body is sized to give the screen a proper 3:4 aspect ratio (240:320)
  const vw = 260, vh = 460;
  const bx = 24, by = 20, bw = 216, bh = 400, br = 12;

  // Screen area: 3:4 aspect ratio matching real 240x320 LCD
  const sw = 168, sh = 224; // 168:224 = 3:4
  const sx = bx + (bw - sw) / 2; // centered in body
  const sy = by + 18;

  // Scale factors: SVG screen coords -> firmware pixel coords
  const scaleX = sw / LAYOUT.screenWidth; // 168/240 = 0.7
  const scaleY = sh / LAYOUT.screenHeight; // 224/320 = 0.7

  // Title bar in SVG coords
  const tbH = LAYOUT.titleBarHeight * scaleY; // ~11.2px
  const ibH = LAYOUT.infoBarHeight * scaleY;  // ~11.2px

  // Content area in SVG coords
  const contentTop = sy + tbH;
  const contentBot = showInfoBar ? sy + sh - ibH : sy + sh;
  const contentSvgH = contentBot - contentTop;

  // Button dimensions in SVG coords
  const svgBtnH = btnH * scaleY;
  const svgBtnW = btnW * scaleX;

  // Click wheel
  const wcx = bx + bw / 2, wcy = sy + sh + 60, wr = 42;

  // Info text
  const infoChars = expanded ? 26 : 22;
  const infoLines = info ? wrapText(info.text, infoChars) : [];
  const fontSize = expanded ? 7.5 : 6.5;

  // Theme-driven colors
  const menuBgHex = theme.menuColor;

  // Map title bar icon IDs to firmware bitmap path keys
  const TITLE_ICON_MAP = {
    camera: 'camera',
    sleep: 'sleep',
    stealth: 'stealth',
    converter: 'upconvert',
    biasT: iconStates.biasT ? 'biast_on' : 'biast_off',
    clock: null, // 8x16, rendered as text fallback
    mute: iconStates.mute ? 'speaker_headphones_mute' : 'speaker_headphones',
    speaker: iconStates.speaker ? 'speaker' : 'speaker_mute',
    brightness: 'brightness',
    battery: 'battery',
    batteryPct: null, // text only
    sdCard: 'sdcard',
  };

  // Title bar icon rendering using actual firmware bitmaps
  const renderTitleBarIcons = () => {
    const icons = TITLE_BAR_ICONS;
    let rx = sx + sw - 2;
    const iy = sy + 1;
    const ih = tbH - 2;

    return icons.slice().reverse().map((icon) => {
      const iw = icon.width * scaleX;
      rx -= iw;
      const ix = rx;
      rx -= 0.5; // tight gap like real firmware

      // Determine icon color
      let fill = theme.fgLight;
      if (icon.id === 'stealth' && iconStates.stealth) fill = theme.statusActive;
      if (icon.id === 'converter' && iconStates.converter) fill = FW_COLORS.red;
      if (icon.id === 'biasT' && iconStates.biasT) fill = FW_COLORS.yellow;
      if (icon.id === 'clock' && iconStates.clock) fill = theme.statusActive;
      if (icon.id === 'mute' && iconStates.mute) fill = theme.statusActive;
      if (icon.id === 'speaker' && iconStates.speaker) fill = theme.statusActive;
      if (icon.id === 'brightness' && iconStates.brightness > 0) fill = theme.statusActive;

      const isHovered = hovIcon === icon.id;
      const bitmapKey = TITLE_ICON_MAP[icon.id];
      const pathData = bitmapKey ? ICON_PATHS[bitmapKey] : null;
      const iconScale = ih / 16;
      const cx = ix + iw / 2;
      const cy = iy + ih / 2;
      const hoverScale = 2.2;

      return (
        <g key={icon.id}
          onMouseEnter={() => setHovIcon(icon.id)}
          onMouseLeave={() => setHovIcon(null)}
          onClick={() => {
            if (icon.type === 'toggle') {
              setIconStates(prev => ({ ...prev, [icon.id]: !prev[icon.id] }));
            }
          }}
          style={{ cursor: icon.type === 'toggle' || icon.type === 'button' ? 'pointer' : 'default' }}
        >
          {/* Enlarged icon when hovered (rendered behind normal to catch mouse) */}
          <rect x={ix - 4} y={iy - 4} width={iw + 8} height={ih + 8} fill="transparent" />
          {isHovered && (
            <g>
              {/* Solid background so enlarged icon doesn't overlap neighbors */}
              <rect x={cx - iw * 1.1} y={cy - ih * 1.1} width={iw * 2.2} height={ih * 2.2}
                rx="2" fill="#000" stroke={fill} strokeWidth="0.5" strokeOpacity="0.6" />
              {/* Enlarged icon */}
              {pathData ? (
                <path d={pathData} fill={fill}
                  transform={`translate(${cx},${cy}) scale(${iconScale * hoverScale}) translate(-8,-8)`}
                  shapeRendering="crispEdges" />
              ) : icon.id === 'batteryPct' ? (
                <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
                  fill={theme.fgMedium} fontSize="7" fontFamily="monospace" fontWeight="bold">87%</text>
              ) : icon.id === 'clock' ? (
                <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
                  fill={fill} fontSize="7" fontFamily="monospace" fontWeight="bold">{iconStates.clock ? 'EX' : 'IN'}</text>
              ) : null}
            </g>
          )}
          {/* Normal size icon */}
          {icon.id === 'batteryPct' ? (
            <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
              fill={theme.fgMedium} fontSize="3.5" fontFamily="monospace">87%</text>
          ) : icon.id === 'clock' ? (
            <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
              fill={fill} fontSize="4" fontFamily="monospace">{iconStates.clock ? 'EX' : 'IN'}</text>
          ) : pathData ? (
            <path d={pathData} fill={fill}
              transform={`translate(${ix},${iy}) scale(${iconScale})`}
              shapeRendering="crispEdges" />
          ) : null}
        </g>
      );
    });
  };

  // Title bar icon tooltip (shown below screen when hovered)
  const hoveredIcon = TITLE_BAR_ICONS.find(i => i.id === hovIcon);

  return (
    <div className={`flex ${expanded ? 'flex-row gap-8 items-start justify-center' : 'flex-col items-center'}`}>
      <div
        ref={containerRef}
        tabIndex={0}
        className="outline-none shrink-0"
        role="application"
        aria-label="PortaPack H4M simulator. Use arrow keys or WASD to navigate menus, Enter to select, Escape to go back."
      >
        <svg viewBox={`0 0 ${vw} ${vh}`} className={expanded ? 'w-72 md:w-80 lg:w-96' : 'w-56 sm:w-64'}>
          <defs>
            <linearGradient id="bz" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a1a1a" /><stop offset="100%" stopColor="#111" />
            </linearGradient>
          </defs>

          {/* ── SMA CONNECTORS (behind device body) ── */}
          <g {...hw('sma')} style={{ ...hw('sma').style, filter: glow('sma', '#fbbf24'), cursor: 'pointer' }}>
            <rect x={bx + 15} y={by - 12} width="10" height="14" rx="2" fill="#b8860b" stroke={st('sma', '#fbbf24', '#cd9b1d')} strokeWidth={active === 'sma' ? 1.5 : 0.8} />
            <rect x={bx + 14} y={by - 13} width="12" height="10" rx="2.5" fill="#dc2626" stroke="#b91c1c" strokeWidth="0.5"
              style={{ transform: active === 'sma' ? 'translate(-4px, -8px) rotate(-25deg)' : 'translate(0, 0) rotate(0deg)', transformOrigin: `${bx + 20}px ${by - 8}px`, transition: 'transform 0.4s ease' }} />
          </g>
          {[bx + 30, bx + 58].map((cx, i) => (
            <g key={`sma-bot-${i}`} {...hw('sma')} style={{ ...hw('sma').style, filter: glow('sma', '#fbbf24'), cursor: 'pointer' }}>
              <rect x={cx - 5} y={by + bh - 2} width="10" height="14" rx="2" fill="#b8860b" stroke={st('sma', '#fbbf24', '#cd9b1d')} strokeWidth={active === 'sma' ? 1.5 : 0.8} />
              <rect x={cx - 6} y={by + bh + 3} width="12" height="10" rx="2.5" fill="#dc2626" stroke="#b91c1c" strokeWidth="0.5"
                style={{ transform: active === 'sma' ? `translate(${i === 0 ? '-5px' : '5px'}, 8px) rotate(${i === 0 ? '-30' : '30'}deg)` : 'translate(0, 0) rotate(0deg)', transformOrigin: `${cx}px ${by + bh + 8}px`, transition: 'transform 0.4s ease' }} />
            </g>
          ))}

          {/* Device body */}
          <rect x={bx} y={by} width={bw} height={bh} rx={br} fill="url(#bz)" stroke="#333" strokeWidth="1.5" />
          <rect x={bx + 6} y={by + 6} width={bw - 12} height={bh - 12} rx={br - 3} fill="none" stroke="#222" strokeWidth="0.5" />

          {/* Corner screws */}
          {[[bx + 14, by + 14], [bx + bw - 14, by + 14], [bx + 14, by + bh - 14], [bx + bw - 14, by + bh - 14]].map(([cx, cy], i) => (
            <g key={`screw-${i}`}>
              <circle cx={cx} cy={cy} r="5" fill="#0e0e0e" stroke="#333" strokeWidth="0.8" />
              <line x1={cx - 2.5} y1={cy} x2={cx + 2.5} y2={cy} stroke="#444" strokeWidth="0.7" />
              <line x1={cx} y1={cy - 2.5} x2={cx} y2={cy + 2.5} stroke="#444" strokeWidth="0.7" />
            </g>
          ))}

          {/* Screen bezel */}
          <rect x={sx - 4} y={sy - 4} width={sw + 8} height={sh + 8} rx="5" fill="#060606" stroke="#222" strokeWidth="0.8" />

          {/* ── SCREEN ── */}
          <rect x={sx} y={sy} width={sw} height={sh} rx="2" fill={theme.bgDarkest} />

          {powerOn && !powerTransition && (
            <g>
              {/* ── TITLE BAR (16px, theme dark background) ── */}
              <rect x={sx} y={sy} width={sw} height={tbH} fill={theme.bgDark} rx="2" />
              <rect x={sx} y={sy + tbH - 3} width={sw} height="3" fill={theme.bgDark} />

              {/* Back arrow (firmware-accurate: highlighted box with bitmap_icon_previous) */}
              {stack.length > 1 && !info ? (
                <g style={{ cursor: 'pointer' }} onClick={goBack}>
                  {/* Highlighted background matching firmware inverted style */}
                  <rect x={sx} y={sy} width={tbH} height={tbH} fill={theme.fgMedium} rx="2" />
                  <rect x={sx} y={sy + tbH - 3} width={tbH} height="3" fill={theme.fgMedium} />
                  {/* Actual bitmap_icon_previous rendered in dark color (inverted) */}
                  <path d={ICON_PATHS.previous} fill={theme.bgDark}
                    transform={`translate(${sx},${sy}) scale(${tbH / 16})`}
                    shapeRendering="crispEdges" />
                </g>
              ) : stack.length === 1 && !info ? (
                /* MAYHEM title image on home screen */
                <text x={sx + 4} y={sy + tbH / 2 + 1} fill={theme.fgMedium} fontSize="6"
                  fontFamily="monospace" fontWeight="bold" dominantBaseline="middle">MAYHEM</text>
              ) : null}

              {/* App title text */}
              {info ? (
                <text x={sx + (stack.length > 1 ? tbH + 2 : 4)} y={sy + tbH / 2 + 1}
                  fill={theme.fgMedium} fontSize="5.5" fontFamily="monospace" dominantBaseline="middle">
                  {info.title}
                </text>
              ) : stack.length > 1 ? (
                <text x={sx + tbH + 2} y={sy + tbH / 2 + 1}
                  fill={theme.fgMedium} fontSize="5.5" fontFamily="monospace" dominantBaseline="middle">
                  {currentMenu?.title}
                </text>
              ) : null}

              {/* Status tray icons (right side) */}
              {renderTitleBarIcons()}

              {/* ── CONTENT AREA ── */}
              {info ? (
                /* Info detail view */
                <g>
                  <rect x={sx} y={contentTop} width={sw} height={contentSvgH} fill={theme.bgDarkest} />
                  {infoLines.map((line, i) => (
                    <text key={i} x={sx + 4} y={contentTop + 10 + i * 9}
                      fill={theme.fgLight} fontSize={fontSize} fontFamily="monospace">{line}</text>
                  ))}
                  <text x={sx + sw / 2} y={contentBot - 4} textAnchor="middle"
                    fill={theme.bgLight} fontSize="4.5" fontFamily="monospace" opacity="0.5">press back to return</text>
                </g>
              ) : (
                /* Grid menu */
                <g>
                  {pageItems.map((item, idx) => {
                    const row = Math.floor(idx / gridCols);
                    const col = idx % gridCols;
                    const bx2 = sx + col * svgBtnW;
                    const by2 = contentTop + row * svgBtnH;
                    const isSel = idx === cursor;
                    const maxLabelChars = gridCols === 2 ? 12 : 9;

                    // Firmware-accurate button rendering (highlight inverts fg/bg)
                    const bgColor = isSel ? item.color : menuBgHex;
                    const textColor = isSel ? theme.bgDarkest : item.color;
                    const iconColor = isSel ? theme.bgDarkest : item.color;

                    return (
                      <g key={`${item.label}-${idx}`} style={{ cursor: 'pointer' }}
                        onClick={() => { setCursor(idx); selectItem(item); }}>
                        {/* Button background */}
                        <rect x={bx2} y={by2} width={svgBtnW} height={svgBtnH}
                          fill={bgColor} />
                        {/* Top highlight border */}
                        <line x1={bx2} y1={by2 + 0.5} x2={bx2 + svgBtnW} y2={by2 + 0.5}
                          stroke={theme.bgLight} strokeWidth="0.3" opacity="0.4" />
                        {/* Bottom shadow border */}
                        <line x1={bx2} y1={by2 + svgBtnH - 0.5} x2={bx2 + svgBtnW} y2={by2 + svgBtnH - 0.5}
                          stroke={theme.bgDark} strokeWidth="0.3" opacity="0.5" />
                        {/* Right shadow border */}
                        <line x1={bx2 + svgBtnW - 0.5} y1={by2} x2={bx2 + svgBtnW - 0.5} y2={by2 + svgBtnH}
                          stroke={theme.bgDark} strokeWidth="0.3" opacity="0.5" />

                        {/* Firmware-accurate 16x16 bitmap icon */}
                        {(() => {
                          const iconKey = item.icon;
                          const pathData = iconKey ? ICON_PATHS[iconKey] : null;
                          const iconSize = gridCols === 2 ? 9 : 7.5;
                          const iconScale = iconSize / 16;
                          const iconX = bx2 + svgBtnW / 2 - iconSize / 2;
                          const iconY = by2 + svgBtnH * 0.18;
                          if (pathData) {
                            return (
                              <path d={pathData} fill={iconColor}
                                transform={`translate(${iconX},${iconY}) scale(${iconScale})`}
                                shapeRendering="crispEdges" />
                            );
                          }
                          // Fallback for icons without bitmap data (external apps use 'ext')
                          return (
                            <rect x={bx2 + svgBtnW / 2 - iconSize / 2} y={iconY}
                              width={iconSize} height={iconSize} rx="0.5"
                              fill="none" stroke={iconColor} strokeWidth="0.4" opacity="0.5" />
                          );
                        })()}

                        {/* Label text (centered below icon) */}
                        <text x={bx2 + svgBtnW / 2} y={by2 + svgBtnH * 0.78}
                          textAnchor="middle" fill={textColor}
                          fontSize={gridCols === 2 ? '5' : '4.2'} fontFamily="monospace">
                          {truncLabel(item.label, maxLabelChars)}
                        </text>
                      </g>
                    );
                  })}

                  {/* Page arrows (firmware-style, bottom of content area) */}
                  {totalPages > 1 && (
                    <g>
                      {page > 0 && (
                        <g style={{ cursor: 'pointer' }} onClick={prevPage}>
                          <rect x={sx} y={contentBot - ibH} width={sw / 2} height={ibH} fill={theme.bgDark} />
                          <text x={sx + sw / 4} y={contentBot - ibH / 2 + 1} textAnchor="middle" dominantBaseline="middle"
                            fill={theme.fgMedium} fontSize="5" fontFamily="monospace">{'\u25B2'} Prev</text>
                        </g>
                      )}
                      {page < totalPages - 1 && (
                        <g style={{ cursor: 'pointer' }} onClick={nextPage}>
                          <rect x={sx + sw / 2} y={contentBot - ibH} width={sw / 2} height={ibH} fill={theme.bgDark} />
                          <text x={sx + sw * 3 / 4} y={contentBot - ibH / 2 + 1} textAnchor="middle" dominantBaseline="middle"
                            fill={theme.fgMedium} fontSize="5" fontFamily="monospace">Next {'\u25BC'}</text>
                        </g>
                      )}
                      {/* Page indicator */}
                      <text x={sx + sw / 2} y={contentBot - ibH - 2} textAnchor="middle"
                        fill={theme.fgLight} fontSize="3.5" fontFamily="monospace" opacity="0.5">
                        {page + 1}/{totalPages}
                      </text>
                    </g>
                  )}
                </g>
              )}

              {/* ── INFO BAR (bottom, main menu only) ── */}
              {showInfoBar && (
                <g>
                  <rect x={sx} y={sy + sh - ibH} width={sw} height={ibH} fill={theme.bgDarker} />
                  <rect x={sx} y={sy + sh - 2} width={sw} height="2" fill={theme.bgDarker} rx="2" />
                  <text x={sx + 3} y={sy + sh - ibH / 2 + 1} fill={theme.fgMedium} fontSize="4.5"
                    fontFamily="monospace" dominantBaseline="middle">v2.4.0</text>
                  <text x={sx + sw - 3} y={sy + sh - ibH / 2 + 1} fill={theme.fgMedium} fontSize="4.5"
                    fontFamily="monospace" textAnchor="end" dominantBaseline="middle">
                    {new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })} {new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                  </text>
                </g>
              )}
            </g>
          )}

          {/* Power-off overlay */}
          {!powerOn && !powerTransition && (
            <rect x={sx} y={sy} width={sw} height={sh} rx="2" fill="#020202" />
          )}

          {/* Shutdown animation */}
          {powerTransition === 'shutting-down' && (
            <g>
              <rect x={sx} y={sy} width={sw} height={sh} rx="2" fill="#020202">
                <animate attributeName="opacity" from="0" to="1" dur="0.6s" fill="freeze" />
              </rect>
              <line x1={sx + 12} y1={sy + sh / 2} x2={sx + sw - 12} y2={sy + sh / 2} stroke="#fff" strokeWidth="1">
                <animate attributeName="opacity" values="0;0.8;0.6;0" dur="0.8s" fill="freeze" />
              </line>
            </g>
          )}

          {/* Boot animation */}
          {powerTransition === 'booting' && (
            <g>
              <rect x={sx} y={sy} width={sw} height={sh} rx="2" fill="#020202">
                <animate attributeName="opacity" from="1" to="0" dur="1.4s" fill="freeze" />
              </rect>
              <text x={sx + sw / 2} y={sy + sh / 2 - 6} textAnchor="middle" fill={theme.statusActive} fontSize="8" fontFamily="monospace" fontWeight="bold">
                MAYHEM
                <animate attributeName="opacity" values="0;1;1;0" dur="1.4s" fill="freeze" />
              </text>
              <text x={sx + sw / 2} y={sy + sh / 2 + 6} textAnchor="middle" fill={theme.fgLight} fontSize="5" fontFamily="monospace">
                Loading...
                <animate attributeName="opacity" values="0;0;0.5;0" dur="1.4s" fill="freeze" />
              </text>
            </g>
          )}

          {/* MIC/EXT notification overlay on screen */}
          {micNotify && powerOn && (
            <g>
              <rect x={sx + sw * 0.1} y={sy + sh * 0.4} width={sw * 0.8} height={sh * 0.2}
                rx="3" fill="#000" fillOpacity="0.9" stroke={theme.statusActive} strokeWidth="0.5" />
              <text x={sx + sw / 2} y={sy + sh * 0.47} textAnchor="middle" dominantBaseline="middle"
                fill={theme.statusActive} fontSize="5" fontFamily="monospace" fontWeight="bold">
                {micMode ? 'MIC: Internal' : 'MIC: External (3.5mm)'}
              </text>
              <text x={sx + sw / 2} y={sy + sh * 0.54} textAnchor="middle" dominantBaseline="middle"
                fill={theme.fgLight} fontSize="4" fontFamily="monospace">
                {micMode ? 'Using built-in board microphone' : 'Using 3.5mm jack line input'}
              </text>
            </g>
          )}

          {/* ── HARDWARE ZONES ── */}

          {/* DFU button */}
          <g {...hw('dfu')} style={{ ...hw('dfu').style, filter: glow('dfu', '#60a5fa') }}>
            <rect x={bx + bw - 68} y={by - 14} width="26" height="20" rx="0" fill="transparent" />
            <rect x={bx + bw - 64} y={by - 8} width="18" height="10" rx="3" fill={active === 'dfu' ? '#93c5fd' : '#60a5fa'}
              stroke={st('dfu', '#bfdbfe', '#93c5fd')} strokeWidth="0.8" />
            <text x={bx + bw - 55} y={by - 1} textAnchor="middle" fill="#000" fontSize="5" fontWeight="bold" dominantBaseline="middle">DFU</text>
          </g>

          {/* RESET button */}
          <g {...hw('reset')} style={{ ...hw('reset').style, filter: glow('reset', '#60a5fa') }}>
            <rect x={bx + bw - 42} y={by - 14} width="26" height="20" rx="0" fill="transparent" />
            <rect x={bx + bw - 38} y={by - 8} width="18" height="10" rx="3" fill={active === 'reset' ? '#93c5fd' : '#60a5fa'}
              stroke={st('reset', '#bfdbfe', '#93c5fd')} strokeWidth="0.8" />
            <text x={bx + bw - 29} y={by - 1} textAnchor="middle" fill="#000" fontSize="5" fontWeight="bold" dominantBaseline="middle">RST</text>
          </g>

          {/* MicroSD slot */}
          <g {...hw('sd')} style={{ ...hw('sd').style, filter: glow('sd', '#4ade80') }}>
            <rect x={bx + bw - 55} y={by + 6} width="24" height="3" rx="1" fill={active === 'sd' ? '#4ade80' : '#555'}
              stroke={st('sd', '#4ade80', '#777')} strokeWidth="0.8" />
          </g>

          {/* Power toggle switch */}
          {(() => { const rbcx = sx + sw + (bx + bw - sx - sw) / 2; return (
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

          {/* MIC/EXT switch */}
          {(() => { const lbcx = (bx + sx) / 2; return (
          <g style={{ cursor: 'pointer' }}
            onMouseEnter={() => setActive('mic')}
            onMouseLeave={() => setActive(null)}
            onClick={() => {
              setMicMode(m => {
                const next = !m;
                setMicNotify(next ? 'Internal Microphone' : 'External Mic (3.5mm)');
                setTimeout(() => setMicNotify(null), 2000);
                return next;
              });
            }}>
            <rect x={lbcx - 3.5} y={sy + sh / 2 - 12} width="7" height="24" rx="3.5" fill="#111"
              stroke={active === 'mic' ? '#4ade80' : '#444'} strokeWidth="0.8"
              style={{ filter: active === 'mic' ? 'drop-shadow(0 0 6px #4ade80)' : 'none' }} />
            <rect x={lbcx - 2} y={sy + sh / 2 - 8} width="4" height="10" rx="2" fill="#e0e0e0"
              style={{ transform: `translateY(${micMode ? 0 : 10}px)`, transition: 'transform 0.2s ease' }} />
            <text x={lbcx} y={sy + sh / 2 - 16} fill={micMode ? '#e0e0e0' : '#444'} fontSize="4" fontFamily="monospace" textAnchor="middle"
              style={{ transition: 'fill 0.2s' }}>MIC</text>
            <text x={lbcx} y={sy + sh / 2 + 20} fill={!micMode ? '#e0e0e0' : '#444'} fontSize="4" fontFamily="monospace" textAnchor="middle"
              style={{ transition: 'fill 0.2s' }}>EXT</text>
          </g>
          ); })()}

          {/* GPIO port */}
          <g {...hw('gpio')} style={{ ...hw('gpio').style, filter: glow('gpio', '#facc15') }}>
            <rect x={bx - 4} y={sy + 20} width="6" height="50" rx="1.5" fill={active === 'gpio' ? '#1a1a1a' : '#0a0a0a'}
              stroke={st('gpio', '#facc15', '#222')} strokeWidth="0.8" />
          </g>

          {/* ── CLICK WHEEL ── */}
          <circle cx={wcx} cy={wcy} r={wr} fill="#080808" stroke="#222" strokeWidth="1.5" />
          <circle cx={wcx} cy={wcy} r={wr - 2} fill="none" stroke="#151515" strokeWidth="0.5" />
          <circle cx={wcx} cy={wcy} r={wr - 6} fill="none" stroke="#1a1a1a" strokeWidth="0.8" />
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 15) * Math.PI / 180;
            const dotR = wr - 12;
            return <circle key={`dot-${i}`} cx={wcx + Math.sin(angle) * dotR} cy={wcy - Math.cos(angle) * dotR} r="1" fill="#1a1a1a" />;
          })}
          <circle cx={wcx} cy={wcy} r={wr - 18} fill="none" stroke="#1a1a1a" strokeWidth="0.8" />

          {/* D-pad: UP */}
          <g onClick={() => navigate('up')} style={{ cursor: 'pointer' }}
            onMouseEnter={() => setHovBtn('up')} onMouseLeave={() => setHovBtn(null)}
            onMouseDown={() => setPressBtn('up')} onMouseUp={() => setPressBtn(null)}>
            <circle cx={wcx} cy={wcy - 28} r="12" fill={hovBtn === 'up' ? '#7fff0008' : 'transparent'} />
            <polygon points={`${wcx},${wcy - 34} ${wcx - 7},${wcy - 22} ${wcx + 7},${wcy - 22}`}
              fill={pressBtn === 'up' ? '#7fff00' : hovBtn === 'up' ? '#7fff00' : '#444'}
              opacity={pressBtn === 'up' ? 1 : hovBtn === 'up' ? 0.9 : 0.6}
              style={{ filter: hovBtn === 'up' ? 'drop-shadow(0 0 4px #7fff0060)' : 'none', transition: 'fill 0.12s, opacity 0.12s', transform: pressBtn === 'up' ? 'translateY(1px)' : 'none', transformOrigin: `${wcx}px ${wcy - 28}px` }} />
          </g>
          {/* D-pad: DOWN */}
          <g onClick={() => navigate('down')} style={{ cursor: 'pointer' }}
            onMouseEnter={() => setHovBtn('down')} onMouseLeave={() => setHovBtn(null)}
            onMouseDown={() => setPressBtn('down')} onMouseUp={() => setPressBtn(null)}>
            <circle cx={wcx} cy={wcy + 28} r="12" fill={hovBtn === 'down' ? '#7fff0008' : 'transparent'} />
            <polygon points={`${wcx},${wcy + 34} ${wcx - 7},${wcy + 22} ${wcx + 7},${wcy + 22}`}
              fill={pressBtn === 'down' ? '#7fff00' : hovBtn === 'down' ? '#7fff00' : '#444'}
              opacity={pressBtn === 'down' ? 1 : hovBtn === 'down' ? 0.9 : 0.6}
              style={{ filter: hovBtn === 'down' ? 'drop-shadow(0 0 4px #7fff0060)' : 'none', transition: 'fill 0.12s, opacity 0.12s', transform: pressBtn === 'down' ? 'translateY(-1px)' : 'none', transformOrigin: `${wcx}px ${wcy + 28}px` }} />
          </g>
          {/* D-pad: LEFT (grid navigate left) */}
          <g onClick={() => navigate('left')} style={{ cursor: 'pointer' }}
            onMouseEnter={() => setHovBtn('left')} onMouseLeave={() => setHovBtn(null)}
            onMouseDown={() => setPressBtn('left')} onMouseUp={() => setPressBtn(null)}>
            <circle cx={wcx - 28} cy={wcy} r="12" fill={hovBtn === 'left' ? '#7fff0008' : 'transparent'} />
            <polygon points={`${wcx - 34},${wcy} ${wcx - 22},${wcy - 7} ${wcx - 22},${wcy + 7}`}
              fill={pressBtn === 'left' ? '#7fff00' : hovBtn === 'left' ? '#7fff00' : '#444'}
              opacity={pressBtn === 'left' ? 1 : hovBtn === 'left' ? 0.9 : 0.6}
              style={{ filter: hovBtn === 'left' ? 'drop-shadow(0 0 4px #7fff0060)' : 'none', transition: 'fill 0.12s, opacity 0.12s', transform: pressBtn === 'left' ? 'translateX(1px)' : 'none', transformOrigin: `${wcx - 28}px ${wcy}px` }} />
          </g>
          {/* D-pad: RIGHT (grid navigate right) */}
          <g onClick={() => navigate('right')} style={{ cursor: 'pointer' }}
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

          {/* USB-C */}
          <g {...hw('usbc')} style={{ ...hw('usbc').style, filter: glow('usbc', '#4ade80') }}>
            <rect x={bx + bw - 52} y={by + bh - 6} width="20" height="7" rx="3" fill={active === 'usbc' ? '#4ade80' : '#555'}
              stroke={st('usbc', '#4ade80', '#777')} strokeWidth="0.8" />
          </g>

          {/* 3.5mm audio jack */}
          <g {...hw('audio')} style={{ ...hw('audio').style, filter: glow('audio', '#4ade80') }}>
            <circle cx={bx + bw - 20} cy={by + bh - 3} r="4.5" fill={active === 'audio' ? '#4ade80' : '#555'}
              stroke={st('audio', '#4ade80', '#777')} strokeWidth="0.8" />
          </g>

          {/* Title bar icon tooltip overlay (inside SVG, near left bezel) */}
          {hoveredIcon && powerOn && !powerTransition && (
            <g>
              <rect x={sx - 2} y={sy + tbH + 4} width={sw + 4} height={sh * 0.28}
                rx="3" fill="#000" fillOpacity="0.95" stroke={theme.fgLight} strokeWidth="0.4" />
              <text x={sx + 4} y={sy + tbH + 14} fill={theme.statusActive} fontSize="5.5"
                fontFamily="monospace" fontWeight="bold">{hoveredIcon.label}</text>
              {hoveredIcon.type === 'toggle' && (
                <text x={sx + sw - 4} y={sy + tbH + 14} fill={theme.fgLight} fontSize="4"
                  fontFamily="monospace" textAnchor="end" opacity="0.6">[toggle]</text>
              )}
              {/* Wrap description manually into lines */}
              {wrapText(hoveredIcon.desc, 34).slice(0, 4).map((line, i) => (
                <text key={i} x={sx + 4} y={sy + tbH + 24 + i * 8} fill={theme.fgLight} fontSize="4"
                  fontFamily="monospace" opacity="0.7">{line}</text>
              ))}
            </g>
          )}

        </svg>

        {/* Keyboard hints (static, no layout shift) */}
        {expanded && (
          <div className="mt-2 h-6">
            <div className="flex items-center gap-2 flex-wrap">
              <kbd className="kbd kbd-xs bg-base-300 border-base-content/10">WASD</kbd>
              <span className="text-[10px] text-base-content/30">or</span>
              <kbd className="kbd kbd-xs bg-base-300 border-base-content/10">{'\u2191\u2193\u2190\u2192'}</kbd>
              <span className="text-[10px] text-base-content/30">{t('controls.simMove', 'Move')}</span>
              <kbd className="kbd kbd-xs bg-base-300 border-base-content/10">Enter</kbd>
              <span className="text-[10px] text-base-content/30">{t('controls.simOpen', 'Open')}</span>
              <kbd className="kbd kbd-xs bg-base-300 border-base-content/10">Esc</kbd>
              <span className="text-[10px] text-base-content/30">{t('controls.simBack', 'Back')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Right panel */}
      {expanded ? (
        <div className="flex-1 min-w-0">
          <ContextPanel
            menuId={currentMenuId}
            highlightedItem={pageItems[cursor]}
            activeHardwareId={active}
            breadcrumb={stack}
            hoveredIcon={hoveredIcon}
          />
        </div>
      ) : null}
    </div>
  );
}
