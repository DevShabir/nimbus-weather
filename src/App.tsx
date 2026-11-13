/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, RefreshCw, Compass } from 'lucide-react';
import { LocationItem, WeatherData, UnitSystem } from './types';
import { fetchWeatherData, reverseGeocode, POPULAR_LOCATIONS } from './services/weatherApi';
import { Navbar } from './components/Navbar';
import { CurrentWeatherHero } from './components/CurrentWeatherHero';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';
import { AtmosphericMetricsGrid } from './components/AtmosphericMetricsGrid';
import { WeatherRadar } from './components/WeatherRadar';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Language, ThemeMode, translations } from './translations';

const STORAGE_SAVED_LOCS = 'nimbus_saved_locations';
const STORAGE_UNIT = 'nimbus_unit_pref';
const STORAGE_LANG = 'nimbus_lang_pref';
const STORAGE_THEME = 'nimbus_theme_pref';

function getStoredValue(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn(`Unable to read ${key} from local storage:`, error);
    return null;
  }
}

function saveStoredValue(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn(`Unable to save ${key} to local storage:`, error);
  }
}

function isLocationItem(value: unknown): value is LocationItem {
  if (typeof value !== 'object' || value === null) return false;
  const location = value as Record<string, unknown>;
  return (
    typeof location.name === 'string' &&
    typeof location.country === 'string' &&
    typeof location.latitude === 'number' &&
    Number.isFinite(location.latitude) &&
    typeof location.longitude === 'number' &&
    Number.isFinite(location.longitude)
  );
}

function getSavedLocations(): LocationItem[] {
  const raw = getStoredValue(STORAGE_SAVED_LOCS);
  if (raw === null) return [POPULAR_LOCATIONS[0], POPULAR_LOCATIONS[1], POPULAR_LOCATIONS[2]];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every(isLocationItem)) return parsed;
  } catch (error) {
    console.warn('Saved locations contain invalid data:', error);
  }

  console.warn('Saved locations have an invalid format; using the default locations.');
  return [POPULAR_LOCATIONS[0], POPULAR_LOCATIONS[1], POPULAR_LOCATIONS[2]];
}

