import { useState, useMemo } from 'react';

// Three series need to be told apart, so they come from the chart tokens
// rather than the single accent. Both themes are handled by the variables.
const METRICS = [
  { key: 'weight', label: 'Weight', unit: 'kg', color: 'var(--ml-series-1)' },
  { key: 'height', label: 'Height', unit: 'cm', color: 'var(--ml-series-2)' },
  { key: 'head', label: 'Head', unit: 'cm', color: 'var(--ml-series-3)' },
];

const WIDTH = 100;
const HEIGHT = 50;
const PADDING = { top: 5, right: 5, bottom: 8, left: 8 };
const CHART_WIDTH = WIDTH - PADDING.left - PADDING.right;
const CHART_HEIGHT = HEIGHT - PADDING.top - PADDING.bottom;

const GrowthChart = ({ data }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [activeMetric, setActiveMetric] = useState('all');

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;

    const result = {};

    METRICS.forEach((metric) => {
      const values = data
        .map((d, i) => ({ value: d[metric.key], index: i, date: d.date }))
        .filter((d) => d.value != null);

      if (values.length === 0) {
        result[metric.key] = null;
        return;
      }

      const minVal = Math.min(...values.map((v) => v.value));
      const maxVal = Math.max(...values.map((v) => v.value));
      const range = maxVal - minVal || 1;

      const points = values.map((v, i) => ({
        x: PADDING.left + (i / Math.max(values.length - 1, 1)) * CHART_WIDTH,
        y: PADDING.top + CHART_HEIGHT - ((v.value - minVal) / range) * CHART_HEIGHT,
        value: v.value,
        date: v.date,
      }));

      const linePath = points.length > 1 ? `M ${points.map((p) => `${p.x},${p.y}`).join(' L ')}` : '';
      const areaPath =
        points.length > 1
          ? `M ${points[0].x},${PADDING.top + CHART_HEIGHT} L ${points
              .map((p) => `${p.x},${p.y}`)
              .join(' L ')} L ${points[points.length - 1].x},${PADDING.top + CHART_HEIGHT} Z`
          : '';

      result[metric.key] = { points, linePath, areaPath, minVal, maxVal };
    });

    return result;
  }, [data]);

  if (!chartData) return null;

  const visibleMetrics =
    activeMetric === 'all'
      ? METRICS.filter((m) => chartData[m.key])
      : METRICS.filter((m) => m.key === activeMetric && chartData[m.key]);

  return (
    <div className="flex flex-col gap-4">
      {/* Series filter */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveMetric('all')}
          className={`chip chip-filter ${activeMetric === 'all' ? 'chip-on' : ''}`}
        >
          All
        </button>
        {METRICS.map(
          (metric) =>
            chartData[metric.key] && (
              <button
                key={metric.key}
                type="button"
                onClick={() => setActiveMetric(metric.key)}
                className={`chip chip-filter ${activeMetric === metric.key ? 'chip-on' : ''}`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: metric.color }} aria-hidden="true" />
                {metric.label}
              </button>
            ),
        )}
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-64" preserveAspectRatio="none" role="img"
          aria-label="Growth measurements over time">
          <defs>
            {METRICS.map((metric) => (
              <linearGradient key={metric.key} id={`growth-fill-${metric.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={metric.color} stopOpacity="0.28" />
                <stop offset="100%" stopColor={metric.color} stopOpacity="0.02" />
              </linearGradient>
            ))}
          </defs>

          {/* Grid */}
          <g className="text-line">
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
              <line
                key={ratio}
                x1={PADDING.left}
                y1={PADDING.top + CHART_HEIGHT * ratio}
                x2={WIDTH - PADDING.right}
                y2={PADDING.top + CHART_HEIGHT * ratio}
                stroke="currentColor"
                strokeWidth="0.2"
              />
            ))}
          </g>

          {visibleMetrics.map((metric) => (
            <path
              key={`area-${metric.key}`}
              d={chartData[metric.key].areaPath}
              fill={`url(#growth-fill-${metric.key})`}
            />
          ))}

          {visibleMetrics.map((metric) => (
            <path
              key={`line-${metric.key}`}
              d={chartData[metric.key].linePath}
              fill="none"
              stroke={metric.color}
              strokeWidth="0.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {visibleMetrics.map((metric) =>
            chartData[metric.key].points.map((point, i) => (
              <g
                key={`point-${metric.key}-${i}`}
                onMouseEnter={() => setHoveredPoint({ metric: metric.key, index: i, ...point, ...metric })}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={hoveredPoint?.metric === metric.key && hoveredPoint?.index === i ? 1.4 : 0.8}
                  fill={metric.color}
                  className="transition-all duration-200 cursor-pointer"
                />
                {/* Larger invisible hit area */}
                <circle cx={point.x} cy={point.y} r={3} fill="transparent" className="cursor-pointer" />
              </g>
            )),
          )}
        </svg>

        {hoveredPoint && (
          <div
            className="absolute z-10 px-2.5 py-1.5 text-xs bg-surface-inverse text-ink-inverse rounded-control shadow-lift pointer-events-none -translate-x-1/2 -translate-y-full whitespace-nowrap"
            style={{
              left: `${(hoveredPoint.x / WIDTH) * 100}%`,
              top: `${(hoveredPoint.y / HEIGHT) * 100}%`,
              marginTop: '-8px',
            }}
          >
            <div className="font-semibold">{new Date(hoveredPoint.date).toLocaleDateString()}</div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: hoveredPoint.color }} />
              {hoveredPoint.label}: {hoveredPoint.value} {hoveredPoint.unit}
            </div>
          </div>
        )}

        <div className="flex justify-between text-xs text-ink-3 mt-2 px-1">
          {data.length > 0 && (
            <>
              <span>{new Date(data[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              {data.length > 2 && (
                <span>
                  {new Date(data[Math.floor(data.length / 2)].date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              )}
              {data.length > 1 && (
                <span>
                  {new Date(data[data.length - 1].date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* Latest reading per series */}
      <div className="grid grid-cols-3 gap-3">
        {METRICS.map((metric) => {
          if (!chartData[metric.key]) return null;
          const latestValue = data.filter((d) => d[metric.key] != null).pop()?.[metric.key];
          const dimmed = activeMetric !== 'all' && activeMetric !== metric.key;

          return (
            <button
              key={metric.key}
              type="button"
              onClick={() => setActiveMetric(activeMetric === metric.key ? 'all' : metric.key)}
              className={`stat text-left cursor-pointer transition-opacity ${dimmed ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: metric.color }} aria-hidden="true" />
                <span className="stat-label">{metric.label}</span>
              </div>
              <div className="stat-value mt-1">
                {latestValue ?? '—'} <span className="text-[13px] font-normal text-ink-3">{metric.unit}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GrowthChart;
