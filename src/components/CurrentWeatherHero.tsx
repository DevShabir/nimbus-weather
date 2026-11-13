import React from 'react';
import { MapPin, ArrowUp, ArrowDown, Droplets, Wind, ShieldCheck, SunMedium } from 'lucide-react';
import { WeatherData, UnitSystem } from '../types';
import { formatTemp, formatWindSpeed, getWindDirectionLabel, getUvCategory, getAqiCategory } from '../utils/formatters';
import { getWeatherCodeInfo } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';
import { Language, ThemeMode, translations } from '../translations';

interface CurrentWeatherHeroProps {
  weather: WeatherData;
  unit: UnitSystem;
  lang: Language;
  theme: ThemeMode;
}

export const CurrentWeatherHero: React.FC<CurrentWeatherHeroProps> = ({ weather, unit, lang, theme }) => {
  const { location, current, daily, airQuality } = weather;
  const today = daily[0];
  const info = getWeatherCodeInfo(current.weatherCode, current.isDay, lang);
  const uvCat = getUvCategory(current.uvIndex, lang);
  const aqiCat = airQuality ? getAqiCategory(airQuality.usAqi, lang) : null;
  const t = translations[lang];

  // Format local date
  const now = new Date(current.time);
  const dateFormatted = now.toLocaleDateString(lang === 'fa' ? 'fa-AF' : 'en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <section
      id="current-weather-hero"
      className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 md:p-10 shadow-xl transition-colors ${
        theme === 'dark'
          ? 'border-slate-800/90 bg-gradient-to-b from-slate-900/95 to-slate-950/95 text-slate-100'
          : 'border-slate-200 bg-gradient-to-b from-white to-slate-50 text-slate-900 shadow-md'
      }`}
    >
      {/* Ambient background glow according to weather condition */}
      <div
        className={`absolute inset-0 bg-gradient-to-tr ${info.gradientClass} pointer-events-none opacity-80`}
      />

      {/* Decorative subtle weather radial glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        
        {/* Left column: Location & Big Temp */}
        <div className="space-y-4">
          
          {/* Location badge & date */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border ${
                theme === 'dark'
                  ? 'bg-slate-800/80 border-slate-700/60 text-slate-200'
                  : 'bg-slate-100/90 border-slate-300 text-slate-800'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-500" />
              <span className="font-semibold">{location.name}</span>
              {location.country && (
                <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>
                  · {location.country}
                </span>
              )}
            </div>

            <span className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              {dateFormatted}
            </span>

            <span className={`text-[11px] font-mono ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
              {t.updated} {weather.lastUpdated}
            </span>
          </div>

          {/* Temperature & High / Low */}
          <div className="flex items-baseline gap-4">
            <div
              id="hero-temperature"
              className={`text-6xl sm:text-7xl md:text-8xl font-black tracking-tight font-mono ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}
            >
              {formatTemp(current.temperature, unit)}
            </div>

            <div className="flex flex-col gap-1 text-sm">
              <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>
                {t.feelsLike}{' '}
                <strong className={`font-semibold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                  {formatTemp(current.apparentTemperature, unit)}
                </strong>
              </span>

              {today && (
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="flex items-center text-emerald-500 dark:text-emerald-400 font-semibold" title={t.high}>
                    <ArrowUp className="w-3.5 h-3.5" />
                    {formatTemp(today.tempMax, unit)}
                  </span>
                  <span className="flex items-center text-sky-500 dark:text-sky-400 font-semibold" title={t.low}>
                    <ArrowDown className="w-3.5 h-3.5" />
                    {formatTemp(today.tempMin, unit)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Condition text & short description */}
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                {info.label}
              </h2>
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${info.badgeBg}`}>
                {current.isDay ? (lang === 'fa' ? 'روز' : 'Day') : (lang === 'fa' ? 'شب' : 'Night')}
              </span>
            </div>
            <p className={`text-sm max-w-md ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              {info.description}
            </p>
          </div>

        </div>

        {/* Right column: Weather Illustration & Quick Key Stats */}
        <div className="flex flex-col sm:flex-row md:flex-col items-center sm:items-end md:items-end gap-6">
          <div className="relative">
            <WeatherIcon
              code={current.weatherCode}
              isDay={current.isDay}
              className="w-28 h-28 sm:w-32 sm:h-32 drop-shadow-2xl"
            />
          </div>

          {/* Mini pill badges: Wind, UV, AQI */}
          <div className="flex flex-wrap gap-2 justify-end">
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium backdrop-blur-sm ${
                theme === 'dark'
                  ? 'bg-slate-900/80 border-slate-800 text-slate-300'
                  : 'bg-white/90 border-slate-200 text-slate-700 shadow-xs'
              }`}
            >
              <Wind className="w-3.5 h-3.5 text-cyan-500" />
              <span>{formatWindSpeed(current.windSpeed, unit, lang)}</span>
              <span className="text-[10px] opacity-75">
                ({getWindDirectionLabel(current.windDirection, lang)})
              </span>
            </div>

            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium backdrop-blur-sm ${
                theme === 'dark'
                  ? 'bg-slate-900/80 border-slate-800 text-slate-300'
                  : 'bg-white/90 border-slate-200 text-slate-700 shadow-xs'
              }`}
            >
              <SunMedium className="w-3.5 h-3.5 text-amber-500" />
              <span>UV: {current.uvIndex}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded border ${uvCat.color}`}>
                {uvCat.label}
              </span>
            </div>

            {aqiCat && airQuality && (
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium backdrop-blur-sm ${
                  theme === 'dark'
                    ? 'bg-slate-900/80 border-slate-800 text-slate-300'
                    : 'bg-white/90 border-slate-200 text-slate-700 shadow-xs'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>AQI: {airQuality.usAqi}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded border ${aqiCat.color}`}>
                  {aqiCat.label}
                </span>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
