import { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import * as d3 from 'd3';
import { noGoBands, legalBands } from '../../data/frequencyMap';

const MARGIN = { top: 10, right: 16, bottom: 32, left: 16 };
const BAR_H = 48;
const GAP = 8;
const LABEL_H = 20;
const FULL_DOMAIN = [1, 6000];

function formatFreq(mhz) {
  if (mhz >= 1000) return `${(mhz / 1000).toFixed(mhz % 1000 === 0 ? 0 : 1)} GHz`;
  if (mhz < 1) return `${(mhz * 1000).toFixed(0)} kHz`;
  return `${mhz} MHz`;
}

function generateTicks(domainMin, domainMax) {
  const allTicks = [0.5, 1, 2, 5, 10, 20, 50, 100, 150, 200, 300, 400, 500, 700, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 6000];
  const visible = allTicks.filter(t => t >= domainMin && t <= domainMax);
  if (visible.length < 3) {
    const step = (domainMax - domainMin) / 5;
    const gen = [];
    for (let i = 0; i <= 5; i++) gen.push(domainMin + step * i);
    return gen.filter(t => t > 0);
  }
  if (visible.length > 12) return visible.filter((_, i) => i % 2 === 0);
  return visible;
}

export default function BandMap() {
  const { t } = useTranslation();
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const [width, setWidth] = useState(900);
  const [domain, setDomain] = useState(FULL_DOMAIN);
  const isZoomed = domain[0] !== FULL_DOMAIN[0] || domain[1] !== FULL_DOMAIN[1];

  useEffect(() => {
    const obs = new ResizeObserver(entries => {
      for (const e of entries) setWidth(e.contentRect.width);
    });
    if (svgRef.current?.parentElement) obs.observe(svgRef.current.parentElement);
    return () => obs.disconnect();
  }, []);

  const zoomToBand = useCallback((startMHz, endMHz) => {
    const range = endMHz - startMHz;
    const padding = Math.max(range * 2, 10);
    setDomain([Math.max(0.5, startMHz - padding), Math.min(6500, endMHz + padding)]);
  }, []);

  const resetZoom = useCallback(() => setDomain(FULL_DOMAIN), []);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const innerW = width - MARGIN.left - MARGIN.right;
    const totalH = MARGIN.top + LABEL_H + BAR_H + GAP + LABEL_H + BAR_H + MARGIN.bottom;
    svg.attr('width', width).attr('height', totalH);

    const g = svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

    // Use log scale for full view, linear when zoomed in tight
    const useLog = domain[1] / domain[0] > 20;
    const x = useLog
      ? d3.scaleLog().domain(domain).range([0, innerW]).clamp(true)
      : d3.scaleLinear().domain(domain).range([0, innerW]).clamp(true);

    // Clip path to prevent overflow
    svg.append('defs').append('clipPath').attr('id', 'band-clip')
      .append('rect').attr('width', innerW).attr('height', totalH - MARGIN.top - MARGIN.bottom);

    // Background
    g.append('rect')
      .attr('x', 0).attr('y', 0)
      .attr('width', innerW).attr('height', LABEL_H + BAR_H + GAP + LABEL_H + BAR_H)
      .attr('fill', '#111').attr('rx', 4);

    // Axis
    const ticks = generateTicks(domain[0], domain[1]);
    const axis = d3.axisBottom(x).tickValues(ticks).tickFormat(d => formatFreq(d));
    g.append('g')
      .attr('transform', `translate(0,${LABEL_H + BAR_H + GAP + LABEL_H + BAR_H + 4})`)
      .call(axis)
      .selectAll('text').attr('fill', '#666').style('font-size', '9px').style('font-family', 'monospace');
    g.selectAll('.domain, .tick line').attr('stroke', '#333');

    // Grid lines
    ticks.forEach(t => {
      if (t < domain[0] || t > domain[1]) return;
      g.append('line')
        .attr('x1', x(t)).attr('x2', x(t))
        .attr('y1', 0).attr('y2', LABEL_H + BAR_H + GAP + LABEL_H + BAR_H)
        .attr('stroke', '#222').attr('stroke-dasharray', '2,3');
    });

    const tooltip = d3.select(tooltipRef.current);
    const content = g.append('g').attr('clip-path', 'url(#band-clip)');

    // ── Row 1: No-Go bands ──
    const nogoY = LABEL_H;
    g.append('text').attr('x', 4).attr('y', 11)
      .text(t('bandMap.restrictedLabel')).attr('fill', '#f43f5e')
      .style('font-size', '9px').style('font-weight', 'bold').style('font-family', 'monospace').style('letter-spacing', '0.05em');

    noGoBands.forEach(b => {
      if (b.endMHz < domain[0] || b.startMHz > domain[1]) return;
      const bx = x(Math.max(b.startMHz, domain[0]));
      const bEnd = x(Math.min(b.endMHz, domain[1]));
      const bw = Math.max(bEnd - bx, 3);
      content.append('rect')
        .attr('x', bx).attr('y', nogoY).attr('width', bw).attr('height', BAR_H)
        .attr('fill', '#f43f5e').attr('opacity', 0.6).attr('rx', 2)
        .style('cursor', 'pointer')
        .on('mouseenter', function (e) {
          d3.select(this).attr('opacity', 1);
          tooltip.style('opacity', 1)
            .html(`<strong style="color:#f43f5e">${b.name}</strong><br/><span style="font-family:monospace">${formatFreq(b.startMHz)} - ${formatFreq(b.endMHz)}</span><br/><span style="opacity:0.6">${b.service}</span><br/><span style="color:#f43f5e;font-size:10px">${t('bandMap.doNotTransmit')}</span><br/><span style="opacity:0.5;font-size:9px">${t('bandMap.listeningPermitted')}</span><br/><span style="opacity:0.4;font-size:9px">${t('bandMap.clickToZoom')}</span>`)
            .style('left', `${Math.min(e.offsetX + 12, width - 220)}px`)
            .style('top', `${e.offsetY - 80}px`);
        })
        .on('mouseleave', function () {
          d3.select(this).attr('opacity', 0.6);
          tooltip.style('opacity', 0);
        })
        .on('click', () => zoomToBand(b.startMHz, b.endMHz));

      if (bw > 35) {
        content.append('text')
          .attr('x', bx + bw / 2).attr('y', nogoY + BAR_H / 2 + 3)
          .text(b.name.replace('Aviation ', '').replace('Cellular ', 'Cell ').replace('Radar ', ''))
          .attr('fill', '#000').attr('text-anchor', 'middle')
          .style('font-size', '7px').style('font-family', 'monospace')
          .style('pointer-events', 'none');
      }
    });

    // ── Row 2: ISM bands ──
    const legalY = LABEL_H + BAR_H + GAP + LABEL_H;
    g.append('text').attr('x', 4).attr('y', LABEL_H + BAR_H + GAP + 11)
      .text(t('bandMap.ismLabel')).attr('fill', '#4ade80')
      .style('font-size', '9px').style('font-weight', 'bold').style('font-family', 'monospace').style('letter-spacing', '0.05em');

    legalBands.forEach(b => {
      if (b.endMHz < domain[0] || b.startMHz > domain[1]) return;
      const bx = x(Math.max(b.startMHz, domain[0]));
      const bEnd = x(Math.min(b.endMHz, domain[1]));
      const bw = Math.max(bEnd - bx, 3);
      content.append('rect')
        .attr('x', bx).attr('y', legalY).attr('width', bw).attr('height', BAR_H)
        .attr('fill', '#4ade80').attr('opacity', 0.5).attr('rx', 2)
        .style('cursor', 'pointer')
        .on('mouseenter', function (e) {
          d3.select(this).attr('opacity', 1);
          tooltip.style('opacity', 1)
            .html(`<strong style="color:#4ade80">${b.name}</strong><br/><span style="font-family:monospace">${formatFreq(b.startMHz)} - ${formatFreq(b.endMHz)}</span><br/><span style="opacity:0.6">${b.requirements}</span><br/><span style="color:#4ade80;font-size:10px">${t('bandMap.ismConditions')}</span><br/><span style="opacity:0.4;font-size:9px">${t('bandMap.clickToZoom')}</span>`)
            .style('left', `${Math.min(e.offsetX + 12, width - 220)}px`)
            .style('top', `${e.offsetY - 80}px`);
        })
        .on('mouseleave', function () {
          d3.select(this).attr('opacity', 0.5);
          tooltip.style('opacity', 0);
        })
        .on('click', () => zoomToBand(b.startMHz, b.endMHz));

      if (bw > 35) {
        content.append('text')
          .attr('x', bx + bw / 2).attr('y', legalY + BAR_H / 2 + 3)
          .text(b.name.replace('ISM ', ''))
          .attr('fill', '#000').attr('text-anchor', 'middle')
          .style('font-size', '7px').style('font-family', 'monospace').style('font-weight', 'bold')
          .style('pointer-events', 'none');
      }
    });

    // ── Overlap indicators ──
    legalBands.forEach(lb => {
      noGoBands.forEach(nb => {
        const overlapStart = Math.max(lb.startMHz, nb.startMHz);
        const overlapEnd = Math.min(lb.endMHz, nb.endMHz);
        if (overlapStart < overlapEnd) {
          if (overlapEnd < domain[0] || overlapStart > domain[1]) return;
          const ox = x(Math.max(overlapStart, domain[0]));
          const ow = Math.max(x(Math.min(overlapEnd, domain[1])) - ox, 2);
          content.append('rect')
            .attr('x', ox).attr('y', nogoY).attr('width', ow).attr('height', BAR_H)
            .attr('fill', '#facc15').attr('opacity', 0.3).attr('rx', 1)
            .style('pointer-events', 'none');
        }
      });
    });

    // ── D3 zoom behavior (scroll to zoom, drag to pan) ──
    const zoom = d3.zoom()
      .scaleExtent([1, 100])
      .translateExtent([[0, 0], [innerW, totalH]])
      .on('zoom', (event) => {
        const newX = event.transform.rescaleX(
          useLog
            ? d3.scaleLog().domain(FULL_DOMAIN).range([0, innerW])
            : d3.scaleLinear().domain(FULL_DOMAIN).range([0, innerW])
        );
        const newDomain = newX.domain();
        setDomain([Math.max(0.5, newDomain[0]), Math.min(6500, newDomain[1])]);
      });

    svg.call(zoom).on('dblclick.zoom', null);

  }, [width, domain, zoomToBand]);

  return (
    <div className="mt-4 mb-2">
      <h3 className="font-semibold text-sm text-base-content/80 mb-2">{t('bandMap.title')}</h3>
      <p className="text-xs text-base-content/40 mb-3 leading-relaxed" dangerouslySetInnerHTML={{ __html: t('bandMap.description') }} />
      <div className="card bg-error/5 border border-error/20 p-3 mb-3">
        <p className="text-xs text-error/80 leading-relaxed" dangerouslySetInnerHTML={{ __html: t('bandMap.disclaimer') }} />
      </div>
      <div className="flex items-center gap-2 mb-2">
        <p className="text-[10px] text-base-content/30 font-mono">{t('bandMap.scrollHint')}</p>
        {isZoomed && (
          <button
            onClick={resetZoom}
            className="badge badge-ghost badge-sm font-mono text-[10px] cursor-pointer hover:bg-base-300"
          >
            {t('bandMap.resetZoom')}
          </button>
        )}
        {isZoomed && (
          <span className="text-[10px] font-mono text-primary/60">
            {formatFreq(domain[0])} - {formatFreq(domain[1])}
          </span>
        )}
      </div>
      <div className="relative overflow-hidden rounded-lg">
        <svg ref={svgRef} className="w-full" role="img" aria-label="Frequency band map showing no-go and legal TX bands from 1 MHz to 6 GHz" />
        <div ref={tooltipRef} className="absolute bg-base-300 border border-base-content/10 text-xs p-2.5 rounded-lg pointer-events-none transition-opacity shadow-lg z-10" style={{ opacity: 0, maxWidth: 220 }} />
      </div>
    </div>
  );
}
