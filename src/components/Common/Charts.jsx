import React, { useState } from 'react';

// Custom 4-color luxury palette constants
export const PALETTE = {
  slateDeep: '#354649',
  slateCool: '#6C7A89',
  sageAqua: '#A3C6C4',
  mistFrost: '#E0E7E9',
  dark: '#121819',
  card: '#1a2325'
};

const DEFAULT_COLORS = [
  '#354649', // Mauve
  '#6C7A89', // Warm Coral
  '#A3C6C4', // Champagne Gold
  '#E0E7E9', // Butter Vanilla
  '#C9889F', // Muted Rose
  '#E8A882'  // Peach
];

/**
 * Donut / Pie Chart Component
 * High precision SVG chart with central total, hover slice highlights & legend
 */
export function DonutChart({
  data = [],
  title = "Distribution",
  subtitle = "Breakdown by category",
  centerLabel = "Total",
  size = 220,
  strokeWidth = 32,
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
      {/* SVG Donut Visual */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {/* Background circle track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={strokeWidth}
          />

          {/* Slices */}
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
                  filter: isHovered ? `drop-shadow(0 0 8px ${slice.color}80)` : 'none',
                  opacity: hoveredIdx !== null && !isHovered ? 0.45 : 1
                }}
                onMouseEnter={() => setHoveredIdx(slice.idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}
        </svg>

        {/* Center Cutout Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">
            {hoveredIdx !== null ? slices[hoveredIdx]?.label : centerLabel}
          </span>
          <span className="font-heading font-extrabold text-2xl text-white">
            {hoveredIdx !== null ? slices[hoveredIdx]?.val : total}
          </span>
          <span className="text-[10px] font-bold text-[#E0E7E9]">
            {hoveredIdx !== null ? `${slices[hoveredIdx]?.percent}%` : '100%'}
          </span>
        </div>
      </div>

      {/* Interactive Legend */}
      <div className="flex-1 w-full space-y-2.5">
        <div className="text-xs font-semibold text-white/50 mb-1 border-b border-white/5 pb-1">
          {title} ({data.length} segments)
        </div>
        <div className="space-y-2">
          {slices.map((slice) => {
            const isHovered = hoveredIdx === slice.idx;
            return (
              <div
                key={slice.idx}
                onMouseEnter={() => setHoveredIdx(slice.idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`p-2 rounded-xl flex items-center justify-between text-xs transition-all cursor-pointer ${
                  isHovered ? 'bg-white/10 scale-[1.02]' : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-3 h-3 rounded-md shrink-0 shadow-sm"
                    style={{ backgroundColor: slice.color }}
                  />
                  <span className="font-medium text-white/90 truncate">{slice.label}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-white/50 text-[11px]">{slice.val}</span>
                  <span 
                    className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded"
                    style={{ 
                      backgroundColor: `${slice.color}25`,
                      color: slice.color
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

/**
 * Bar Graph Component
 * Visual vertical bar comparisons with gradient heights & tooltips
 */
export function BarGraph({
  data = [],
  height = 180,
  className = ""
}) {
  const [activeBar, setActiveBar] = useState(null);
  const maxVal = Math.max(...data.map(d => Number(d.value) || 0), 1);

  return (
    <div className={`space-y-4 ${className}`}>
      <div 
        className="flex items-end justify-between gap-2 sm:gap-4 pt-6 px-2 border-b border-white/10"
        style={{ height: `${height}px` }}
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
              {/* Hover Value Popover */}
              {isSelected && (
                <div className="absolute -top-7 px-2 py-0.5 rounded-lg bg-[#252523] border border-white/20 text-[#E0E7E9] text-[10px] font-mono font-bold whitespace-nowrap shadow-xl z-20 animate-in fade-in zoom-in-95">
                  {val} ({item.unit || 'units'})
                </div>
              )}

              {/* Bar Column */}
              <div
                className="w-full max-w-[42px] rounded-t-xl transition-all duration-500 relative overflow-hidden"
                style={{
                  height: `${heightPercent}%`,
                  background: isSelected 
                    ? 'linear-gradient(180deg, #E0E7E9 0%, #6C7A89 50%, #354649 100%)' 
                    : 'linear-gradient(180deg, #6C7A89 0%, #354649 100%)',
                  boxShadow: isSelected ? '0 0 15px rgba(251, 147, 120, 0.4)' : 'none'
                }}
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          );
        })}
      </div>

      {/* X-Axis Labels */}
      <div className="flex items-center justify-between gap-2 sm:gap-4 px-2">
        {data.map((item, idx) => (
          <div key={idx} className="flex-1 text-center truncate">
            <span className="text-[10px] font-mono text-white/50 block truncate group-hover:text-white">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Area Trend Graph Component
 * Smooth curved SVG wave graph for activity over time
 */
export function AreaTrendGraph({
  data = [],
  height = 140,
  className = ""
}) {
  if (data.length < 2) return null;

  const width = 500;
  const maxVal = Math.max(...data.map(d => Number(d.value) || 0), 1);
  const minVal = 0;

  // Generate SVG path points
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((Number(d.value) - minVal) / (maxVal - minVal || 1)) * (height - 30) - 15;
    return { x, y, ...d };
  });

  // Construct SVG cubic bezier curve
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
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
      >
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6C7A89" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#354649" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#121819" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#354649" />
            <stop offset="50%" stopColor="#6C7A89" />
            <stop offset="100%" stopColor="#A3C6C4" />
          </linearGradient>
        </defs>

        {/* Shaded Area */}
        <path d={fillPathD} fill="url(#areaGradient)" />

        {/* Curve Line */}
        <path
          d={pathD}
          fill="none"
          stroke="url(#strokeGradient)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Data points */}
        {points.map((p, idx) => (
          <g key={idx} className="cursor-pointer group">
            <circle
              cx={p.x}
              cy={p.y}
              r="4.5"
              fill="#121819"
              stroke="#A3C6C4"
              strokeWidth="2.5"
              className="group-hover:r-6 transition-all"
            />
          </g>
        ))}
      </svg>

      {/* Axis Footer */}
      <div className="flex justify-between items-center text-[10px] font-mono text-white/40 pt-2 border-t border-white/10 mt-1">
        <span>{data[0]?.label}</span>
        <span>Peak: {maxVal} events/hr</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  );
}

