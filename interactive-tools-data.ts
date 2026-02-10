// ═══════════════════════════════════════════════════════════════════════════════
// INTERACTIVE TOOLS UTILITIES & DATA
// ═══════════════════════════════════════════════════════════════════════════════

// TASBIH DATA
export interface TasbihSession {
  id: string;
  dhikr: string;
  count: number;
  date: string;
  time: string;
  duration: number; // in seconds
}

export interface DhikrConfig {
  text: string;
  arabic: string;
  recommended: number;
  reward: string;
  timing: string;
  note: string;
  relatedVerse?: string;
  relatedHadith?: string;
  emoji: string;
}

export const DHIKRS: DhikrConfig[] = [
  {
    text: 'سبحان الله',
    arabic: 'سُبْحَانَ اللَّهِ',
    recommended: 33,
    reward: 'تكفير الذنوب وتنوير القبر',
    timing: 'بعد الصلوات المفروضة',
    note: 'يستحب بعد الصلوات المفروضة مع الحمد والتكبير.',
    relatedVerse: 'سورة البقرة: 30',
    relatedHadith: 'من قال سبحان الله بعد كل صلاة ثلاثاً وثلاثين...',
    emoji: '✨'
  },
  {
    text: 'الحمد لله',
    arabic: 'الْحَمْدُ لِلَّهِ',
    recommended: 33,
    reward: 'زيادة النعم والرزق',
    timing: 'عند كل نعمة وفضل',
    note: 'تثني بها على ربك بعد كل نعمة وتشكر فضله.',
    relatedVerse: 'سورة فاطر: 34',
    relatedHadith: 'الحمد لله ملء السموات والأرض...',
    emoji: '🙏'
  },
  {
    text: 'الله أكبر',
    arabic: 'اللَّهُ أَكْبَرُ',
    recommended: 34,
    reward: 'تعظيم الله وإجلاله وتكبيره',
    timing: 'في كل وقت وحين',
    note: 'تكبير وتعظيم لله عز وجل، يرفع من شأن القلب.',
    relatedVerse: 'سورة الأعلى: 1',
    relatedHadith: 'الله أكبر كبيراً والحمد لله كثيراً...',
    emoji: '📿'
  },
  {
    text: 'لا إله إلا الله',
    arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ',
    recommended: 100,
    reward: 'أفضل الذكر، غسل من الذنوب كالماء',
    timing: 'كل وقت وحين',
    note: 'أفضل الذكر، توحيد خالص لله سبحانه، تثقل الموازين.',
    relatedVerse: 'سورة النساء: 87',
    relatedHadith: 'أفضل ما قلت أنا والنبيون من قبلي لا إله إلا الله',
    emoji: '☪️'
  },
  {
    text: 'أستغفر الله',
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    recommended: 100,
    reward: 'مغفرة الذنوب وتفريج الكروب',
    timing: 'في الصباح والمساء',
    note: 'استغفار من الذنوب وتجديد للتوبة والإنابة.',
    relatedVerse: 'سورة النساء: 106',
    relatedHadith: 'قال النبي: والذي نفسي بيده لو لم تذنبوا...',
    emoji: '💚'
  },
  {
    text: 'اللهم صل وسلم على نبينا محمد',
    arabic: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ',
    recommended: 100,
    reward: 'قرب من النبي يوم القيامة وكفارة للذنوب',
    timing: 'كل وقت وحين',
    note: 'صلاة على النبي تزيدك قرباً ومحبة له.',
    relatedVerse: 'سورة الأحزاب: 56',
    relatedHadith: 'من صلى عليّ واحدة صلى الله عليه عشراً',
    emoji: '💫'
  },
  {
    text: 'حسبي الله ونعم الوكيل',
    arabic: 'حَسْبِيَ اللَّهُ وَنِعْمَ الْوَكِيلُ',
    recommended: 10,
    reward: 'كفاية من الله والحماية من الشرور',
    timing: 'عند الخوف والقلق',
    note: 'يقول المؤمن عند الخوف والقلق توكلاً على الله.',
    relatedVerse: 'سورة آل عمران: 173',
    relatedHadith: 'حسبي الله لا إله إلا هو عليه توكلت',
    emoji: '🛡️'
  },
  {
    text: 'سبحان الله وبحمده عدد خلقه',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ',
    recommended: 3,
    reward: 'أثقل ما يوضع في الميزان',
    timing: 'في الصباح والمساء',
    note: 'من أفضل الأذكار وأثقلها في الميزان.',
    emoji: '⚖️'
  }
];

