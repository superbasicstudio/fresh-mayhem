import { useRef, useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import { rxApps } from '../../data/rxApps';
import { categoryColors } from '../../data/frequencyMap';

export default function CategoryBreakdown({ onFilterCategory, activeCategory }) {
  const svgRef = useRef(null);

  const categories = useMemo(() => {
    const counts = {};
    rxApps.forEach(a => { counts[a.category] = (counts[a.category] || 0) + 1; });
    return Object.entries(counts)
      .map(([cat, count]) => ({ category: cat, count }))
      .sort((a, b) => b.count - a.count);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const W = svgRef.current.parentElement?.clientWidth || 500;
    const barH = 22;
    const gap = 3;
    const labelW = 80;
    const H = categories.length * (barH + gap) + 4;

    svg.attr('width', W).attr('height', H);

    const maxCount = d3.max(categories, d => d.count);
    const x = d3.scaleLinear().domain([0, maxCount]).range([0, W - labelW - 50]);

    categories.forEach((d, i) => {
      const y = i * (barH + gap);
      const color = categoryColors[d.category] || '#666';
      const isActive = !activeCategory || activeCategory === d.category;

      svg.append('text')
        .attr('x', labelW - 4).attr('y', y + barH / 2 + 4)
        .attr('text-anchor', 'end')
        .attr('fill', isActive ? '#e0e0e0' : '#666')
        .style('font-size', '11px')
        .text(d.category);

      svg.append('rect')
        .attr('x', labelW).attr('y', y + 2)
        .attr('width', x(d.count)).attr('height', barH - 4)
        .attr('fill', color)
        .attr('opacity', isActive ? 0.85 : 0.3)
        .attr('rx', 3)
        .style('cursor', 'pointer')
        .on('click', () => {
          if (onFilterCategory) onFilterCategory(activeCategory === d.category ? null : d.category);
        });

      svg.append('text')
        .attr('x', labelW + x(d.count) + 6).attr('y', y + barH / 2 + 4)
        .attr('fill', isActive ? '#e0e0e0' : '#666')
        .style('font-size', '11px').style('font-weight', 'bold')
        .text(d.count);
    });

  }, [categories, activeCategory, onFilterCategory]);

  return (
    <div className="mb-3">
      <svg ref={svgRef} className="w-full" role="img" aria-label="Bar chart showing receive app category breakdown" />
      {activeCategory && (
        <button className="btn btn-xs btn-ghost mt-1" onClick={() => onFilterCategory(null)}>Clear filter</button>
      )}
    </div>
  );
}
