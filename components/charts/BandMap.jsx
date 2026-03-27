import { useRef, useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { noGoBands, legalBands } from '../../data/frequencyMap';

const MARGIN = { top: 10, right: 16, bottom: 32, left: 16 };
const BAR_H = 20;
const GAP = 3;
const LABEL_H = 16;

function formatFreq(mhz) {
  if (mhz >= 1000) return `${(mhz / 1000).toFixed(mhz % 1000 === 0 ? 0 : 1)} GHz`;
  return `${mhz} MHz`;
}

// Merge overlapping ranges for visual grouping
function mergeRanges(bands) {
  const sorted = [...bands].sort((a, b) => a.startMHz - b.startMHz);
  const merged = [];
  for (const b of sorted) {
    const last = merged[merged.length - 1];
    if (last && b.startMHz <= last.endMHz) {
      last.endMHz = Math.max(last.endMHz, b.endMHz);
      last.bands.push(b);
    } else {
      merged.push({ startMHz: b.startMHz, endMHz: b.endMHz, bands: [b] });
    }
  }
  return merged;
}

export default function BandMap() {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const [width, setWidth] = useState(900);
  const [hovered, setHovered] = useState(null);

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

    // Two rows: No-Go and Legal
    const totalH = MARGIN.top + LABEL_H + BAR_H + GAP + LABEL_H + BAR_H + MARGIN.bottom;
    svg.attr('width', width).attr('height', totalH);

    const g = svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

    // Use log scale to show the full 1 MHz - 6 GHz range
    const x = d3.scaleLog().domain([1, 6000]).range([0, innerW]).clamp(true);

    // Background
    g.append('rect')
      .attr('x', 0).attr('y', 0)
      .attr('width', innerW).attr('height', totalH - MARGIN.top - MARGIN.bottom)
      .attr('fill', '#111').attr('rx', 4);

    // Axis
    const ticks = [1, 10, 50, 100, 200, 500, 1000, 2000, 4000, 6000];
    const axis = d3.axisBottom(x).tickValues(ticks).tickFormat(d => formatFreq(d));
    g.append('g')
      .attr('transform', `translate(0,${LABEL_H + BAR_H + GAP + LABEL_H + BAR_H + 4})`)
      .call(axis)
      .selectAll('text').attr('fill', '#666').style('font-size', '9px').style('font-family', 'monospace');
    g.selectAll('.domain, .tick line').attr('stroke', '#333');

    // Grid lines
    ticks.forEach(t => {
      g.append('line')
        .attr('x1', x(t)).attr('x2', x(t))
        .attr('y1', 0).attr('y2', LABEL_H + BAR_H + GAP + LABEL_H + BAR_H)
        .attr('stroke', '#222').attr('stroke-dasharray', '2,3');
    });

    const tooltip = d3.select(tooltipRef.current);

    // ── Row 1: No-Go bands ──
    const nogoY = LABEL_H;
    g.append('text').attr('x', 4).attr('y', 11)
      .text('NO-GO BANDS').attr('fill', '#f43f5e')
      .style('font-size', '9px').style('font-weight', 'bold').style('font-family', 'monospace').style('letter-spacing', '0.05em');

    noGoBands.forEach(b => {
      const bx = x(Math.max(b.startMHz, 1));
      const bw = Math.max(x(b.endMHz) - bx, 3);
      g.append('rect')
        .attr('x', bx).attr('y', nogoY).attr('width', bw).attr('height', BAR_H)
        .attr('fill', '#f43f5e').attr('opacity', 0.6).attr('rx', 2)
        .style('cursor', 'pointer')
        .on('mouseenter', function (e) {
          d3.select(this).attr('opacity', 1);
          tooltip.style('opacity', 1)
            .html(`<strong style="color:#f43f5e">${b.name}</strong><br/><span style="font-family:monospace">${formatFreq(b.startMHz)} – ${formatFreq(b.endMHz)}</span><br/><span style="opacity:0.6">${b.service}</span><br/><span style="color:#f43f5e;font-size:10px">⛔ DO NOT TRANSMIT</span>`)
            .style('left', `${Math.min(e.offsetX + 12, width - 200)}px`)
            .style('top', `${e.offsetY - 70}px`);
        })
        .on('mouseleave', function () {
          d3.select(this).attr('opacity', 0.6);
          tooltip.style('opacity', 0);
        });
      // Label if wide enough
      if (bw > 30) {
        g.append('text')
          .attr('x', bx + bw / 2).attr('y', nogoY + BAR_H / 2 + 3)
          .text(b.name.replace('Aviation ', '').replace('Cellular ', 'Cell '))
          .attr('fill', '#fff').attr('text-anchor', 'middle')
          .style('font-size', '7px').style('font-family', 'monospace')
          .style('pointer-events', 'none');
      }
    });

    // ── Row 2: Legal bands ──
    const legalY = LABEL_H + BAR_H + GAP + LABEL_H;
    g.append('text').attr('x', 4).attr('y', LABEL_H + BAR_H + GAP + 11)
      .text('LEGAL TX BANDS').attr('fill', '#4ade80')
      .style('font-size', '9px').style('font-weight', 'bold').style('font-family', 'monospace').style('letter-spacing', '0.05em');

    legalBands.forEach(b => {
      const bx = x(Math.max(b.startMHz, 1));
      const bw = Math.max(x(b.endMHz) - bx, 3);
      g.append('rect')
        .attr('x', bx).attr('y', legalY).attr('width', bw).attr('height', BAR_H)
        .attr('fill', '#4ade80').attr('opacity', 0.5).attr('rx', 2)
        .style('cursor', 'pointer')
        .on('mouseenter', function (e) {
          d3.select(this).attr('opacity', 1);
          tooltip.style('opacity', 1)
            .html(`<strong style="color:#4ade80">${b.name}</strong><br/><span style="font-family:monospace">${formatFreq(b.startMHz)} – ${formatFreq(b.endMHz)}</span><br/><span style="opacity:0.6">${b.requirements}</span><br/><span style="color:#4ade80;font-size:10px">✓ Legal with conditions</span>`)
            .style('left', `${Math.min(e.offsetX + 12, width - 200)}px`)
            .style('top', `${e.offsetY - 70}px`);
        })
        .on('mouseleave', function () {
          d3.select(this).attr('opacity', 0.5);
          tooltip.style('opacity', 0);
        });
      if (bw > 30) {
        g.append('text')
          .attr('x', bx + bw / 2).attr('y', legalY + BAR_H / 2 + 3)
          .text(b.name.replace('ISM ', ''))
          .attr('fill', '#000').attr('text-anchor', 'middle')
          .style('font-size', '7px').style('font-family', 'monospace').style('font-weight', 'bold')
          .style('pointer-events', 'none');
      }
    });

    // ── Overlap indicators ──
    // Show where legal bands fall within or near no-go bands
    legalBands.forEach(lb => {
      noGoBands.forEach(nb => {
        const overlapStart = Math.max(lb.startMHz, nb.startMHz);
        const overlapEnd = Math.min(lb.endMHz, nb.endMHz);
        if (overlapStart < overlapEnd) {
          const ox = x(overlapStart);
          const ow = Math.max(x(overlapEnd) - ox, 2);
          // Draw a hatched warning in no-go row
          g.append('rect')
            .attr('x', ox).attr('y', nogoY).attr('width', ow).attr('height', BAR_H)
            .attr('fill', '#facc15').attr('opacity', 0.3).attr('rx', 1)
            .style('pointer-events', 'none');
        }
      });
    });

  }, [width]);

  return (
    <div className="mt-4 mb-2">
      <h3 className="font-semibold text-sm text-base-content/80 mb-2">Band Map — No-Go vs Legal TX (1 MHz – 6 GHz)</h3>
      <p className="text-xs text-base-content/40 mb-3 leading-relaxed">Interactive map showing restricted (red) and permitted (green) frequency bands on a logarithmic scale. Hover any band for details. Yellow overlap indicates where legal ISM bands share spectrum with restricted services.</p>
      <div className="relative overflow-x-auto">
        <svg ref={svgRef} className="w-full" role="img" aria-label="Frequency band map showing no-go and legal TX bands from 1 MHz to 6 GHz" />
        <div ref={tooltipRef} className="absolute bg-base-300 border border-base-content/10 text-xs p-2.5 rounded-lg pointer-events-none transition-opacity shadow-lg z-10" style={{ opacity: 0, maxWidth: 220 }} />
      </div>
    </div>
  );
}
