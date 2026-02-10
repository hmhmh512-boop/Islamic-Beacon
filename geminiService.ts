import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from "./types";
import {
  AZKAR_DATABASE,
  QURAN_DATABASE,
  HADITH_DATABASE,
  FIQH_DATABASE,
  STORIES_DATABASE,
  GENERAL_KNOWLEDGE,
  searchKnowledgeBase,
  searchAzkar,
  searchQuran,
  searchHadith,
  searchFiqh,
  searchStories,
  getRandomAzkar,
  getRandomStories,
} from "./assistant-knowledge-base";

// 📝 قاعدة معرفية أوفلاين
const OFFLINE_KNOWLEDGE: Record<string, string> = {
  "التوحيد": "التوحيد هو إفراد الله بالعبادة وإنكار الشريك معه...",
  "الإيمان": "الإيمان قول باللسان وتصديق بالجنان وعمل بالأركان...",
  "الإحسان": "الإحسان هو أن تعبد الله كأنك تراه...",
  "الشهادتين": "أشهد أن لا إله إلا الله وأشهد أن محمداً رسول الله.",
  "الصلاة": "الصلاة عماد الدين وثاني أركان الإسلام...",
  "شروط الصلاة": "الإسلام، العقل، التمييز، رفع الحدث...",
  "أركان الصلاة": "تكبيرة الإحرام، قراءة الفاتحة، الركوع...",
  "الوضوء": "غسل الكفين، المضمضة، غسل الوجه، غسل اليدين...",
  "نواقض الوضوء": "الخارج من السبيلين، النوم العميق...",
  "التيمم": "هو التطهر بالتراب النظيف عند عدم وجود الماء...",
  "الصيام": "هو الإمساك عن المفطرات من طلوع الفجر إلى غروب الشمس...",
  "مبطلات الصيام": "الأكل والشرب عمداً، الجماع، القيء عمداً...",
  "ليلة القدر": "ليلة عظيمة في شهر رمضان...",
  "زكاة الفطر": "واجبة على كل مسلم غني وفقير من تمام رمضان...",
  "الزكاة": "حق واجب في مال مخصوص... نصاب الذهب 85 جرام، الفضة 595 جرام...",
  "مصارف الزكاة": "ثمانية مصارف: الفقراء، المساكين، العاملين عليها...",
  "الحج": "قصد بيت الله الحرام لأداء مناسك مخصوصة...",
  "أركان الحج": "الإحرام، الوقوف بعرفة، طواف الإفاضة، السعي...",
  "العمرة": "زيارة بيت الله الحرام لأداء الطواف والسعي...",
  "أذكار الصباح": "آية الكرسي، سورة الفلق والناس، دعاء أصبحنا...",
  "أذكار المساء": "آية الكرسي، سورة الفلق والناس، دعاء أمسينا...",
  "دعاء السفر": "سبحان الذي سخر لنا هذا وما كنا له مقرنين...",
  "الاستخارة": "صلاة ركعتين ثم دعاء الاستخارة...",
  "القرآن": "كلام الله المنزل على محمد صلى الله عليه وسلم...",
  "السنة": "كل ما ورد عن النبي صلى الله عليه وسلم من قول أو فعل...",
  "الصحابة": "هم من لقوا النبي مؤمنين به وماتوا على الإسلام...",
  "بر الوالدين": "طاعتهما في غير معصية، الإحسان إليهما...",
  "صلة الرحم": "زيارة الأقارب والإحسان إليهم...",
  "الربا": "محرم تحريماً قطعياً...",
  "الغيبة": "ذكرك أخاك بما يكره في غيبته من العيوب..."
};

// 🎯 واجهة الردود
export interface AssistantResponse {
  answer: string;
  source: 'online' | 'offline' | 'hybrid';
  suggestedTopics: string[];
  relatedContent: {
    verses?: string[];
    hadiths?: string[];
    stories?: string[];
    azkar?: string[];
  };
  canReadAloud: boolean;
}

// 🔍 دالة البحث الشاملة
export const searchAllBases = (query: string) => ({
  azkar: searchAzkar(query),
  quran: searchQuran(query),
  hadith: searchHadith(query),
  fiqh: searchFiqh(query),
  stories: searchStories(query),
  general: searchKnowledgeBase(query)
});

