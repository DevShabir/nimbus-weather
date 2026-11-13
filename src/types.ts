export type UnitSystem = 'metric' | 'imperial';

export interface LocationItem {
  id: number | string;
  name: string;
  country: string;
  country_code?: string;
  admin1?: string; // State or province
  latitude: number;
  longitude: number;
  timezone?: string;
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  pressure: number;
  cloudCover: number;
  uvIndex: number;
  precipitation: number;
  visibility: number;
  isDay: boolean;
}

export interface HourlyForecastItem {
  time: string; // ISO string
  hourLabel: string; // e.g., "14:00" or "2 PM"
  temperature: number;
  weatherCode: number;
  precipitationProbability: number;
  uvIndex: number;
  isDay: boolean;
}

export interface DailyForecastItem {
  date: string; // YYYY-MM-DD
  dayLabel: string; // e.g. "Today", "Mon", "Tue"
  fullDateLabel: string; // e.g. "Sep 12"
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationProbabilityMax: number;
  precipitationSum: number;
  uvIndexMax: number;
  windSpeedMax: number;
  sunrise: string;
  sunset: string;
}

export interface AirQualityData {
  usAqi: number;
  europeanAqi: number;
  pm2_5: number;
  pm10: number;
  nitrogenDioxide: number;
  ozone: number;
  sulphurDioxide: number;
  carbonMonoxide: number;
}

export interface WeatherData {
  location: LocationItem;
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  airQuality?: AirQualityData;
  lastUpdated: string;
}
