import { LocationItem, WeatherData, HourlyForecastItem, DailyForecastItem } from '../types';

interface GeocodingResult {
  id?: number;
  name: string;
  country?: string;
  country_code?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

interface GeocodingResponse {
  results?: GeocodingResult[];
}

interface ForecastResponse {
  current?: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
    surface_pressure: number;
    cloud_cover: number;
    uv_index: number;
    precipitation: number;
    visibility?: number;
    is_day: number;
  };
  hourly?: {
    time?: string[];
    temperature_2m?: number[];
    weather_code?: number[];
    precipitation_probability?: number[];
    uv_index?: number[];
    is_day?: number[];
  };
  daily?: {
    time?: string[];
    weather_code?: number[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    sunrise?: string[];
    sunset?: string[];
    precipitation_probability_max?: number[];
    precipitation_sum?: number[];
    uv_index_max?: number[];
    wind_speed_10m_max?: number[];
  };
}

interface AirQualityResponse {
  current?: {
    us_aqi?: number;
    european_aqi?: number;
    pm2_5?: number;
    pm10?: number;
    nitrogen_dioxide?: number;
    ozone?: number;
    sulphur_dioxide?: number;
    carbon_monoxide?: number;
  };
}

export const POPULAR_LOCATIONS: LocationItem[] = [
  { id: 'kabul', name: 'کابل (Kabul)', country: 'افغانستان (Afghanistan)', latitude: 34.5553, longitude: 69.2075, timezone: 'Asia/Kabul' },
  { id: 'herat', name: 'هرات (Herat)', country: 'افغانستان (Afghanistan)', latitude: 34.3529, longitude: 62.2040, timezone: 'Asia/Kabul' },
  { id: 'mazar', name: 'مزار شریف (Mazar-i-Sharif)', country: 'افغانستان (Afghanistan)', latitude: 36.7090, longitude: 67.1109, timezone: 'Asia/Kabul' },
  { id: 'london', name: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' },
  { id: 'dubai', name: 'دبی (Dubai)', country: 'United Arab Emirates', latitude: 25.2048, longitude: 55.2708, timezone: 'Asia/Dubai' },
  { id: 'tehran', name: 'تهران (Tehran)', country: 'Iran', latitude: 35.6892, longitude: 51.3890, timezone: 'Asia/Tehran' },
];

export async function searchLocations(query: string): Promise<LocationItem[]> {
  if (!query.trim() || query.trim().length < 2) return [];
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query.trim()
    )}&count=8&language=en&format=json`
  );
  if (!res.ok) throw new Error(`Geocoding service responded with status ${res.status}`);
  const data = (await res.json()) as GeocodingResponse;
  if (!data.results || !Array.isArray(data.results)) return [];

  return data.results.map((item) => ({
    id: item.id ?? `${item.latitude}-${item.longitude}`,
    name: item.name,
    country: item.country || '',
    country_code: item.country_code,
    admin1: item.admin1,
    latitude: item.latitude,
    longitude: item.longitude,
    timezone: item.timezone,
  }));
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<LocationItem> {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    if (res.ok) {
      const data = await res.json();
      const name = data.city || data.locality || data.principalSubdivision || 'My Location';
      const country = data.countryName || '';
      const admin1 = data.principalSubdivision || '';
      return {
        id: `current-${latitude.toFixed(2)}-${longitude.toFixed(2)}`,
        name,
        country,
        admin1,
        latitude,
        longitude,
      };
    }
  } catch (error) {
    console.warn('Reverse geocoding error:', error);
  }

  return {
    id: `current-${latitude.toFixed(2)}-${longitude.toFixed(2)}`,
    name: 'Current Coordinates',
    country: '',
    latitude,
    longitude,
  };
}

export async function fetchWeatherData(location: LocationItem, signal?: AbortSignal): Promise<WeatherData> {
  const { latitude, longitude, timezone = 'auto' } = location;

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,cloud_cover,uv_index,visibility&hourly=temperature_2m,weather_code,precipitation_probability,uv_index,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=${encodeURIComponent(
    timezone || 'auto'
  )}`;

