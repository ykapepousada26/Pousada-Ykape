import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudLightning, Wind } from 'lucide-react';
import { motion } from 'motion/react';

interface WeatherData {
  temperature: number;
  weathercode: number;
}

export const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('/api/weather');
        const data = await response.json();
        if (data.current_weather) {
          setWeather({
            temperature: Math.round(data.current_weather.temperature),
            weathercode: data.current_weather.weathercode,
          });
        }
      } catch (error) {
        console.error('Error fetching weather:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    // Refresh weather every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (code: number) => {
    if (code <= 3) return <Sun className="w-5 h-5 text-yellow-400" />;
    if (code <= 48) return <Cloud className="w-5 h-5 text-blue-200" />;
    if (code <= 67 || code >= 80) return <CloudRain className="w-5 h-5 text-blue-400" />;
    if (code >= 95) return <CloudLightning className="w-5 h-5 text-purple-400" />;
    return <Wind className="w-5 h-5 text-gray-300" />;
  };

  const getWeatherDescription = (code: number) => {
    if (code === 0) return 'Céu Limpo';
    if (code <= 3) return 'Parcialmente Nublado';
    if (code <= 48) return 'Nublado';
    if (code <= 67 || code >= 80) return 'Chuva';
    if (code >= 95) return 'Tempestade';
    return 'Ventania';
  };

  if (loading) return null;
  if (!weather) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-white"
      id="weather-widget"
    >
      <div className="flex items-center gap-2">
        {getWeatherIcon(weather.weathercode)}
        <span className="font-bold text-lg">{weather.temperature}°C</span>
      </div>
      <div className="w-px h-4 bg-white/20" />
      <div className="flex flex-col leading-tight">
        <span className="text-[10px] uppercase tracking-wider opacity-70">Ilha Comprida</span>
        <span className="text-xs font-medium">{getWeatherDescription(weather.weathercode)}</span>
      </div>
    </motion.div>
  );
};
