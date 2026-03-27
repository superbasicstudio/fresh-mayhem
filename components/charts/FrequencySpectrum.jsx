import { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import * as d3 from 'd3';
import { rxBands, noGoBands, legalBands, categoryColors } from '../../data/frequencyMap';

const MARGIN = { top: 30, right: 20, bottom: 40, left: 20 };
const ROW_H = 22;
const FULL_DOMAIN = [1, 6000];

function formatFreq(mhz) {
  if (mhz >= 1000) return `${(mhz / 1000).toFixed(mhz % 1000 === 0 ? 0 : 1)} GHz`;
  return `${mhz} MHz`;
}

function generateTicks(dMin, dMax) {
  const all = [0.5, 1, 2, 5, 10, 20, 50, 100, 150, 200, 300, 400, 500, 700, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 6000];
  const vis = all.filter(t => t >= dMin && t <= dMax);
  if (vis.length < 3) {
    const step = (dMax - dMin) / 5;
    return Array.from({ length: 6 }, (_, i) => dMin + step * i).filter(t => t > 0);
  }
  if (vis.length > 12) return vis.filter((_, i) => i % 2 === 0);
  return vis;
}

export default function FrequencySpectrum() {
  const { t } = useTranslation();
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const [layers, setLayers] = useState({ nogo: true, legal: true, rx: true });
  const [width, setWidth] = useState(800);
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
    const useLog = domain[1] / domain[0] > 20;
    const x = useLog
      ? d3.scaleLog().domain(domain).range([0, innerW]).clamp(true)
      : d3.scaleLinear().domain(domain).range([0, innerW]).clamp(true);

    const specificRx = rxBands.filter(b => !b.wide);
    const nogoH = layers.nogo ? ROW_H : 0;
    const legalH = layers.legal ? ROW_H : 0;
    const rxH = layers.rx ? specificRx.length * 8 + 14 : 0;
    const totalH = MARGIN.top + nogoH + legalH + rxH + MARGIN.bottom + 10;

    svg.attr('width', width).attr('height', totalH);
    const g = svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

    // Background
    g.append('rect')
      .attr('x', 0).attr('y', 0)
      .attr('width', innerW).attr('height', nogoH + legalH + rxH)
      .attr('fill', '#1e1e1e').attr('rx', 3);

    // Axis
    const ticks = generateTicks(domain[0], domain[1]);
    const axis = d3.axisBottom(x).tickValues(ticks).tickFormat(d => formatFreq(d));
    g.append('g')
      .attr('transform', `translate(0,${nogoH + legalH + rxH + 4})`)
      .call(axis)
      .selectAll('text').attr('fill', '#888').style('font-size', '10px').style('font-family', 'monospace');
    g.selectAll('.domain, .tick line').attr('stroke', '#333');

    // Grid
    ticks.forEach(t => {
      if (t < domain[0] || t > domain[1]) return;
      g.append('line')
        .attr('x1', x(t)).attr('x2', x(t))
        .attr('y1', 0).attr('y2', nogoH + legalH + rxH)
        .attr('stroke', '#282828').attr('stroke-dasharray', '2,3');
    });

    const tooltip = d3.select(tooltipRef.current);
    const content = g.append('g');
    let yOff = 0;

    if (layers.nogo) {
      g.append('text').attr('x', -2).attr('y', yOff + 14).text(t('spectrum.restrictedTx').toUpperCase())
        .attr('fill', '#f43f5e').style('font-size', '9px').style('font-weight', 'bold').style('font-family', 'monospace');
      noGoBands.forEach(b => {
        if (b.endMHz < domain[0] || b.startMHz > domain[1]) return;
        const bx = x(Math.max(b.startMHz, domain[0]));
        const bw = Math.max(x(Math.min(b.endMHz, domain[1])) - bx, 2);
        content.append('rect')
          .attr('x', bx).attr('y', yOff + 2).attr('width', bw).attr('height', ROW_H - 4)
          .attr('fill', '#f43f5e').attr('opacity', 0.7).attr('rx', 1)
          .style('cursor', 'pointer')
          .on('mouseenter', function (e) {
            d3.select(this).attr('opacity', 1);
            tooltip.style('opacity', 1)
              .html(`<strong style="color:#f43f5e">${b.name}</strong><br/><span style="font-family:monospace">${formatFreq(b.startMHz)} – ${formatFreq(b.endMHz)}</span><br/><span style="opacity:0.6">${b.service}</span><br/><span style="opacity:0.4;font-size:9px">Click to zoom</span>`)
              .style('left', `${Math.min(e.offsetX + 10, width - 200)}px`).style('top', `${e.offsetY - 60}px`);
          })
          .on('mouseleave', function () { d3.select(this).attr('opacity', 0.7); tooltip.style('opacity', 0); })
          .on('click', () => zoomToBand(b.startMHz, b.endMHz));
        if (bw > 30) {
          content.append('text')
            .attr('x', bx + bw / 2).attr('y', yOff + ROW_H / 2 + 2)
            .text(b.name.replace('Aviation ', '').replace('Cellular ', 'Cell '))
            .attr('fill', '#fff').attr('text-anchor', 'middle')
            .style('font-size', '7px').style('font-family', 'monospace').style('pointer-events', 'none');
        }
      });
      yOff += ROW_H;
    }

    if (layers.legal) {
      g.append('text').attr('x', -2).attr('y', yOff + 14).text(t('spectrum.ismTx').toUpperCase())
        .attr('fill', '#4ade80').style('font-size', '9px').style('font-weight', 'bold').style('font-family', 'monospace');
      legalBands.forEach(b => {
        if (b.endMHz < domain[0] || b.startMHz > domain[1]) return;
        const bx = x(Math.max(b.startMHz, domain[0]));
        const bw = Math.max(x(Math.min(b.endMHz, domain[1])) - bx, 2);
        content.append('rect')
          .attr('x', bx).attr('y', yOff + 2).attr('width', bw).attr('height', ROW_H - 4)
          .attr('fill', '#4ade80').attr('opacity', 0.7).attr('rx', 1)
          .style('cursor', 'pointer')
          .on('mouseenter', function (e) {
            d3.select(this).attr('opacity', 1);
            tooltip.style('opacity', 1)
              .html(`<strong style="color:#4ade80">${b.name}</strong><br/><span style="font-family:monospace">${formatFreq(b.startMHz)} – ${formatFreq(b.endMHz)}</span><br/><span style="opacity:0.6">${b.requirements}</span><br/><span style="opacity:0.4;font-size:9px">Click to zoom</span>`)
              .style('left', `${Math.min(e.offsetX + 10, width - 200)}px`).style('top', `${e.offsetY - 60}px`);
          })
          .on('mouseleave', function () { d3.select(this).attr('opacity', 0.7); tooltip.style('opacity', 0); })
          .on('click', () => zoomToBand(b.startMHz, b.endMHz));
        if (bw > 30) {
          content.append('text')
            .attr('x', bx + bw / 2).attr('y', yOff + ROW_H / 2 + 2)
            .text(b.name.replace('ISM ', ''))
            .attr('fill', '#000').attr('text-anchor', 'middle')
            .style('font-size', '7px').style('font-family', 'monospace').style('font-weight', 'bold').style('pointer-events', 'none');
        }
      });
      yOff += ROW_H;
    }

    if (layers.rx) {
      g.append('text').attr('x', -2).attr('y', yOff + 10).text(t('spectrum.rxApps').toUpperCase())
        .attr('fill', '#7fff00').style('font-size', '9px').style('font-weight', 'bold').style('font-family', 'monospace');
      yOff += 14;
      specificRx.forEach((b, i) => {
        if (b.endMHz < domain[0] || b.startMHz > domain[1]) return;
        const bx = x(Math.max(b.startMHz, domain[0]));
        const bw = Math.max(x(Math.min(b.endMHz, domain[1])) - bx, 3);
        const color = categoryColors[b.category] || '#666';
        content.append('rect')
          .attr('x', bx).attr('y', yOff + i * 8).attr('width', bw).attr('height', 6)
          .attr('fill', color).attr('opacity', 0.85).attr('rx', 1)
          .style('cursor', 'pointer')
          .on('mouseenter', function (e) {
            d3.select(this).attr('opacity', 1).attr('height', 8).attr('y', yOff + i * 8 - 1);
            tooltip.style('opacity', 1)
              .html(`<strong style="color:${color}">${b.app}</strong><br/><span style="font-family:monospace">${formatFreq(b.startMHz)} – ${formatFreq(b.endMHz)}</span><br/><span style="opacity:0.6">${b.category}</span><br/><span style="opacity:0.4;font-size:9px">Click to zoom</span>`)
              .style('left', `${Math.min(e.offsetX + 10, width - 200)}px`).style('top', `${e.offsetY - 60}px`);
          })
          .on('mouseleave', function () { d3.select(this).attr('opacity', 0.85).attr('height', 6).attr('y', yOff + i * 8); tooltip.style('opacity', 0); })
          .on('click', () => zoomToBand(b.startMHz, b.endMHz));
        if (bw > 25) {
          content.append('text')
            .attr('x', bx + bw / 2).attr('y', yOff + i * 8 + 5)
            .text(b.app)
            .attr('fill', '#fff').attr('text-anchor', 'middle')
            .style('font-size', '6px').style('font-family', 'monospace').style('pointer-events', 'none');
        }
      });
    }

    // D3 zoom
    const baseScale = useLog
      ? d3.scaleLog().domain(FULL_DOMAIN).range([0, innerW])
      : d3.scaleLinear().domain(FULL_DOMAIN).range([0, innerW]);
    const zoom = d3.zoom()
      .scaleExtent([1, 100])
      .translateExtent([[0, 0], [innerW, totalH]])
      .on('zoom', (event) => {
        const newX = event.transform.rescaleX(baseScale);
        const nd = newX.domain();
        setDomain([Math.max(0.5, nd[0]), Math.min(6500, nd[1])]);
      });
    svg.call(zoom).on('dblclick.zoom', null);

  }, [width, layers, domain, zoomToBand]);

  const toggle = (k) => setLayers(l => ({ ...l, [k]: !l[k] }));

  return (
    <div className="mb-4">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <button className={`btn btn-xs !text-black ${layers.nogo ? 'btn-error' : 'btn-ghost !text-base-content'}`} onClick={() => toggle('nogo')} aria-pressed={layers.nogo}>{t('spectrum.restrictedTx')}</button>
        <button className={`btn btn-xs !text-black ${layers.legal ? 'btn-success' : 'btn-ghost !text-base-content'}`} onClick={() => toggle('legal')} aria-pressed={layers.legal}>{t('spectrum.ismTx')}</button>
        <button className={`btn btn-xs !text-black ${layers.rx ? 'btn-info' : 'btn-ghost !text-base-content'}`} onClick={() => toggle('rx')} aria-pressed={layers.rx}>{t('spectrum.rxApps')}</button>
        {isZoomed && (
          <>
            <button onClick={resetZoom} className="badge badge-ghost badge-sm font-mono text-[10px] cursor-pointer hover:bg-base-300">{t('spectrum.resetZoom')}</button>
            <span className="text-[10px] font-mono text-primary/60">{formatFreq(domain[0])} – {formatFreq(domain[1])}</span>
          </>
        )}
      </div>
      <p className="text-[10px] text-base-content/30 font-mono mb-1">{t('spectrum.scrollHint')}</p>
      <div className="relative overflow-hidden rounded-lg">
        <svg ref={svgRef} className="w-full" role="img" aria-label="RF spectrum coverage chart from 1 MHz to 6 GHz" />
        <div ref={tooltipRef} className="absolute bg-base-300 border border-base-content/10 text-xs p-2.5 rounded-lg pointer-events-none transition-opacity shadow-lg z-10" style={{ opacity: 0, maxWidth: 220 }} />
      </div>
      <p className="text-[10px] text-base-content/30 mt-2">{t('spectrum.omitted')}</p>
    </div>
  );
}
