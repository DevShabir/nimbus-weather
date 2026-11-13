export type Language = 'en' | 'fa'; // 'fa' for Dari / Persian (فارسی دری)
export type ThemeMode = 'dark' | 'light';

export interface Translations {
  appName: string;
  appBadge: string;
  searchPlaceholder: string;
  searchFailed: string;
  popularMetros: string;
  noCitiesFound: string;
  favorites: string;
  refreshTooltip: string;
  gpsTooltip: string;
  addFavorite: string;
  removeFavorite: string;
  feelsLike: string;
  updated: string;
  hourlyForecast: string;
  next24Hours: string;
  cardsView: string;
  graphView: string;
  temp: string;
  precip: string;
  dailyForecast: string;
  clickForDetails: string;
  atmosphericConditions: string;
  wind: string;
  windGusts: string;
  uvIndex: string;
  humidity: string;
  dewPoint: string;
  pressure: string;
  visibility: string;
  airQuality: string;
  sunSchedule: string;
  sunrise: string;
  sunset: string;
  daylightRemaining: string;
  daylightEnded: string;
  liveRadarTitle: string;
  near: string;
  radarRain: string;
  satelliteClouds: string;
  precipitation: string;
  light: string;
  heavy: string;
  radarAttribution: string;
  footerTitle: string;
  footerMeteorology: string;
  footerRadar: string;
  footerStandards: string;
  retry: string;
  geolocationUnsupported: string;
  geolocationFailed: string;
  installApp: string;
  installAppMobile: string;
  installOnIOS: string;
  installIOSGuideTitle: string;
  installIOSGuideStep1: string;
  installIOSGuideStep2: string;
  close: string;
  offlineModeNotice: string;
  today: string;
  now: string;
  high: string;
  low: string;
  // Weather condition labels
  clearSkyDay: string;
  clearSkyNight: string;
  mainlySunny: string;
  mostlyClear: string;
  partlyCloudy: string;
  overcast: string;
  foggy: string;
  drizzle: string;
  freezingDrizzle: string;
  slightRain: string;
  moderateRain: string;
  heavyRain: string;
  freezingRain: string;
  slightSnow: string;
  moderateSnow: string;
  heavySnow: string;
  thunderstorm: string;
  thunderstormHail: string;
  // Beaufort
  calm: string;
  lightBreeze: string;
  gentleBreeze: string;
  moderateBreeze: string;
  freshBreeze: string;
  strongBreeze: string;
  highWind: string;
  galeForce: string;
  // AQI / UV categories
  good: string;
  moderate: string;
  sensitive: string;
  unhealthy: string;
  veryUnhealthy: string;
  hazardous: string;
  lowUv: string;
  moderateUv: string;
  highUv: string;
  veryHighUv: string;
  extremeUv: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'Nimbus',
    appBadge: 'PRO',
    searchPlaceholder: 'Search city, state, or country...',
    searchFailed: 'Location search failed. Check your connection and try again.',
    popularMetros: 'Popular Metros',
    noCitiesFound: 'No cities found matching',
    favorites: 'Favorites:',
    refreshTooltip: 'Refresh forecast',
    gpsTooltip: 'Use current GPS location',
    addFavorite: 'Add to favorites',
    removeFavorite: 'Remove from favorites',
    feelsLike: 'Feels like',
    updated: 'Updated',
    hourlyForecast: 'Hourly Forecast',
    next24Hours: 'Next 24 Hours',
    cardsView: 'Cards',
    graphView: 'Graph',
    temp: 'Temp',
    precip: 'Precip',
    dailyForecast: '7-Day Forecast',
    clickForDetails: 'Click day for details',
    atmosphericConditions: 'Atmospheric Conditions',
    wind: 'WIND',
    windGusts: 'Gusts up to',
    uvIndex: 'UV INDEX',
    humidity: 'HUMIDITY',
    dewPoint: 'The dew point is',
    pressure: 'AIR PRESSURE',
    visibility: 'VISIBILITY',
    airQuality: 'AIR QUALITY (AQI)',
    sunSchedule: 'SUN & DAYLIGHT',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    daylightRemaining: 'daylight left',
    daylightEnded: 'Daylight cycle completed',
    liveRadarTitle: 'Live Weather Radar & Satellite',
    near: 'Near',
    radarRain: 'Radar (Rain)',
    satelliteClouds: 'Satellite (Clouds)',
    precipitation: 'Precipitation:',
    light: 'Light',
    heavy: 'Heavy',
    radarAttribution: 'Interactive Doppler & Cloud Motion',
    footerTitle: 'Nimbus Weather — DevShabir',
    footerMeteorology: 'Meteorological Data by Open-Meteo',
    footerRadar: 'Radar by RainViewer',
    footerStandards: 'WMO Standards',
    retry: 'Retry',
    geolocationUnsupported: 'Geolocation is not supported by your browser.',
    geolocationFailed: 'Unable to get your location. Check your browser permissions and try again.',
    installApp: 'Install App',
    installAppMobile: 'Install',
    installOnIOS: 'Install on iOS',
    installIOSGuideTitle: 'Install on iPhone / iPad',
    installIOSGuideStep1: 'Tap the Share button in Safari toolbar.',
    installIOSGuideStep2: 'Scroll down and tap Add to Home Screen.',
    close: 'Close',
    offlineModeNotice: 'Offline Mode — Showing cached weather data.',
    today: 'Today',
    now: 'Now',
    high: 'High',
    low: 'Low',
    clearSkyDay: 'Clear Sky',
    clearSkyNight: 'Clear Night',
    mainlySunny: 'Mainly Sunny',
    mostlyClear: 'Mostly Clear',
    partlyCloudy: 'Partly Cloudy',
    overcast: 'Overcast',
    foggy: 'Foggy',
    drizzle: 'Drizzle',
    freezingDrizzle: 'Freezing Drizzle',
    slightRain: 'Slight Rain',
    moderateRain: 'Moderate Rain',
    heavyRain: 'Heavy Rain',
    freezingRain: 'Freezing Rain',
    slightSnow: 'Slight Snow',
    moderateSnow: 'Moderate Snow',
    heavySnow: 'Heavy Snow',
    thunderstorm: 'Thunderstorm',
    thunderstormHail: 'Thunderstorm with Hail',
    calm: 'Calm',
    lightBreeze: 'Light Breeze',
    gentleBreeze: 'Gentle Breeze',
    moderateBreeze: 'Moderate Breeze',
    freshBreeze: 'Fresh Breeze',
    strongBreeze: 'Strong Breeze',
    highWind: 'High Wind',
    galeForce: 'Gale Force',
    good: 'Good',
    moderate: 'Moderate',
    sensitive: 'Sensitive',
    unhealthy: 'Unhealthy',
    veryUnhealthy: 'Very Unhealthy',
    hazardous: 'Hazardous',
    lowUv: 'Low',
    moderateUv: 'Moderate',
    highUv: 'High',
    veryHighUv: 'Very High',
    extremeUv: 'Extreme',
  },
  fa: {
    appName: 'نیمبوس',
    appBadge: 'حرفه‌ای',
    searchPlaceholder: 'جستجوی شهر، ولایت یا کشور...',
    searchFailed: 'جستجوی مکان انجام نشد. اتصال اینترنت را بررسی کرده و دوباره تلاش کنید.',
    popularMetros: 'شهرهای مشهور',
    noCitiesFound: 'هیچ شهری مطابق پیدا نشد',
    favorites: 'مکان‌های برگزیده:',
    refreshTooltip: 'تازه‌سازی پیش‌بینی آب و هوا',
    gpsTooltip: 'استفاده از موقعیت مکانی GPS فعلی',
    addFavorite: 'افزودن به برگزیده‌ها',
    removeFavorite: 'حذف از برگزیده‌ها',
    feelsLike: 'دمای احساسی',
    updated: 'بروزرسانی',
    hourlyForecast: 'پیش‌بینی ساعتی',
    next24Hours: '۲۴ ساعت آینده',
    cardsView: 'کارت‌ها',
    graphView: 'نمودار',
    temp: 'دما',
    precip: 'بارندگی',
    dailyForecast: 'پیش‌بینی ۷ روزه',
    clickForDetails: 'برای جزئیات بیشتر روی هر روز کلیک کنید',
    atmosphericConditions: 'شرایط اتمسفر و جوی',
    wind: 'سرعت و جهت باد',
    windGusts: 'تندباد تا',
    uvIndex: 'شاخص فرابنفش (UV)',
    humidity: 'میزان رطوبت',
    dewPoint: 'نقطه شبنم حدود',
    pressure: 'فشار هوا',
    visibility: 'دید افقی',
    airQuality: 'کیفیت هوا (AQI)',
    sunSchedule: 'طلوع و غروب آفتاب',
    sunrise: 'طلوع آفتاب',
    sunset: 'غروب آفتاب',
    daylightRemaining: 'از روشنایی روز باقی‌مانده',
    daylightEnded: 'ساعات روز به پایان رسیده است',
    liveRadarTitle: 'رادار زنده بارش و ماهواره ابری',
    near: 'حوالی',
    radarRain: 'رادار بارش (باران)',
    satelliteClouds: 'ماهواره (حرکت ابرها)',
    precipitation: 'میزان بارندگی:',
    light: 'اندک',
    heavy: 'شدید',
    radarAttribution: 'نقشه متحرک داپلر و پوشش ابری',
    footerTitle: 'نیمبوس — ساخته DevShabir',
    footerMeteorology: 'داده‌های جوی توسط Open-Meteo',
    footerRadar: 'رادار هواشناسی توسط RainViewer',
    footerStandards: 'استانداردهای سازمان جهانی هواشناسی (WMO)',
    retry: 'تلاش مجدد',
    geolocationUnsupported: 'مرورگر شما از موقعیت‌یاب جغرافیایی پشتیبانی نمی‌کند.',
    geolocationFailed: 'دریافت موقعیت شما ممکن نشد. دسترسی موقعیت‌یابی را بررسی و دوباره تلاش کنید.',
    installApp: 'نصب اپلیکیشن',
    installAppMobile: 'نصب',
    installOnIOS: 'نصب در آیفون / iOS',
    installIOSGuideTitle: 'راهنمای نصب روی آیفون و آیپد',
    installIOSGuideStep1: 'در نوار سافاری دکمه اشتراک‌گذاری (Share) را بزنید.',
    installIOSGuideStep2: 'گزینه «Add to Home Screen» را انتخاب کنید.',
    close: 'بستن',
    offlineModeNotice: 'حالت آفلاین — نمایش آخرین داده‌های ذخیره شده.',
    today: 'امروز',
    now: 'اکنون',
    high: 'حداکثر',
    low: 'حداقل',
    clearSkyDay: 'آسمان صاف و آفتابی',
    clearSkyNight: 'آسمان مهتابی و شفاف',
    mainlySunny: 'عمدتاً آفتابی',
    mostlyClear: 'عمدتاً صاف',
    partlyCloudy: 'قسمتی ابری',
    overcast: 'کاملاً ابری',
    foggy: 'مه‌آلود',
    drizzle: 'نم‌نم باران',
    freezingDrizzle: 'نم‌نم باران یخ‌زده',
    slightRain: 'باران ملایم',
    moderateRain: 'باران متوسط',
    heavyRain: 'باران شدید',
    freezingRain: 'باران منجمد',
    slightSnow: 'برف خفیف',
    moderateSnow: 'برف متوسط',
    heavySnow: 'برف سنگین',
    thunderstorm: 'رعد و برق و توفان',
    thunderstormHail: 'توفان تندری همراه با تگرگ',
    calm: 'آرام بدون باد',
    lightBreeze: 'نسیم بسیار ملایم',
    gentleBreeze: 'نسیم دلپذیر',
    moderateBreeze: 'نسیم معتدل',
    freshBreeze: 'نسیم خنک و تازه',
    strongBreeze: 'باد شدید',
    highWind: 'باد تند',
    galeForce: 'توفان سهمگین',
    good: 'پاک و عالی',
    moderate: 'قابل قبول',
    sensitive: 'ناسالم برای گروه‌های حساس',
    unhealthy: 'ناسالم',
    veryUnhealthy: 'بسیار ناسالم',
    hazardous: 'خطرناک',
    lowUv: 'پایین',
    moderateUv: 'متوسط',
    highUv: 'بالا',
    veryHighUv: 'بسیار بالا',
    extremeUv: 'بسیار خطرناک',
  },
};
