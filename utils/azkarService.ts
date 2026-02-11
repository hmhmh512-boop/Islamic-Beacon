// AzkarService.ts - Service for managing Azkar with audio
import { AzkarItemWithAudio } from '../types';

/**
 * Azkar categories with audio and additional information
 * Categories: صباح, مساء, النوم, السفر, الشكر, الخوف, عام
 */
export const AZKAR_WITH_AUDIO: AzkarItemWithAudio[] = [
  // صباح (Morning Azkar)
  {
    id: '1',
    category: 'صباح',
    text: 'اللهم بك أصبحنا وبك أمسينا وبك نحيا وبك نموت وإليك النشور',
    count: 1,
    source: 'اليومية',
    audioUrl: 'https://example.com/azkar/morning/1.mp3',
    transliteration: 'Allahumma bika asbahna wa bika amsayna',
    meaning: 'O Allah, by You we begin the morning and by You we begin the evening...',
    reward: 'من قالها موقنا بها دخل الجنة',
    timing: 'الصباح',
    frequency: 'يوميا',
  },
  {
    id: '2',
    category: 'صباح',
    text: 'اللهم إني أصبحت أشهدك وأشهد حملة عرشك وملائكتك وجميع خلقك أنك أنت الله لا إله إلا أنت وحدك لا شريك لك',
    count: 3,
    source: 'اليومية',
    audioUrl: 'https://example.com/azkar/morning/2.mp3',
    transliteration: 'Allahumma inni asbahtu ushhiduka...',
    meaning: 'O Allah, I have reached the morning and call upon You...',
    reward: 'تحت سبعة أظلال يوم القيامة',
    timing: 'الصباح',
    frequency: 'يوميا',
  },
  {
    id: '3',
    category: 'صباح',
    text: 'الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور',
    count: 1,
    source: 'اليومية',
    audioUrl: 'https://example.com/azkar/morning/3.mp3',
    transliteration: 'Alhamdulillahi alladhi ahyana ba\'da ma amatana',
    meaning: 'All praise is due to Allah who has revived us after causing us to die...',
    reward: 'من قالها دخل الجنة',
    timing: 'الصباح',
    frequency: 'يوميا',
  },

  // مساء (Evening Azkar)
  {
    id: '4',
    category: 'مساء',
    text: 'اللهم بك أمسينا وبك نحيا وإليك المصير',
    count: 1,
    source: 'اليومية',
    audioUrl: 'https://example.com/azkar/evening/1.mp3',
    transliteration: 'Allahumma bika amsayna wa bika nahya wa ilaika al-masir',
    meaning: 'O Allah, by You we have reached the evening...',
    reward: 'حفظ من الشر',
    timing: 'المساء',
    frequency: 'يوميا',
  },
  {
    id: '5',
    category: 'مساء',
    text: 'اللهم أمسينا في حفظك وجوارك وحرزك وستائك',
    count: 1,
    source: 'اليومية',
    audioUrl: 'https://example.com/azkar/evening/2.mp3',
    transliteration: 'Allahumma amsayna fi hifzika wa jiwarika',
    meaning: 'O Allah, we have reached the evening under Your protection...',
    reward: 'السلامة من كل سوء',
    timing: 'المساء',
    frequency: 'يوميا',
  },

  // الخوف (Fear/Anxiety)
  {
    id: '6',
    category: 'الخوف',
    text: 'حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم',
    count: 7,
    source: 'آية الكرسي',
    audioUrl: 'https://example.com/azkar/fear/1.mp3',
    transliteration: 'Hasbiya Allahu la ilaha illa huwa alayhi tawakkaltu wa huwa rabb al-arsh al-azeem',
    meaning: 'Allah is sufficient for me. There is no deity except Him. Upon Him I rely...',
    reward: 'تفريج الهموم والأحزان',
    timing: 'عند الخوف',
    frequency: 'حسب الحاجة',
  },
  {
    id: '7',
    category: 'الخوف',
    text: 'اللهم إني أعوذ بك من الهم والحزن والعجز والكسل والبخل والجبن وضلع الدين وغلبة الرجال',
    count: 1,
    source: 'دعاء النبي',
    audioUrl: 'https://example.com/azkar/fear/2.mp3',
    transliteration: 'Allahumma inni a\'udhu bika min al-hamm wa al-hazn...',
    meaning: 'O Allah, I seek refuge with You from worry, grief, powerlessness...',
    reward: 'إزالة الهموم والكروب',
    timing: 'عند الخوف',
    frequency: 'حسب الحاجة',
  },

  // السفر (Travel)
  {
    id: '8',
    category: 'السفر',
    text: 'سبحان الذي سخر لنا هذا وما كنا له مقرنين وإنا إلى ربنا لمنقلبون',
    count: 3,
    source: 'دعاء السفر',
    audioUrl: 'https://example.com/azkar/travel/1.mp3',
    transliteration: 'Subhana alladhi sakhkhara lana hadha wa ma kunna lahu muqrinun',
    meaning: 'Glory be to Him who has subjected this for us and we could not have done it...',
    reward: 'حفظ في السفر',
    timing: 'عند السفر',
    frequency: 'عند بداية السفر',
  },
  {
    id: '9',
    category: 'السفر',
    text: 'اللهم إني أعوذ بك من وعثاء السفر وكآبة المنقلب وسوء المنظر في الأهل والمال',
    count: 1,
    source: 'دعاء السفر',
    audioUrl: 'https://example.com/azkar/travel/2.mp3',
    transliteration: 'Allahumma inni a\'udhu bika min wa\'atha al-safar...',
    meaning: 'O Allah, I seek refuge with You from the hardships of travel...',
    reward: 'السلامة والحفظ',
    timing: 'عند السفر',
    frequency: 'عند بداية السفر',
  },

  // الشكر (Gratitude)
  {
    id: '10',
    category: 'الشكر',
    text: 'الحمد لله حمدا كثيرا طيبا مباركا فيه ملء السماوات والأرض وملء ما بينهما',
    count: 3,
    source: 'دعاء الشكر',
    audioUrl: 'https://example.com/azkar/gratitude/1.mp3',
    transliteration: 'Alhamdulillahi hamdan kathiran tayyiban mubarakah',
    meaning: 'All praise is due to Allah with much good praise...',
    reward: 'شكر النعم',
    timing: 'بعد الانتهاء من العمل',
    frequency: 'حسب الحاجة',
  },
  {
    id: '11',
    category: 'الشكر',
    text: 'شكرا لله على كل حال وفي كل وقت وحين',
    count: 1,
    source: 'دعاء الشكر',
    audioUrl: 'https://example.com/azkar/gratitude/2.mp3',
    transliteration: 'Shukran lillahi ala kulli hal wa fi kulli waqt wa heen',
    meaning: 'Thanks to Allah in every state and at every time...',
    reward: 'زيادة النعم',
    timing: 'في كل وقت',
    frequency: 'يوميا',
  },

  // عام (General)
  {
    id: '12',
    category: 'عام',
    text: 'سبحان الله والحمد لله ولا إله إلا الله والله أكبر',
    count: 100,
    source: 'تسبيح',
    audioUrl: 'https://example.com/azkar/general/1.mp3',
    transliteration: 'Subhana Allahi wa alhamdulillahi wa la ilaha illallahu wa Allahu akbar',
    meaning: 'Glory be to Allah, all praise is due to Allah, there is no deity except Allah, and Allah is Greatest',
    reward: 'أحب الدعاء إلى الله',
    timing: 'في كل وقت',
    frequency: 'يوميا',
  },
  {
    id: '13',
    category: 'عام',
    text: 'لا إله إلا الله وحده لا شريك له له الملك وله الحمد وهو على كل شيء قدير',
    count: 100,
    source: 'تهليل',
    audioUrl: 'https://example.com/azkar/general/2.mp3',
    transliteration: 'La ilaha illallahu wahdahu la sharika lahu lahu al-mulk wa lahu al-hamd...',
    meaning: 'There is no deity except Allah alone, with no partner. To Him belongs all sovereignty and praise...',
    reward: 'خير من الدنيا وما فيها',
    timing: 'في كل وقت',
    frequency: 'يوميا',
  },

  // قبل النوم (Before Sleep)
  {
    id: '14',
    category: 'النوم',
    text: 'بسم الله الرحمن الرحيم اللهم باسمك أموت وأحيا',
    count: 1,
    source: 'دعاء النوم',
    audioUrl: 'https://example.com/azkar/sleep/1.mp3',
    transliteration: 'Bismillah ar-Rahman ar-Rahim Allahumma bismika amutu wa ahya',
    meaning: 'In the name of Allah, the Most Gracious, the Most Merciful. O Allah, by Your name I die and I live',
    reward: 'حفظ الله للنائم',
    timing: 'قبل النوم',
    frequency: 'يوميا',
  },
];

