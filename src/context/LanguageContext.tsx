import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja' | 'pt' | 'ar';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    home: "Today",
    calendar: "The Grid",
    analytics: "Analytics",
    coach: "AI Coach",
    profile: "Profile",
    habits: "Your Habits",
    dailyProgress: "Daily Progress",
    streak: "streak",
    consistency: "Consistency",
    perfect: "Perfect",
    good: "Good",
    askAdvice: "Ask for advice...",
    logout: "Log Out",
    stats: "Stats",
    settings: "Settings",
    language: "Language",
    insight: "AI Coach Insight",
    focus: "Focus",
    habitsCompleted: "Habits completed",
    days: "Days",
    noHabits: "No habits defined yet.",
    addDemo: "Add Demo Habit",
    grid: "Grid",
    less: "Less",
    more: "More",
    quote: "Consistency is harder when no one is looking. The Grid never lies.",
    weeklyPerf: "Weekly Performance",
    strongestHabits: "Strongest Habits",
    completionWord: "completion",
    sponsored: "Sponsored"
  },
  es: {
    home: "Hoy",
    calendar: "La Cuadrícula",
    analytics: "Análisis",
    coach: "Entrenador AI",
    profile: "Perfil",
    habits: "Tus Hábitos",
    dailyProgress: "Progreso Diario",
    streak: "racha",
    consistency: "Consistencia",
    perfect: "Perfecto",
    good: "Bueno",
    askAdvice: "Pide un consejo...",
    logout: "Cerrar Sesión",
    stats: "Estadísticas",
    settings: "Ajustes",
    language: "Idioma",
    insight: "Perspectiva del Entrenador AI",
    focus: "Enfoque",
    habitsCompleted: "Hábitos completados",
    days: "Días",
    noHabits: "Aún no hay hábitos definidos.",
    addDemo: "Añadir Hábito de Prueba",
    grid: "Cuadrícula",
    less: "Menos",
    more: "Más",
    quote: "La consistencia es más difícil cuando nadie mira. La Cuadrícula nunca miente.",
    weeklyPerf: "Rendimiento Semanal",
    strongestHabits: "Hábitos más fuertes",
    completionWord: "completado",
    sponsored: "Patrocinado"
  },
  fr: {
    home: "Aujourd'hui",
    calendar: "La Grille",
    analytics: "Analyses",
    coach: "Coach IA",
    profile: "Profil",
    habits: "Vos Habitudes",
    dailyProgress: "Progrès Quotidien",
    streak: "série",
    consistency: "Consistance",
    perfect: "Parfait",
    good: "Bon",
    askAdvice: "Demandez un conseil...",
    logout: "Déconnexion",
    stats: "Stats",
    settings: "Paramètres",
    language: "Langue",
    insight: "Aperçu du Coach IA",
    focus: "Point central",
    habitsCompleted: "Habitudes complétées",
    days: "Jours",
    noHabits: "Aucune habitude définie pour l'instant.",
    addDemo: "Ajouter une habitude de démo",
    grid: "Grille",
    less: "Moins",
    more: "Plus",
    quote: "La régularité est plus difficile quand personne ne regarde. La Grille ne ment jamais.",
    weeklyPerf: "Performance Hebdomadaire",
    strongestHabits: "Habitudes les plus fortes",
    completionWord: "complété",
    sponsored: "Sponsorisé"
  },
  de: {
    home: "Heute",
    calendar: "Das Gitter",
    analytics: "Analyse",
    coach: "KI Coach",
    profile: "Profil",
    habits: "Deine Gewohnheiten",
    dailyProgress: "Täglicher Fortschritt",
    streak: "Serie",
    consistency: "Konsistenz",
    perfect: "Perfekt",
    good: "Gut",
    askAdvice: "Frage um Rat...",
    logout: "Abmelden",
    stats: "Statistiken",
    settings: "Einstellungen",
    language: "Sprache",
    insight: "KI Coach Einblick",
    focus: "Fokus",
    habitsCompleted: "Gewohnheiten abgeschlossen",
    days: "Tage",
    noHabits: "Noch keine Gewohnheiten definiert.",
    addDemo: "Demo-Gewohnheit hinzufügen",
    grid: "Gitter",
    less: "Weniger",
    more: "Mehr",
    quote: "Beständigkeit ist schwieriger, wenn niemand zusieht. Das Gitter lügt nie.",
    weeklyPerf: "Wöchentliche Leistung",
    strongestHabits: "Stärkste Gewohnheiten",
    completionWord: "abgeschlossen",
    sponsored: "Gesponsert"
  },
  zh: {
    home: "今天",
    calendar: "网格",
    analytics: "分析",
    coach: "AI 教练",
    profile: "个人资料",
    habits: "您的习惯",
    dailyProgress: "每日进展",
    streak: "连续",
    consistency: "一致性",
    perfect: "完美",
    good: "良好",
    askAdvice: "寻求建议...",
    logout: "登出",
    stats: "统计",
    settings: "设置",
    language: "语言",
    insight: "AI 教练见解",
    focus: "专注",
    habitsCompleted: "已完成的习惯",
    days: "天",
    noHabits: "尚未定义习惯。",
    addDemo: "添加示例习惯",
    grid: "网格",
    less: "少",
    more: "多",
    quote: "没人注视时，坚持更难。网格永不撒谎。",
    weeklyPerf: "每周表现",
    strongestHabits: "最强的习惯",
    completionWord: "完成",
    sponsored: "赞助内容"
  },
  ja: {
    home: "今日",
    calendar: "グリッド",
    analytics: "分析",
    coach: "AIコーチ",
    profile: "プロフィール",
    habits: "あなたの習慣",
    dailyProgress: "今日の進捗",
    streak: "連続中",
    consistency: "継続性",
    perfect: "完璧",
    good: "良好",
    askAdvice: "アドバイスを求める...",
    logout: "ログアウト",
    stats: "統計",
    settings: "設定",
    language: "言語",
    insight: "AIコーチの洞察",
    focus: "集中",
    habitsCompleted: "完了した習慣",
    days: "日",
    noHabits: "習慣がまだ定義されていません。",
    addDemo: "デモ習慣を追加",
    grid: "グリッド",
    less: "少ない",
    more: "多い",
    quote: "誰も見ていないとき、継続はより難しくなります。グリッドは嘘をつきません。",
    weeklyPerf: "週間パフォーマンス",
    strongestHabits: "最も強い習慣",
    completionWord: "完了",
    sponsored: "スポンサー"
  },
  pt: {
    home: "Hoje",
    calendar: "A Grade",
    analytics: "Análises",
    coach: "Treinador IA",
    profile: "Perfil",
    habits: "Seus Hábitos",
    dailyProgress: "Progresso Diário",
    streak: "sequência",
    consistency: "Consistência",
    perfect: "Perfeito",
    good: "Bom",
    askAdvice: "Peça um conselho...",
    logout: "Sair",
    stats: "Estatísticas",
    settings: "Configurações",
    language: "Idioma",
    insight: "Insight do Treinador IA",
    focus: "Foco",
    habitsCompleted: "Hábitos concluídos",
    days: "Dias",
    noHabits: "Nenhum hábito definido ainda.",
    addDemo: "Adicionar hábito de demonstração",
    grid: "Grade",
    less: "Menos",
    more: "Mais",
    quote: "A consistência é mais difícil quando ninguém está olhando. A Grade nunca mente.",
    weeklyPerf: "Desempenho Semanal",
    strongestHabits: "Hábitos mais fortes",
    completionWord: "concluído",
    sponsored: "Patrocinado"
  },
  ar: {
    home: "اليوم",
    calendar: "الشبكة",
    analytics: "التحليلات",
    coach: "مدرب الذكاء الاصطناعي",
    profile: "الملف الشخصي",
    habits: "عاداتك",
    dailyProgress: "التقدم اليومي",
    streak: "سلسلة",
    consistency: "الاتساق",
    perfect: "مثالي",
    good: "جيد",
    askAdvice: "اطلب نصيحة...",
    logout: "تسجيل الخروج",
    stats: "الإحصائيات",
    settings: "الإعدادات",
    language: "اللغة",
    insight: "رؤية مدرب الذكاء الاصطناعي",
    focus: "التركيز",
    habitsCompleted: "العادات المكتملة",
    days: "أيام",
    noHabits: "لم يتم تحديد عادات بعد.",
    addDemo: "إضافة عادة تجريبية",
    grid: "الشبكة",
    less: "أقل",
    more: "أكثر",
    quote: "الاتساق أصعب عندما لا ينظر أحد. الشبكة لا تكذب أبدًا.",
    weeklyPerf: "الأداء الأسبوعي",
    strongestHabits: "أقوى العادات",
    completionWord: "اكتمال",
    sponsored: "محتوى إعلاني"
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