// 🕌 دالة المساعد الديني
export const askReligiousAssistant = async (
  prompt: string,
  history: any[]
): Promise<AssistantResponse> => {
  const searchPrompt = prompt.toLowerCase().trim();
  const allResults = searchAllBases(prompt);

  let answer = "";
  let source: 'online' | 'offline' | 'hybrid' = 'offline';
  let suggestedTopics: string[] = [];
  let relatedContent = { verses: [], hadiths: [], stories: [], azkar: [] };
  let hasLocalMatch = false;

  // 🔹 أولوية البحث: القرآن
  if (allResults.quran.length > 0) {
    hasLocalMatch = true;
    const surah = allResults.quran[0];
    answer = `📖 **${surah.surahNameArabic}**\n${surah.description}\n📌 الموضوع: ${surah.theme}\n📝 عدد الآيات: ${surah.versesCount}\n🕌 نوع السورة: ${surah.revelation === 'Meccan' ? 'مكية' : 'مدنية'}\n**آية مهمة:** "${surah.keyVerse}"`;
    suggestedTopics = surah.importantTopics;
    relatedContent.verses = surah.importantTopics;
  }

  // 🔹 البحث في الأحاديث
  if (!hasLocalMatch && allResults.hadith.length > 0) {
    hasLocalMatch = true;
    const hadith = allResults.hadith[0];
    answer = `🕌 **الحديث الشريف**\n"${hadith.text}"\n📖 المصدر: ${hadith.source}\n👤 الراوي: ${hadith.narrator}\n⭐ درجة الحديث: ${hadith.degree}\n📌 الموضوع: ${hadith.topic}\n💡 المعنى: ${hadith.meaning}`;
    suggestedTopics = [hadith.topic];
    relatedContent.hadiths = hadith.relatedAhadith || [];
  }

  // 🔹 البحث في الفقه
  if (!hasLocalMatch && allResults.fiqh.length > 0) {
    hasLocalMatch = true;
    const fiqhEntry = allResults.fiqh[0];
    answer = `⚖️ **${fiqhEntry.titleArabic}**\n📚 التعريف: ${fiqhEntry.definition}\n📖 الحكم: ${fiqhEntry.ruling}`;
    if (fiqhEntry.conditions) answer += `\n✅ الشروط:\n${fiqhEntry.conditions.map(c => `• ${c}`).join('\n')}`;
    if (fiqhEntry.examples) answer += `\n📝 أمثلة:\n${fiqhEntry.examples.map(e => `• ${e}`).join('\n')}`;
    suggestedTopics = fiqhEntry.practicalTips?.slice(0, 3) || [];
    relatedContent.verses = fiqhEntry.relatedAyas || [];
  }

  // 🔹 البحث في الأذكار
  if (!hasLocalMatch && allResults.azkar.length > 0) {
    hasLocalMatch = true;
    const zikr = allResults.azkar[0];
    answer = `📿 **${zikr.titleArabic}**\n🎯 الذكر: "${zikr.zikr}"\n📖 المعنى: ${zikr.meaning}\n🏆 الفضل: ${zikr.reward}`;
    suggestedTopics = ['تطبيق يومي', 'أوقات مختلفة', 'فضائل إضافية'];
    relatedContent.azkar = [zikr.titleArabic];
  }

  // 🔹 البحث في القصص
  if (!hasLocalMatch && allResults.stories.length > 0) {
    hasLocalMatch = true;
    const story = allResults.stories[0];
    answer = `📖 **${story.titleArabic}**\n📜 القصة:\n${story.fullStory}\n💡 الدرس: ${story.lesson}`;
    suggestedTopics = ['دروس أخرى', 'شخصيات إسلامية', 'قصص مشابهة'];
    relatedContent.stories = [story.titleArabic];
  }

  // 🔹 البحث العام
  if (!hasLocalMatch && allResults.general.length > 0) {
    hasLocalMatch = true;
    const general = allResults.general[0];
    answer = `📌 **${general.titleArabic}**\n${general.answer}`;
    suggestedTopics = general.suggestedTopics || [];
  }

  // 🔹 التحقق من القاعدة المحلية
  if (!hasLocalMatch) {
    for (const key in OFFLINE_KNOWLEDGE) {
      if (searchPrompt.includes(key.toLowerCase())) {
        answer = `💬 **${key}**\n${OFFLINE_KNOWLEDGE[key]}`;
        hasLocalMatch = true;
        break;
      }
    }
  }

  // 🔹 إثراء الإجابة عبر الإنترنت
  if (hasLocalMatch && navigator.onLine && typeof navigator !== 'undefined') {
    source = 'hybrid';
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const enrichmentPrompt = `السؤال: ${prompt}\nالإجابة الأساسية:\n${answer}\nأضف نقاط مهمة إضافية باختصار.`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: enrichmentPrompt }] }],
        config: { systemInstruction: `أنت مساعد إسلامي، أضف معلومات إضافية دون تكرار.`, temperature: 0.3 }
      });
      if (response.text) answer += `\n✨ معلومات إضافية:\n${response.text}`;
    } catch {}
  } else if (!hasLocalMatch && navigator.onLine) {
    source = 'online';
    answer = "عذراً، لم أتمكن من استحضار الإجابة. حاول سؤال آخر.";
  } else if (!hasLocalMatch) {
    answer = "عذراً، لم أجد إجابة في القاعدة المحلية. يرجى الاتصال بالإنترنت.";
  }

  // 🔹 اقتراحات عشوائية
  if (suggestedTopics.length === 0) {
    const randomAzkar = getRandomAzkar(1);
    const randomStories = getRandomStories(1);
    if (randomAzkar.length) suggestedTopics.push(`تعلم: ${randomAzkar[0].titleArabic}`);
    if (randomStories.length) suggestedTopics.push(`اقرأ قصة: ${randomStories[0].titleArabic}`);
  }

  return { answer, source, suggestedTopics: suggestedTopics.slice(0,3), relatedContent, canReadAloud: true };
};