export class AzkarService {
  /**
   * Get all Azkar
   */
  static getAllAzkar(): AzkarItemWithAudio[] {
    return AZKAR_WITH_AUDIO;
  }

  /**
   * Get Azkar by category
   */
  static getAzkarByCategory(category: string): AzkarItemWithAudio[] {
    return AZKAR_WITH_AUDIO.filter((azkar) => azkar.category === category);
  }

  /**
   * Get all available categories
   */
  static getCategories(): string[] {
    const categories = new Set<string>();
    AZKAR_WITH_AUDIO.forEach((azkar) => {
      categories.add(azkar.category);
    });
    return Array.from(categories);
  }

  /**
   * Search Azkar by text
   */
  static searchAzkar(query: string): AzkarItemWithAudio[] {
    const normalizedQuery = this.normalizeText(query);
    return AZKAR_WITH_AUDIO.filter((azkar) => {
      const normalizedText = this.normalizeText(azkar.text);
      return normalizedText.includes(normalizedQuery);
    });
  }

  /**
   * Get random Azkar
   */
  static getRandomAzkar(): AzkarItemWithAudio {
    return AZKAR_WITH_AUDIO[Math.floor(Math.random() * AZKAR_WITH_AUDIO.length)];
  }

  /**
   * Get daily Azkar based on time
   */
  static getDailyAzkar(): AzkarItemWithAudio[] {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      // Morning
      return this.getAzkarByCategory('صباح');
    } else if (hour >= 12 && hour < 17) {
      // Noon to afternoon
      return this.getAzkarByCategory('عام');
    } else if (hour >= 17 && hour < 21) {
      // Evening
      return this.getAzkarByCategory('مساء');
    } else {
      // Night
      return this.getAzkarByCategory('النوم');
    }
  }

  /**
   * Normalize Arabic text for search
   */
  private static normalizeText(text: string): string {
    return text
      .replace(/[\u064B-\u0652]/g, '') // Remove Arabic diacritics
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Cache Azkar to localStorage
   */
  static cacheAzkar(): void {
    try {
      localStorage.setItem('azkar_cache', JSON.stringify({
        data: AZKAR_WITH_AUDIO,
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.error('Failed to cache Azkar:', error);
    }
  }

  /**
   * Get cached Azkar from localStorage
   */
  static getCachedAzkar(): AzkarItemWithAudio[] | null {
    try {
      const cached = localStorage.getItem('azkar_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        // Cache valid for 24 hours
        if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
          return parsed.data;
        }
      }
      return null;
    } catch (error) {
      console.error('Failed to get cached Azkar:', error);
      return null;
    }
  }
}

export default AzkarService;