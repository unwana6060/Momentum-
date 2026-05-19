import React, { useState, useEffect } from 'react';
import { useAuth } from '../firebase/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../firebase/config';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  serverTimestamp, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { Habit, HabitCompletion } from '../types';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import AdBanner from '../components/AdBanner';
import { Plus, Check, Search, Calendar as CalendarIcon, Target, Clock, Activity, Zap, Trash2, X } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../firebase/errorHandler';

function HabitList({
  habits,
  completions,
  date,
  onToggle,
  onDelete
}: {
  habits: Habit[];
  completions: HabitCompletion[];
  date: string;
  onToggle: (habitId: string, completed: boolean) => void;
  onDelete: (habitId: string) => void;
}) {
  const { t } = useLanguage();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3">
      <AnimatePresence initial={false}>
        {habits.map((habit) => {
          const isCompleted = completions.some(c => c.habitId === habit.id && c.status === 'completed');
          const isConfirming = confirmDeleteId === habit.id;
          
          return (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              key={habit.id}
              className={`p-4 rounded-[24px] border flex items-center justify-between transition-all bg-momentum-surface-light border-white/5 group`}
            >
              <div className="flex items-center gap-4 flex-1">
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
                    <Zap className="w-3 h-3 text-orange-500" /> {habit.currentStreak || 0} {t('streak')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {isConfirming ? (
                  <div className="flex items-center gap-1 animate-in fade-in slide-in-from-right-2 duration-300">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(habit.id);
                        setConfirmDeleteId(null);
                      }}
                      className="px-3 py-2 bg-red-500 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-lg shadow-red-500/20"
                    >
                      Delete
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDeleteId(null);
                      }}
                      className="p-2 bg-white/5 text-white rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmDeleteId(habit.id);
                      // Reset after timeout
                      setTimeout(() => setConfirmDeleteId(curr => curr === habit.id ? null : curr), 4000);
                    }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-red-500/30 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 sm:opacity-0"
                    aria-label="Delete habit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                
                {!isConfirming && (
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
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
      
      {habits.length === 0 && (
        <div className="text-center py-12 px-6 bg-momentum-surface/30 rounded-[32px] border border-white/5 border-dashed">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
             <Plus className="w-6 h-6 text-momentum-text-dim" />
          </div>
          <p className="text-momentum-text-dim text-sm">{t('noHabits')}</p>
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
    
    setLoading(true);
    
    // Subscribe to Habits
    const habitsQuery = query(
      collection(db, 'habits'), 
      where('userId', '==', user.uid)
    );
    
    const unsubscribeHabits = onSnapshot(habitsQuery, (snapshot) => {
      const fetchedHabits = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Habit));
      
      // Sort manually to avoid index requirement
      fetchedHabits.sort((a, b) => {
        const timeA = a.createdAt?.toMillis?.() || a.createdAt?.seconds * 1000 || 0;
        const timeB = b.createdAt?.toMillis?.() || b.createdAt?.seconds * 1000 || 0;
        return timeB - timeA;
      });

      setHabits(fetchedHabits);
      setLoading(false);
      
      // For each habit, we need its completion for TODAY
      // In a real app, you might have a global completions collection or 
      // fetch them differently. For now, we'll listen to completions for all habits.
      // This is slightly complex to do reactively for all, so we'll do it focused.
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'habits');
      setLoading(false);
    });
    
    return () => unsubscribeHabits();
  }, [user]);

  // Separate effect for completions (simpler sync)
  useEffect(() => {
    if (!user || habits.length === 0) {
      setCompletions([]);
      return;
    }

    // Since completions are nested, we can't easily query ALL habits' completions in one onSnapshot
    // unless we had a top-level collection. For simplicity, we'll fetch them on demand or
    // use a more performant way. 
    // Optimization: Just query today's completions for the specific habits
    
    const fetchCompletions = async () => {
      const todayComps: HabitCompletion[] = [];
      for (const habit of habits) {
        const q = query(
          collection(db, `habits/${habit.id}/completions`),
          where('date', '==', today)
        );
        const snap = await getDocs(q);
        snap.forEach(doc => {
          todayComps.push({ id: doc.id, habitId: habit.id, ...doc.data() } as HabitCompletion);
        });
      }
      setCompletions(todayComps);
    };

    fetchCompletions();
  }, [user, habits, today]);

  const toggleCompletion = async (habitId: string, completed: boolean) => {
    if (!user) return;
    
    const completionId = `${habitId}_${today}`;
    const completionRef = doc(db, `habits/${habitId}/completions`, completionId);
    
    if (completed) {
      // Optimistic
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
          habitId,
          date: today,
          completedAt: serverTimestamp(),
          status: 'completed'
        });
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

  const deleteHabit = async (habitId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'habits', habitId));
      // Local state is updated by onSnapshot
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `habits/${habitId}`);
    }
  };

  const progress = habits.length > 0 ? Math.round((completions.filter(c => c.status === 'completed').length / habits.length) * 100) : 0;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newHabitTitle.trim()) return;

    setIsSubmitting(true);
    try {
      const newRef = doc(collection(db, 'habits'));
      const habitData = {
        userId: user.uid,
        title: newHabitTitle,
        description: "",
        category: "General",
        color: "#3b82f6",
        icon: "✨",
        scheduleType: "daily",
        currentStreak: 0,
        longestStreak: 0,
        totalCompletions: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      await setDoc(newRef, habitData);
      setNewHabitTitle('');
      setIsAddModalOpen(false);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'habits');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-1 bg-momentum-accent text-white text-xs font-semibold rounded-full shadow-[0_0_10px_theme('colors.momentum-accent-glow')]"
          >
            {t('addHabit') || '+ New Habit'}
          </button>
        </div>
        
        {loading ? (
           <div className="flex justify-center p-10"><div className="w-8 h-8 border-2 border-momentum-accent border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <HabitList habits={habits} completions={completions} date={today} onToggle={toggleCompletion} onDelete={deleteHabit} />
        )}
      </section>
      
      {/* Floating Action Button */}
      <div className="fixed bottom-28 right-6 z-[60]">
        <button 
           className="w-14 h-14 bg-momentum-accent hover:bg-momentum-accent-light rounded-full flex items-center justify-center text-white shadow-[0_10px_30px_theme('colors.momentum-accent-glow')] transition-transform hover:scale-105 active:scale-95"
           onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Add Habit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-momentum-surface-light w-full max-w-sm rounded-[32px] border border-white/10 p-6 shadow-2xl"
          >
            <h3 className="text-xl font-bold mb-4">{t('addHabitTitle')}</h3>
            <form onSubmit={handleCreateHabit}>
              <div className="mb-6">
                <label className="block text-xs font-medium text-momentum-text-dim uppercase tracking-wider mb-2">{t('habitName')}</label>
                <input 
                  type="text" 
                  value={newHabitTitle}
                  onChange={(e) => setNewHabitTitle(e.target.value)}
                  placeholder="e.g. Drink 2L Water"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:border-momentum-accent transition-colors"
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 font-medium transition-colors"
                >
                  {t('cancel')}
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting || !newHabitTitle.trim()}
                  className="flex-1 px-4 py-3 rounded-2xl bg-momentum-accent hover:bg-momentum-accent-light text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? t('creating') : t('create')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <AdBanner className="mt-8" />
    </div>
  );
}
