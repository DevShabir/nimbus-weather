import React, { useState } from 'react';
import { Clock, Droplet, LineChart as LineChartIcon, LayoutGrid } from 'lucide-react';
import { HourlyForecastItem, UnitSystem } from '../types';
import { formatTemp, formatTempNumber } from '../utils/formatters';
import { WeatherIcon } from './WeatherIcon';
import { Language, ThemeMode, translations } from '../translations';

interface HourlyForecastProps {
  hourly: HourlyForecastItem[];
  unit: UnitSystem;
  lang: Language;
  theme: ThemeMode;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourly, unit, lang, theme }) => {
  const [viewMode, setViewMode] = useState<'cards' | 'chart'>('cards');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const t = translations[lang];

  // Take the next 24 hours
  const items = hourly.slice(0, 24);

  if (items.length === 0) return null;

  // Compute stats for SVG curve chart
  const temps = items.map((it) => formatTempNumber(it.temperature, unit));
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const tempRange = Math.max(1, maxTemp - minTemp);

  const svgWidth = 800;
  const svgHeight = 160;
  const paddingX = 40;
  const paddingY = 30;
  const availableWidth = svgWidth - paddingX * 2;
  const availableHeight = svgHeight - paddingY * 2;

  // Generate points
  const points = items.map((it, idx) => {
    const x = paddingX + (idx / Math.max(1, items.length - 1)) * availableWidth;
    const currentVal = temps[idx];
    const normalized = (currentVal - minTemp) / tempRange;
    const y = svgHeight - paddingY - normalized * availableHeight;
    return { x, y, item: it, tempVal: currentVal };
  });

  // Build SVG path
  const pathD = points.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[i - 1];
    const cpX1 = prev.x + (pt.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (pt.x - prev.x) / 2;
    const cpY2 = pt.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${pt.x} ${pt.y}`;
  }, '');

  const areaPathD = `${pathD} L ${points[points.length - 1].x} ${svgHeight} L ${points[0].x} ${svgHeight} Z`;

  return (
    <div
      id="hourly-forecast-section"
      className={`rounded-3xl border p-6 sm:p-7 backdrop-blur-sm shadow-sm transition-colors ${
        theme === 'dark'
          ? 'border-slate-800/90 bg-slate-900/60 text-slate-100'
          : 'border-slate-200 bg-white/90 text-slate-900 shadow-xs'
      }`}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-500" />
          <h3 className="text-base font-bold tracking-tight">{t.hourlyForecast}</h3>
          <span className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            {t.next24Hours}
          </span>
        </div>

        {/* View mode toggle */}
        <div
          className={`flex items-center p-1 rounded-xl border ${
            theme === 'dark'
              ? 'bg-slate-950/80 border-slate-800'
              : 'bg-slate-100 border-slate-200'
          }`}
        >
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              viewMode === 'cards'
                ? theme === 'dark'
                  ? 'bg-slate-800 text-cyan-300 shadow-sm font-semibold'
                  : 'bg-white text-cyan-700 shadow-xs font-semibold'
                : theme === 'dark'
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>{t.cardsView}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('chart')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              viewMode === 'chart'
                ? theme === 'dark'
                  ? 'bg-slate-800 text-cyan-300 shadow-sm font-semibold'
                  : 'bg-white text-cyan-700 shadow-xs font-semibold'
                : theme === 'dark'
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LineChartIcon className="w-3.5 h-3.5" />
            <span>{t.graphView}</span>
          </button>
        </div>
      </div>

      {viewMode === 'cards' ? (
        /* Scrubbable horizontal list of hourly cards */
        <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar">
          {items.map((item, index) => (
            <div
              key={`${item.time}-${index}`}
              className={`flex flex-col items-center justify-between p-3.5 rounded-2xl min-w-[86px] border transition-all flex-shrink-0 ${
                index === 0
                  ? theme === 'dark'
                    ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-200 shadow-xs'
                    : 'bg-cyan-50 border-cyan-300 text-cyan-800 shadow-xs'
                  : theme === 'dark'
                  ? 'bg-slate-950/50 border-slate-800/70 hover:border-slate-700 text-slate-300'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <span className="text-xs font-semibold mb-2">
                {index === 0 ? t.now : item.hourLabel}
              </span>

              <div className="my-1.5">
                <WeatherIcon code={item.weatherCode} isDay={item.isDay} className="w-7 h-7" />
              </div>

              <span className={`text-sm font-bold font-mono mt-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {formatTemp(item.temperature, unit)}
              </span>

              {/* Rain chance pill */}
              <div className="mt-2 min-h-[18px] flex items-center">
                {item.precipitationProbability > 0 ? (
                  <span
                    className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-md border font-mono ${
                      theme === 'dark'
                        ? 'text-cyan-400 bg-cyan-950/60 border-cyan-800/40'
                        : 'text-cyan-700 bg-cyan-100 border-cyan-300'
                    }`}
                  >
                    <Droplet className="w-2.5 h-2.5 fill-cyan-400" />
                    {Math.round(item.precipitationProbability)}%
                  </span>
                ) : (
                  <span className={`text-[10px] font-mono ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`}>
                    0%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Interactive Temperature Curve Chart */
        <div className="relative w-full overflow-x-auto">
          <div className="min-w-[700px]">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-44 overflow-visible"
            >
              <defs>
                <linearGradient id="hourlyTempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={theme === 'dark' ? '0.35' : '0.25'} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Shaded Area */}
              <path d={areaPathD} fill="url(#hourlyTempGrad)" />

              {/* Curve Line */}
              <path
                d={pathD}
                fill="none"
                stroke="#0891b2"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points and labels */}
              {points.map((pt, i) => {
                const isHovered = hoveredIndex === i;
                const showLabel = i % 2 === 0 || isHovered;

                return (
                  <g key={i} className="cursor-pointer">
                    <rect
                      x={pt.x - 15}
                      y={0}
                      width={30}
                      height={svgHeight}
                      fill="transparent"
                      onMouseEnter={() => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    />

                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 5 : 3.5}
                      fill={isHovered ? '#06b6d4' : '#0284c7'}
                      stroke={theme === 'dark' ? '#0f172a' : '#ffffff'}
                      strokeWidth={isHovered ? 2.5 : 1.5}
                      className="transition-all"
                    />

                    {showLabel && (
                      <text
                        x={pt.x}
                        y={pt.y - 10}
                        textAnchor="middle"
                        fill={
                          isHovered
                            ? theme === 'dark' ? '#ffffff' : '#0f172a'
                            : theme === 'dark' ? '#94a3b8' : '#64748b'
                        }
                        fontSize="11"
                        fontWeight="700"
                        fontFamily="monospace"
                      >
                        {pt.tempVal}°
                      </text>
                    )}

                    {i % 2 === 0 && (
                      <text
                        x={pt.x}
                        y={svgHeight - 6}
                        textAnchor="middle"
                        fill={theme === 'dark' ? '#64748b' : '#94a3b8'}
                        fontSize="10"
                        fontWeight="500"
                      >
                        {i === 0 ? t.now : pt.item.hourLabel}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Active hover info readout */}
          {hoveredIndex !== null && items[hoveredIndex] && (
            <div
              className={`mt-2 text-center text-xs flex items-center justify-center gap-4 py-1.5 px-3 rounded-xl border ${
                theme === 'dark'
                  ? 'bg-slate-950/60 border-slate-800 text-slate-300'
                  : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {hoveredIndex === 0 ? t.now : items[hoveredIndex].hourLabel}
              </span>
              <span>
                {t.temp}:{' '}
                <strong className="text-cyan-500 font-mono">
                  {formatTemp(items[hoveredIndex].temperature, unit)}
                </strong>
              </span>
              <span>
                {t.precip}:{' '}
                <strong className="text-blue-500 font-mono">
                  {Math.round(items[hoveredIndex].precipitationProbability)}%
                </strong>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
