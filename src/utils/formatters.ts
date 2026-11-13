import { UnitSystem } from '../types';
import { Language, translations } from '../translations';

export function formatTemp(celsius: number, unit: UnitSystem): string {
  if (unit === 'imperial') {
    const fahrenheit = (celsius * 9) / 5 + 32;
    return `${Math.round(fahrenheit)}°`;
  }
  return `${Math.round(celsius)}°`;
}

export function formatTempNumber(celsius: number, unit: UnitSystem): number {
  if (unit === 'imperial') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function getTempUnitSymbol(unit: UnitSystem): string {
  return unit === 'imperial' ? '°F' : '°C';
}

export function formatWindSpeed(kmh: number, unit: UnitSystem, lang: Language = 'en'): string {
  if (unit === 'imperial') {
    const mph = kmh * 0.621371;
    return lang === 'fa' ? `${Math.round(mph)} مایل/ساعت` : `${Math.round(mph)} mph`;
  }
  return lang === 'fa' ? `${Math.round(kmh)} کیلومتر/ساعت` : `${Math.round(kmh)} km/h`;
}

export function formatPressure(hpa: number, unit: UnitSystem, lang: Language = 'en'): string {
  if (unit === 'imperial') {
    const inhg = hpa * 0.02953;
    return `${inhg.toFixed(2)} inHg`;
  }
  return lang === 'fa' ? `${Math.round(hpa)} هکتوپاسکال` : `${Math.round(hpa)} hPa`;
}

export function formatVisibility(metersOrKm: number, unit: UnitSystem, lang: Language = 'en'): string {
  const km = metersOrKm >= 1000 ? metersOrKm / 1000 : metersOrKm;
  if (unit === 'imperial') {
    const miles = km * 0.621371;
    return lang === 'fa' ? `${miles.toFixed(1)} مایل` : `${miles.toFixed(1)} mi`;
  }
  return lang === 'fa' ? `${km.toFixed(1)} کیلومتر` : `${km.toFixed(1)} km`;
}

export function formatPrecipitation(mm: number, unit: UnitSystem, lang: Language = 'en'): string {
  if (unit === 'imperial') {
    const inches = mm * 0.0393701;
    return lang === 'fa' ? `${inches.toFixed(2)} اینچ` : `${inches.toFixed(2)} in`;
  }
  return lang === 'fa' ? `${mm.toFixed(1)} میلی‌متر` : `${mm.toFixed(1)} mm`;
}

export function getWindDirectionLabel(deg: number, lang: Language = 'en'): string {
  const directionsEn = [
    'N', 'NNE', 'NE', 'ENE',
    'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW',
    'W', 'WNW', 'NW', 'NNW'
  ];
  const directionsFa = [
    'شمال', 'شمال-شمال‌شرق', 'شمال‌شرق', 'شرق-شمال‌شرق',
    'شرق', 'شرق-جنوب‌شرق', 'جنوب‌شرق', 'جنوب-جنوب‌شرق',
    'جنوب', 'جنوب-جنوب‌غرب', 'جنوب‌غرب', 'غرب-جنوب‌غرب',
    'غرب', 'غرب-شمال‌غرب', 'شمال‌غرب', 'شمال-شمال‌غرب'
  ];
  const index = Math.round(((deg %= 360) < 0 ? deg + 360 : deg) / 22.5) % 16;
  return lang === 'fa' ? directionsFa[index] : directionsEn[index];
}

export function getUvCategory(uv: number, lang: Language = 'en'): { label: string; color: string; advice: string } {
  const t = translations[lang];
  if (uv <= 2) {
    return {
      label: t.lowUv,
      color: 'text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      advice: lang === 'fa' ? 'خطر تابش اندک و بی‌خطر' : 'Minimal sun hazard'
    };
  }
  if (uv <= 5) {
    return {
      label: t.moderateUv,
      color: 'text-amber-500 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
      advice: lang === 'fa' ? 'استفاده از عینک آفتابی یا کلاه توصیه می‌شود' : 'Wear sunglasses & hat'
    };
  }
  if (uv <= 7) {
    return {
      label: t.highUv,
      color: 'text-orange-500 dark:text-orange-400 bg-orange-500/10 border-orange-500/20',
      advice: lang === 'fa' ? 'پوشش محافظتی و کرم ضدآفتاب لازم است' : 'Protection needed'
    };
  }
  if (uv <= 10) {
    return {
      label: t.veryHighUv,
      color: 'text-rose-500 dark:text-rose-400 bg-rose-500/10 border-rose-500/20',
      advice: lang === 'fa' ? 'در ساعات اوج ظهر در سایه بمانید' : 'Seek midday shade'
    };
  }
  return {
    label: t.extremeUv,
    color: 'text-purple-500 dark:text-purple-400 bg-purple-500/10 border-purple-500/20',
    advice: lang === 'fa' ? 'از قرارگیری طولانی زیر آفتاب پرهیز کنید' : 'Avoid outdoor sun'
  };
}

export function getAqiCategory(aqi: number, lang: Language = 'en'): { label: string; color: string; advice: string } {
  const t = translations[lang];
  if (aqi <= 50) {
    return {
      label: t.good,
      color: 'text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      advice: lang === 'fa' ? 'هوا پاک و کاملاً سالم برای فعالیت باز است.' : 'Air quality is satisfactory and poses little or no risk.'
    };
  }
  if (aqi <= 100) {
    return {
      label: t.moderate,
      color: 'text-amber-500 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
      advice: lang === 'fa' ? 'کیفیت هوا قابل قبول است؛ افراد بسیار حساس احتیاط کنند.' : 'Acceptable; sensitive individuals may experience mild symptoms.'
    };
  }
  if (aqi <= 150) {
    return {
      label: t.sensitive,
      color: 'text-orange-500 dark:text-orange-400 bg-orange-500/10 border-orange-500/20',
      advice: lang === 'fa' ? 'ناسالم برای سالمندان، کودکان و بیماران تنفسی.' : 'General public not likely affected; sensitive groups at risk.'
    };
  }
  if (aqi <= 200) {
    return {
      label: t.unhealthy,
      color: 'text-rose-500 dark:text-rose-400 bg-rose-500/10 border-rose-500/20',
      advice: lang === 'fa' ? 'هوا ناسالم است، از ورزش سنگین در فضای باز خودداری کنید.' : 'Everyone may begin to experience health effects.'
    };
  }
  if (aqi <= 300) {
    return {
      label: t.veryUnhealthy,
      color: 'text-purple-500 dark:text-purple-400 bg-purple-500/10 border-purple-500/20',
      advice: lang === 'fa' ? 'هشدار سلامت: اثرات جدی بر تمام افراد جامعه.' : 'Health alert: risk of more serious health effects for everyone.'
    };
  }
  return {
    label: t.hazardous,
    color: 'text-red-500 bg-red-500/15 border-red-500/30',
    advice: lang === 'fa' ? 'وضعیت خطرناک؛ در خانه بمانید و پنجره‌ها را ببندید.' : 'Emergency health warnings. Stay indoors.'
  };
}

export function formatTimeOnly(isoString: string, lang: Language = 'en'): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString(lang === 'fa' ? 'fa-AF' : 'en-US', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return isoString;
  }
}

export function getDaylightProgress(
  sunriseIso: string,
  sunsetIso: string,
  currentTimeIso = new Date().toISOString()
): number {
  const now = new Date(currentTimeIso).getTime();
  const rise = new Date(sunriseIso).getTime();
  const set = new Date(sunsetIso).getTime();
  if (![now, rise, set].every(Number.isFinite) || set <= rise) return 0;
  if (now <= rise) return 0;
  if (now >= set) return 100;
  return Math.round(((now - rise) / (set - rise)) * 100);
}
