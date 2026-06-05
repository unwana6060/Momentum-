import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, Calendar, BarChart2, Zap, Globe, User as UserIcon, Menu } from 'lucide-react';
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
    { to: '/profile', icon: UserIcon, label: t('profile') },
  ];

  return (
    <div className="flex flex-col h-screen h-[100dvh] w-full sm:max-w-md mx-auto relative bg-momentum-bg/50 backdrop-blur-sm sm:shadow-2xl sm:shadow-black/50 sm:border sm:border-white/10 sm:rounded-[48px] sm:my-4 sm:h-[calc(100dvh-2rem)] transition-all duration-500 overflow-hidden">
      {/* Header */}
      <header className="flex-none px-6 py-4 flex items-center justify-between z-20 bg-momentum-bg/80 backdrop-blur-md border-b border-white/5 sm:rounded-t-[48px]">
        <div className="flex items-center gap-3">
          <NavLink 
            to="/menu" 
            className={({ isActive }) => cn(
              "w-8 h-8 rounded-full flex items-center justify-center border transition-all active:scale-90",
              isActive ? "bg-momentum-accent/20 border-momentum-accent/40 text-momentum-accent shadow-[0_0_10px_theme(colors.momentum-accent-glow)]" : "bg-white/5 border-white/10 text-momentum-text-dim hover:text-white"
            )}
            title="Menu Hub"
          >
            <Menu className="w-4.5 h-4.5" />
          </NavLink>
          <Logo size="sm" />
        </div>
        <div className="flex items-center gap-3">
          <NavLink 
            to="/clock" 
            className={({ isActive }) => cn(
              "w-8 h-8 rounded-full flex items-center justify-center border transition-all active:scale-90",
              isActive ? "bg-momentum-accent/20 border-momentum-accent/40 text-momentum-accent shadow-[0_0_10px_theme(colors.momentum-accent-glow)]" : "bg-white/5 border-white/10 text-momentum-text-dim hover:text-white"
            )}
          >
            <Globe className="w-4 h-4" />
          </NavLink>
          {user && (
            <NavLink to="/profile" className="w-9 h-9 rounded-full overflow-hidden border border-white/10 active:scale-90 transition-transform">
              <img 
                src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email || 'User'}&background=1f2937&color=f9fafb`} 
                alt="Profile" 
                className="w-full h-full object-cover" 
              />
            </NavLink>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto z-10 overscroll-contain relative">
        <div className="pb-48 px-4 sm:px-6">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation */}
      <div className="flex-none z-20 bg-[rgba(15,23,42,0.95)] backdrop-blur-[24px] border-t border-white/5 pb-safe sm:rounded-b-[48px]">
        <nav className="flex items-center justify-around px-1 py-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="relative flex flex-col items-center gap-1 flex-1 py-1"
              >
                <div className="relative mb-[2px]">
                  <Icon 
                    className={cn(
                      "w-5 h-5 transition-all duration-300 sm:w-6 sm:h-6", 
                      isActive ? "text-momentum-accent scale-110" : "text-momentum-text-dim"
                    )} 
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -inset-3 bg-momentum-accent/20 rounded-full blur-lg"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
                <span className={cn(
                  "text-[10px] uppercase tracking-wider font-bold transition-colors duration-300 text-center block leading-tight",
                  isActive ? "text-momentum-accent" : "text-momentum-text-dim"
                )}>
                  {item.label}
                </span>
                
                {isActive && (
                  <motion.div 
                    layoutId="nav-dot"
                    className="absolute -top-1 w-1 h-1 rounded-full bg-momentum-accent shadow-[0_0_8px_theme(colors.momentum-accent)]" 
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
