/**
 * Ramadan & Ten Blessed Days Content Database
 * Fully offline – authentic – scalable
 */

// ==================== INTERFACES ====================

export type RamadanCategory =
  | 'suhoor'
  | 'iftar'
  | 'fasting'
  | 'taraweeh'
  | 'qiyam'
  | 'dua'
  | 'charity';

export interface RamadanAzkar {
  id: string;
  category: RamadanCategory;
  titleArabic: string;
  zikr: string;
  transliteration?: string;
  meaning: string;
  source: string;
  reward: string;
  timing: string;
  additionalTips?: string;
}

export interface RamadanMission {
  id: string;
  day: number; // 1–30
  title: string;
  description: string;
  challenge: string;
  reward: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuranReadingPlan {
  day: number;
  surahStart: number;
  surahEnd: number;
  ayahStart?: number;
  ayahEnd?: number;
  theme: string;
  spiritualReflection: string;
}

// ==================== RAMADAN AZKAR ====================

export const RAMADAN_AZKAR: RamadanAzkar[] = [
  {
    id: 'suhoor_1',
    category: 'suhoor',
    titleArabic: 'نية الصيام',
    zikr: 'نويت صيام هذا اليوم من شهر رمضان إيمانًا واحتسابًا لله تعالى',
    meaning:
      'I intend to fast this day of Ramadan out of faith and seeking reward from Allah',
    source: 'النية محلها القلب – مأخوذ من المعنى الشرعي',
    reward: 'قبول الصيام بإذن الله',
    timing: 'قبل الفجر',
    additionalTips: 'النية لا يشترط التلفظ بها، ويكفي عزم القلب'
  },
  {
    id: 'fasting_1',
    category: 'fasting',
    titleArabic: 'دعاء الصائم',
    zikr:
      'اللهم إني لك صمت وبك آمنت وعليك توكلت وعلى رزقك أفطرت',
    meaning:
      'O Allah, for You I have fasted, in You I have believed, upon You I rely, and with Your provision I break my fast',
    source: 'ورد بمعناه في السنن',
    reward: 'دعاء الصائم لا يُرد',
    timing: 'طوال وقت الصيام'
  },
  {
    id: 'iftar_1',
    category: 'iftar',
    titleArabic: 'دعاء الإفطار',
    zikr:
      'ذهب الظمأ وابتلت العروق وثبت الأجر إن شاء الله',
    meaning:
      'The thirst has gone, the veins are moistened, and the reward is assured, if Allah wills',
    source: 'رواه أبو داود وصححه الألباني',
    reward: 'ثواب الإفطار',
    timing: 'عند الإفطار مباشرة'
  },
  {
    id: 'qiyam_1',
    category: 'qiyam',
    titleArabic: 'دعاء قيام الليل',
    zikr:
      'اللهم لك الحمد، أنت نور السماوات والأرض، اغفر لي ذنبي كله',
    meaning:
      'O Allah, all praise is Yours, You are the Light of the heavens and the earth, forgive me all my sins',
    source: 'صحيح البخاري ومسلم',
    reward: 'مغفرة الذنوب',
    timing: 'الثلث الأخير من الليل'
  }
];

// ==================== RAMADAN MISSIONS ====================

export const RAMADAN_DAILY_MISSIONS: RamadanMission[] = [
  {
    id: 'day_1',
    day: 1,
    title: 'نية وبداية صادقة',
    description: 'بداية شهر رمضان',
    challenge: 'جدّد نيتك واكتب هدفك من رمضان',
    reward: 'ثبات وإخلاص',
    difficulty: 'easy'
  },
  {
    id: 'day_2',
    day: 2,
    title: 'القرآن رفيقك',
    description: 'يوم مع كتاب الله',
    challenge: 'اقرأ 4 صفحات بتدبر',
    reward: 'نور في القلب',
    difficulty: 'medium'
  }
  // يُستكمل حتى اليوم 30
];

// ==================== RAMADAN KHATMA ====================

export const RAMADAN_KHATMA_PLAN: QuranReadingPlan[] = [
  {
    day: 1,
    surahStart: 1,
    surahEnd: 1,
    theme: 'الفاتحة',
    spiritualReflection:
      'كيف تخاطب الله في كل ركعة؟'
  },
  {
    day: 2,
    surahStart: 2,
    surahEnd: 2,
    ayahStart: 1,
    ayahEnd: 141,
    theme: 'الاستخلاف في الأرض',
    spiritualReflection:
      'ما مسؤوليتك كعبد لله؟'
  }
];

// ==================== TEN BLESSED DAYS ====================

export interface TenDaysContent {
  id: string;
  day: number; // 1–10
  category: 'morning' | 'evening' | 'qiyam' | 'dua' | 'action';
  titleArabic: string;
  content: string;
  spiritualGuidance: string;
}

export const TEN_BLESSED_DAYS_CONTENT: TenDaysContent[] = [
  {
    id: 'ten_1',
    day: 1,
    category: 'action',
    titleArabic: 'استقبال العشر',
    content:
      'أكثر من الذكر والتكبير والنية الصالحة',
    spiritualGuidance:
      'الأعمال الصالحة في هذه الأيام أحب إلى الله'
  },
  {
    id: 'ten_2',
    day: 2,
    category: 'dua',
    titleArabic: 'دعاء المغفرة',
    content:
      'اللهم اغفر لي وارحمني واعتق رقبتي من النار',
    spiritualGuidance:
      'الإكثار من الدعاء في العشر من أعظم القربات'
  }
];
