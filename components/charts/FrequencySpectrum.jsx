import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { rxBands, noGoBands, legalBands, categoryColors } from '../../data/frequencyMap';

const MARGIN = { top: 30, right: 20, bottom: 40, left: 20 };
const ROW_H = 18;
const LEGEND_H = 24;

function formatFreq(mhz) {
  if (mhz >= 1000) return `${(mhz / 1000).toFixed(mhz % 1000 === 0 ? 0 : 1)} GHz`;
  return `${mhz} MHz`;
}

export default function FrequencySpectrum() {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const [layers, setLayers] = useState({ nogo: true, legal: true, rx: true });
  const [width, setWidth] = useState(800);

  useEffect(() => {
    const obs = new ResizeObserver(entries => {
      for (const e of entries) setWidth(e.contentRect.width);
    });
    if (svgRef.current?.parentElement) obs.observe(svgRef.current.parentElement);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const innerW = width - MARGIN.left - MARGIN.right;
    const x = d3.scaleLog().domain([1, 6000]).range([0, innerW]);
    const specificRx = rxBands.filter(b => !b.wide);

    const nogoH = layers.nogo ? ROW_H : 0;
    const legalH = layers.legal ? ROW_H : 0;
    const rxH = layers.rx ? specificRx.length * 6 + 10 : 0;
    const totalH = MARGIN.top + nogoH + legalH + rxH + MARGIN.bottom + LEGEND_H + 10;

    svg.attr('width', width).attr('height', totalH);
    const g = svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

    const ticks = [1, 5, 10, 50, 100, 200, 500, 1000, 2000, 3000, 6000];
    const axis = d3.axisBottom(x).tickValues(ticks).tickFormat(d => formatFreq(d));
    g.append('g')
      .attr('transform', `translate(0,${nogoH + legalH + rxH + 4})`)
      .call(axis)
      .selectAll('text').attr('fill', '#888').style('font-size', '10px');
    g.selectAll('.domain, .tick line').attr('stroke', '#333');

    g.append('rect')
      .attr('x', x(1)).attr('y', 0)
      .attr('width', x(6000) - x(1)).attr('height', nogoH + legalH + rxH)
      .attr('fill', '#1e1e1e').attr('rx', 3);

    const tooltip = d3.select(tooltipRef.current);
    let yOff = 0;

    if (layers.nogo) {
      g.append('text').attr('x', -2).attr('y', yOff + 12).text('NO-GO TX')
        .attr('fill', '#f43f5e').style('font-size', '9px').style('font-weight', 'bold');
      noGoBands.forEach(b => {
        const bx = x(Math.max(b.startMHz, 1));
        const bw = Math.max(x(b.endMHz) - bx, 2);
        g.append('rect')
          .attr('x', bx).attr('y', yOff + 2).attr('width', bw).attr('height', ROW_H - 4)
          .attr('fill', '#f43f5e').attr('opacity', 0.7).attr('rx', 1)
          .style('cursor', 'pointer')
          .on('mouseenter', (e) => {
            tooltip.style('opacity', 1)
              .html(`<strong class="text-error">${b.name}</strong><br/>${formatFreq(b.startMHz)} - ${formatFreq(b.endMHz)}<br/><span style="opacity:0.7">${b.service}</span>`)
              .style('left', `${e.offsetX + 10}px`).style('top', `${e.offsetY - 40}px`);
          })
          .on('mouseleave', () => tooltip.style('opacity', 0));
      });
      yOff += ROW_H;
    }

    if (layers.legal) {
      g.append('text').attr('x', -2).attr('y', yOff + 12).text('LEGAL TX')
        .attr('fill', '#4ade80').style('font-size', '9px').style('font-weight', 'bold');
      legalBands.forEach(b => {
        const bx = x(Math.max(b.startMHz, 1));
        const bw = Math.max(x(b.endMHz) - bx, 2);
        g.append('rect')
          .attr('x', bx).attr('y', yOff + 2).attr('width', bw).attr('height', ROW_H - 4)
          .attr('fill', '#4ade80').attr('opacity', 0.7).attr('rx', 1)
          .style('cursor', 'pointer')
          .on('mouseenter', (e) => {
            tooltip.style('opacity', 1)
              .html(`<strong class="text-success">${b.name}</strong><br/>${formatFreq(b.startMHz)} - ${formatFreq(b.endMHz)}<br/><span style="opacity:0.7">${b.requirements}</span>`)
              .style('left', `${e.offsetX + 10}px`).style('top', `${e.offsetY - 40}px`);
          })
          .on('mouseleave', () => tooltip.style('opacity', 0));
      });
      yOff += ROW_H;
    }

    if (layers.rx) {
      g.append('text').attr('x', -2).attr('y', yOff + 10).text('RX APPS')
        .attr('fill', '#7fff00').style('font-size', '9px').style('font-weight', 'bold');
      yOff += 12;
      specificRx.forEach((b, i) => {
        const bx = x(Math.max(b.startMHz, 1));
        const bw = Math.max(x(b.endMHz) - bx, 3);
        const color = categoryColors[b.category] || '#666';
        g.append('rect')
          .attr('x', bx).attr('y', yOff + i * 6).attr('width', bw).attr('height', 5)
          .attr('fill', color).attr('opacity', 0.85).attr('rx', 1)
          .style('cursor', 'pointer')
          .on('mouseenter', (e) => {
            tooltip.style('opacity', 1)
              .html(`<strong style="color:${color}">${b.app}</strong><br/>${formatFreq(b.startMHz)} - ${formatFreq(b.endMHz)}<br/><span style="opacity:0.7">${b.category}</span>`)
              .style('left', `${e.offsetX + 10}px`).style('top', `${e.offsetY - 40}px`);
          })
          .on('mouseleave', () => tooltip.style('opacity', 0));
      });
    }

  }, [width, layers]);

  const toggle = (k) => setLayers(l => ({ ...l, [k]: !l[k] }));

  return (
    <div className="mb-4">
      <div className="flex gap-2 mb-2">
        <button className={`btn btn-xs ${layers.nogo ? 'btn-error' : 'btn-ghost'}`} onClick={() => toggle('nogo')} aria-pressed={layers.nogo}>No-Go TX</button>
        <button className={`btn btn-xs ${layers.legal ? 'btn-success' : 'btn-ghost'}`} onClick={() => toggle('legal')} aria-pressed={layers.legal}>Legal TX</button>
        <button className={`btn btn-xs ${layers.rx ? 'btn-info' : 'btn-ghost'}`} onClick={() => toggle('rx')} aria-pressed={layers.rx}>RX Apps</button>
      </div>
      <div className="relative overflow-x-auto">
        <svg ref={svgRef} className="w-full" role="img" aria-label="RF spectrum coverage chart from 1 MHz to 6 GHz showing no-go, legal, and RX app frequency bands" />
        <div ref={tooltipRef} className="absolute bg-base-300 text-xs p-2 rounded pointer-events-none transition-opacity" style={{ opacity: 0 }} />
      </div>
      <p className="text-xs text-base-content/50 mt-2">Log scale. Hover bands for details. Wide-range apps (Audio, Scanner, etc.) omitted for clarity.</p>
    </div>
  );
}
