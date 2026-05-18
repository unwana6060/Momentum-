import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';

interface AdBannerProps {
  className?: string;
  type?: 'banner' | 'large' | 'native';
  title?: string;
  description?: string;
  buttonText?: string;
  icon?: string;
  color?: string;
}

export default function AdBanner({ 
  className = "", 
  type = 'banner',
  title = "Upgrade to Momentum Pro",
  description = "Unlock advanced AI insights & custom themes",
  buttonText = "UPGRADE",
  icon = "🚀",
  color = "bg-momentum-accent"
}: AdBannerProps) {
  const { t } = useLanguage();

  if (type === 'native') {
    return (
      <div className={`w-full overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-md relative group ${className}`}>
        <div className="absolute top-3 left-4 px-2 py-0.5 bg-white/10 rounded-md z-10">
          <span className="text-[9px] text-momentum-text-dim uppercase tracking-[1.5px] font-bold">{t('sponsored')}</span>
        </div>
        
        <div className="p-6 pt-10">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-2xl ${color}/20 flex items-center justify-center text-2xl shadow-inner`}>
              {icon}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-white mb-1">{title}</h4>
              <p className="text-xs text-momentum-text-dim leading-relaxed mb-4">
                {description}
              </p>
              <button className={`w-full py-2.5 rounded-xl ${color} text-white text-xs font-bold transition-all shadow-lg active:scale-95`}>
                {buttonText}
              </button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-momentum-accent/10 rounded-full blur-3xl group-hover:bg-momentum-accent/20 transition-colors"></div>
      </div>
    );
  }

  return (
    <div className={`h-24 w-full flex flex-col items-center justify-center border border-white/5 bg-white/[0.02] rounded-[32px] overflow-hidden relative group transition-all duration-500 hover:bg-white/[0.04] ${className}`}>
      <div className="absolute top-2 left-3 px-1.5 py-0.5 bg-white/10 rounded-md">
        <span className="text-[8px] text-momentum-text-dim uppercase tracking-[1px] font-bold">{t('sponsored')}</span>
      </div>
      
      <div className="flex items-center gap-4 px-6 text-left w-full">
        <div className={`w-10 h-10 rounded-xl ${color}/20 flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div>
          <p className="text-[13px] font-bold text-white leading-none mb-1">{title}</p>
          <p className="text-[10px] text-momentum-text-dim">{description}</p>
        </div>
      </div>
      
      {/* Subtle glow effect */}
      <div className={`absolute inset-0 ${color}/5 opacity-0 group-hover:opacity-100 transition-opacity`}></div>
      <div className={`absolute bottom-0 left-0 h-[2px] w-0 ${color} group-hover:w-full transition-all duration-700`}></div>
    </div>
  );
}
