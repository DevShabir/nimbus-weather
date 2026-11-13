import React, { useState } from 'react';
import { Calendar, Droplets, Wind, Sun, ChevronDown, ChevronUp } from 'lucide-react';
import { DailyForecastItem, UnitSystem } from '../types';
import { formatTemp, formatTempNumber, formatWindSpeed, formatPrecipitation, formatTimeOnly, getUvCategory } from '../utils/formatters';
import { getWeatherCodeInfo } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';
import { Language, ThemeMode, translations } from '../translations';

interface DailyForecastProps {
  daily: DailyForecastItem[];
  unit: UnitSystem;
  lang: Language;
  theme: ThemeMode;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ daily, unit, lang, theme }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const t = translations[lang];

  if (daily.length === 0) return null;

  // Calculate week min and max across all days for proportional range bars
  const allMins = daily.map((d) => formatTempNumber(d.tempMin, unit));
  const allMaxs = daily.map((d) => formatTempNumber(d.tempMax, unit));
  const weekMin = Math.min(...allMins);
  const weekMax = Math.max(...allMaxs);
  const totalRange = Math.max(1, weekMax - weekMin);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Helper for translated day label
  const getDayLabel = (item: DailyForecastItem, idx: number) => {
    if (idx === 0) return t.today;
    if (lang === 'fa') {
      try {
        const dateObj = new Date(item.date + 'T12:00:00');
        return dateObj.toLocaleDateString('fa-AF', { weekday: 'long' });
      } catch {
        return item.dayLabel;
      }
    }
    return item.dayLabel;
  };

  const getDateLabel = (item: DailyForecastItem) => {
    if (lang === 'fa') {
      try {
        const dateObj = new Date(item.date + 'T12:00:00');
        return dateObj.toLocaleDateString('fa-AF', { month: 'short', day: 'numeric' });
      } catch {
        return item.fullDateLabel;
      }
    }
    return item.fullDateLabel;
  };

  return (
    <div
      id="daily-forecast-section"
      className={`rounded-3xl border p-6 sm:p-7 backdrop-blur-sm shadow-sm transition-colors ${
        theme === 'dark'
          ? 'border-slate-800/90 bg-slate-900/60 text-slate-100'
          : 'border-slate-200 bg-white/90 text-slate-900 shadow-xs'
      }`}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyan-500" />
          <h3 className="text-base font-bold tracking-tight">{t.dailyForecast}</h3>
        </div>
        <span className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
          {t.clickForDetails}
        </span>
      </div>

      <div className="space-y-2">
        {daily.map((item, idx) => {
          const info = getWeatherCodeInfo(item.weatherCode, true, lang);
          const isExpanded = expandedIndex === idx;

          // Proportional range bar calculations
          const dayMin = formatTempNumber(item.tempMin, unit);
          const dayMax = formatTempNumber(item.tempMax, unit);
          const leftPercent = ((dayMin - weekMin) / totalRange) * 100;
          const barWidthPercent = Math.max(8, ((dayMax - dayMin) / totalRange) * 100);

          return (
            <div
              key={item.date}
              className={`rounded-2xl border transition-all overflow-hidden ${
                theme === 'dark'
                  ? 'bg-slate-950/40 border-slate-800/60 hover:border-slate-700/80'
                  : 'bg-slate-50 border-slate-200/90 hover:border-slate-300'
              }`}
            >
              {/* Main row */}
              <button
                type="button"
                onClick={() => toggleExpand(idx)}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left gap-2 sm:gap-4 transition-colors cursor-pointer"
              >
                {/* Day name & date */}
                <div className="w-24 sm:w-28 flex-shrink-0">
                  <span
                    className={`text-sm font-bold block ${
                      idx === 0
                        ? 'text-cyan-500'
                        : theme === 'dark'
                        ? 'text-slate-200'
                        : 'text-slate-800'
                    }`}
                  >
                    {getDayLabel(item, idx)}
                  </span>
                  <span
                    className={`text-[11px] font-medium ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {getDateLabel(item)}
                  </span>
                </div>

                {/* Weather icon & condition description */}
                <div className="flex items-center gap-2.5 w-32 sm:w-44 flex-shrink-0">
                  <WeatherIcon code={item.weatherCode} isDay={true} className="w-6 h-6" />
                  <span
                    className={`text-xs font-medium truncate hidden sm:inline ${
                      theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    {info.label}
                  </span>
                </div>

                {/* Rain probability */}
                <div className="w-14 sm:w-16 text-left flex items-center gap-1 flex-shrink-0">
                  {item.precipitationProbabilityMax > 0 ? (
                    <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-cyan-500 font-mono">
                      <Droplets className="w-3 h-3 text-cyan-500" />
                      {Math.round(item.precipitationProbabilityMax)}%
                    </span>
                  ) : (
                    <span
                      className={`text-[11px] font-mono ${
                        theme === 'dark' ? 'text-slate-600' : 'text-slate-400'
                      }`}
                    >
                      0%
                    </span>
                  )}
                </div>

                {/* Temperature Min, Proportional Bar, and Max */}
                <div className="flex-1 flex items-center justify-end gap-2.5 max-w-xs">
                  <span
                    className={`text-xs font-mono font-semibold w-8 text-right ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {formatTemp(item.tempMin, unit)}
                  </span>

                  {/* Range visual bar */}
                  <div
                    className={`relative w-24 sm:w-32 h-2 rounded-full overflow-hidden flex-shrink-0 ${
                      theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 to-amber-400"
                      style={{
                        left: `${Math.min(90, Math.max(0, leftPercent))}%`,
                        width: `${Math.min(100, Math.max(10, barWidthPercent))}%`,
                      }}
                    />
                  </div>

                  <span
                    className={`text-xs font-mono font-bold w-8 text-left ${
                      theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                    }`}
                  >
                    {formatTemp(item.tempMax, unit)}
                  </span>
                </div>

                {/* Chevron */}
                <div
                  className={`flex-shrink-0 ml-1 ${
                    theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Expandable details drawer */}
              {isExpanded && (
                <div
                  className={`px-4 pb-4 pt-2 border-t grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs ${
                    theme === 'dark'
                      ? 'border-slate-800/80 bg-slate-900/40 text-slate-300'
                      : 'border-slate-200 bg-white/70 text-slate-700'
                  }`}
                >
                  <div>
                    <span className="text-[11px] text-slate-500 block">{t.wind}</span>
                    <span className="font-semibold font-mono">
                      {formatWindSpeed(item.windSpeedMax, unit, lang)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">{t.precipitation}</span>
                    <span className="font-semibold font-mono">
                      {formatPrecipitation(item.precipitationSum, unit, lang)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">{t.sunrise}</span>
                    <span className="font-semibold font-mono">
                      {formatTimeOnly(item.sunrise, lang)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">{t.sunset}</span>
                    <span className="font-semibold font-mono">
                      {formatTimeOnly(item.sunset, lang)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
