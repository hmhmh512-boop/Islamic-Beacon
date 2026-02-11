
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
  ADHAN = 'adhan', // FIX: New Adhan section
  FORTY_HADITH = 'forty_hadith',
  HISN_ALMUSLIM = 'hisn_almuslim',
  RAMADAN_SPECIAL = 'ramadan_special',
  RAMADAN_DASHBOARD = 'ramadan_dashboard',
  KHATMA_PLANNER = 'khatma_planner',
  TEN_DAYS_SPECIAL = 'ten_days_special',
  RAMADAN_REMINDERS = 'ramadan_reminders',
  TASME_A = 'tasme_a', // FIX: New Tasme'a section for Quran dictation
  DAILY_WIRD = 'daily_wird' // FIX: New daily Wird section for tracking
}

export interface Reciter {
  id: string;
  name: string;
  identifier: string;
  server: string;
  style?: string; // مثل: تجويد، ترتيل، حدر، إلخ
  country?: string;
}

// FIX: New types for page-based display
export interface QuranPage {
  pageNumber: number;
  surahId: number;
  startAyah: number;
  endAyah: number;
  ayahs: QuranAyah[];
}

export interface QuranAyah {
  numberInSurah: number;
  numberInQuran: number;
  text: string;
  juzNumber?: number;
  hizbNumber?: number;
}

// FIX: Search result type
export interface SearchResult {
  type: 'surah' | 'ayah';
  surahId: number;
  surahName: string;
  ayahNumber?: number;
  ayahText?: string;
  page?: number;
}

// FIX: Tasme'a types for dictation feature
export interface TasmeaSession {
  id: string;
  surahId: number;
  surahName: string;
  startAyah: number;
  endAyah: number;
  userText: string;
  correctText: string;
  accuracy: number; // 0-100
  errors: TasmeaError[];
  startTime: number;
  endTime?: number;
  duration?: number; // in seconds
}

export interface TasmeaError {
  position: number;
  userWord: string;
  correctWord: string;
  type: 'spelling' | 'missing' | 'extra';
}

// FIX: Azkar with audio support
export interface AzkarItemWithAudio extends AzkarItem {
  audioUrl?: string;
  transliteration?: string;
  meaning?: string;
  reward?: string;
  timing?: string;
  frequency?: string;
}

export interface AzkarItem {
  id: string;
  category: string; // Can be: صباح, مساء, النوم, السفر, الشكر, الخوف, عام
  text: string;
  count: number;
  source?: string; // Source reference (e.g., البخاري, مسلم, حصن المسلم)
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
