import React from 'react';
import {
  Wind,
  Sun,
  Droplets,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  ShieldCheck,
  CloudRain,
  Navigation,
} from 'lucide-react';
import { WeatherData, UnitSystem } from '../types';
import {
  formatWindSpeed,
  formatPressure,
  formatVisibility,
  formatPrecipitation,
  formatTemp,
  getWindDirectionLabel,
  getUvCategory,
  getAqiCategory,
  formatTimeOnly,
  getDaylightProgress,
} from '../utils/formatters';
import { Language, ThemeMode, translations } from '../translations';

interface AtmosphericMetricsGridProps {
  weather: WeatherData;
  unit: UnitSystem;
  lang: Language;
  theme: ThemeMode;
}

export const AtmosphericMetricsGrid: React.FC<AtmosphericMetricsGridProps> = ({
  weather,
  unit,
  lang,
  theme,
}) => {
  const { current, daily, airQuality } = weather;
  const today = daily[0];
  const t = translations[lang];

  const uvCat = getUvCategory(current.uvIndex, lang);
  const aqiCat = airQuality ? getAqiCategory(airQuality.usAqi, lang) : null;

  // Dew point approximation (Magnus-Tetens formula)
  const dewPointC = current.temperature - (100 - current.humidity) / 5;

  // Daylight calculation
  const sunriseTime = today?.sunrise || '';
  const sunsetTime = today?.sunset || '';
  const daylightProgress = getDaylightProgress(sunriseTime, sunsetTime, current.time);

  // Beaufort scale helper
  const getBeaufort = (kmh: number) => {
    if (kmh < 2) return t.calm;
    if (kmh < 12) return t.lightBreeze;
    if (kmh < 20) return t.gentleBreeze;
    if (kmh < 29) return t.moderateBreeze;
    if (kmh < 39) return t.freshBreeze;
    if (kmh < 50) return t.strongBreeze;
    if (kmh < 62) return t.highWind;
    return t.galeForce;
  };

  const cardBgClass =
    theme === 'dark'
      ? 'rounded-3xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-sm shadow-sm flex flex-col justify-between text-slate-100'
      : 'rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-xs flex flex-col justify-between text-slate-900';

  const labelClass = `text-xs font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`;
  const subtextClass = `text-xs mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`;

  return (
    <div id="atmospheric-metrics-section" className="space-y-4">
      <div className="flex items-center gap-2">
        <Gauge className="w-4 h-4 text-cyan-500" />
        <h3 className="text-base font-bold tracking-tight">{t.atmosphericConditions}</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Wind & Compass Card */}
        <div className={cardBgClass}>
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 ${labelClass}`}>
              <Wind className="w-4 h-4 text-cyan-500" />
              <span>{t.wind}</span>
            </div>
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                theme === 'dark'
                  ? 'text-cyan-400 bg-cyan-950/60 border-cyan-800/50'
                  : 'text-cyan-700 bg-cyan-100 border-cyan-300'
              }`}
            >
              {getBeaufort(current.windSpeed)}
            </span>
          </div>

          <div className="my-4 flex items-center justify-between">
            <div>
              <div className="text-2xl font-black font-mono">
                {formatWindSpeed(current.windSpeed, unit, lang)}
              </div>
              <div className={subtextClass}>
                {t.windGusts} {formatWindSpeed(current.windGusts, unit, lang)}
              </div>
            </div>

            {/* Compass rose */}
            <div
              className={`relative w-14 h-14 rounded-full border flex items-center justify-center flex-shrink-0 shadow-inner ${
                theme === 'dark'
                  ? 'border-slate-700/80 bg-slate-950'
                  : 'border-slate-300 bg-slate-100'
              }`}
            >
              <span className="absolute top-1 text-[8px] font-bold text-slate-400">N</span>
              <span className="absolute right-1 text-[8px] font-bold text-slate-400">E</span>
              <span className="absolute bottom-1 text-[8px] font-bold text-slate-400">S</span>
              <span className="absolute left-1 text-[8px] font-bold text-slate-400">W</span>
              <div
                className="w-full h-full flex items-center justify-center transition-transform duration-500"
                style={{ transform: `rotate(${current.windDirection}deg)` }}
              >
                <Navigation className="w-5 h-5 text-cyan-500 fill-cyan-500" />
              </div>
            </div>
          </div>

          <div className="text-xs font-semibold text-cyan-500">
            {getWindDirectionLabel(current.windDirection, lang)} ({current.windDirection}°)
          </div>
        </div>

        {/* 2. UV Index Card */}
        <div className={cardBgClass}>
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 ${labelClass}`}>
              <Sun className="w-4 h-4 text-amber-500" />
              <span>{t.uvIndex}</span>
            </div>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${uvCat.color}`}>
              {uvCat.label}
            </span>
          </div>

          <div className="my-4">
            <div className="text-3xl font-black font-mono">{current.uvIndex}</div>
            <div className={subtextClass}>{uvCat.advice}</div>
          </div>

          {/* UV Progress Bar */}
          <div className={`w-full h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}>
            <div
              className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 via-rose-500 to-purple-600 rounded-full"
              style={{ width: `${Math.min(100, (current.uvIndex / 12) * 100)}%` }}
            />
          </div>
        </div>

        {/* 3. Humidity & Dew Point Card */}
        <div className={cardBgClass}>
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 ${labelClass}`}>
              <Droplets className="w-4 h-4 text-blue-500" />
              <span>{t.humidity}</span>
            </div>
            <span
              className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${
                theme === 'dark'
                  ? 'text-blue-400 bg-blue-950/60 border-blue-800/50'
                  : 'text-blue-700 bg-blue-100 border-blue-300'
              }`}
            >
              {current.humidity}%
            </span>
          </div>

          <div className="my-4">
            <div className="text-3xl font-black font-mono">{current.humidity}%</div>
            <div className={subtextClass}>
              {t.dewPoint} {formatTemp(dewPointC, unit)}
            </div>
          </div>

          <div className={`w-full h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}>
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-blue-600 rounded-full"
              style={{ width: `${current.humidity}%` }}
            />
          </div>
        </div>

        {/* 4. Air Quality (AQI) Card */}
        <div className={cardBgClass}>
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 ${labelClass}`}>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>{t.airQuality}</span>
            </div>
            {aqiCat && (
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${aqiCat.color}`}>
                {aqiCat.label}
              </span>
            )}
          </div>

          <div className="my-4">
            <div className="text-3xl font-black font-mono">
              {airQuality ? airQuality.usAqi : '—'}
            </div>
            <div className={subtextClass}>
              {aqiCat?.advice || (lang === 'fa' ? 'اطلاعات در دسترس نیست' : 'No sensor data nearby')}
            </div>
          </div>

          {/* Detailed pollutants mini pills */}
          {airQuality && (
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
              <span>PM2.5: {airQuality.pm2_5.toFixed(1)}</span>
              <span>·</span>
              <span>PM10: {airQuality.pm10.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* 5. Air Pressure Card */}
        <div className={cardBgClass}>
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 ${labelClass}`}>
              <Gauge className="w-4 h-4 text-purple-500" />
              <span>{t.pressure}</span>
            </div>
            <span
              className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${
                theme === 'dark'
                  ? 'text-purple-400 bg-purple-950/60 border-purple-800/50'
                  : 'text-purple-700 bg-purple-100 border-purple-300'
              }`}
            >
              {current.pressure > 1013 ? (lang === 'fa' ? 'فشار زیاد' : 'High') : (lang === 'fa' ? 'فشار کم' : 'Low')}
            </span>
          </div>

          <div className="my-4">
            <div className="text-3xl font-black font-mono">
              {formatPressure(current.pressure, unit, lang)}
            </div>
            <div className={subtextClass}>
              {current.pressure >= 1013
                ? (lang === 'fa' ? 'سامانه پایدار جوی' : 'Stable atmospheric conditions')
                : (lang === 'fa' ? 'احتمال ناپایداری یا بارش' : 'Low pressure unsettled weather')}
            </div>
          </div>

          <div className={`w-full h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}>
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
              style={{
                width: `${Math.min(100, Math.max(10, ((current.pressure - 970) / (1050 - 970)) * 100))}%`,
              }}
            />
          </div>
        </div>

        {/* 6. Visibility Card */}
        <div className={cardBgClass}>
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 ${labelClass}`}>
              <Eye className="w-4 h-4 text-teal-500" />
              <span>{t.visibility}</span>
            </div>
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                theme === 'dark'
                  ? 'text-teal-400 bg-teal-950/60 border-teal-800/50'
                  : 'text-teal-700 bg-teal-100 border-teal-300'
              }`}
            >
              {current.visibility >= 10000 ? (lang === 'fa' ? 'عالی' : 'Clear') : (lang === 'fa' ? 'محدود' : 'Haze')}
            </span>
          </div>

          <div className="my-4">
            <div className="text-3xl font-black font-mono">
              {formatVisibility(current.visibility, unit, lang)}
            </div>
            <div className={subtextClass}>
              {current.visibility >= 10000
                ? (lang === 'fa' ? 'افق دید کاملاً باز و شفاف' : 'Perfect line of sight')
                : (lang === 'fa' ? 'دید ناشی از غبار یا مه کاهش یافته' : 'Reduced by moisture/mist')}
            </div>
          </div>

          <div className={`w-full h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}>
            <div
              className="h-full bg-teal-500 rounded-full"
              style={{ width: `${Math.min(100, (current.visibility / 10000) * 100)}%` }}
            />
          </div>
        </div>

        {/* 7. Sun Schedule & Daylight Card (Spans 2 cols on lg) */}
        <div className={`${cardBgClass} sm:col-span-2`}>
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 ${labelClass}`}>
              <Sunrise className="w-4 h-4 text-amber-500" />
              <span>{t.sunSchedule}</span>
            </div>
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                theme === 'dark'
                  ? 'text-amber-400 bg-amber-950/60 border-amber-800/50'
                  : 'text-amber-700 bg-amber-100 border-amber-300'
              }`}
            >
              {daylightProgress < 100 ? `${100 - daylightProgress}% ${t.daylightRemaining}` : t.daylightEnded}
            </span>
          </div>

          <div className="my-4 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
                <Sunrise className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">{t.sunrise}</span>
                <span className="text-lg font-bold font-mono">
                  {formatTimeOnly(sunriseTime, lang)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500">
                <Sunset className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">{t.sunset}</span>
                <span className="text-lg font-bold font-mono">
                  {formatTimeOnly(sunsetTime, lang)}
                </span>
              </div>
            </div>
          </div>

          {/* Daylight Cycle Arc Indicator */}
          <div>
            <div className="flex justify-between text-[10px] text-slate-500 mb-1 font-mono">
              <span>{formatTimeOnly(sunriseTime, lang)}</span>
              <span>{daylightProgress}%</span>
              <span>{formatTimeOnly(sunsetTime, lang)}</span>
            </div>
            <div className={`w-full h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}>
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-1000"
                style={{ width: `${daylightProgress}%` }}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