// HIJRI CALENDAR DATA
export interface IslamicEvent {
  hijriMonth: number; // 1-12
  hijriDay: number; // 1-30
  name: string;
  nameArabic: string;
  description: string;
  significance: string;
  color: 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'amber';
  type: 'holiday' | 'observance' | 'historical' | 'personal';
}

export const ISLAMIC_CALENDAR_EVENTS: IslamicEvent[] = [
  {
    hijriMonth: 1,
    hijriDay: 1,
    name: "Islamic New Year",
    nameArabic: "رأس السنة الهجرية",
    description: "Marks the beginning of a new Islamic year, commemorating the Hijrah of Prophet Muhammad.",
    significance: "Beginning of the Hijri calendar, a time for reflection and renewal.",
    color: 'blue',
    type: 'holiday'
  },
  {
    hijriMonth: 1,
    hijriDay: 10,
    name: "Day of Ashura",
    nameArabic: "يوم عاشوراء",
    description: "Day of fasting, commemorating Allah's mercy upon the Prophet Musa.",
    significance: "Strongly recommended day of fasting with great rewards.",
    color: 'purple',
    type: 'observance'
  },
  {
    hijriMonth: 3,
    hijriDay: 12,
    name: "Mawlid al-Nabi",
    nameArabic: "مولد النبي",
    description: "Celebration of Prophet Muhammad's birth, though traditional Sunni scholars commemorate it quietly.",
    significance: "Day to remember the Prophet's exemplary life and teachings.",
    color: 'green',
    type: 'holiday'
  },
  {
    hijriMonth: 7,
    hijriDay: 27,
    name: "Laylat al-Isra wa al-Miraj",
    nameArabic: "ليلة الإسراء والمعراج",
    description: "Night of the Prophet's journey to Jerusalem and ascension to heaven.",
    significance: "Commemorates the miraculous night journey and the establishment of the five daily prayers.",
    color: 'blue',
    type: 'observance'
  },
  {
    hijriMonth: 9,
    hijriDay: 1,
    name: "Ramadan Begins",
    nameArabic: "بداية شهر رمضان",
    description: "First day of the blessed month of fasting and spiritual growth.",
    significance: "Month of fasting, Quran recitation, and increased worship.",
    color: 'amber',
    type: 'holiday'
  },
  {
    hijriMonth: 9,
    hijriDay: 27,
    name: "Laylat al-Qadr",
    nameArabic: "ليلة القدر",
    description: "Night of Power - the night when the Quran was first revealed.",
    significance: "Worship this night is better than 1000 months. Sought in the last 10 nights of Ramadan.",
    color: 'red',
    type: 'observance'
  },
  {
    hijriMonth: 10,
    hijriDay: 1,
    name: "Eid al-Fitr",
    nameArabic: "عيد الفطر",
    description: "Festival marking the end of Ramadan fasting.",
    significance: "Day of celebration, gratitude, charity, and community gathering.",
    color: 'green',
    type: 'holiday'
  },
  {
    hijriMonth: 12,
    hijriDay: 10,
    name: "Eid al-Adha",
    nameArabic: "عيد الأضحى",
    description: "Festival of sacrifice commemorating Prophet Ibrahim's obedience.",
    significance: "Pilgrimage culmination, animal sacrifice, and thanksgiving to Allah.",
    color: 'red',
    type: 'holiday'
  }
];

// PRAYER TIMES DATA
export interface PrayerSupplication {
  prayer: 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
  nameArabic: string;
  dua: string;
  transliteration: string;
  timing: string;
  reward: string;
}

