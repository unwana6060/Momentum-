import React, { useState, useEffect } from 'react';
import { useAuth } from '../firebase/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../firebase/config';
import { collection, query, where, getDocs, doc, setDoc, deleteDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { Habit, HabitCompletion } from '../types';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import AdBanner from '../components/AdBanner';
import { Plus, Check, Search, Calendar as CalendarIcon, Target, Clock, Activity, Zap } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../firebase/errorHandler';

function HabitList({
  habits,
  completions,
  date,
  onToggle
}: {
  habits: Habit[];
  completions: HabitCompletion[];
  date: string;
  onToggle: (habitId: string, completed: boolean) => void;
}) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col gap-3">
      {habits.map((habit) => {
        const isCompleted = completions.some(c => c.habitId === habit.id && c.status === 'completed');
        
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={habit.id}
            className={`p-4 rounded-[24px] border flex items-center justify-between transition-all bg-momentum-surface-light border-white/5`}
          >
            <div className="flex items-center gap-4">
              <div 
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
                  isCompleted ? 'bg-momentum-accent/20' : 'bg-white/5'
                }`}
                style={isCompleted ? { color: habit.color || '#3b82f6', textShadow: '0 0 10px currentColor' } : {}}
              >
                {habit.icon || '🔥'}
              </div>
              <div>
                <h3 className="text-[14px] font-[600] m-0 text-white">{habit.title}</h3>
                <p className="text-[11px] text-[#64748B] flex items-center gap-1 mt-[2px] m-0">
                  <Zap className="w-3 h-3 text-orange-500" /> {habit.currentStreak} {t('streak')}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => onToggle(habit.id, !isCompleted)}
              className={`w-[40px] h-[40px] rounded-[14px] border-[2px] flex items-center justify-center transition-all ${
                isCompleted 
                  ? 'bg-momentum-accent border-momentum-accent text-white shadow-[0_0_15px_theme("colors.momentum-accent-glow")]' 
                  : 'bg-transparent border-momentum-accent text-transparent hover:bg-momentum-accent/20'
              }`}
            >
              {isCompleted ? <Check className="w-5 h-5" strokeWidth={3} /> : null}
            </button>
          </motion.div>
        );
      })}
      
      {habits.length === 0 && (
        <div className="text-center py-10 px-4 bg-momentum-surface/50 rounded-3xl border border-white/5 border-dashed">
          <p className="text-momentum-text-dim mb-4">{t('noHabits')}</p>
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-dashed border-momentum-text-dim/50 text-momentum-text-dim">
            <Plus className="w-5 h-5" />
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  
  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    if (!user) return;
    
    // Fetch Habits
    const fetchHabitsAndCompletions = async () => {
      try {
        const habitsQuery = query(collection(db, 'habits'), where('userId', '==', user.uid));
        const habitsSnap = await getDocs(habitsQuery);
        const fetchedHabits = habitsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Habit));
        setHabits(fetchedHabits);
        
        // Fetch Today's completetions
        const completionsItems: HabitCompletion[] = [];
        for (const habit of fetchedHabits) {
            const compQuery = query(
              collection(db, `habits/${habit.id}/completions`), 
              where('userId', '==', user.uid),
              where('date', '==', today)
            );
            const compSnap = await getDocs(compQuery);
            compSnap.forEach(doc => {
              completionsItems.push({ id: doc.id, habitId: habit.id, ...doc.data() } as HabitCompletion);
            });
        }
        
        setCompletions(completionsItems);
      } catch (error) {
         handleFirestoreError(error, OperationType.GET, 'habits');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHabitsAndCompletions();
  }, [user, today]);

  const toggleCompletion = async (habitId: string, completed: boolean) => {
    if (!user) return;
    
    const completionId = `${habitId}_${today}`;
    const completionRef = doc(db, `habits/${habitId}/completions`, completionId);
    
    // Optimistic update
    if (completed) {
      const newComp: HabitCompletion = {
        id: completionId,
        userId: user.uid,
        habitId,
        date: today,
        completedAt: new Date(),
        status: 'completed'
      };
      setCompletions(prev => [...prev.filter(c => c.habitId !== habitId), newComp]);
      
      try {
        await setDoc(completionRef, {
          userId: user.uid,
          date: today,
          completedAt: serverTimestamp(),
          status: 'completed'
        });
        
        // In a real app we would update the habit's streak via Firebase Cloud Functions
        // or a batch update here, but we'll simplified for this UI prototype.
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `habits/${habitId}/completions`);
      }
    } else {
      setCompletions(prev => prev.filter(c => c.habitId !== habitId));
      try {
        await deleteDoc(completionRef);
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `habits/${habitId}/completions`);
      }
    }
  };

  const progress = habits.length > 0 ? Math.round((completions.filter(c => c.status === 'completed').length / habits.length) * 100) : 0;

  // Add dummy habit for demo if empty
  const handleAddDemoHabit = async () => {
    if (!user) return;
    try {
      const newRef = doc(collection(db, 'habits'));
      const habitData = {
        userId: user.uid,
        title: "Morning Workout",
        description: "30 minutes ring fit",
        category: "Health",
        color: "#3b82f6",
        icon: "🏋️",
        scheduleType: "daily",
        currentStreak: 5,
        longestStreak: 12,
        totalCompletions: 43,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      await setDoc(newRef, habitData);
      setHabits(prev => [...prev, { id: newRef.id, ...habitData } as any]);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'habits');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8 pt-2">
        <p className="text-momentum-accent font-medium tracking-widest text-[10px] uppercase mb-1">{format(new Date(), 'EEEE, MMMM d')}</p>
        <h1 className="text-3xl font-light tracking-tight">{t('focus')} <span className="font-bold">{t('home')}</span></h1>
      </div>

      {/* Progress ring/card */}
      <section className="mb-10 relative">
        <div className="bg-momentum-surface rounded-[24px] p-6 border border-white/5 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
             <Target className="w-32 h-32" />
           </div>
           
           <h2 className="text-sm font-medium text-momentum-text-dim mb-4">{t('dailyProgress')}</h2>
           
           <div className="flex items-center gap-6">
             <div className="relative w-24 h-24 flex items-center justify-center">
               <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                 <circle
                   cx="50"
                   cy="50"
                   r="40"
                   fill="transparent"
                   className="stroke-momentum-surface border-white/5"
                   strokeWidth="8"
                 />
                 <circle
                   cx="50"
                   cy="50"
                   r="40"
                   fill="transparent"
                   className="stroke-momentum-accent"
                   strokeWidth="8"
                   strokeDasharray="251.2" // 2 * pi * 40
                   strokeDashoffset={251.2 - (251.2 * progress) / 100}
                   strokeLinecap="round"
                 />
               </svg>
               <span className="absolute text-2xl font-bold">{progress}%</span>
             </div>
             
             <div>
               <p className="text-2xl font-bold">{completions.filter(c => c.status === 'completed').length} / {habits.length}</p>
               <p className="text-sm text-momentum-text-dim">{t('habitsCompleted')}</p>
             </div>
           </div>
           
           <div className="mt-6 pt-6 border-t border-white/5 flex justify-between">
              <div className="text-center flex flex-col items-center">
                 <span className="text-orange-500 font-bold flex items-center gap-1"><Zap className="w-4 h-4" /> 12</span>
                 <span className="text-[10px] text-momentum-text-dim uppercase tracking-wider">Days {t('streak')}</span>
              </div>
              <div className="w-[1px] bg-white/5"></div>
              <div className="text-center flex flex-col items-center">
                 <span className="text-momentum-accent font-bold flex items-center gap-1"><Activity className="w-4 h-4" /> {progress > 80 ? t('perfect') : t('good')}</span>
                 <span className="text-[10px] text-momentum-text-dim uppercase tracking-wider">{t('consistency')}</span>
              </div>
           </div>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">{t('habits')}</h2>
          {habits.length === 0 && (
            <button 
              onClick={handleAddDemoHabit}
              className="px-3 py-1 bg-momentum-accent text-white text-xs font-semibold rounded-full shadow-[0_0_10px_theme('colors.momentum-accent-glow')]"
            >
              {t('addDemo')}
            </button>
          )}
        </div>
        
        {loading ? (
           <div className="flex justify-center p-10"><div className="w-8 h-8 border-2 border-momentum-accent border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <HabitList habits={habits} completions={completions} date={today} onToggle={toggleCompletion} />
        )}
      </section>
      
      {/* Floating Action Button */}
      <div className="fixed bottom-28 right-6 z-[60]">
        <button 
           className="w-14 h-14 bg-momentum-accent hover:bg-momentum-accent-light rounded-full flex items-center justify-center text-white shadow-[0_10px_30px_theme('colors.momentum-accent-glow')] transition-transform hover:scale-105 active:scale-95"
           onClick={handleAddDemoHabit}
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <AdBanner className="mt-8" />
    </div>
  );
}
