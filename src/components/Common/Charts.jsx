import React, { useState } from 'react';

const DEFAULT_COLORS = [
  '#5A6552', // Olive
  '#3B7A57', // Forest Green
  '#7D8F69', // Sage Olive
  '#9CAF88', // Light Sage
  '#46503F', // Deep Olive
  '#B45309', // Warm Amber
];

export function DonutChart({
  data = [],
  title = "Distribution",
  centerLabel = "Total",
  size = 190,
  strokeWidth = 28,
  className = ""
}) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const total = data.reduce((sum, item) => sum + (Number(item.value) || 0), 0);
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  const slices = data.map((item, idx) => {
    const val = Number(item.value) || 0;
    const percent = total > 0 ? (val / total) : 0;
    const strokeDasharray = `${percent * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedPercent * circumference;
    const color = item.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length];

    accumulatedPercent += percent;

    return {
      ...item,
      val,
      percent: Math.round(percent * 100),
      strokeDasharray,
      strokeDashoffset,
      color,
      idx
    };
  });

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-6 ${className}`}>
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--border-color)"
            strokeWidth={strokeWidth}
          />
          {slices.map((slice) => {
            const isHovered = hoveredIdx === slice.idx;
            return (
              <circle
                key={slice.idx}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={slice.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={slice.strokeDasharray}
                strokeDashoffset={slice.strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300 cursor-pointer"
                style={{
                  opacity: hoveredIdx !== null && !isHovered ? 0.45 : 1
                }}
                onMouseEnter={() => setHoveredIdx(slice.idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider truncate max-w-[110px]" style={{ color: 'var(--text-muted)' }}>
            {hoveredIdx !== null ? slices[hoveredIdx]?.label : centerLabel}
          </span>
          <span className="font-bold text-2xl" style={{ color: 'var(--text-main)' }}>
            {hoveredIdx !== null ? slices[hoveredIdx]?.val : total}
          </span>
          <span className="text-[11px] font-semibold" style={{ color: 'var(--fp-olive)' }}>
            {hoveredIdx !== null ? `${slices[hoveredIdx]?.percent}%` : '100%'}
          </span>
        </div>
      </div>

      <div className="flex-1 w-full space-y-2">
        <div className="text-xs font-semibold pb-1.5 border-b" style={{ color: 'var(--text-muted)', borderColor: 'var(--border-color)' }}>
          {title} ({data.length} segments)
        </div>
        <div className="space-y-1.5">
          {slices.map((slice) => {
            const isHovered = hoveredIdx === slice.idx;
            return (
              <div
                key={slice.idx}
                onMouseEnter={() => setHoveredIdx(slice.idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="p-2 rounded-lg flex items-center justify-between text-xs transition-all cursor-pointer"
                style={{
                  background: isHovered ? 'var(--bg-subtle)' : 'transparent',
                }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-3 h-3 rounded-sm shrink-0"
                    style={{ backgroundColor: slice.color }}
                  />
                  <span className="font-medium truncate" style={{ color: 'var(--text-main)' }}>{slice.label}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{slice.val}</span>
                  <span
                    className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: 'var(--fp-sage)',
                      color: 'var(--fp-sage-text)'
                    }}
                  >
                    {slice.percent}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function BarGraph({
  data = [],
  height = 170,
  className = ""
}) {
  const [activeBar, setActiveBar] = useState(null);
  const maxVal = Math.max(...data.map((d) => Number(d.value) || 0), 1);

  return (
    <div className={`space-y-3 ${className}`}>
      <div
        className="flex items-end justify-between gap-2 sm:gap-4 pt-6 px-2 border-b"
        style={{ height: `${height}px`, borderColor: 'var(--border-color)' }}
      >
        {data.map((item, idx) => {
          const val = Number(item.value) || 0;
          const heightPercent = Math.max(8, (val / maxVal) * 100);
          const isSelected = activeBar === idx;

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
              onMouseEnter={() => setActiveBar(idx)}
              onMouseLeave={() => setActiveBar(null)}
            >
              {isSelected && (
                <div
                  className="absolute -top-7 px-2 py-0.5 rounded-md text-[11px] font-mono font-bold whitespace-nowrap shadow-md z-20"
                  style={{
                    background: 'var(--fp-olive)',
                    color: 'var(--fp-olive-text, #ffffff)',
                  }}
                >
                  {val} {item.unit || ''}
                </div>
              )}

              <div
                className="w-full max-w-[44px] rounded-t-lg transition-all duration-300"
                style={{
                  height: `${heightPercent}%`,
                  backgroundColor: isSelected ? 'var(--fp-olive)' : 'var(--fp-sage)',
                  border: '1px solid var(--border-color)',
                  borderBottom: 'none',
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-2 sm:gap-4 px-2">
        {data.map((item, idx) => (
          <div key={idx} className="flex-1 text-center truncate">
            <span className="text-[11px] font-mono block truncate" style={{ color: 'var(--text-muted)' }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AreaTrendGraph({
  data = [],
  height = 140,
  className = ""
}) {
  if (data.length < 2) return null;

  const width = 500;
  const maxVal = Math.max(...data.map((d) => Number(d.value) || 0), 1);

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((Number(d.value) || 0) / maxVal) * (height - 30) - 15;
    return { x, y, ...d };
  });

  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const mx = (p0.x + p1.x) / 2;
    pathD += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
  }

  const fillPathD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  return (
    <div className={`relative ${className}`}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id="fpAreaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5A6552" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#5A6552" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        <path d={fillPathD} fill="url(#fpAreaGradient)" />
        <path
          d={pathD}
          fill="none"
          stroke="var(--fp-olive)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {points.map((p, idx) => (
          <circle
            key={idx}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="var(--bg-main)"
            stroke="var(--fp-olive)"
            strokeWidth="2.5"
          />
        ))}
      </svg>

      <div className="flex justify-between items-center text-[11px] font-mono pt-2 border-t mt-1" style={{ color: 'var(--text-muted)', borderColor: 'var(--border-color)' }}>
        <span>{data[0]?.label}</span>
        <span>Peak: {maxVal}/hr</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  );
}