export const PRAYER_SUPPLICATIONS: PrayerSupplication[] = [
  {
    prayer: 'Fajr',
    nameArabic: 'الفجر',
    dua: 'اللهم بك أصبحنا وبك أمسينا وبك نحيا وبك نموت، وإليك النشور',
    transliteration: 'Allahumma bika asbahna wa bika amsayna wa bika nahya wa bika namutu wa ilayak an-nushur',
    timing: 'عند طلوع الفجر',
    reward: 'استقرار النهار وحفظ اليوم'
  },
  {
    prayer: 'Dhuhr',
    nameArabic: 'الظهر',
    dua: 'اللهم أنت السلام ومنك السلام، تباركت يا ذا الجلال والإكرام',
    transliteration: 'Allahumma anta as-salam wa minaka as-salam, tabarakta ya dha al-jalal wa al-ikram',
    timing: 'بعد زوال الشمس',
    reward: 'السلام والأمان طول اليوم'
  },
  {
    prayer: 'Asr',
    nameArabic: 'العصر',
    dua: 'اللهم إني أسألك العفو والعافية في الدنيا والآخرة',
    transliteration: 'Allahumma inni as\'aluka al-afu wa al-aafiya fi ad-dunya wa al-akhira',
    timing: 'قبل الغروب',
    reward: 'العفو والسلامة من الأمراض والمشاكل'
  },
  {
    prayer: 'Maghrib',
    nameArabic: 'المغرب',
    dua: 'اللهم أنت نور السموات والأرض، أنت حي لا تموت والجن والإنس يموتون',
    transliteration: 'Allahumma anta nuru as-samawat wa al-ard, anta hayy la tamutu wa al-jinn wa al-insan yamutu',
    timing: 'عند الغروب',
    reward: 'النور والحياة الطيبة'
  },
  {
    prayer: 'Isha',
    nameArabic: 'العشاء',
    dua: 'اللهم بك أمسينا وبك نحيا وبك نموت، وإليك المصير',
    transliteration: 'Allahumma bika amsayna wa bika nahya wa bika namutu wa ilayak al-masir',
    timing: 'في المساء',
    reward: 'حفظ الليل والنوم الهانئ'
  }
];

// ZAKAT DATA
export interface ZakatAsset {
  type: string;
  typeArabic: string;
  description: string;
  nisab: number;
  nisabDescription: string;
  rate: number; // percentage
  notes: string;
  examples: string[];
}

export const ZAKAT_ASSETS: ZakatAsset[] = [
  {
    type: 'Gold',
    typeArabic: 'الذهب',
    description: 'Pure gold in any form (jewelry, coins, bars)',
    nisab: 85,
    nisabDescription: '85 grams of pure gold',
    rate: 2.5,
    notes: 'Zakat is obligatory on gold if you own 85 grams or more of pure gold.',
    examples: [
      '100g gold @ 60 per gram = 6000 total, zakat = 150',
      '200g gold @ 60 per gram = 12000 total, zakat = 300'
    ]
  },
  {
    type: 'Silver',
    typeArabic: 'الفضة',
    description: 'Pure silver in any form (coins, bars, utensils)',
    nisab: 595,
    nisabDescription: '595 grams of pure silver',
    rate: 2.5,
    notes: 'Zakat is obligatory on silver if you own 595 grams or more of pure silver.',
    examples: [
      '600g silver @ 1 per gram = 600 total, zakat = 15',
      '1000g silver @ 1 per gram = 1000 total, zakat = 25'
    ]
  },
  {
    type: 'Cash & Currency',
    typeArabic: 'النقود والعملات',
    description: 'Money, banknotes, coins, and savings',
    nisab: 0,
    nisabDescription: 'Equal to nisab of gold or silver (whichever is lower)',
    rate: 2.5,
    notes: 'Zakat on money follows the nisab of whichever precious metal is lower in value (usually gold).',
    examples: [
      '$5000 savings = zakat of 125',
      '$10000 savings = zakat of 250'
    ]
  },
  {
    type: 'Trade Inventory',
    typeArabic: 'عروض التجارة',
    description: 'Goods bought for sale/trade (retail stock, business inventory)',
    nisab: 0,
    nisabDescription: 'Equal to nisab of gold (85g value)',
    rate: 2.5,
    notes: 'Zakat on business goods is 2.5% if the value reaches the nisab.',
    examples: [
      'Retail stock worth $8500 = zakat of 212.50',
      'Business inventory worth $15000 = zakat of 375'
    ]
  },
  {
    type: 'Livestock (Goats)',
    typeArabic: 'الماعز',
    description: 'Goats or sheep owned for one lunar year',
    nisab: 40,
    nisabDescription: '40 goats/sheep minimum',
    rate: 0,
    notes: 'If 40-120 goats: 1 goat. 121-200: 2 goats. 201-300: 3 goats. 300+: 1 per 100.',
    examples: [
      '40-120 goats: give 1 goat',
      '121-200 goats: give 2 goats',
      '201+ goats: give 1 per 100'
    ]
  },
  {
    type: 'Livestock (Cattle)',
    typeArabic: 'البقر',
    description: 'Cows or buffalo owned for one lunar year',
    nisab: 30,
    nisabDescription: '30 cattle minimum',
    rate: 0,
    notes: 'If 30-39: 1 cow. 40-59: 1 cow. 60-69: 2 cows. 70+: 1 per 30.',
    examples: [
      '30-39 cattle: give 1 cow',
      '40-59 cattle: give 1 cow',
      '60-69 cattle: give 2 cows'
    ]
  },
  {
    type: 'Crops & Produce',
    typeArabic: 'الحبوب والثمار',
    description: 'Harvested crops (wheat, barley, dates, raisins)',
    nisab: 0,
    nisabDescription: '5 wasqs (approximately 653 kg)',
    rate: 10,
    notes: 'If watered by rain: 10%. If watered by effort: 5%.',
    examples: [
      '1000 kg produce (rain-watered): zakat 100 kg',
      '1000 kg produce (effort-watered): zakat 50 kg'
    ]
  }
];

