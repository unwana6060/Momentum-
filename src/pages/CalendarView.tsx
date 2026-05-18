import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { useLanguage } from '../context/LanguageContext';

import AdBanner from '../components/AdBanner';

export default function CalendarView() {
  const { t } = useLanguage();
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Simulate a heatmap where some days are more intense
  const getIntensity = (date: Date) => {
    if (date > today) return 'empty';
    const rand = Math.random();
    if (rand > 0.7) return 'high';
    if (rand > 0.4) return 'medium';
    if (rand > 0.1) return 'low';
    return 'none';
  };

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-light tracking-tight mb-8 pt-2">The <span className="font-bold">{t('grid')}</span></h1>

      <div className="bg-momentum-surface border border-white/5 rounded-[24px] p-6">
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-xl font-bold">{format(today, 'MMMM yyyy')}</h2>
        </div>

        <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center mb-2">
          {dayNames.map((d, i) => (
            <div key={i} className="text-[10px] uppercase font-bold text-momentum-text-dim">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-3 gap-x-2">
          {/* Pad the first days of the week */}
          {Array.from({ length: monthStart.getDay() }).map((_, i) => (
            <div key={`pad-${i}`} className="aspect-square opacity-0"></div>
          ))}
          
          {days.map((day, i) => {
            const intensity = getIntensity(day);
            let bgClass = "bg-momentum-surface-light border border-white/5";
            
            if (intensity === 'high') bgClass = "bg-[#3B82F6] shadow-[0_0_10px_rgba(59,130,246,0.3)]";
            else if (intensity === 'medium') bgClass = "bg-[#3B82F6]/40";
            else if (intensity === 'low') bgClass = "bg-[#3B82F6]/10";
            else if (intensity === 'empty') bgClass = "bg-white/5 opacity-30";
            
            return (
              <div 
                key={day.toISOString()} 
                className={`flex items-center justify-center aspect-square rounded-xl text-xs font-semibold ${bgClass} ${isToday(day) ? 'ring-2 ring-white ring-offset-2 ring-offset-momentum-surface' : ''}`}
                title={format(day, 'MMM d, yyyy')}
              >
                <span className={intensity === 'none' || intensity === 'empty' ? 'text-momentum-text-dim' : 'text-white'}>
                  {format(day, 'd')}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Heatmap Legend */}
      <div className="mt-6 flex items-center justify-end gap-2 text-xs text-momentum-text-dim">
         <span>{t('less')}</span>
         <div className="w-4 h-4 rounded-md bg-momentum-surface-light border border-white/5"></div>
         <div className="w-4 h-4 rounded-md bg-[#3B82F6]/10"></div>
         <div className="w-4 h-4 rounded-md bg-[#3B82F6]/40"></div>
         <div className="w-4 h-4 rounded-md bg-[#3B82F6]"></div>
         <span>{t('more')}</span>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-medium text-momentum-text-dim uppercase tracking-wider mb-4">{t('focus')}</h3>
        <p className="text-sm leading-relaxed text-momentum-text-dim bg-momentum-surface p-4 rounded-[24px] border border-white/5">
          "{t('quote')}"
        </p>
      </div>

      <AdBanner 
        className="mt-6"
        title="Sync Everywhere"
        description="Access your grid on any device, anywhere."
        icon="✨"
        color="bg-indigo-500"
      />
    </div>
  );
}
