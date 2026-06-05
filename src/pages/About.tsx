import React from 'react';
import { motion } from 'motion/react';
import { Crown, Mail, Code, Sparkles, Target, Compass } from 'lucide-react';

export default function About() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2 py-4">
        <h1 className="text-3xl font-bold tracking-tight text-white">About Momentum</h1>
        <p className="text-sm text-momentum-text-dim">Learn about our mission and the designer behind this app</p>
      </div>

      {/* Developer Profile Card */}
      <div className="bg-momentum-surface/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-momentum-accent to-purple-600 flex items-center justify-center text-white shadow-lg shadow-momentum-accent/20">
            <Crown className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Unwana Peter Otung</h2>
            <p className="text-sm text-momentum-accent font-medium">Web Designer &amp; Content Creator</p>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-momentum-text-dim">
              <Mail className="w-3.5 h-3.5 text-momentum-accent" />
              <span>unwanaotung@gmail.com</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-momentum-text-dim leading-relaxed">
          Hi, I am Unwana Peter Otung, a passionate web designer and digital content creator. 
          I specialize in building sleek, high-conversion visual experiences and crafting engaging designs. 
          As the chief architect and administrator of Momentum, I designed this application with the user experience at the forefront — ensuring it is fast, fluid, mobile-first, and highly intuitive.
        </p>
      </div>

      {/* App Purpose section */}
      <h3 className="text-lg font-bold text-white pl-1">App Purpose &amp; Guidelines</h3>
      <div className="grid gap-4 sm:grid-cols-1">
        <div className="bg-momentum-surface/30 backdrop-blur-md rounded-2xl p-5 border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-momentum-accent">
            <Target className="w-5 h-5" />
            <h4 className="font-semibold text-white">The Purpose of Momentum</h4>
          </div>
          <p className="text-sm text-momentum-text-dim leading-relaxed">
            Momentum is a modern day habit building suite designed to streamline self-improvement. It empowers you to track habit compliance with an ultra-responsive interface, trace your success over weeks using a visual grid calendar, and dissect your long-term consistency with smart statistical analysis.
          </p>
        </div>

        <div className="bg-momentum-surface/30 backdrop-blur-md rounded-2xl p-5 border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-momentum-accent">
            <Sparkles className="w-5 h-5" />
            <h4 className="font-semibold text-white">Advanced AI Habit Coach</h4>
          </div>
          <p className="text-sm text-momentum-text-dim leading-relaxed">
            Harness the power of server-side generative AI to analyze your habit histories. Get actionable recommendations, visual milestones, and highly structured advice tailored to your personal routine to ensure you never lose your streak.
          </p>
        </div>

        <div className="bg-momentum-surface/30 backdrop-blur-md rounded-2xl p-5 border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-momentum-accent">
            <Compass className="w-5 h-5" />
            <h4 className="font-semibold text-white">Global timezone compliance</h4>
          </div>
          <p className="text-sm text-momentum-text-dim leading-relaxed">
            Never lose track of your habits when traveling. With the integrated World Clock suite, you can monitor local and global cities in real-time, allowing you to synchronize your sleep cycle, workout blocks, and hydration schedules perfectly.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