// LOCATION-BASED PRAYER TIMES
export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

export interface PrayerTiming {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

// Gregorian to Hijri conversion utility
export const gregorianToHijri = (date: Date): { year: number; month: number; day: number } => {
  const N = date.getDate();
  const Q = Math.floor(date.getMonth() + 1);
  const K = date.getFullYear();

  const J = Math.floor((3 * (Q + 1)) / 11);
  const A = Math.floor((14 - Q) / 12);
  const B = K + 4800 - A;
  const JD = N + Math.floor((306001 * (Q + 1 - 12 * A)) / 10000) + Math.floor((3 * (Math.floor((B + 100) / 100) - Math.floor((B + 100) / 400))) / 4) - 32045;

  let N1 = JD;
  let Q1 = Math.floor((30 * (N1 - 1948440) + 10646) / 10645);
  let Q2 = Math.floor((10645 * (Q1 - 1)) / 30) + 1;
  let N2 = N1 - Q2 + 1;
  let Q3 = Math.floor(((11 * Q1) + 3) / 30);
  let L = Q3 + 1;
  let M = ((N2 + Q3) % 354) + 1;

  return {
    year: L,
    month: Q3 + 1,
    day: M
  };
};

// Hijri to Gregorian conversion utility
export const hijriToGregorian = (hijriYear: number, hijriMonth: number, hijriDay: number): Date => {
  const N = hijriDay + 30 * (hijriMonth - 1) + Math.floor((11 * hijriYear + 3) / 30) + 1948440 - 385;
  const A = Math.floor((N + 32044) / 146097);
  const B = N + 32044 - 146097 * A;
  const C = Math.floor((4 * B + 3) / 1461);
  const D = B - Math.floor((1461 * C) / 4);
  const E = Math.floor((5 * D + 2) / 153);
  const day = D - Math.floor((153 * E + 2) / 5) + 1;
  const month = E + 3 - 12 * Math.floor((E + 3) / 12);
  const year = 100 * A + C - 4800 + Math.floor((E + 3) / 12);

  return new Date(year, month - 1, day);
};

// Format Hijri date
export const formatHijriDate = (hijriYear: number, hijriMonth: number, hijriDay: number): string => {
  const monthNames = [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الثانية',
    'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
  ];
  return `${hijriDay} ${monthNames[hijriMonth - 1]} ${hijriYear} هـ`;
};

// Calculate days between two dates
export const daysBetween = (date1: Date, date2: Date): number => {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
};

// Get next Islamic event
export const getNextIslamicEvent = (): IslamicEvent | null => {
  const today = new Date();
  const currentHijri = gregorianToHijri(today);
  
  const upcomingEvents = ISLAMIC_CALENDAR_EVENTS.filter(event => {
    if (event.hijriMonth > currentHijri.month) return true;
    if (event.hijriMonth === currentHijri.month && event.hijriDay >= currentHijri.day) return true;
    return false;
  });

  return upcomingEvents.length > 0 ? upcomingEvents[0] : ISLAMIC_CALENDAR_EVENTS[0];
};
