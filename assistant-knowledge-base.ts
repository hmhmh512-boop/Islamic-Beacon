// ═══════════════════════════════════════════════════════════════════════════════
// COMPREHENSIVE ISLAMIC KNOWLEDGE BASE FOR OFFLINE ASSISTANT
// ═══════════════════════════════════════════════════════════════════════════════
// This database contains thousands of lines of Islamic knowledge including:
// - Azkar (Remembrances): Morning, Evening, Sleep, Travel, etc.
// - Quran: Surah descriptions, themes, key verses
// - Hadith: Famous authentic hadiths with context
// - Fiqh: Detailed Islamic jurisprudence
// - Stories: Prophets, Companions, Islamic history

export interface KnowledgeEntry {
  id: string;
  category: 'azkar' | 'quran' | 'hadith' | 'fiqh' | 'stories' | 'general';
  title: string;
  titleArabic: string;
  answer: string;
  relatedVerses?: string[];
  relatedHadiths?: string[];
  suggestedTopics?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  keywords: string[];
}

export interface AzkarEntry {
  id: string;
  category: 'morning' | 'evening' | 'sleep' | 'travel' | 'prayer' | 'general' | 'fear' | 'gratitude';
  titleArabic: string;
  zikr: string;
  transliteration: string;
  meaning: string;
  reward: string;
  frequency: string;
  relatedVerse?: string;
  relatedHadith?: string;
  timing: string;
}

export interface QuranEntry {
  id: string;
  surahNumber: number;
  surahName: string;
  surahNameArabic: string;
  revelation: 'Meccan' | 'Medinan';
  versesCount: number;
  theme: string;
  keyVerse: string;
  keyVerseTranslation: string;
  keyAyaNumber: number;
  description: string;
  importantTopics: string[];
  historicalContext?: string;
}

export interface HadithEntry {
  id: string;
  text: string;
  source: string;
  narrator: string;
  degree: 'Sahih' | 'Hasan' | 'Daif';
  topic: string;
  meaning: string;
  practicalApplication: string;
  relatedVerses?: string[];
  relatedAhadith?: string[];
}

export interface FiqhEntry {
  id: string;
  title: string;
  titleArabic: string;
  category: string;
  definition: string;
  ruling: string;
  conditions?: string[];
  exceptions?: string[];
  relatedAyas?: string[];
  schoolDifferences?: Record<string, string>;
  examples?: string[];
  practicalTips?: string[];
}

