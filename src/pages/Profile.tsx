import React, { useState, useEffect } from 'react';
import { useAuth } from '../firebase/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { UserProfile } from '../types';
import { Settings, LogOut, Award, Shield, User as UserIcon, Moon, Sun, Monitor, Globe } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../firebase/errorHandler';

export default function Profile() {
  const { user, isAdmin, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const countries = [
    { code: 'en', flag: '🇺🇸', name: 'USA' },
    { code: 'es', flag: '🇪🇸', name: 'Spain' },
    { code: 'fr', flag: '🇫🇷', name: 'France' },
    { code: 'de', flag: '🇩🇪', name: 'Germany' },
    { code: 'zh', flag: '🇨🇳', name: 'China' },
    { code: 'ja', flag: '🇯🇵', name: 'Japan' },
    { code: 'pt', flag: '🇧🇷', name: 'Brazil' },
    { code: 'ar', flag: '🇸🇦', name: 'UAE' },
  ];

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile({ id: docSnap.id, ...docSnap.data() } as UserProfile);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, 'users');
      }
    };
    fetchProfile();
  }, [user]);

  const toggleTheme = async (theme: 'system' | 'light' | 'dark') => {
    if (!user || !profile) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), { theme, updatedAt: new Date() });
      setProfile({ ...profile, theme });
      // Theme toggling in actual app would update body classes
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'users');
    }
  };

  const [confirmSignOut, setConfirmSignOut] = useState(false);

  const handleSignOut = async () => {
    if (!confirmSignOut) {
      setConfirmSignOut(true);
      setTimeout(() => setConfirmSignOut(false), 3000);
      return;
    }
    try {
      await signOut();
    } catch (error) {
       console.error(error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-light tracking-tight mb-8 pt-2">{language === 'en' ? 'Your' : ''} <span className="font-bold">{t('profile')}</span></h1>

      <div className="bg-momentum-surface-light rounded-[24px] p-6 border border-white/5 relative overflow-hidden mb-8">
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-20 h-20 rounded-full bg-white/10 overflow-hidden border-2 border-momentum-accent/50 shadow-[0_0_20px_theme('colors.momentum-accent-glow')]">
            <img src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.email}&background=1f2937&color=f9fafb`} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{profile?.displayName || user?.email?.split('@')[0]}</h2>
            <p className="text-sm text-momentum-text-dim">{user?.email}</p>
            <div className="inline-flex items-center gap-2 mt-2">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-momentum-accent/20 text-momentum-accent text-xs font-semibold">
                <Award className="w-3 h-3" /> Level {profile?.level || 1}
              </div>
              {isAdmin && (
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30">
                  <Shield className="w-3 h-3" /> ADMIN
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-sm font-medium text-momentum-text-dim uppercase tracking-wider mb-3 px-2">{t('stats')}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-momentum-surface rounded-[24px] px-6 py-4 border border-white/5">
              <p className="text-3xl font-bold mb-1 text-white">{profile?.xp || 0}</p>
              <p className="text-[13px] text-momentum-text-dim">Total XP</p>
            </div>
            <div className="bg-momentum-surface rounded-[24px] px-6 py-4 border border-white/5">
              <p className="text-3xl font-bold mb-1 text-white">{profile?.longestStreak || 0}</p>
              <p className="text-[13px] text-momentum-text-dim">Longest Streak</p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-medium text-momentum-text-dim uppercase tracking-wider mb-3 px-2">{t('settings')}</h3>
          <div className="bg-momentum-surface rounded-[24px] border border-white/5 overflow-hidden">
             
            <div className="p-4 border-b border-white/5 flex flex-col gap-4">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                      <Globe className="w-4 h-4 text-momentum-text-dim" />
                   </div>
                   <span>{t('language')}</span>
                 </div>
               </div>
               <div className="grid grid-cols-4 gap-2">
                 {countries.map((c) => (
                   <button 
                    key={c.code}
                    onClick={() => setLanguage(c.code as any)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${language === c.code ? 'bg-momentum-accent/20 border-momentum-accent' : 'bg-white/5 border-transparent'}`}
                    title={c.name}
                   >
                     <span className="text-xl">{c.flag}</span>
                     <span className="text-[10px] mt-1 text-momentum-text-dim">{c.name}</span>
                   </button>
                 ))}
               </div>
            </div>

            <div className="p-4 border-b border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                    <Moon className="w-4 h-4 text-momentum-text-dim" />
                 </div>
                 <span>Theme</span>
               </div>
               <div className="flex bg-momentum-surface rounded-full p-1 border border-white/5">
                 <button onClick={() => toggleTheme('system')} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${profile?.theme === 'system' ? 'bg-white/10 text-white' : 'text-momentum-text-dim hover:text-white'}`}>Sys</button>
                 <button onClick={() => toggleTheme('dark')} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${profile?.theme === 'dark' ? 'bg-white/10 text-white' : 'text-momentum-text-dim hover:text-white'}`}>Dark</button>
               </div>
            </div>
            
            <button className="w-full p-4 border-b border-white/5 flex items-center gap-3 hover:bg-white/5 transition-colors text-left">
               <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-momentum-text-dim" />
               </div>
               <span>Privacy & Security</span>
            </button>
            
            <button 
              onClick={handleSignOut}
              className={`w-full p-4 flex items-center gap-3 transition-all text-left ${confirmSignOut ? 'bg-red-500 text-white' : 'hover:bg-white/5 text-red-400'}`}
            >
               <div className={`w-8 h-8 rounded-full flex items-center justify-center ${confirmSignOut ? 'bg-white/20' : 'bg-red-400/10'}`}>
                  <LogOut className="w-4 h-4" />
               </div>
               <span>{confirmSignOut ? 'Confirm Sign Out?' : t('logout')}</span>
            </button>
          </div>
        </section>

        <div className="flex justify-center p-4">
           <button className="px-6 py-2 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white font-bold rounded-full shadow-[0_0_15px_rgba(234,179,8,0.3)] text-sm tracking-wide">
             UPGRADE TO PREMIUM
           </button>
        </div>
      </div>
    </div>
  );
}
