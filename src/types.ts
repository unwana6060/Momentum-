export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
  theme: 'system' | 'light' | 'dark';
  xp: number;
  level: number;
  longestStreak: number;
}

export interface Habit {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  color: string;
  icon: string;
  scheduleType: 'daily' | 'weekly' | 'specific_days';
  scheduleDays?: number[]; // 0 for Sunday
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  createdAt: any;
  updatedAt: any;
}

export interface HabitCompletion {
  id: string;
  userId: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  completedAt: any;
  status: 'completed' | 'missed';
}