  const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi,european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&timezone=${encodeURIComponent(
    timezone || 'auto'
  )}`;

  const [weatherRes, aqiRes] = await Promise.all([
    fetch(weatherUrl, { signal }),
    fetch(airQualityUrl, { signal }).catch(() => null),
  ]);

  if (!weatherRes.ok) {
    throw new Error(`Weather service responded with status ${weatherRes.status}`);
  }

  const rawWeather = (await weatherRes.json()) as ForecastResponse;
  const cur = rawWeather.current;
  if (!cur || typeof cur.time !== 'string') {
    throw new Error('Weather service returned an invalid forecast');
  }

  const requiredCurrentValues = [
    cur.temperature_2m,
    cur.apparent_temperature,
    cur.relative_humidity_2m,
    cur.weather_code,
    cur.wind_speed_10m,
    cur.wind_direction_10m,
    cur.wind_gusts_10m,
    cur.surface_pressure,
    cur.cloud_cover,
    cur.uv_index,
    cur.precipitation,
    cur.is_day,
  ];
  if (requiredCurrentValues.some((value) => !Number.isFinite(value))) {
    throw new Error('Weather service returned incomplete current conditions');
  }

  let rawAqi: AirQualityResponse | null = null;
  if (aqiRes && aqiRes.ok) {
    try {
      rawAqi = (await aqiRes.json()) as AirQualityResponse;
    } catch {
      rawAqi = null;
    }
  }

  // Parse Hourly (first 48 hours for buffer)
  const hourlyData: HourlyForecastItem[] = [];
  if (rawWeather.hourly && rawWeather.hourly.time) {
    const times = rawWeather.hourly.time;
    const temps = rawWeather.hourly.temperature_2m || [];
    const codes = rawWeather.hourly.weather_code || [];
    const precipProb = rawWeather.hourly.precipitation_probability || [];
    const uv = rawWeather.hourly.uv_index || [];
    const isDay = rawWeather.hourly.is_day || [];

    // Find starting index matching current hour
    let startIndex = times.findIndex((time) => time.startsWith(cur.time.slice(0, 13)));
    if (startIndex === -1) startIndex = times.findIndex((time) => time >= cur.time);
    if (startIndex === -1) startIndex = 0;

    const count = Math.min(24, times.length - startIndex);
    for (let i = 0; i < count; i++) {
      const idx = startIndex + i;
      const t = times[idx];
      const hourDate = new Date(t);
      const hourLabel = hourDate.toLocaleTimeString([], { hour: 'numeric', hour12: true });

      hourlyData.push({
        time: t,
        hourLabel,
        temperature: temps[idx] ?? 0,
        weatherCode: codes[idx] ?? 0,
        precipitationProbability: precipProb[idx] ?? 0,
        uvIndex: uv[idx] ?? 0,
        isDay: Boolean(isDay[idx] ?? 1),
      });
    }
  }

  // Parse Daily (7-day forecast)
  const dailyData: DailyForecastItem[] = [];
  if (rawWeather.daily && rawWeather.daily.time) {
    const days = rawWeather.daily.time;
    const codes = rawWeather.daily.weather_code || [];
    const maxTemps = rawWeather.daily.temperature_2m_max || [];
    const minTemps = rawWeather.daily.temperature_2m_min || [];
    const sunrises = rawWeather.daily.sunrise || [];
    const sunsets = rawWeather.daily.sunset || [];
    const precipMax = rawWeather.daily.precipitation_probability_max || [];
    const precipSum = rawWeather.daily.precipitation_sum || [];
    const uvMax = rawWeather.daily.uv_index_max || [];
    const windMax = rawWeather.daily.wind_speed_10m_max || [];

    for (let i = 0; i < Math.min(7, days.length); i++) {
      const dateStr = days[i];
      const d = new Date(dateStr + 'T12:00:00');
      const dayLabel = i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const fullDateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      dailyData.push({
        date: dateStr,
        dayLabel,
        fullDateLabel,
        weatherCode: codes[i] ?? 0,
        tempMax: maxTemps[i] ?? 0,
        tempMin: minTemps[i] ?? 0,
        precipitationProbabilityMax: precipMax[i] ?? 0,
        precipitationSum: precipSum[i] ?? 0,
        uvIndexMax: uvMax[i] ?? 0,
        windSpeedMax: windMax[i] ?? 0,
        sunrise: sunrises[i] ?? '',
        sunset: sunsets[i] ?? '',
      });
    }
  }

  // Parse Air Quality
  let airQuality: WeatherData['airQuality'];
  if (rawAqi && rawAqi.current) {
    const curAqi = rawAqi.current;
    airQuality = {
      usAqi: curAqi.us_aqi ?? 0,
      europeanAqi: curAqi.european_aqi ?? 0,
      pm2_5: curAqi.pm2_5 ?? 0,
      pm10: curAqi.pm10 ?? 0,
      nitrogenDioxide: curAqi.nitrogen_dioxide ?? 0,
      ozone: curAqi.ozone ?? 0,
      sulphurDioxide: curAqi.sulphur_dioxide ?? 0,
      carbonMonoxide: curAqi.carbon_monoxide ?? 0,
    };
  }

  return {
    location,
    current: {
      time: cur.time,
      temperature: cur.temperature_2m,
      apparentTemperature: cur.apparent_temperature,
      humidity: cur.relative_humidity_2m,
      weatherCode: cur.weather_code,
      windSpeed: cur.wind_speed_10m,
      windDirection: cur.wind_direction_10m,
      windGusts: cur.wind_gusts_10m,
      pressure: cur.surface_pressure,
      cloudCover: cur.cloud_cover,
      uvIndex: cur.uv_index,
      precipitation: cur.precipitation,
      visibility: cur.visibility ?? 10000,
      isDay: Boolean(cur.is_day),
    },
    hourly: hourlyData,
    daily: dailyData,
    airQuality,
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}
