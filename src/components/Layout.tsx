import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, Calendar, BarChart2, Zap, Globe, User as UserIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../firebase/AuthContext';
import Logo from './Logo';

export default function Layout() {
  const location = useLocation();
  const { t } = useLanguage();
  const { user } = useAuth();

  const navItems = [
    { to: '/', icon: Home, label: t('home') },
    { to: '/calendar', icon: Calendar, label: t('calendar') },
    { to: '/analytics', icon: BarChart2, label: t('analytics') },
    { to: '/coach', icon: Zap, label: t('coach') },
    { to: '/clock', icon: Globe, label: 'Clock' },
    { to: '/profile', icon: UserIcon, label: t('profile') },
  ];

  return (
    <div className="flex flex-col h-screen h-[100svh] w-full max-w-md mx-auto relative overflow-hidden bg-momentum-bg/50 backdrop-blur-sm sm:shadow-2xl sm:shadow-black/50 sm:border sm:border-white/10 sm:rounded-[48px] sm:my-4 sm:h-[calc(100svh-2rem)] transition-all duration-500">
      {/* Header */}
      <header className="flex-none px-6 py-4 flex items-center justify-between z-20 bg-momentum-bg/80 backdrop-blur-md border-b border-white/5 sm:rounded-t-[48px]">
        <Logo size="sm" />
        {user && (
          <NavLink to="/profile" className="w-9 h-9 rounded-full overflow-hidden border border-white/10 active:scale-90 transition-transform">
            <img 
              src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=1f2937&color=f9fafb`} 
              alt="Profile" 
              className="w-full h-full object-cover" 
            />
          </NavLink>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto z-10 overscroll-contain min-h-0">
        <div className="pb-32 px-1">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation */}
      <div className="flex-none z-20 pb-safe px-6 bg-[rgba(15,23,42,0.9)] backdrop-blur-[20px] border-t border-[rgba(255,255,255,0.05)] pb-6 sm:rounded-b-[48px]">
        <nav className="flex justify-between items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="relative p-2 flex flex-col items-center gap-1 min-w-[60px]"
              >
                <div className="relative">
                  <Icon 
                    className={cn(
                      "w-6 h-6 transition-colors duration-300", 
                      isActive ? "text-momentum-accent" : "text-momentum-text-dim"
                    )} 
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -inset-2 bg-momentum-accent/20 rounded-full blur-md"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
                <span className={cn(
                  "text-[10px] uppercase tracking-wider font-medium transition-colors duration-300",
                  isActive ? "text-momentum-accent font-semibold" : "text-momentum-text-dim"
                )}>
                  {item.label}
                </span>
                
                {isActive && (
                  <motion.div 
                    layoutId="nav-dot"
                    className="absolute -top-3 w-1 h-1 rounded-full bg-momentum-accent" 
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
