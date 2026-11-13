import React, { useState } from 'react';
import { Radar, Layers, ExternalLink, RefreshCw } from 'lucide-react';
import { LocationItem } from '../types';
import { Language, ThemeMode, translations } from '../translations';

interface WeatherRadarProps {
  location: LocationItem;
  lang: Language;
  theme: ThemeMode;
}

export const WeatherRadar: React.FC<WeatherRadarProps> = ({ location, lang, theme }) => {
  const [layer, setLayer] = useState<'radar' | 'satellite'>('radar');
  const [radarKey, setRadarKey] = useState(0);
  const t = translations[lang];

  const { latitude, longitude, name } = location;

  // RainViewer live animated radar URL
  const radarUrl = `https://www.rainviewer.com/map.html?loc=${latitude},${longitude},7&oFa=0&oC=1&oU=0&oRev=0&layer=${layer}&sm=1&sn=1`;

  const reloadRadar = () => {
    setRadarKey((prev) => prev + 1);
  };

  return (
    <div
      id="weather-radar-section"
      className={`rounded-3xl border p-6 sm:p-7 backdrop-blur-sm shadow-sm transition-colors ${
        theme === 'dark'
          ? 'border-slate-800/90 bg-slate-900/60 text-slate-100'
          : 'border-slate-200 bg-white/90 text-slate-900 shadow-xs'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <Radar className="w-4 h-4 text-cyan-500" />
          <h3 className="text-base font-bold tracking-tight">{t.liveRadarTitle}</h3>
          <span className={`text-xs font-medium hidden sm:inline ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            {t.near} {name}
          </span>
        </div>

        {/* Controls & Layer toggle */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center p-1 rounded-xl border ${
              theme === 'dark'
                ? 'bg-slate-950/80 border-slate-800'
                : 'bg-slate-100 border-slate-200'
            }`}
          >
            <button
              type="button"
              onClick={() => setLayer('radar')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                layer === 'radar'
                  ? theme === 'dark'
                    ? 'bg-slate-800 text-cyan-300 shadow-sm font-bold'
                    : 'bg-white text-cyan-700 shadow-xs font-bold'
                  : theme === 'dark'
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.radarRain}
            </button>
            <button
              type="button"
              onClick={() => setLayer('satellite')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                layer === 'satellite'
                  ? theme === 'dark'
                    ? 'bg-slate-800 text-cyan-300 shadow-sm font-bold'
                    : 'bg-white text-cyan-700 shadow-xs font-bold'
                  : theme === 'dark'
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.satelliteClouds}
            </button>
          </div>

          <button
            type="button"
            onClick={reloadRadar}
            title={t.refreshTooltip}
            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-cyan-300'
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-cyan-700'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Embedded live interactive Doppler radar */}
      <div
        className={`relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border shadow-inner ${
          theme === 'dark'
            ? 'border-slate-800/80 bg-slate-950'
            : 'border-slate-300 bg-slate-100'
        }`}
      >
        <iframe
          key={radarKey}
          src={radarUrl}
          title={`Weather Radar for ${name}`}
          className="w-full h-full border-0"
          loading="lazy"
          allow="geolocation"
        />

        {/* Floating radar legend */}
        <div
          className={`absolute bottom-3 ${
            lang === 'fa' ? 'right-3' : 'left-3'
          } backdrop-blur-md border px-3 py-1.5 rounded-xl text-[11px] flex items-center gap-2 pointer-events-none shadow-md ${
            theme === 'dark'
              ? 'bg-slate-950/85 border-slate-800 text-slate-300'
              : 'bg-white/90 border-slate-200 text-slate-700'
          }`}
        >
          <span className="font-semibold text-cyan-500">{t.precipitation}</span>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2 rounded bg-cyan-400" />
            <span className="text-[10px] opacity-75">{t.light}</span>
            <span className="w-2.5 h-2 rounded bg-blue-600" />
            <span className="w-2.5 h-2 rounded bg-yellow-400" />
            <span className="w-2.5 h-2 rounded bg-red-500" />
            <span className="text-[10px] opacity-75">{t.heavy}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
