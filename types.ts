
export interface Surah {
  id: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
  revelationType: string;
  isFavorite?: boolean;
}

export interface User {
  name: string;
  email: string;
  photo: string;
  isLoggedIn: boolean;
}

export interface NameOfAllah {
  name: string;
  meaning: string;
}

export interface ProphetStory {
  prophet: string;
  title: string;
  content: string;
}

export interface NawawiHadith {
  id: number;
  title: string;
  hadith: string;
  explanation: string;
}

export interface Hadith {
  id: number;
  text: string;
  source: string;
}

export interface Sunnah {
  id: number;
  title: string;
  description: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export enum AppTab {
  DASHBOARD = 'dashboard',
  QURAN = 'quran',
  AZKAR = 'azkar',
  HADITH = 'hadith',
  QUIZ = 'quiz',
  ASSISTANT = 'assistant',
  TASBIH = 'tasbih',
  LOGIN = 'login',
  STORIES = 'stories',
  ZAKAT = 'zakat',
  HAJJ = 'hajj',
  PRAYER_TIMES = 'prayer_times',
  FORTY_HADITH = 'forty_hadith',
  HISN_ALMUSLIM = 'hisn_almuslim',
  RAMADAN_SPECIAL = 'ramadan_special',
  RAMADAN_DASHBOARD = 'ramadan_dashboard',
  KHATMA_PLANNER = 'khatma_planner',
  TEN_DAYS_SPECIAL = 'ten_days_special',
  RAMADAN_REMINDERS = 'ramadan_reminders'
}

export interface Reciter {
  id: string;
  name: string;
  identifier: string;
  server: string;
}

export interface AzkarItem {
  id: number;
  category: string;
  text: string;
  count: number;
  // مصدر الذكر أو الدعاء (مثلاً: البخاري، مسلم، حصن المسلم...)
  source?: string;
}

// نماذج خاصة بالمساعد الذكي (Offline / Online)
export interface AssistantMessage {
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: number;
  offline?: boolean;
}

export interface OfflineKnowledgeEntry {
  key: string;          // الكلمة أو الموضوع المستهدف في البحث
  answer: string;       // النص الكامل للإجابة
  tags?: string[];      // كلمات مفتاحية مساعدة
}