// 🔊 تحويل النص لصوت
export const speakText = (text: string, language: string = 'ar-SA'): Promise<void> => new Promise((resolve, reject) => {
  if (!('speechSynthesis' in window)) return reject(new Error('Speech synthesis not supported'));
  const utterance = new SpeechSynthesisUtterance(text.replace(/[#*`]/g,'').replace(/\n/g,'. ').substring(0,500));
  utterance.lang = language; utterance.rate = 0.9; utterance.pitch = 1; utterance.volume = 1;
  utterance.onend = () => resolve();
  utterance.onerror = () => reject(new Error('Speech synthesis failed'));
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
});

// ⏹️ إيقاف الصوت
export const stopSpeech = () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); };

// 📝 أسئلة اختيار من متعدد ثابتة
export interface MultipleChoiceQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// ⚡ إنشاء أسئلة اختيار متعدد
export const generateMultipleChoiceQuestions = (): MultipleChoiceQuestion[] => {
  return [
    { id: 'mc-001', question: 'كم عدد أركان الإسلام؟', options: ['ثلاثة','أربعة','خمسة','ستة'], correctAnswerIndex:2, explanation:'أركان الإسلام خمسة: الشهادتان، الصلاة، الزكاة، الصيام والحج', difficulty:'easy' },
    { id: 'mc-002', question: 'كم عدد أركان الإيمان؟', options: ['خمسة','ستة','سبعة','ثمانية'], correctAnswerIndex:1, explanation:'أركان الإيمان ستة: الإيمان بالله وملائكته وكتبه ورسله واليوم الآخر والقدر', difficulty:'easy' },
    { id: 'mc-003', question: 'كم عدد الصلوات المفروضة؟', options: ['ثلاث','أربع','خمس','ست'], correctAnswerIndex:2, explanation:'الصلوات المفروضة خمس: الفجر والظهر والعصر والمغرب والعشاء', difficulty:'easy' },
    { id: 'mc-004', question: 'كم عدد سور القرآن الكريم؟', options: ['100','110','114','120'], correctAnswerIndex:2, explanation:'القرآن الكريم 114 سورة', difficulty:'hard' },
    { id: 'mc-005', question: 'في أي شهر الصيام المفروض؟', options: ['محرم','رمضان','شوال','ذو الحجة'], correctAnswerIndex:1, explanation:'الصيام المفروض في رمضان', difficulty:'easy' }
  ];
};

// ⚡ إنشاء أسئلة ذكية عبر AI
export const generateSmartQuiz = async (): Promise<QuizQuestion[]> => {
  if (!navigator.onLine) return [];
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role:'user', parts:[{ text:'Generate 5 Arabic Islamic multiple choice questions in JSON format.' }] }],
      config:{ temperature:0.7 }
    });
    const parsed = JSON.parse(response.text || '[]');
    return parsed.map((q:any,i:number) => ({
      id:`ai-quiz-${i}`,
      question:q.question,
      options:q.options||[],
      answerIndex:q.answerIndex||0,
      explanation:q.explanation||'',
      category:'Islamic Knowledge'
    }));
  } catch {
    return [];
  }
};
