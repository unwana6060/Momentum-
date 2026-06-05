import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Calendar, 
  BarChart2, 
  Zap, 
  Globe, 
  User, 
  BookOpen, 
  Info, 
  Mail, 
  Shield, 
  Scale, 
  ChevronRight, 
  Lightbulb, 
  Play, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export default function MenuNavigation() {
  const [activeGuideTab, setActiveGuideTab] = useState<'basics' | 'grid' | 'coach' | 'clock'>('basics');

  const mainRoutes = [
    { to: '/', icon: Home, label: 'Today’s Habits', desc: 'Manage your daily routine & check completed tasks', badge: 'Active' },
    { to: '/calendar', icon: Calendar, label: 'The Habit Grid', desc: 'Visualize your consistency in our signature heatmap grid', badge: 'Utility' },
    { to: '/analytics', icon: BarChart2, label: 'Smart Analytics', desc: 'Dissect completion histories & tracking statistics', badge: 'Power' },
    { to: '/coach', icon: Zap, label: 'AI Habit Coach', desc: 'Tailored coaching, tips & milestone planning', badge: 'AI Native' },
    { to: '/clock', icon: Globe, label: 'World Clock Widget', desc: 'Coordinate routines with world timezones', badge: 'Sync' },
    { to: '/profile', icon: User, label: 'User Profile & XP', desc: 'Review achievements, user levels, and streak ranks', badge: 'Member' },
  ];

  const complianceRoutes = [
    { to: '/about', icon: Info, label: 'About Developer', desc: 'Meet Unwana Peter Otung, designer & creator' },
    { to: '/contact', icon: Mail, label: 'Contact Support', desc: 'WPForms style contact/inquiry form' },
    { to: '/privacy', icon: Shield, label: 'Privacy Policy', desc: 'Learn how we collect & safeguard user info' },
    { to: '/terms', icon: Scale, label: 'Terms & Disclaimers', desc: 'Read terms of use & partner advertising details' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 pb-12"
    >
      <div className="text-center space-y-1.5 py-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans bg-clip-text text-transparent bg-gradient-to-r from-momentum-accent via-momentum-accent-light to-blue-300">Momentum Hub</h1>
        <p className="text-sm text-momentum-text-dim">Your directory for guidelines, legal standards, and navigation</p>
      </div>

      {/* Dynamic How to Use Guide Panel */}
      <div className="bg-gradient-to-br from-[#0c1322] to-momentum-surface/50 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-white/5 bg-[#0f1a30]/50 flex items-center gap-2 text-momentum-accent font-semibold">
          <BookOpen className="w-5 h-5" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">How To Use Momentum</h2>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-white/5 text-xs">
          {(['basics', 'grid', 'coach', 'clock'] as const).map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveGuideTab(tab)}
              className={`flex-1 py-3 text-center font-bold tracking-wide transition-all uppercase border-b-2 ${
                activeGuideTab === tab 
                  ? 'border-momentum-accent text-momentum-accent bg-momentum-accent/5' 
                  : 'border-transparent text-momentum-text-dim hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Dynamic Content */}
        <div className="p-5 min-h-[140px] text-sm leading-relaxed text-momentum-text-dim">
          <AnimatePresence mode="wait">
            {activeGuideTab === 'basics' && (
              <motion.div 
                key="basics"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-1.5 text-white font-semibold">
                  <Play className="w-4 h-4 text-momentum-accent" />
                  <span>The Today view Explained</span>
                </div>
                <p>
                  On the primary <span className="text-white">Today</span> homepage, we present your curated daily habit checklists. Tap the checklist bubbles to log habit completions in real-time. This saves live instances to Firebase and starts your streak!
                </p>
                <div className="flex items-center gap-1.5 text-xs text-momentum-accent-light bg-momentum-accent/10 rounded-lg p-2.5 mt-2 border border-momentum-accent/15">
                  <Lightbulb className="w-4 h-4 flex-shrink-0" />
                  <span>Pro-tip: Long streak counts unlock gamified Profile XP awards automatically!</span>
                </div>
              </motion.div>
            )}

            {activeGuideTab === 'grid' && (
              <motion.div 
                key="grid"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-1.5 text-white font-semibold">
                  <Calendar className="w-4 h-4 text-momentum-accent" />
                  <span>Interactive Heatmap (The Grid)</span>
                </div>
                <p>
                  Navigate to the <span className="text-white">Grid</span> tab to view your performance in color intensity blocks. Darker circles denote exceptional habit consistency throughout the month, giving you visual feedback on your commitment.
                </p>
                <p className="text-xs">
                  Clicking any circle shows the breakdown of active goals complete on that specific calendar day.
                </p>
              </motion.div>
            )}

            {activeGuideTab === 'coach' && (
              <motion.div 
                key="coach"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-2"
              >
                <div className="flex items-center gap-1.5 text-white font-semibold">
                  <Zap className="w-4 h-4 text-momentum-accent" />
                  <span>Dynamic AI Coaching Support</span>
                </div>
                <p>
                  Open the <span className="text-white">Coach</span> page to run predictive queries. Backed by your secure user key, the AI Coach reviews your success records, drafts milestone advice, and flags potential drop-off warnings proactively.
                </p>
              </motion.div>
            )}

            {activeGuideTab === 'clock' && (
              <motion.div 
                key="clock"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-2"
              >
                <div className="flex items-center gap-1.5 text-white font-semibold">
                  <Globe className="w-4 h-4 text-momentum-accent" />
                  <span>World Timezone Synchronization</span>
                </div>
                <p>
                  Designed with travelers and global creators in mind. Track current times in Madrid, London, New York, and Sydney in real-time. Great for scheduling late-night runs, synchronization check-ins, block-outs, or early morning focus rounds.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Pages Navigation */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-momentum-text-dim pl-1">Primary App Views</h3>
        <div className="grid gap-3.5">
          {mainRoutes.map((route) => {
            const IconComponent = route.icon;
            return (
              <NavLink 
                key={route.to} 
                to={route.to}
                className="group flex items-center justify-between p-4 bg-momentum-surface/30 hover:bg-momentum-surface/50 border border-white/5 rounded-2xl transition-all duration-300 hover:border-white/15"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-momentum-surface flex items-center justify-center text-momentum-accent group-hover:scale-105 transition-transform duration-300">
                    <IconComponent className="w-5 h-5 text-momentum-accent" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm group-hover:text-momentum-accent-light transition-colors">{route.label}</span>
                      <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-white/5 text-momentum-text-dim">{route.badge}</span>
                    </div>
                    <p className="text-xs text-momentum-text-dim mt-0.5 leading-tight">{route.desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-momentum-text-dim group-hover:text-white transition-colors translate-x-0 group-hover:translate-x-1 duration-300" />
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Compliance / Info Pages Navigation */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-momentum-text-dim pl-1">Information &amp; AdSense Guidelines</h3>
        <div className="grid gap-3">
          {complianceRoutes.map((route) => {
            const IconComponent = route.icon;
            return (
              <NavLink 
                key={route.to} 
                to={route.to}
                className="group flex items-center justify-between p-4 bg-[#0a0f1c]/50 hover:bg-[#0c1222] border border-white/5 rounded-2xl transition-all duration-300 hover:border-white/10"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-momentum-text-dim group-hover:text-white transition-all">
                    <IconComponent className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-white text-xs group-hover:text-momentum-accent-light transition-colors">{route.label}</span>
                    <p className="text-[11px] text-momentum-text-dim leading-none mt-1">{route.desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-momentum-text-dim group-hover:text-white transition-colors translate-x-0 group-hover:translate-x-1 duration-300" />
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Footer Branding Statement */}
      <div className="text-center py-6 border-t border-white/5">
        <p className="text-xs text-momentum-text-dim">
          Designed by <span className="text-white font-medium">Unwana Peter Otung</span> | unwanaotung@gmail.com
        </p>
        <p className="text-[10px] text-momentum-text-dim/60 mt-1">
          &copy; 2026 Momentum Suite. All rights reserved. Google AdSense Certified setup.
        </p>
      </div>
    </motion.div>
  );
}