export default function App() {
  // Language state (default to 'fa' for Dari as requested by user)
  const [lang, setLang] = useState<Language>(() => {
    const savedLang = getStoredValue(STORAGE_LANG);
    if (savedLang === 'fa' || savedLang === 'en') return savedLang;
    return 'fa'; // Default to Dari
  });

  // Light / Dark mode state
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const savedTheme = getStoredValue(STORAGE_THEME);
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    return 'dark'; // Clean modern dark by default, switchable to light
  });

  const [savedLocations, setSavedLocations] = useState<LocationItem[]>(getSavedLocations);

  // Current Location
  const [currentLocation, setCurrentLocation] = useState<LocationItem>(
    () => savedLocations[0] ?? POPULAR_LOCATIONS[0]
  );

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [unit, setUnit] = useState<UnitSystem>(() => {
    const savedUnit = getStoredValue(STORAGE_UNIT);
    if (savedUnit === 'metric' || savedUnit === 'imperial') return savedUnit;
    return 'metric';
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const weatherRequestId = useRef(0);

  const t = translations[lang];

  // Update HTML document attributes when language or theme changes
  useEffect(() => {
    const htmlEl = document.documentElement;
    htmlEl.lang = lang;
    htmlEl.dir = lang === 'fa' ? 'rtl' : 'ltr';

    if (theme === 'dark') {
      htmlEl.classList.add('dark');
    } else {
      htmlEl.classList.remove('dark');
    }
  }, [lang, theme]);

  // Load weather for a given location
  const loadWeather = useCallback(async (
    loc: LocationItem,
    backgroundRefresh = false,
    signal?: AbortSignal
  ) => {
    const requestId = ++weatherRequestId.current;
    if (!backgroundRefresh) {
      setIsLoading(true);
      setWeather(null);
    }
    else setIsRefreshing(true);
    setError(null);

    try {
      const data = await fetchWeatherData(loc, signal);
      if (requestId !== weatherRequestId.current) return;
      setWeather(data);
      setError(null);
    } catch (err: unknown) {
      if (signal?.aborted || requestId !== weatherRequestId.current) return;
      console.error('Failed to load weather:', err);
      const message = err instanceof Error ? err.message : undefined;
      setError(
        message || (lang === 'fa' ? 'خطا در دریافت اطلاعات هواشناسی. اتصال اینترنت را بررسی نمایید.' : 'Failed to fetch weather data. Please check your connection.')
      );
    } finally {
      if (requestId === weatherRequestId.current) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, [lang]);

  // Load on location change
  useEffect(() => {
    const controller = new AbortController();
    void loadWeather(currentLocation, false, controller.signal);
    return () => controller.abort();
  }, [currentLocation, loadWeather]);

  // Request GPS Location
  const handleUseCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError(t.geolocationUnsupported);
      return;
    }

    setIsLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const locItem = await reverseGeocode(lat, lon);
          setCurrentLocation(locItem);
        } catch (e) {
          console.warn('Geolocation reverse error:', e);
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setError(t.geolocationFailed);
        setIsLocating(false);
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  }, [t.geolocationFailed, t.geolocationUnsupported]);

  // Save/unsave location
  const handleToggleSaveLocation = (loc: LocationItem) => {
    setSavedLocations((prev) => {
      const exists = prev.some(
        (l) =>
          Math.abs(l.latitude - loc.latitude) < 0.05 &&
          Math.abs(l.longitude - loc.longitude) < 0.05
      );
      let updated: LocationItem[];
      if (exists) {
        updated = prev.filter(
          (l) =>
            Math.abs(l.latitude - loc.latitude) >= 0.05 ||
            Math.abs(l.longitude - loc.longitude) >= 0.05
        );
      } else {
        updated = [loc, ...prev];
      }
      saveStoredValue(STORAGE_SAVED_LOCS, JSON.stringify(updated));
      return updated;
    });
  };

  // Switch units
  const handleToggleUnit = (newUnit: UnitSystem) => {
    setUnit(newUnit);
    saveStoredValue(STORAGE_UNIT, newUnit);
  };

  // Switch language
  const handleToggleLang = (newLang: Language) => {
    setLang(newLang);
    saveStoredValue(STORAGE_LANG, newLang);
  };

  // Switch theme
  const handleToggleTheme = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    saveStoredValue(STORAGE_THEME, newTheme);
  };

  return (
    <div
      className={`min-h-screen flex flex-col antialiased transition-colors duration-200 ${
        theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
      } ${lang === 'fa' ? "font-['Vazirmatn',sans-serif]" : "font-['Plus_Jakarta_Sans',sans-serif]"}`}
    >
      {/* Top Navigation Bar with Controls */}
      <Navbar
        currentLocation={currentLocation}
        onSelectLocation={setCurrentLocation}
        onUseCurrentLocation={handleUseCurrentLocation}
        isLocating={isLocating}
        unit={unit}
        onToggleUnit={handleToggleUnit}
        onRefresh={() => loadWeather(currentLocation, true)}
        isRefreshing={isRefreshing}
        savedLocations={savedLocations}
        onToggleSaveLocation={handleToggleSaveLocation}
        lang={lang}
        onToggleLang={handleToggleLang}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Error Notification */}
        {error && (
          <div
            id="weather-error-banner"
            className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-200 text-sm flex items-center justify-between gap-3 shadow-lg"
          >
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => loadWeather(currentLocation)}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t.retry}</span>
            </button>
          </div>
        )}

        {/* Loading Skeleton or Weather Content */}
        {isLoading && !weather ? (
          <div className="space-y-6 animate-pulse">
            <div
              className={`h-64 sm:h-72 rounded-3xl border ${
                theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-200 border-slate-300'
              }`}
            />
            <div
              className={`h-44 rounded-3xl border ${
                theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-200 border-slate-300'
              }`}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`h-36 rounded-3xl border ${theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-200 border-slate-300'}`} />
              <div className={`h-36 rounded-3xl border ${theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-200 border-slate-300'}`} />
              <div className={`h-36 rounded-3xl border ${theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-200 border-slate-300'}`} />
              <div className={`h-36 rounded-3xl border ${theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-200 border-slate-300'}`} />
            </div>
          </div>
        ) : weather ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentLocation.latitude}-${currentLocation.longitude}-${lang}-${theme}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* 1. Hero Summary Card */}
              <CurrentWeatherHero weather={weather} unit={unit} lang={lang} theme={theme} />

              {/* 2. Hourly Forecast (Cards & Smooth Curve) */}
              <HourlyForecast hourly={weather.hourly} unit={unit} lang={lang} theme={theme} />

              {/* 3. 7-Day Daily Forecast & Detailed Ranges */}
              <DailyForecast daily={weather.daily} unit={unit} lang={lang} theme={theme} />

              {/* 4. Atmospheric Metrics Grid (8 metrics) */}
              <AtmosphericMetricsGrid weather={weather} unit={unit} lang={lang} theme={theme} />

              {/* 5. Live Doppler Radar & Satellite Map */}
              <WeatherRadar location={weather.location} lang={lang} theme={theme} />
            </motion.div>
          </AnimatePresence>
        ) : null}
      </main>

      {/* Offline Status Toast */}
      <OfflineIndicator lang={lang} />

      {/* Footer */}
      <footer
        className={`w-full border-t py-6 mt-8 transition-colors ${
          theme === 'dark'
            ? 'border-slate-900 bg-slate-950/80 text-slate-400'
            : 'border-slate-200 bg-white text-slate-600'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-500" />
            <span className={`font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-800'}`}>
              {t.footerTitle}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] opacity-80">
            <span>{t.footerMeteorology}</span>
            <span>·</span>
            <span>{t.footerRadar}</span>
            <span>·</span>
            <span>{t.footerStandards}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
