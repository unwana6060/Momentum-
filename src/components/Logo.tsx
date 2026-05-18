import React from 'react';
import { Zap } from 'lucide-react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Logo({ className = "", showText = true, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xl',
    md: 'w-8 h-8 text-2xl',
    lg: 'w-10 h-10 text-3xl',
    xl: 'w-16 h-16 text-5xl'
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${sizeClasses[size]} rounded-2xl bg-momentum-accent flex items-center justify-center shadow-[0_0_20px_theme('colors.momentum-accent-glow')] relative group overflow-hidden`}>
        <Zap 
          size={iconSizes[size]} 
          className="text-white fill-white group-hover:scale-110 transition-transform duration-500" 
        />
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold tracking-tighter leading-none text-white ${size === 'xl' ? 'text-4xl' : 'text-xl'}`}>
            MOMENTUM
          </span>
          <span className={`font-mono text-[9px] tracking-[3px] text-momentum-accent uppercase opacity-80 ${size === 'xl' ? 'mt-1' : ''}`}>
            Habit Grid
          </span>
        </div>
      )}
    </div>
  );
}
