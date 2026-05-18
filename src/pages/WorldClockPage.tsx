import React, { useState, useEffect } from 'react';
import { Clock, Globe } from 'lucide-react';
import { motion } from 'motion/react';

interface CityTime {
  city: string;
  country: string;
  timezone: string;
  flag: string;
}

const cities: CityTime[] = [
  { city: 'Lagos', country: 'Nigeria', timezone: 'Africa/Lagos', flag: '🇳🇬' },
  { city: 'London', country: 'UK', timezone: 'Europe/London', flag: '🇬🇧' },
  { city: 'New York', country: 'USA', timezone: 'America/New_York', flag: '🇺🇸' },
  { city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', flag: '🇯🇵' },
  { city: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai', flag: '🇦🇪' },
  { city: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', flag: '🇸🇬' },
  { city: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin', flag: '🇩🇪' },
  { city: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', flag: '🇦🇺' },
  { city: 'Sao Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo', flag: '🇧🇷' },
  { city: 'New Delhi', country: 'India', timezone: 'Asia/Kolkata', flag: '🇮🇳' },
];

export default function WorldClockPage() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (timezone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(time);
  };

  const formatDate = (timezone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(time);
  };

  return (
    <div className="p-6">
      <div className="mb-8 pt-2">
        <h1 className="text-3xl font-light tracking-tight">World <span className="font-bold">Clock</span></h1>
        <p className="text-momentum-text-dim text-sm mt-1">Global momentum tracking across timezones.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {cities.map((city, index) => (
          <motion.div
            key={city.city}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-momentum-surface/40 backdrop-blur-md border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:bg-momentum-surface/60 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="text-2xl">{city.flag}</div>
              <div>
                <h3 className="text-white font-semibold text-base leading-tight">{city.city}</h3>
                <p className="text-momentum-text-dim text-xs uppercase tracking-wider">{city.country}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center justify-end gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-momentum-accent animate-pulse"></div>
                <div className="text-xl font-mono font-bold text-momentum-accent tracking-tighter">
                  {formatTime(city.timezone)}
                </div>
              </div>
              <div className="text-[10px] text-momentum-text-dim font-medium uppercase tracking-widest mt-0.5">
                {formatDate(city.timezone)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-8 p-6 bg-momentum-accent/10 border border-momentum-accent/20 rounded-3xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-momentum-accent flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
          <Globe className="text-white w-6 h-6" />
        </div>
        <div>
          <h4 className="text-white font-medium text-sm">Synchronized Performance</h4>
          <p className="text-momentum-text-dim text-xs leading-relaxed">No matter where you are, Momentum keeps your discipline aligned with your local environment.</p>
        </div>
      </div>
    </div>
  );
}
