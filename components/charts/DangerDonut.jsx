import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { txApps } from '../../data/txApps';

const DANGER_COLORS = {
  extreme: '#dc2626',
  danger: '#ef4444',
  illegal: '#f97316',
  caution: '#eab308',
};

const DANGER_LABELS = {
  extreme: 'Extreme',
  danger: 'Danger',
  illegal: 'Illegal',
  caution: 'Caution',
};

const DANGER_ORDER = ['extreme', 'danger', 'illegal', 'caution'];

export default function DangerDonut({ onFilterDanger, activeFilter }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const size = 200;
    const radius = size / 2;
    const inner = radius * 0.55;
    svg.attr('width', size).attr('height', size);

    const g = svg.append('g').attr('transform', `translate(${radius},${radius})`);

    const counts = {};
    const appsByLevel = {};
    txApps.forEach(a => {
      counts[a.danger] = (counts[a.danger] || 0) + 1;
      if (!appsByLevel[a.danger]) appsByLevel[a.danger] = [];
      appsByLevel[a.danger].push(a.name);
    });

    const data = DANGER_ORDER.map(d => ({ level: d, count: counts[d] || 0 }));
    const pie = d3.pie().value(d => d.count).sort(null);
    const arc = d3.arc().innerRadius(inner).outerRadius(radius - 4);
    const arcHover = d3.arc().innerRadius(inner).outerRadius(radius);

    g.selectAll('path')
      .data(pie(data))
      .enter().append('path')
      .attr('d', arc)
      .attr('fill', d => DANGER_COLORS[d.data.level])
      .attr('stroke', '#080808')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseenter', function (e, d) {
        d3.select(this).transition().duration(150).attr('d', arcHover);
        centerText.text(`${d.data.count} ${d.data.level}`);
        const names = appsByLevel[d.data.level]?.slice(0, 3).join(', ') + (d.data.count > 3 ? '...' : '');
        subText.text(names.length > 18 ? names.slice(0, 17) + '...' : names);
      })
      .on('mouseleave', function () {
        d3.select(this).transition().duration(150).attr('d', arc);
        centerText.text(`${txApps.length} TX`);
        subText.text('Apps');
      })
      .on('click', (e, d) => {
        if (onFilterDanger) onFilterDanger(activeFilter === d.data.level ? null : d.data.level);
      });

    // Dark background circle for center text readability
    g.append('circle')
      .attr('r', inner - 2)
      .attr('fill', '#080808');

    const centerText = g.append('text')
      .attr('text-anchor', 'middle').attr('dy', '-0.1em')
      .attr('fill', '#ffffff').style('font-size', '20px').style('font-weight', 'bold')
      .text(`${txApps.length} TX`);
    const subText = g.append('text')
      .attr('text-anchor', 'middle').attr('dy', '1.4em')
      .attr('fill', '#ffffff').style('font-size', '11px').style('font-weight', '500')
      .text('Apps');

  }, [onFilterDanger, activeFilter]);

  return (
    <div className="flex flex-col items-center">
      <svg ref={svgRef} role="img" aria-label="Donut chart showing TX app danger level distribution" />
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-3">
        {DANGER_ORDER.map(level => {
          const count = txApps.filter(a => a.danger === level).length;
          const isActive = activeFilter === level;
          return (
            <button
              key={level}
              onClick={() => onFilterDanger && onFilterDanger(isActive ? null : level)}
              className={`flex items-center gap-1.5 text-xs font-mono transition-colors ${isActive ? 'text-base-content' : 'text-base-content/50 hover:text-base-content/70'}`}
              aria-label={`Filter by ${DANGER_LABELS[level]} (${count} apps)`}
              aria-pressed={isActive}
            >
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: DANGER_COLORS[level] }} />
              <span>{DANGER_LABELS[level]}</span>
              <span className="text-base-content/30">{count}</span>
            </button>
          );
        })}
        <button
          onClick={() => onFilterDanger && onFilterDanger(null)}
          className={`flex items-center gap-1.5 text-xs font-mono transition-colors ${!activeFilter ? 'text-base-content' : 'text-base-content/50 hover:text-base-content/70'}`}
          aria-label="Show all apps"
          aria-pressed={!activeFilter}
        >
          <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-base-content/30" />
          <span>All</span>
          <span className="text-base-content/30">{txApps.length}</span>
        </button>
      </div>
    </div>
  );
}
