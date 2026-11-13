import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  Compass,
  Bookmark,
  BookmarkCheck,
  RotateCw,
  Loader2,
  X,
  Sun,
  Moon,
  Languages,
} from 'lucide-react';
import { LocationItem, UnitSystem } from '../types';
import { searchLocations, POPULAR_LOCATIONS } from '../services/weatherApi';
import { Language, ThemeMode, translations } from '../translations';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  currentLocation: LocationItem;
  onSelectLocation: (loc: LocationItem) => void;
  onUseCurrentLocation: () => void;
  isLocating: boolean;
  unit: UnitSystem;
  onToggleUnit: (unit: UnitSystem) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  savedLocations: LocationItem[];
  onToggleSaveLocation: (loc: LocationItem) => void;
  lang: Language;
  onToggleLang: (lang: Language) => void;
  theme: ThemeMode;
  onToggleTheme: (theme: ThemeMode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLocation,
  onSelectLocation,
  onUseCurrentLocation,
  isLocating,
  unit,
  onToggleUnit,
  onRefresh,
  isRefreshing,
  savedLocations,
  onToggleSaveLocation,
  lang,
  onToggleLang,
  theme,
  onToggleTheme,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  // Debounced search
  useEffect(() => {
    let active = true;
    if (!query || query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      setSearchError(false);
      return;
    }

    setIsSearching(true);
    setSearchError(false);
    setResults([]);
    const timer = setTimeout(async () => {
      try {
        const res = await searchLocations(query);
        if (active) setResults(res);
      } catch (error) {
        console.error('Location search failed:', error);
        if (active) setSearchError(true);
      } finally {
        if (active) {
          setIsSearching(false);
          setIsOpen(true);
        }
      }
    }, 350);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isCurrentSaved = savedLocations.some(
    (l) =>
      Math.abs(l.latitude - currentLocation.latitude) < 0.05 &&
      Math.abs(l.longitude - currentLocation.longitude) < 0.05
  );

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors ${
        theme === 'dark'
          ? 'border-slate-800/80 bg-slate-950/90 text-slate-100'
          : 'border-slate-300 bg-white/95 text-slate-900 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 min-h-16 py-2 flex flex-wrap items-center justify-between gap-2 sm:gap-4">
        
        {/* Logo / Brand */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white shadow-sm shadow-cyan-500/20">
            <Compass className="w-5 h-5" />
          </div>
          <div className="hidden md:block">
            <span className="font-bold text-lg tracking-tight">{t.appName}</span>
            <span
              className={`text-[10px] ml-1.5 px-1.5 py-0.5 rounded font-mono uppercase ${
                theme === 'dark'
                  ? 'bg-cyan-950/80 text-cyan-400 border border-cyan-800/50'
                  : 'bg-cyan-100 text-cyan-800 border border-cyan-300'
              }`}
            >
              {t.appBadge}
            </span>
          </div>
        </div>

        {/* Global Search with Autocomplete */}
        <div ref={searchContainerRef} className="relative flex-1 min-w-[170px] max-w-xs sm:max-w-sm md:max-w-md">
          <div className="relative flex items-center">
            <Search
              className={`absolute w-4 h-4 pointer-events-none ${
                lang === 'fa' ? 'right-3' : 'left-3'
              } ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}
            />
            <input
              id="weather-search-input"
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder={t.searchPlaceholder}
              className={`w-full py-2 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/30 ${
                lang === 'fa' ? 'pr-9 pl-8 text-right' : 'pl-9 pr-8 text-left'
              } ${
                theme === 'dark'
                  ? 'bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-cyan-500/70'
                  : 'bg-slate-100 border border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-cyan-600 focus:bg-white'
              }`}
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setResults([]);
                }}
                className={`absolute p-0.5 ${lang === 'fa' ? 'left-2.5' : 'right-2.5'} ${
                  theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            {isSearching && (
              <Loader2
                className={`absolute w-4 h-4 text-cyan-500 animate-spin ${
                  lang === 'fa' ? 'left-2.5' : 'right-2.5'
                }`}
              />
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {isOpen && (
            <div
              className={`absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto border ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-800 text-slate-100'
                  : 'bg-white border-slate-300 text-slate-900 shadow-xl'
              }`}
            >
              {results.length > 0 ? (
                <div className="py-1 divide-y divide-slate-800/20">
                  {results.map((loc) => (
                    <button
                      key={`${loc.id}-${loc.latitude}-${loc.longitude}`}
                      onClick={() => {
                        onSelectLocation(loc);
                        setQuery('');
                        setIsOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 flex items-center justify-between text-left gap-2 transition-colors cursor-pointer ${
                        theme === 'dark' ? 'hover:bg-slate-800/80' : 'hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <MapPin className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                        <span className="text-sm font-semibold truncate">{loc.name}</span>
                        {loc.admin1 && (
                          <span
                            className={`text-xs truncate ${
                              theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                            }`}
                          >
                            {loc.admin1}
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-xs font-mono flex-shrink-0 ${
                          theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                        }`}
                      >
                        {loc.country}
                      </span>
                    </button>
                  ))}
                </div>
              ) : searchError ? (
                <div className="p-4 text-center text-xs text-rose-500">{t.searchFailed}</div>
              ) : query.trim().length >= 2 && !isSearching ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  {t.noCitiesFound} "{query}"
                </div>
              ) : (
                <div className="p-2.5">
                  <div
                    className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {t.popularMetros}
                  </div>
                  <div className="grid grid-cols-2 gap-1 mt-1">
                    {POPULAR_LOCATIONS.map((loc) => (
                      <button
                        key={loc.id}
                        onClick={() => {
                          onSelectLocation(loc);
                          setQuery('');
                          setIsOpen(false);
                        }}
                        className={`px-3 py-2 text-left rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                          theme === 'dark'
                            ? 'text-slate-300 hover:bg-slate-800'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>{loc.name}</span>
                        <span
                          className={`text-[10px] ${
                            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                          }`}
                        >
                          {loc.country}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Controls & Settings */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          
          {/* PWA Install Button */}
          <PWAInstallButton lang={lang} theme={theme} />

          {/* Language Switcher (Dari / English) */}
          <button
            id="lang-toggle-btn"
            type="button"
            onClick={() => onToggleLang(lang === 'en' ? 'fa' : 'en')}
            title={lang === 'en' ? 'تغییر به فارسی دری' : 'Switch to English'}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs flex-shrink-0 ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-800 text-slate-200 hover:text-cyan-400 hover:border-cyan-500/50'
                : 'bg-white border-slate-300 text-slate-800 hover:text-cyan-600 hover:border-cyan-500 hover:bg-slate-50'
            }`}
          >
            <Languages className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0" />
            <span className="font-semibold">{lang === 'en' ? 'دری' : 'EN'}</span>
          </button>

          {/* Light / Dark Mode Toggle - HIGH VISIBILITY & CONTRAST */}
          <button
            id="theme-mode-toggle-btn"
            type="button"
            onClick={() => onToggleTheme(theme === 'dark' ? 'light' : 'dark')}
            title={theme === 'dark' ? 'تغییر به حالت روشن (Light Mode)' : 'تغییر به حالت تاریک (Dark Mode)'}
            aria-label="Toggle Theme Mode"
            className={`p-2 rounded-xl border transition-all cursor-pointer shadow-sm flex items-center justify-center flex-shrink-0 ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-700 text-amber-300 hover:bg-slate-800 hover:border-amber-400/50 hover:scale-105'
                : 'bg-white border-slate-300 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 hover:scale-105 ring-1 ring-slate-200'
            }`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 stroke-[2.5]" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 stroke-[2.5] fill-indigo-100" />
            )}
          </button>

          {/* GPS Current Location */}
          <button
            id="gps-location-btn"
            type="button"
            onClick={onUseCurrentLocation}
            disabled={isLocating}
            title={t.gpsTooltip}
            className={`p-2 rounded-xl border transition-all disabled:opacity-50 cursor-pointer shadow-xs flex-shrink-0 ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40'
                : 'bg-white border-slate-300 text-slate-700 hover:text-cyan-600 hover:border-cyan-400'
            }`}
          >
            {isLocating ? (
              <Loader2 className="w-4 h-4 animate-spin text-cyan-500" />
            ) : (
              <MapPin className="w-4 h-4 text-cyan-600" />
            )}
          </button>

          {/* Bookmark / Favorite current location */}
          <button
            id="save-location-btn"
            type="button"
            onClick={() => onToggleSaveLocation(currentLocation)}
            title={isCurrentSaved ? t.removeFavorite : t.addFavorite}
            className={`p-2 rounded-xl border transition-all cursor-pointer shadow-xs flex-shrink-0 ${
              isCurrentSaved
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-500'
                : theme === 'dark'
                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                : 'bg-white border-slate-300 text-slate-600 hover:text-slate-900'
            }`}
          >
            {isCurrentSaved ? (
              <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500/30" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>

          {/* Refresh Data */}
          <button
            id="refresh-weather-btn"
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            title={t.refreshTooltip}
            className={`p-2 rounded-xl border transition-all disabled:opacity-50 cursor-pointer shadow-xs flex-shrink-0 ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                : 'bg-white border-slate-300 text-slate-600 hover:text-slate-900'
            }`}
          >
            <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-500' : ''}`} />
          </button>

          {/* Metric / Imperial Unit Toggle */}
          <div
            id="unit-system-toggle"
            className={`flex items-center p-0.5 rounded-xl border shadow-xs flex-shrink-0 ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-800'
                : 'bg-white border-slate-300'
            }`}
          >
            <button
              type="button"
              onClick={() => onToggleUnit('metric')}
              className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                unit === 'metric'
                  ? 'bg-cyan-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              °C
            </button>
            <button
              type="button"
              onClick={() => onToggleUnit('imperial')}
              className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                unit === 'imperial'
                  ? 'bg-cyan-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              °F
            </button>
          </div>

        </div>
      </div>

      {/* Saved Cities Quick Pills Bar */}
      {savedLocations.length > 0 && (
        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-2 overflow-x-auto border-t no-scrollbar ${
            theme === 'dark' ? 'border-slate-900/60' : 'border-slate-200 bg-slate-50/50'
          }`}
        >
          <span
            className={`text-[11px] font-semibold uppercase tracking-wider flex-shrink-0 ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {t.favorites}
          </span>
          {savedLocations.map((loc) => {
            const isSelected =
              Math.abs(loc.latitude - currentLocation.latitude) < 0.05 &&
              Math.abs(loc.longitude - currentLocation.longitude) < 0.05;
            return (
              <button
                key={`${loc.id}-${loc.latitude}`}
                onClick={() => onSelectLocation(loc)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all flex-shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/40 font-bold'
                    : theme === 'dark'
                    ? 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700'
                    : 'bg-white text-slate-700 border border-slate-300 hover:border-slate-400 shadow-xs'
                }`}
              >
                <span>{loc.name}</span>
                {loc.country_code && (
                  <span className="text-[10px] opacity-75">{loc.country_code}</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