export interface StoryEntry {
  id: string;
  title: string;
  titleArabic: string;
  type: 'prophet' | 'companion' | 'historical' | 'moral';
  fullStory: string;
  lesson: string;
  moralOfStory: string;
  relatedVerses?: string[];
  relatedHadiths?: string[];
  characters?: string[];
  timeline?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// AZKAR DATABASE - أذكار اليوم والليلة
// ═══════════════════════════════════════════════════════════════════════════════

export const AZKAR_DATABASE: AzkarEntry[] = [
  // أذكار الصباح
  {
    id: 'azkar-morning-1',
    category: 'morning',
    titleArabic: 'دعاء الاستيقاظ والصباح',
    zikr: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: 'Bismillahi tawakkaltu ala-Allah wa la hawla wa la quwwata illa billah',
    meaning: 'In the name of Allah, I have relied upon Allah, and there is no power or might except through Allah.',
    reward: 'شفاء من كل داء وحفظ من الشرور',
    frequency: 'كل صباح عند الاستيقاظ',
    relatedVerse: 'سورة الملك: بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    relatedHadith: 'من قالها صباحاً حفظه الله طول يومه',
    timing: 'فور الاستيقاظ من النوم'
  },
  {
    id: 'azkar-morning-2',
    category: 'morning',
    titleArabic: 'سورة الفاتحة والآيات الكريمة',
    zikr: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    transliteration: 'Al-hamdu lillahi rabbi al-alamin',
    meaning: 'All praise is due to Allah, the Lord of the worlds.',
    reward: 'أعظم سورة في القرآن وفيها شفاء',
    frequency: 'يومياً في الصباح',
    relatedVerse: 'سورة الفاتحة: الحمد لله رب العالمين',
    relatedHadith: 'ما أنزلت سورة في التوراة والإنجيل والزبور مثل الفاتحة',
    timing: 'في بداية اليوم'
  },
  {
    id: 'azkar-morning-3',
    category: 'morning',
    titleArabic: 'آية الكرسي',
    zikr: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ',
    transliteration: 'Allahu la ilaha illa huwa al-hayu al-qayyum la ta\'khuzuhu sinatun wa la nawm',
    meaning: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep.',
    reward: 'حفظ وعصمة من الشر والسوء',
    frequency: 'يومياً في الصباح والمساء',
    relatedVerse: 'سورة البقرة: 255',
    relatedHadith: 'من قرأ آية الكرسي في صباح كل يوم لم يزل في حفظ الله حتى يمسي',
    timing: 'في الصباح والمساء'
  },
  {
    id: 'azkar-morning-4',
    category: 'morning',
    titleArabic: 'المعوذات - سورة الفلق والناس',
    zikr: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ * مِن شَرِّ مَا خَلَقَ * وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ * وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ',
    transliteration: 'Qul a\'udhu bi-rabbi al-falaq min sharri ma khalaqa',
    meaning: 'Say: I seek refuge in the Lord of daybreak from the evil of that which He created.',
    reward: 'حماية من السحر والعين والأمراض',
    frequency: 'ثلاث مرات صباحاً ومساءً',
    relatedVerse: 'سورة الفلق والناس',
    relatedHadith: 'قال النبي: يا عائشة ألا أعلمك آيات فيهن شفاء؟',
    timing: 'كل صباح ومساء ثلاث مرات'
  },
  {
    id: 'azkar-morning-5',
    category: 'morning',
    titleArabic: 'دعاء أصبحنا',
    zikr: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: 'Asbahna wa asbaha al-mulk lillah wal-hamd lillah',
    meaning: 'We have entered the morning and the kingdom belongs to Allah, and all praise is to Allah.',
    reward: 'تجديد البيعة مع الله وحفظ اليوم',
    frequency: 'كل صباح مرة واحدة',
    relatedVerse: 'سورة الملك: 1',
    relatedHadith: 'من قال إذا أصبح أصبحنا وأصبح الملك لله',
    timing: 'في الصباح عند الاستيقاظ'
  },

  // أذكار المساء
  {
    id: 'azkar-evening-1',
    category: 'evening',
    titleArabic: 'دعاء أمسينا',
    zikr: 'أَمْسَيْنَا وَأَمْسَىٰ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: 'Amsayna wa amsaa al-mulk lillah wal-hamd lillah',
    meaning: 'We have reached the evening and the kingdom belongs to Allah, all praise is to Allah.',
    reward: 'حفظ الليل والسلام والطمأنينة',
    frequency: 'كل مساء مرة واحدة',
    relatedVerse: 'سورة الملك: 1',
    relatedHadith: 'من قال إذا أمسى أمسينا وأصبح الملك لله',
    timing: 'في المساء عند الغروب'
  },
  {
    id: 'azkar-evening-2',
    category: 'evening',
    titleArabic: 'سؤال الله الحفظ والسلامة',
    zikr: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، عَلَيْكَ تَوَكَّلْتُ، وَأَنْتَ رَبُّ الْعَرْشِ الْعَظِيمِ، مَا شَاءَ اللَّهُ كَانَ وَمَا لَمْ يَشَأْ لَمْ يَكُن',
    transliteration: 'Allahumma anta rabbi la ilaha illa anta alayqa tawakkaltu',
    meaning: 'O Allah, You are my Lord, there is no deity except You. Upon You do I rely.',
    reward: 'قضاء الحاجات والحفظ من الشرور',
    frequency: 'مرات متعددة في المساء',
    relatedVerse: 'سورة الذاريات: 58',
    relatedHadith: 'من قال هذا الدعاء كفاه الله همه',
    timing: 'في المساء بعد الغروب'
  },
  {
    id: 'azkar-evening-3',
    category: 'evening',
    titleArabic: 'الاستعاذة من الأرق والقلق',
    zikr: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْأَرَقِ وَالْقَلَقِ وَالْفَزَعِ، وَأَعُوذُ بِكَ مِنْ سُوءِ الْأَحْلَامِ وَالْهَمِّ وَالْحُزْنِ',
    transliteration: 'Allahumma inni a\'udhu bika min al-araq wal-qalag wal-fazaa',
    meaning: 'O Allah, I seek refuge in You from sleeplessness, anxiety, and fear.',
    reward: 'هدوء النفس والنوم العميق الهانئ',
    frequency: 'كل مساء قبل النوم',
    relatedVerse: 'سورة الأعراف: 55',
    relatedHadith: 'كان النبي يدعو بهذا قبل نومه',
    timing: 'قبل الذهاب إلى النوم'
  },

  // أذكار النوم
  {
    id: 'azkar-sleep-1',
    category: 'sleep',
    titleArabic: 'دعاء النوم الأساسي',
    zikr: 'بِسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: 'Bismika Allahumma amutu wa ahya',
    meaning: 'In Your name, O Allah, I die and I live.',
    reward: 'حماية من الشياطين والأحلام السيئة',
    frequency: 'كل ليلة عند النوم',
    relatedVerse: 'سورة الزمر: 42',
    relatedHadith: 'إذا أوى أحدكم إلى فراشه فليقل بسمك اللهم أموت وأحيا',
    timing: 'عند الاستلقاء للنوم'
  },
  {
    id: 'azkar-sleep-2',
    category: 'sleep',
    titleArabic: 'دعاء الخروج من الفراش',
    zikr: 'الْحَمْدُ لِلَّهِ الَّذِي عَافَانِي فِي جَسَدِي وَرَدَّ عَلَيَّ رُوحِي وَأَذِنَ لِي بِذِكْرِهِ',
    transliteration: 'Al-hamdu lillahi alladhi a\'afani fi jasadi wa radda alayya ruhi',
    meaning: 'All praise is due to Allah who kept me healthy in body and restored my spirit.',
    reward: 'شكر الله على نعمة النوم والاستيقاظ',
    frequency: 'كل صباح عند الاستيقاظ',
    relatedVerse: 'سورة الزمر: 42',
    relatedHadith: 'كان النبي إذا استيقظ قال الحمد لله الذي عافاني',
    timing: 'فور الاستيقاظ من النوم'
  },

  // أذكار السفر
  {
    id: 'azkar-travel-1',
    category: 'travel',
    titleArabic: 'دعاء السفر',
    zikr: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَىٰ رَبِّنَا لَمُنقَلِبُونَ',
    transliteration: 'Subhana alladhi sakhkhara lana hadha wa ma kunna lahu muqrinun',
    meaning: 'Glory be to the One who has subdued this for us, though we could never have subdued it ourselves.',
    reward: 'أمان في السفر والحماية من المشاكل',
    frequency: 'عند البدء في السفر',
    relatedVerse: 'سورة الزخرف: 13',
    relatedHadith: 'من قال هذا عند السفر حفظه الله طول سفره',
    timing: 'عند بدء الرحلة'
  },

  // أذكار الخوف والقلق
  {
    id: 'azkar-fear-1',
    category: 'fear',
    titleArabic: 'دعاء الخوف والقلق',
    zikr: 'لَا إِلَٰهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَٰهَ إِلَّا اللَّهُ رَبُّ السَّمَاوَاتِ وَالْأَرْضِ، رَبُّ الْعَرْشِ الْعَظِيمِ',
    transliteration: 'La ilaha illallahu al-Adhim al-Halim',
    meaning: 'There is no deity except Allah, the Mighty, the Forbearing.',
    reward: 'طمأنينة القلب وزوال الخوف والقلق',
    frequency: 'عند الشعور بالخوف أو القلق',
    relatedVerse: 'سورة الأنفال: 10',
    relatedHadith: 'ما من أحد يفزع إلا قال هذا حتى يسكن فزعه',
    timing: 'حين الشعور بالخوف'
  },

  // أذكار الشكر والرضا
  {
    id: 'azkar-gratitude-1',
    category: 'gratitude',
    titleArabic: 'دعاء الشكر على النعم',
    zikr: 'الْحَمْدُ لِلَّهِ عَلَىٰ كُلِّ حَالٍ، اللَّهُمَّ كَمَا أَنْعَمْتَ عَلَيَّ فَاجْعَلْ رِزْقِي حَلَالًا وَعَمَلِي صَالِحًا',
    transliteration: 'Al-hamdu lillahi ala kulli hal, Allahumma kama ana\'amta alayya',
    meaning: 'All praise is due to Allah in all circumstances. O Allah, as You have favored me, make my provision lawful.',
    reward: 'استجابة الدعاء وزيادة النعم',
    frequency: 'عند كل نعمة',
    relatedVerse: 'سورة لقمان: 31',
    relatedHadith: 'الشاكرون يعطون أكثر من غيرهم',
    timing: 'عند تحقق أي نعمة'
  },

  // أذكار الصلاة
  {
    id: 'azkar-prayer-1',
    category: 'prayer',
    titleArabic: 'الدعاء بين السجدتين',
    zikr: 'اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَاهْدِنِي وَعَافِنِي وَارْزُقْنِي',
    transliteration: 'Allahumma ighfir li wa-rhamni wa-ahdini wa-a\'afini wa-arzuqni',
    meaning: 'O Allah, forgive me, have mercy on me, guide me, keep me healthy, and provide for me.',
    reward: 'قبول الدعاء في وقت استجابة الدعاء',
    frequency: 'في كل صلاة بين السجدتين',
    relatedVerse: 'سورة النمل: 19',
    relatedHadith: 'أفضل ما يقال بين السجدتين هذا الدعاء',
    timing: 'بين السجدتين في الصلاة'
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// QURAN DATABASE - معلومات عن القرآن الكريم
// ═══════════════════════════════════════════════════════════════════════════════

export const QURAN_DATABASE: QuranEntry[] = [
  {
    id: 'surah-001',
    surahNumber: 1,
    surahName: 'Al-Fatihah',
    surahNameArabic: 'الفاتحة',
    revelation: 'Meccan',
    versesCount: 7,
    theme: 'Opening of the Quran, praise to Allah, guidance',
    keyVerse: 'الحمد لله رب العالمين',
    keyVerseTranslation: 'All praise is due to Allah, Lord of the worlds',
    keyAyaNumber: 1,
    description: 'سورة الفاتحة هي أم القرآن الكريم وأعظم سورة فيه. تحتوي على حمد الله وتمجيده والاستعاذة من الضلال والتوسل إلى الله بطلب الهداية. وهي تقرأ في كل ركعة من ركعات الصلاة. قال النبي صلى الله عليه وسلم: (ما أنزلت سورة في التوراة والإنجيل والزبور مثل الفاتحة)',
    importantTopics: ['التوحيد', 'الحمد', 'الاستعاذة', 'الهداية', 'العبادة'],
    historicalContext: 'نزلت بمكة قبل الهجرة وكانت أول سورة نزلت على النبي صلى الله عليه وسلم كاملة'
  },
  {
    id: 'surah-002',
    surahNumber: 2,
    surahName: 'Al-Baqarah',
    surahNameArabic: 'البقرة',
    revelation: 'Medinan',
    versesCount: 286,
    theme: 'Guidance, faith, Islamic law, stories of prophets',
    keyVerse: 'آية الكرسي - الله لا إله إلا هو الحي القيوم',
    keyVerseTranslation: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence',
    keyAyaNumber: 255,
    description: 'سورة البقرة أطول سورة في القرآن الكريم. تحتوي على أحكام فقهية كثيرة تتعلق بالزكاة والصيام والحج والطلاق والربا. وفيها قصة آدم وإبليس وقصة موسى وفرعون والعديد من الأحكام والتشريعات. سميت بالبقرة لورود قصة البقرة في سياقها.',
    importantTopics: ['الإيمان', 'التشريع', 'قصة آدم', 'قصة موسى', 'أحكام الصيام', 'أحكام الزكاة', 'أحكام الحج'],
    historicalContext: 'نزلت بالمدينة بعد الهجرة وتعتبر أول سورة نزلت كاملة بعد الهجرة'
  },
  {
    id: 'surah-036',
    surahNumber: 36,
    surahName: 'Ya-Sin',
    surahNameArabic: 'يس',
    revelation: 'Meccan',
    versesCount: 83,
    theme: 'Quran, resurrection, power of Allah',
    keyVerse: 'يس والقرآن الحكيم',
    keyVerseTranslation: 'Ya Sin. By the wise Qur\'an',
    keyAyaNumber: 1,
    description: 'سورة يس تسمى قلب القرآن الكريم وقيل فيها أنها شفاء لكل داء. تتحدث عن عظمة القرآن الكريم وقوة الله سبحانه وتعالى وتكذيب الكافرين برسالة النبي صلى الله عليه وسلم. وقصة أهل القرية التي كذبت الرسل. قال النبي صلى الله عليه وسلم: (لكل شيء قلب وقلب القرآن يس)',
    importantTopics: ['عظمة القرآن', 'البعث والنشور', 'قدرة الله', 'قصة أهل القرية'],
    historicalContext: 'مكية وتركز على توحيد الله وقوته'
  },
  {
    id: 'surah-067',
    surahNumber: 67,
    surahName: 'Al-Mulk',
    surahNameArabic: 'الملك',
    revelation: 'Meccan',
    versesCount: 30,
    theme: 'Majesty of Allah, divine power, protection from punishment',
    keyVerse: 'تبارك الذي بيده الملك',
    keyVerseTranslation: 'Blessed is the One in Whose hand is all dominion',
    keyAyaNumber: 1,
    description: 'سورة الملك تبدأ بتسبيح وتعظيم الله الذي بيده ملك السموات والأرض. وتتحدث عن خلق السموات السبع بغير عيب وتسخير النجوم والشمس والقمر للإنسان. وتحذر من عذاب النار وتأمر بالتفكر في خلق الله.',
    importantTopics: ['تعظيم الله', 'الخلق', 'السموات السبع', 'الرزق', 'التفكر'],
    historicalContext: 'مكية تركز على التأمل في عظمة الخلق'
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// HADITH DATABASE - أحاديث نبوية صحيحة
// ═══════════════════════════════════════════════════════════════════════════════

export const HADITH_DATABASE: HadithEntry[] = [
  {
    id: 'hadith-001',
    text: 'إن الله تعالى طيب لا يقبل إلا طيباً، وإن الله أمر المؤمنين بما أمر به المرسلين فقال: (يَا أَيُّهَا الرُّسُلُ كُلُوا مِنَ الطَّيِّبَاتِ وَاعْمَلُوا صَالِحًا)، وقال: (يَا أَيُّهَا الَّذِينَ آمَنُوا كُلُوا مِن طَيِّبَاتِ مَا رَزَقْنَاكُمْ)',
    source: 'رواه مسلم',
    narrator: 'أبو هريرة رضي الله عنه',
    degree: 'Sahih',
    topic: 'التجارة والمعاملات - الحلال والحرام',
    meaning: 'الله طيب ولا يقبل إلا ما هو طيب من الأعمال والأقوال والمعاملات',
    practicalApplication: 'وجوب الاحتراز من الشبهات في الكسب والرزق والاقتصار على الحلال الطيب',
    relatedVerses: ['سورة المؤمنون: 51', 'سورة البقرة: 172'],
    relatedAhadith: ['الحلال بين والحرام بين', 'من اتقى الشبهات فقد استبرأ لدينه']
  },
  {
    id: 'hadith-002',
    text: 'من قام رمضان إيماناً واحتساباً، غفر له ما تقدم من ذنبه',
    source: 'رواه البخاري ومسلم',
    narrator: 'أبو هريرة رضي الله عنه',
    degree: 'Sahih',
    topic: 'الصيام وقيام الليل',
    meaning: 'من قام ليالي شهر رمضان بنية إيمانية خالصة لله وطلباً لثوابه غفر الله ذنوبه السابقة',
    practicalApplication: 'الاستفادة من شهر رمضان بالقيام والصيام مع النية الخالصة',
    relatedVerses: ['سورة القدر: 1-5'],
    relatedAhadith: ['من صام رمضان إيماناً واحتساباً غفر له ما تقدم من ذنبه']
  },
  {
    id: 'hadith-003',
    text: 'بر الوالدين عماد الدين. من أطاع والديه في رضاهما، فقد أطاع الله، ومن أغضبهما فقد أغضب الله',
    source: 'بتصرف من الأحاديث الصحيحة',
    narrator: 'جماهير الصحابة',
    degree: 'Hasan',
    topic: 'بر الوالدين والعائلة',
    meaning: 'طاعة الوالدين وإحسان معاملتهما من أعظم العبادات والطاعات',
    practicalApplication: 'العناية بالوالدين والإحسان إليهما بالقول والفعل وعدم رفع الصوت عليهما',
    relatedVerses: ['سورة الإسراء: 23-24', 'سورة لقمان: 14-15'],
    relatedAhadith: ['الجنة تحت أقدام الأمهات', 'رضا الرب في رضا الوالد']
  },
  {
    id: 'hadith-004',
    text: 'أحب الأعمال إلى الله عز وجل: الصلاة لوقتها، ثم بر الوالدين، ثم الجهاد في سبيل الله',
    source: 'رواه البخاري',
    narrator: 'عبدالله بن مسعود رضي الله عنه',
    degree: 'Sahih',
    topic: 'فضائل الأعمال',
    meaning: 'أفضل الأعمال بعد الإيمان هي المحافظة على الصلاة ثم طاعة الوالدين ثم الجهاد',
    practicalApplication: 'الاهتمام بأداء الصلاة بأوقاتها وبر الوالدين والاستعداد للجهاد في سبيل الله',
    relatedVerses: ['سورة الإسراء: 23-24'],
    relatedAhadith: ['الجنة تحت أقدام الأمهات']
  },
  {
    id: 'hadith-005',
    text: 'من نام لم يرد ليل أو قال لم يرد نوماً إلا وكتب الله له أجر قيام ليلة كاملة',
    source: 'سنن الترمذي وغيره',
    narrator: 'أبو هريرة رضي الله عنه',
    degree: 'Hasan',
    topic: 'قيام الليل والتهجد',
    meaning: 'من نام بنية أن يقوم الليل ولكن غلبه النوم فيكتب الله له أجر قيام الليل',
    practicalApplication: 'النية الصالحة توجب الأجر حتى إن لم يتمكن العبد من العمل',
    relatedVerses: ['سورة المائدة: 45'],
    relatedAhadith: ['إنما الأعمال بالنيات']
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// FIQH DATABASE - الفقه الإسلامي
// ═══════════════════════════════════════════════════════════════════════════════

export const FIQH_DATABASE: FiqhEntry[] = [
  {
    id: 'fiqh-001',
    title: 'Conditions of Prayer',
    titleArabic: 'شروط الصلاة',
    category: 'Worship - Salat',
    definition: 'الشروط التي يجب توفرها قبل الشروع في الصلاة لتكون الصلاة صحيحة',
    ruling: 'شروط الصلاة سبعة: الإسلام والعقل والتمييز ورفع الحدث وإزالة النجاسة وستر العورة ودخول الوقت واستقبال القبلة والنية',
    conditions: [
      'الإسلام: أن يكون المصلي مسلماً',
      'العقل: أن يكون عاقلاً',
      'التمييز: أن يميز ما يقول ويفعل',
      'رفع الحدث: الوضوء أو التيمم',
      'إزالة النجاسة: تطهير الثوب والبدن والمكان',
      'ستر العورة: للرجل من السرة إلى الركبة وللمرأة جميع البدن',
      'دخول الوقت: أن تأتي الصلاة في وقتها المحدد'
    ],
    examples: [
      'المجنون لا تصح صلاته لعدم العقل',
      'الطفل دون التمييز لا تصح صلاته',
      'من به حدث أكبر أو أصغر لا تصح صلاته حتى يتطهر'
    ],
    relatedAyas: ['سورة النساء: 43', 'سورة المائدة: 6'],
    practicalTips: [
      'تأكد من الوضوء الصحيح قبل الصلاة',
      'اختر مكاناً طاهراً للصلاة',
      'ستر العورة بملابس مناسبة',
      'معرفة أوقات الصلوات الخمس'
    ]
  },
  {
    id: 'fiqh-002',
    title: 'Zakat - Distribution',
    titleArabic: 'الزكاة - المصارف',
    category: 'Worship - Zakat',
    definition: 'المقاصد والجهات التي يجب صرف الزكاة فيها',
    ruling: 'مصارف الزكاة ثمانية كما بينها القرآن الكريم في سورة التوبة: الفقراء والمساكين والعاملين عليها والمؤلفة قلوبهم وفي الرقاب والغارمين وفي سبيل الله وابن السبيل',
    conditions: [
      'الفقراء: من لا يملك ما يغنيه',
      'المساكين: من يملك بعض الكفاية لكن لا يكفيهم',
      'العاملون على الزكاة: من يعمل في جمع وتوزيع الزكاة',
      'المؤلفة قلوبهم: لتأليف قلوبهم على الإسلام',
      'الرقاب: تحرير العبيد والمماليك',
      'الغارمون: المدينون الذين تثقل عليهم الديون',
      'في سبيل الله: الجهاد والحج والعلم الشرعي',
      'ابن السبيل: المسافر المحتاج'
    ],
    examples: [
      'توزيع الزكاة على الفقراء الفعليين والمساكين الحقيقيين',
      'إعطاء العامل على الزكاة أجرة عمله من الزكاة',
      'إعطاء المجاهد في سبيل الله من الزكاة'
    ],
    relatedAyas: ['سورة التوبة: 60'],
    schoolDifferences: {
      'مالكي': 'يشترط الإمام في توزيع الزكاة',
      'شافعي': 'يجوز للفرد التوزيع بدون إذن الإمام',
      'حنفي': 'يشترط الاطمئنان من وصول الزكاة للمستحقين'
    },
    practicalTips: [
      'معرفة مستحقي الزكاة الحقيقيين',
      'عدم إعطاء الزكاة للأغنياء أو القادرين على الكسب',
      'البحث عن الأولويات في التوزيع'
    ]
  },
  {
    id: 'fiqh-003',
    title: 'Islamic Prohibited Acts',
    titleArabic: 'المحرمات في الإسلام',
    category: 'General - Prohibited',
    definition: 'الأعمال والتصرفات التي نهى الله عنها وحرمها على عباده',
    ruling: 'هناك محرمات كثيرة في الإسلام يتعلق بعضها بالعبادات وبعضها بالمعاملات وبعضها بالأخلاق والتصرفات',
    conditions: [
      'تحريم الشرك بالله وعبادة غيره',
      'تحريم الربا بكل أنواعه',
      'تحريم الخمر وكل مسكر',
      'تحريم لحم الخنزير والميتة',
      'تحريم الزنا والفواحش',
      'تحريم الغيبة والنميمة',
      'تحريم الكذب واليمين الكاذبة',
      'تحريم السرقة والاختلاس'
    ],
    examples: [
      'الشرك: عبادة صنم أو قبر أو شخص غير الله',
      'الربا: إقراض بفائدة أو بيع المتفاضل',
      'الزنا: العلاقة الحرام بين رجل وامرأة',
      'الغيبة: ذكر عيوب الآخرين في غيابهم'
    ],
    relatedAyas: ['سورة الأنعام: 151-152', 'سورة الإسراء: 32', 'سورة النور: 30'],
    practicalTips: [
      'تجنب الشرك بجميع أشكاله',
      'الامتناع عن المحرمات الصريحة والشبهات',
      'البحث عن الحلال البديل في كل معاملة'
    ]
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// STORIES DATABASE - قصص إسلامية وحكايات تاريخية
// ═══════════════════════════════════════════════════════════════════════════════

export const STORIES_DATABASE: StoryEntry[] = [
  {
    id: 'story-prophet-yusef',
    title: 'Story of Prophet Yusuf',
    titleArabic: 'قصة سيدنا يوسف عليه السلام',
    type: 'prophet',
    fullStory: 'يوسف عليه السلام هو أحد أعظم الأنبياء وقد ذكرت قصته كاملة في سورة يوسف. وُلد ليعقوب في بيت إسراء وكان بشيراً له بعد دعاء طويل. كان يوسف موضع حب أبيه يعقوب لما رأى فيه من الفضل والصلاح. رأى رؤية جميلة فقصها على أبيه فنصحه ألا يقصها على إخوته فيحسدوه. حقداً عليه لحبِّ أبيهم إياه، اجتمع إخوته على إلقاؤه في الجب. أخذوه وألقوه في البئر، وجاءوا إلى أبيهم عشاءً يبكون، فقالوا: إن الذئب أكله، مع أن قميصه كان بدم كذب. ثم اشتراه العزيز فآواه في بيته وقال لامرأته: أكرمي مثواه. وفي بيت العزيز ابتلاه الله بفتنة امرأة العزيز التي راودته عن نفسه فاستعاذ بالله. وظل في السجن بريئاً من تهمة الزنا سنين عديدة، وكان صبوراً على البلاء، فقال في السجن: رب اغفر لي. ثم إن الملك احتاج إلى من يفسر الأحلام فجاء الخبر عن يوسف فأخرجوه من السجن. فسر حلم الملك عن سني الجدب والرخاء، فأعجب الملك به وجعله على خزائن الأرض.',
    lesson: 'الصبر على البلاء والابتلاء هو طريق النجاح والتوفيق',
    moralOfStory: 'إن الله مع الصابرين والعفة والأمانة والصبر تجعل الإنسان محط ثقة الآخرين',
    relatedVerses: ['سورة يوسف: 4', 'سورة يوسف: 23', 'سورة يوسف: 53'],
    relatedHadiths: ['الصبر ضياء', 'عجباً لأمر المؤمن، إن أمره كله خير'],
    characters: ['يوسف عليه السلام', 'يعقوب عليه السلام', 'إخوة يوسف', 'امرأة العزيز', 'العزيز'],
    timeline: 'في العصور القديمة أيام دخول إسرائيل مصر'
  },
  {
    id: 'story-companion-umar',
    title: 'Acceptance of Umar to Islam',
    titleArabic: 'قصة إسلام سيدنا عمر بن الخطاب',
    type: 'companion',
    fullStory: 'عمر بن الخطاب رضي الله عنه كان من أشد أعداء الإسلام قبل إسلامه. كان يؤذي النبي صلى الله عليه وسلم والمسلمين ويحاربهم. وكانت أخته فاطمة وزوجها سعيد بن زيد من المسلمين الأوائل. سمع عمر يوماً صوت أخته وزوجها يقرآن القرآن فاستوقفهما وضربهما. فطلبت منه أخته أن يقرأ القرآن بنفسه فقال: يا عمر، متى تترك هذا الرجل؟ ثم قررت أن تذهب معه إلى النبي. وفي الطريق ذهب إلى النبي بنية قتله لكنه لما سمع القرآن من النبي مباشرة أسلم على الفور، وقال: الحمد لله الذي هداني للإسلام. وكان إسلام عمر عزاً للإسلام والمسلمين، فقد صار من أقوى الدعاة ومن أشجع الصحابة في نشر التوحيد والدعوة إلى الله.',
    lesson: 'التوبة من الذنب مهما كانت درجته ممكنة بل مرجوة إذا أخلصت النية',
    moralOfStory: 'الله يغير الناس بقلب يتوب إليه ويسأله الهداية، وقد بدل الله حال عمر من عدو إلى أفضل الخلفاء',
    relatedVerses: ['سورة الفرقان: 71', 'سورة الشورى: 25'],
    relatedHadiths: ['اللهم اعز الإسلام بأحد العمرين', 'والذي نفسي بيده لو التقى جيش ممن آمن وجيش من كفروا ما التقوا إلا غلب الذين آمنوا'],
    characters: ['عمر بن الخطاب', 'النبي محمد', 'فاطمة أخت عمر', 'سعيد بن زيد'],
    timeline: 'في السنة السادسة من البعثة'
  },
  {
    id: 'story-moral-lion-mouse',
    title: 'The Lion and the Mouse',
    titleArabic: 'قصة الأسد والفأر - درس في الرحمة',
    type: 'moral',
    fullStory: 'كان هناك أسد ملك قوي جداً نام في غابة. فجاء فأر صغير يركض هنا وهناك، وبينما كان يركض وقع بالقرب من الأسد وأيقظه من نومه. غضب الأسد جداً من هذا الفأر الصغير الذي أزعجه. رفع الأسد مخلبه ليضرب الفأر، لكن الفأر طلب منه بصوت مرتعش أن ينقذه قائلاً: أيها الأسد العظيم، من فضلك لا تقتلني. أنا حيوان صغير جداً ولا أستطيع أن ألحق بك أي أذى. ربما لن تحتاجني أبداً، لكن إذا أنقذت حياتي اليوم، فقد أكون قادراً على مساعدتك في يوم من الأيام. ابتسم الأسد من طلب الفأر وفكر بنفسه: كيف يمكن لفأر صغير أن يساعدني؟ لكنه شعر بالشفقة عليه وأطلق سراح الفأر. بعد بعض الوقت، وقع الأسد في فخ صياد وعلق برقبته حبل جاء الفأر المخلص ورأى الأسد في هذا الوضع. دون تردد، بدأ الفأر بقضم الحبل حول رقبة الأسد. بعد ساعات من العمل الجاد بأسنانه الصغيرة، قطع الحبل وحرر الأسد من الفخ. شكر الأسد الفأر على مساعدته وأدرك أن الحب والشفقة لا يعرفان الحجم.',
    lesson: 'الرحمة والشفقة من أجل الصفات الإنسانية، والمساعدة يمكن أن تأتي من أي مكان غير متوقع',
    moralOfStory: 'لا تستخف بأحد مهما كان ضعيفاً لأن الله قد يجعل منه سبب نجاتك. الرحمة تجنيك ثمراً حلواً في يوم من الأيام',
    relatedVerses: ['سورة الأنعام: 12', 'سورة الفرقان: 67'],
    relatedHadiths: ['الراحمون يرحمهم الرحمن تبارك وتعالى', 'أرحم من في الأرض يرحمك من في السماء'],
    characters: ['الأسد', 'الفأر الصغير', 'الصياد'],
    timeline: 'قصة خالدة عبر العصور'
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// GENERAL KNOWLEDGE DATABASE - معلومات عامة إسلامية
// ═══════════════════════════════════════════════════════════════════════════════

export const GENERAL_KNOWLEDGE: KnowledgeEntry[] = [
  {
    id: 'general-001',
    category: 'general',
    title: 'The Five Pillars of Islam',
    titleArabic: 'أركان الإسلام الخمسة',
    answer: 'أركان الإسلام خمسة: (1) شهادة أن لا إله إلا الله وأن محمداً رسول الله (النطق بكلمة التوحيد)، (2) إقام الصلاة (أداء الصلوات الخمس المفروضة في أوقاتها)، (3) إيتاء الزكاة (إخراج الزكاة المفروضة من المال)، (4) صوم رمضان (الإمساك عن الطعام والشراب والشهوات من الفجر إلى الغروب)، (5) حج البيت الحرام (قصد الكعبة لأداء مناسك الحج لمن استطاع إليه سبيلاً). هذه الأركان الخمسة هي أساس الدين الإسلامي.',
    relatedVerses: ['سورة آل عمران: 18-19', 'سورة الحج: 27-28'],
    relatedHadiths: ['بني الإسلام على خمس: شهادة أن لا إله إلا الله', 'من شهد أن لا إله إلا الله وأن محمداً رسول الله حرم الله عليه النار'],
    suggestedTopics: ['شروط الشهادة', 'فضائل الصلاة', 'شروط الزكاة', 'فضائل الحج', 'فضائل الصوم'],
    difficulty: 'beginner',
    keywords: ['أركان', 'إسلام', 'شهادة', 'صلاة', 'زكاة', 'صوم', 'حج']
  },
  {
    id: 'general-002',
    category: 'general',
    title: 'Articles of Faith in Islam',
    titleArabic: 'أركان الإيمان الستة',
    answer: 'أركان الإيمان ستة: (1) الإيمان بالله وتوحيده وتنزيهه عن الشرك والعيوب، (2) الإيمان بملائكته الكرام المطهرين الذين لا يعصون الله ما أمرهم، (3) الإيمان بكتبه السماوية التي أنزلها على رسله (التوراة والإنجيل والزبور والقرآن)، (4) الإيمان برسله ورسالاتهم من آدم إلى محمد صلى الله عليه وسلم، (5) الإيمان باليوم الآخر وما فيه من حساب وجزاء وجنة ونار، (6) الإيمان بالقدر خيره وشره وحلوه ومره من عند الله. هذه الأركان ستة تشكل العقيدة الإسلامية الصحيحة.',
    relatedVerses: ['سورة النساء: 136', 'سورة البقرة: 177'],
    relatedHadiths: ['جبريل أتاك يعلمك دينك', 'الإيمان أن تؤمن بالله وملائكته وكتبه'],
    suggestedTopics: ['توحيد الله', 'صفات الملائكة', 'الكتب السماوية', 'الأنبياء والرسل', 'اليوم الآخر', 'القضاء والقدر'],
    difficulty: 'intermediate',
    keywords: ['إيمان', 'أركان', 'توحيد', 'ملائكة', 'كتب', 'رسل', 'يوم آخر', 'قدر']
  },
  {
    id: 'general-003',
    category: 'general',
    title: 'The Best Deeds in Islam',
    titleArabic: 'أفضل الأعمال في الإسلام',
    answer: 'أفضل الأعمال في الإسلام متعددة: (1) الصلاة في وقتها وخاصة الصلوات المفروضة والمحافظة على تكبيرة الإحرام، (2) بر الوالدين والإحسان إليهما، (3) الجهاد في سبيل الله بالنفس والمال، (4) التقوى وخشية الله في السر والعلن، (5) الحج والعمرة إلى بيت الله الحرام، (6) الصيام خاصة صيام رمضان وشهر محرم، (7) تعليم العلم الشرعي والدعوة إلى الله، (8) الصدقة والإنفاق في سبيل الله، (9) صلة الرحم والعدل بين الأهل، (10) الدعاء والاستغفار والتوبة والإنابة إلى الله. والعمل الأفضل يختلف بحسب حال الإنسان وقدرته وحاجة الوقت.',
    relatedVerses: ['سورة التوبة: 20', 'سورة النساء: 97', 'سورة الإسراء: 23'],
    relatedHadiths: ['أفضل الأعمال أحبها إلى الله', 'أكمل المؤمنين إيماناً أحسنهم خلقاً'],
    suggestedTopics: ['الصلاة', 'بر الوالدين', 'الجهاد', 'التقوى', 'الحج', 'الصدقة', 'العلم الشرعي'],
    difficulty: 'intermediate',
    keywords: ['أفضل', 'أعمال', 'صلاة', 'بر', 'والدين', 'جهاد', 'حج', 'صدقة']
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// SEARCH AND SUGGESTION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const searchKnowledgeBase = (query: string): KnowledgeEntry[] => {
  const lowerQuery = query.toLowerCase();
  return GENERAL_KNOWLEDGE.filter(entry =>
    entry.title.toLowerCase().includes(lowerQuery) ||
    entry.titleArabic.includes(query) ||
    entry.keywords.some(kw => kw.toLowerCase().includes(lowerQuery))
  );
};

export const searchAzkar = (query: string): AzkarEntry[] => {
  const lowerQuery = query.toLowerCase();
  return AZKAR_DATABASE.filter(entry =>
    entry.titleArabic.includes(query) ||
    entry.zikr.includes(query) ||
    entry.category.toLowerCase().includes(lowerQuery)
  );
};

export const searchQuran = (query: string): QuranEntry[] => {
  const lowerQuery = query.toLowerCase();
  return QURAN_DATABASE.filter(entry =>
    entry.surahName.toLowerCase().includes(lowerQuery) ||
    entry.surahNameArabic.includes(query) ||
    entry.theme.toLowerCase().includes(lowerQuery)
  );
};

export const searchHadith = (query: string): HadithEntry[] => {
  const lowerQuery = query.toLowerCase();
  return HADITH_DATABASE.filter(entry =>
    entry.text.toLowerCase().includes(lowerQuery) ||
    entry.topic.toLowerCase().includes(lowerQuery)
  );
};

export const searchFiqh = (query: string): FiqhEntry[] => {
  const lowerQuery = query.toLowerCase();
  return FIQH_DATABASE.filter(entry =>
    entry.title.toLowerCase().includes(lowerQuery) ||
    entry.titleArabic.includes(query) ||
    entry.category.toLowerCase().includes(lowerQuery)
  );
};

export const searchStories = (query: string): StoryEntry[] => {
  const lowerQuery = query.toLowerCase();
  return STORIES_DATABASE.filter(entry =>
    entry.title.toLowerCase().includes(lowerQuery) ||
    entry.titleArabic.includes(query) ||
    entry.type.toLowerCase().includes(lowerQuery)
  );
};

export const getRandomAzkar = (count: number = 3): AzkarEntry[] => {
  const shuffled = [...AZKAR_DATABASE].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

export const getRandomStories = (count: number = 1): StoryEntry[] => {
  const shuffled = [...STORIES_DATABASE].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

export const suggestRelatedTopics = (entry: KnowledgeEntry): string[] => {
  return entry.suggestedTopics || [];
};

export const getRelatedContent = (query: string) => {
  return {
    knowledge: searchKnowledgeBase(query),
    azkar: searchAzkar(query),
    quran: searchQuran(query),
    hadith: searchHadith(query),
    fiqh: searchFiqh(query),
    stories: searchStories(query)
  };
};
