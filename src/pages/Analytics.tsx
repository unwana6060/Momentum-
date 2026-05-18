import React, { useState, useEffect } from 'react';
import { useAuth } from '../firebase/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { format, subDays } from 'date-fns';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Activity, Flame, Target } from 'lucide-react';

import AdBanner from '../components/AdBanner';

export default function Analytics() {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  
  // Dummy data representing past 7 days of completions
  const data = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(new Date(), 6 - i);
    return {
      name: format(d, 'EEE'), // Mon, Tue...
      completions: Math.floor(Math.random() * 5) + 1,
    };
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-light tracking-tight mb-8 pt-2">{language === 'en' ? 'Your' : ''} <span className="font-bold">{t('analytics')}</span></h1>

      {/* Top Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
         <div className="bg-momentum-surface rounded-[24px] p-6 border border-white/5 relative overflow-hidden">
           <div className="absolute -right-4 -bottom-4 opacity-10">
              <Activity className="w-24 h-24 text-momentum-text" />
           </div>
           <p className="text-[13px] text-momentum-text-dim mt-1 order-2">{t('consistency')}</p>
           <p className="text-[32px] font-bold text-[#F8FAFC] order-1">82%</p>
         </div>
         <div className="bg-momentum-surface rounded-[24px] p-6 border border-momentum-accent/20 relative overflow-hidden flex flex-col justify-end">
           <div className="absolute -right-2 -top-2 opacity-20">
              <Flame className="w-20 h-20 text-orange-500" />
           </div>
           <p className="text-[13px] text-momentum-text-dim mt-1 order-2 inline-flex items-center gap-1">{t('days')} {t('streak')}</p>
           <p className="text-[32px] font-bold text-[#F8FAFC] order-1">12</p>
         </div>
      </div>

      {/* Bar Chart */}
      <section className="mb-8 bg-momentum-surface p-6 rounded-[24px] border border-white/5">
        <h2 className="text-sm font-medium text-momentum-text-dim uppercase tracking-wider mb-6">{t('weeklyPerf')}</h2>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis 
                 dataKey="name" 
                 axisLine={false} 
                 tickLine={false} 
                 tick={{ fill: '#9ca3af', fontSize: 12 }} 
                 dy={10}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              />
              <Bar dataKey="completions" radius={[4, 4, 4, 4]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#3b82f6' : '#1f2937'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Habit Breakdown */}
      <section className="mb-10">
        <h2 className="text-sm font-medium text-momentum-text-dim uppercase tracking-wider mb-4">{t('strongestHabits')}</h2>
        <div className="space-y-3">
           <div className="bg-momentum-surface/30 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-500 flex items-center justify-center">🏋️</div>
                 <div>
                   <h4 className="font-semibold text-sm">Morning Workout</h4>
                   <p className="text-xs text-momentum-text-dim">95% {t('completionWord')}</p>
                 </div>
              </div>
              <Target className="w-5 h-5 text-momentum-accent" />
           </div>
           <div className="bg-momentum-surface/30 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-500 flex items-center justify-center">📚</div>
                 <div>
                   <h4 className="font-semibold text-sm">Read 10 Pages</h4>
                   <p className="text-xs text-momentum-text-dim">80% {t('completionWord')}</p>
                 </div>
              </div>
              <Target className="w-5 h-5 text-momentum-accent" />
           </div>
        </div>
      </section>

      <AdBanner 
        type="native" 
        className="mt-6" 
        title="Momentum Weekly Report" 
        description="Deep dive into your consistency patterns and get personalized focus tips."
        icon="📉"
        color="bg-emerald-500"
      />
    </div>
  );
}
