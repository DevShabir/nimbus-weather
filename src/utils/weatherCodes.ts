import { Language, translations } from '../translations';

export interface WeatherCodeInfo {
  code: number;
  label: string;
  iconName: 'Sun' | 'Moon' | 'CloudSun' | 'CloudMoon' | 'Cloud' | 'CloudFog' | 'CloudDrizzle' | 'CloudRain' | 'CloudSnow' | 'CloudLightning';
  description: string;
  gradientClass: string;
  badgeBg: string;
}

export function getWeatherCodeInfo(code: number, isDay: boolean = true, lang: Language = 'en'): WeatherCodeInfo {
  const t = translations[lang];

  switch (code) {
    case 0:
      return {
        code,
        label: isDay ? t.clearSkyDay : t.clearSkyNight,
        iconName: isDay ? 'Sun' : 'Moon',
        description: isDay
          ? (lang === 'fa' ? 'آسمان کاملاً صاف، آفتابی و دید بسیار عالی' : 'Clear, sunny conditions with great visibility')
          : (lang === 'fa' ? 'آسمان مهتابی، شفاف و بدون لکه ابری' : 'Crisp, starlit clear night skies'),
        gradientClass: isDay
          ? 'from-sky-500/20 via-amber-500/10 to-transparent'
          : 'from-indigo-950/40 via-purple-950/20 to-transparent',
        badgeBg: isDay ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
      };
    case 1:
      return {
        code,
        label: isDay ? t.mainlySunny : t.mostlyClear,
        iconName: isDay ? 'CloudSun' : 'CloudMoon',
        description: lang === 'fa' ? 'هوای مطلوب و ملایم با تکه‌های پراکنده ابر' : 'Gentle fair weather with faint patchy cloud cover',
        gradientClass: isDay
          ? 'from-sky-500/20 via-blue-500/10 to-transparent'
          : 'from-slate-900/40 via-indigo-950/20 to-transparent',
        badgeBg: isDay ? 'bg-sky-500/15 text-sky-300 border-sky-500/30' : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
      };
    case 2:
      return {
        code,
        label: t.partlyCloudy,
        iconName: isDay ? 'CloudSun' : 'CloudMoon',
        description: lang === 'fa' ? 'تابش متناوب خورشید با پوشش ابرهای گذرا' : 'Sun intermittently filtered by scattered cloud patches',
        gradientClass: 'from-blue-600/20 via-slate-600/10 to-transparent',
        badgeBg: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      };
    case 3:
      return {
        code,
        label: t.overcast,
        iconName: 'Cloud',
        description: lang === 'fa' ? 'پوشش ضخیم و یکدست ابر در پهنه آسمان' : 'Continuous gray cloud blanket sheltering the ground',
        gradientClass: 'from-slate-700/25 via-zinc-800/15 to-transparent',
        badgeBg: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
      };
    case 45:
    case 48:
      return {
        code,
        label: t.foggy,
        iconName: 'CloudFog',
        description: lang === 'fa' ? 'مه غلیظ و کاهش میدان دید در سطح زمین' : 'Dense ground-level mist causing reduced visibility',
        gradientClass: 'from-zinc-600/20 via-slate-700/15 to-transparent',
        badgeBg: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/30',
      };
    case 51:
    case 53:
    case 55:
      return {
        code,
        label: t.drizzle,
        iconName: 'CloudDrizzle',
        description: lang === 'fa' ? 'قطرات ریز و لطیف نم‌نم باران' : 'Fine, gentle droplets of mist and light rain',
        gradientClass: 'from-teal-600/20 via-slate-700/15 to-transparent',
        badgeBg: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
      };
    case 56:
    case 57:
      return {
        code,
        label: t.freezingDrizzle,
        iconName: 'CloudDrizzle',
        description: lang === 'fa' ? 'نم‌نم باران بسیار سرد و لغزندگی معابر' : 'Supercooled drizzle creating slick surface conditions',
        gradientClass: 'from-cyan-700/25 via-blue-900/15 to-transparent',
        badgeBg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      };
    case 61:
      return {
        code,
        label: t.slightRain,
        iconName: 'CloudRain',
        description: lang === 'fa' ? 'بارش باران آرام و یکنواخت' : 'Mild, steady raindrops falling continuously',
        gradientClass: 'from-cyan-600/20 via-blue-800/15 to-transparent',
        badgeBg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      };
    case 63:
      return {
        code,
        label: t.moderateRain,
        iconName: 'CloudRain',
        description: lang === 'fa' ? 'بارندگی پیوسته و ملموس در منطقه' : 'Regular steady rainfall across the region',
        gradientClass: 'from-blue-600/25 via-slate-800/20 to-transparent',
        badgeBg: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      };
    case 65:
      return {
        code,
        label: t.heavyRain,
        iconName: 'CloudRain',
        description: lang === 'fa' ? 'بارش شدید و پرحجم با آبگرفتگی سطح زمین' : 'Intense precipitation with strong ground accumulation',
        gradientClass: 'from-blue-700/30 via-indigo-900/25 to-transparent',
        badgeBg: 'bg-blue-600/20 text-blue-200 border-blue-500/40',
      };
    case 66:
    case 67:
      return {
        code,
        label: t.freezingRain,
        iconName: 'CloudRain',
        description: lang === 'fa' ? 'بارش باران منجمد و خطرناک' : 'Hazardous precipitation freezing immediately upon contact',
        gradientClass: 'from-sky-700/25 via-indigo-950/20 to-transparent',
        badgeBg: 'bg-sky-500/15 text-sky-200 border-sky-500/30',
      };
    case 71:
    case 73:
    case 75:
    case 77:
      return {
        code,
        label: code === 71 ? t.slightSnow : code === 73 ? t.moderateSnow : t.heavySnow,
        iconName: 'CloudSnow',
        description: lang === 'fa' ? 'بارش دانه‌های برف و سفیدپوش شدن منطقه' : 'Crystalline snowfall blanketing landscapes in white',
        gradientClass: 'from-slate-200/20 via-cyan-900/20 to-transparent',
        badgeBg: 'bg-cyan-400/15 text-cyan-200 border-cyan-400/30',
      };
    case 80:
    case 81:
    case 82:
      return {
        code,
        label: lang === 'fa' ? 'رگبار باران' : 'Rain Showers',
        iconName: 'CloudRain',
        description: lang === 'fa' ? 'رگبارهای متناوب و گذرا' : 'Intermittent bursts of lively rain showers',
        gradientClass: 'from-blue-600/25 via-cyan-900/15 to-transparent',
        badgeBg: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      };
    case 85:
    case 86:
      return {
        code,
        label: lang === 'fa' ? 'رگبار برف' : 'Snow Showers',
        iconName: 'CloudSnow',
        description: lang === 'fa' ? 'رگبارهای ناگهانی برف' : 'Gusty bursts of localized snow showers',
        gradientClass: 'from-slate-300/20 via-blue-900/20 to-transparent',
        badgeBg: 'bg-slate-400/15 text-slate-200 border-slate-400/30',
      };
    case 95:
      return {
        code,
        label: t.thunderstorm,
        iconName: 'CloudLightning',
        description: lang === 'fa' ? 'توفان الکتریکی، آذرخش و غرش رعد' : 'Dramatic electrical storm activity with rumbling thunder',
        gradientClass: 'from-amber-600/25 via-purple-900/30 to-transparent',
        badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      };
    case 96:
    case 99:
      return {
        code,
        label: t.thunderstormHail,
        iconName: 'CloudLightning',
        description: lang === 'fa' ? 'توفان شدید رعد و برق همراه با ریزش تگرگ' : 'Severe electrical storm producing dangerous hail stones',
        gradientClass: 'from-red-600/20 via-purple-900/35 to-transparent',
        badgeBg: 'bg-red-500/15 text-red-300 border-red-500/30',
      };
    default:
      return {
        code,
        label: t.partlyCloudy,
        iconName: isDay ? 'CloudSun' : 'CloudMoon',
        description: lang === 'fa' ? 'وضعیت جوی مساعد و نیمه‌ابری' : 'Fair meteorological conditions',
        gradientClass: 'from-blue-600/20 via-slate-800/10 to-transparent',
        badgeBg: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      };
  }
}
