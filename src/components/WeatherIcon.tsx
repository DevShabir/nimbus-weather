import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
} from 'lucide-react';
import { getWeatherCodeInfo } from '../utils/weatherCodes';

interface WeatherIconProps {
  code: number;
  isDay?: boolean;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  code,
  isDay = true,
  className = 'w-6 h-6',
  size,
}) => {
  const info = getWeatherCodeInfo(code, isDay);

  const props = {
    className,
    size,
    strokeWidth: 1.8,
  };

  switch (info.iconName) {
    case 'Sun':
      return <Sun {...props} className={`${className} text-amber-400`} />;
    case 'Moon':
      return <Moon {...props} className={`${className} text-indigo-300`} />;
    case 'CloudSun':
      return <CloudSun {...props} className={`${className} text-amber-300`} />;
    case 'CloudMoon':
      return <CloudMoon {...props} className={`${className} text-indigo-300`} />;
    case 'Cloud':
      return <Cloud {...props} className={`${className} text-slate-300`} />;
    case 'CloudFog':
      return <CloudFog {...props} className={`${className} text-zinc-300`} />;
    case 'CloudDrizzle':
      return <CloudDrizzle {...props} className={`${className} text-teal-300`} />;
    case 'CloudRain':
      return <CloudRain {...props} className={`${className} text-cyan-400`} />;
    case 'CloudSnow':
      return <CloudSnow {...props} className={`${className} text-sky-200`} />;
    case 'CloudLightning':
      return <CloudLightning {...props} className={`${className} text-amber-400`} />;
    default:
      return <CloudSun {...props} className={`${className} text-amber-300`} />;
  }
};
