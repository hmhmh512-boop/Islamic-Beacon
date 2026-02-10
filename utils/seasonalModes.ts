/**
 * Seasonal Modes Utilities
 * Detects and manages Ramadan and Ten Blessed Days modes
 */

// Islamic calendar conversion utilities
export interface IslamicDate {
  year: number;
  month: number; // 1-12
  day: number;   // 1-30
}

/**
 * Convert Gregorian date to Islamic (Hijri) date
 * Based on the Kuwaiti algorithm
 */
export function gregorianToIslamic(gregorianDate: Date): IslamicDate {
  const day = gregorianDate.getDate();
  const month = gregorianDate.getMonth() + 1;
  const year = gregorianDate.getFullYear();

  let N = day + Math.floor(30.6001 * (month + 1)) - 15 + 365 * (year - 1) + Math.floor((year - 1) / 4) - Math.floor((year - 1) / 100) + Math.floor((year - 1) / 400) - 24440588;
  let Q = Math.floor(N / 10631);
  N = N % 10631;
  let R = Math.floor(N / 325);
  if (R > 3) R = 3;
  N = N % 325;
  let S = Math.floor(N / 30);
  if (S > 11) S = 11;
  let D = N % 30 + 1;

  return {
    year: Q * 30 + R * 5 + S + 1,
    month: S + 1,
    day: D,
  };
}

/**
 * Check if today is during Ramadan
 * Ramadan is the 9th month in Islamic calendar
 */
export function isRamadanPeriod(today?: Date): boolean {
  const checkDate = today || new Date();
  const islamic = gregorianToIslamic(checkDate);
  return islamic.month === 9;
}

/**
 * Check if today is in the first 10 days of Dhul-Hijjah
 * Dhul-Hijjah is the 12th month, first 10 days
 */
export function isTenBlessedDays(today?: Date): boolean {
  const checkDate = today || new Date();
  const islamic = gregorianToIslamic(checkDate);
  return islamic.month === 12 && islamic.day <= 10;
}

/**
 * Get remaining days in Ramadan
 */
export function getDaysRemainingInRamadan(): number {
  const today = new Date();
  const islamic = gregorianToIslamic(today);
  
  if (islamic.month !== 9) {
    return 0;
  }
  
  // Ramadan has 29 or 30 days
  return 30 - islamic.day;
}

/**
 * Get remaining days in the Ten Blessed Days
 */
export function getDaysRemainingInTenDays(): number {
  const today = new Date();
  const islamic = gregorianToIslamic(today);
  
  if (islamic.month !== 12) {
    return 0;
  }
  
  if (islamic.day > 10) {
    return 0;
  }
  
  return 10 - islamic.day + 1;
}

/**
 * Get current Islamic date info
 */
export function getCurrentIslamicDate(): IslamicDate {
  return gregorianToIslamic(new Date());
}

/**
 * Get day number in Ramadan (1-30)
 */
export function getDayInRamadan(): number | null {
  const today = new Date();
  const islamic = gregorianToIslamic(today);
  
  if (islamic.month === 9) {
    return islamic.day;
  }
  
  return null;
}

/**
 * Get day number in Ten Blessed Days (1-10)
 */
export function getDayInTenDays(): number | null {
  const today = new Date();
  const islamic = gregorianToIslamic(today);
  
  if (islamic.month === 12 && islamic.day <= 10) {
    return islamic.day;
  }
  
  return null;
}

/**
 * Get Hijri year
 */
export function getCurrentHijriYear(): number {
  return gregorianToIslamic(new Date()).year;
}

/**
 * Seasonal mode type
 */
export type SeasonalMode = 'ramadan' | 'ten-days' | 'normal';

/**
 * Get current seasonal mode
 */
export function getCurrentSeasonalMode(): SeasonalMode {
  if (isRamadanPeriod()) return 'ramadan';
  if (isTenBlessedDays()) return 'ten-days';
  return 'normal';
}

/**
 * Get seasonal mode info
 */
export function getSeasonalModeInfo() {
  const mode = getCurrentSeasonalMode();
  const islamic = getCurrentIslamicDate();
  
  if (mode === 'ramadan') {
    return {
      mode: 'ramadan' as const,
      isActive: true,
      name: 'رمضان المبارك',
      hijriMonth: '9',
      dayInSeason: getDayInRamadan(),
      daysRemaining: getDaysRemainingInRamadan(),
      totalDays: 30,
      year: islamic.year,
    };
  }
  
  if (mode === 'ten-days') {
    return {
      mode: 'ten-days' as const,
      isActive: true,
      name: 'العشر ذي الحجة المباركة',
      hijriMonth: '12',
      dayInSeason: getDayInTenDays(),
      daysRemaining: getDaysRemainingInTenDays(),
      totalDays: 10,
      year: islamic.year,
    };
  }
  
  return {
    mode: 'normal' as const,
    isActive: false,
    name: 'الأيام العادية',
    hijriMonth: islamic.month.toString(),
    dayInSeason: null,
    daysRemaining: null,
    totalDays: 0,
    year: islamic.year,
  };
}

/**
 * Get day name in Arabic for Ramadan
 */
export function getRamadanDayLabel(day: number): string {
  if (day === 1) return 'اليوم الأول من رمضان';
  if (day >= 2 && day <= 9) return `اليوم الثاني والعشرون${day === 2 ? '' : '...'} من رمضان`;
  if (day === 27) return 'ليلة القدر المحتملة';
  if (day >= 21) return `${day === 21 ? 'الليالي الفردية' : `اليوم ${day}`} من رمضان`;
  return `اليوم ${day} من رمضان`;
}

/**
 * Get day name in Arabic for Ten Blessed Days
 */
export function getTenDaysDayLabel(day: number): string {
  const days = [
    'اليوم الأول من العشر',
    'اليوم الثاني من العشر',
    'اليوم الثالث من العشر',
    'اليوم الرابع من العشر',
    'اليوم الخامس من العشر',
    'اليوم السادس من العشر',
    'اليوم السابع من العشر',
    'اليوم الثامن من العشر',
    'اليوم التاسع من العشر',
    'اليوم العاشر من العشر - يوم العيد'
  ];
  return days[day - 1] || `اليوم ${day}`;
}

/**
 * Get progress percentage for Ramadan
 */
export function getRamadanProgress(): number {
  const dayInRamadan = getDayInRamadan();
  if (!dayInRamadan) return 0;
  return Math.round((dayInRamadan / 30) * 100);
}

/**
 * Get progress percentage for Ten Days
 */
export function getTenDaysProgress(): number {
  const dayInTenDays = getDayInTenDays();
  if (!dayInTenDays) return 0;
  return Math.round((dayInTenDays / 10) * 100);
}
