/**
 * Offline Prayer Times Calculator
 * Uses Adhan.js library for accurate prayer time calculations
 */

import { PrayerTimes, Coordinates, CalculationMethod, Madhab, Shafaq } from 'adhan';

interface PrayerTimeData {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  sunset: Date;
  maghrib: Date;
  isha: Date;
  date: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
  name: string;
  timezone: string;
}

class OfflinePrayerTimesService {
  private calculationMethod = CalculationMethod.MuslimWorldLeague();

  /**
   * Calculate prayer times for a specific date and location
   */
  calculatePrayerTimes(
    date: Date,
    location: LocationData
  ): PrayerTimeData | null {
    try {
      const coordinates = new Coordinates(location.latitude, location.longitude);
      const prayerTimes = new PrayerTimes(
        coordinates,
        date,
        this.calculationMethod
      );

      return {
        fajr: prayerTimes.fajr,
        sunrise: prayerTimes.sunrise,
        dhuhr: prayerTimes.dhuhr,
        asr: prayerTimes.asr,
        sunset: prayerTimes.sunset,
        maghrib: prayerTimes.maghrib,
        isha: prayerTimes.isha,
        date: date.toISOString().split('T')[0],
      };
    } catch (error) {
      console.error('[OfflinePrayerTimes] Error calculating prayer times:', error);
      return null;
    }
  }

  /**
   * Get prayer times for today
   */
  getTodayPrayerTimes(location: LocationData): PrayerTimeData | null {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.calculatePrayerTimes(today, location);
  }

  /**
   * Get prayer times for a week
   */
  getWeekPrayerTimes(location: LocationData): PrayerTimeData[] {
    const times: PrayerTimeData[] = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      date.setHours(0, 0, 0, 0);

      const prayerTime = this.calculatePrayerTimes(date, location);
      if (prayerTime) {
        times.push(prayerTime);
      }
    }

    return times;
  }

  /**
   * Get prayer times for a month
   */
  getMonthPrayerTimes(location: LocationData, year?: number, month?: number): PrayerTimeData[] {
    const times: PrayerTimeData[] = [];
    const today = new Date();
    const currentYear = year || today.getFullYear();
    const currentMonth = month !== undefined ? month : today.getMonth();

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      date.setHours(0, 0, 0, 0);

      const prayerTime = this.calculatePrayerTimes(date, location);
      if (prayerTime) {
        times.push(prayerTime);
      }
    }

    return times;
  }

  /**
   * Get next prayer after a specific time
   */
  getNextPrayer(
    location: LocationData,
    afterTime?: Date
  ): { name: string; time: Date } | null {
    const reference = afterTime || new Date();
    const today = new Date(reference);
    today.setHours(0, 0, 0, 0);

    const prayerTime = this.calculatePrayerTimes(today, location);
    if (!prayerTime) return null;

    const prayers = [
      { name: 'Fajr', time: prayerTime.fajr },
      { name: 'Sunrise', time: prayerTime.sunrise },
      { name: 'Dhuhr', time: prayerTime.dhuhr },
      { name: 'Asr', time: prayerTime.asr },
      { name: 'Sunset', time: prayerTime.sunset },
      { name: 'Maghrib', time: prayerTime.maghrib },
      { name: 'Isha', time: prayerTime.isha },
    ];

    for (const prayer of prayers) {
      if (prayer.time.getTime() > reference.getTime()) {
        return prayer;
      }
    }

    // If no prayer found today, get first prayer tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const tomorrowPrayers = this.calculatePrayerTimes(tomorrow, location);
    if (tomorrowPrayers) {
      return { name: 'Fajr', time: tomorrowPrayers.fajr };
    }

    return null;
  }

  /**
   * Get time until next prayer
   */
  getTimeUntilNextPrayer(location: LocationData): { 
    prayer: string; 
    time: Date; 
    minutesRemaining: number 
  } | null {
    const next = this.getNextPrayer(location);
    if (!next) return null;

    const now = new Date();
    const minutesRemaining = Math.floor((next.time.getTime() - now.getTime()) / 60000);

    return {
      prayer: next.name,
      time: next.time,
      minutesRemaining,
    };
  }

  /**
   * Predefined locations with coordinates
   */
  getPredefinedLocations(): LocationData[] {
    return [
      {
        name: 'Makkah, Saudi Arabia',
        latitude: 21.4225,
        longitude: 39.8262,
        timezone: 'Asia/Riyadh',
      },
      {
        name: 'Madinah, Saudi Arabia',
        latitude: 24.4701,
        longitude: 39.6122,
        timezone: 'Asia/Riyadh',
      },
      {
        name: 'Cairo, Egypt',
        latitude: 30.0444,
        longitude: 31.2357,
        timezone: 'Africa/Cairo',
      },
      {
        name: 'Dubai, UAE',
        latitude: 25.2048,
        longitude: 55.2708,
        timezone: 'Asia/Dubai',
      },
      {
        name: 'London, UK',
        latitude: 51.5074,
        longitude: -0.1278,
        timezone: 'Europe/London',
      },
      {
        name: 'New York, USA',
        latitude: 40.7128,
        longitude: -74.006,
        timezone: 'America/New_York',
      },
      {
        name: 'Toronto, Canada',
        latitude: 43.6532,
        longitude: -79.3832,
        timezone: 'America/Toronto',
      },
      {
        name: 'Sydney, Australia',
        latitude: -33.8688,
        longitude: 151.2093,
        timezone: 'Australia/Sydney',
      },
    ];
  }

  /**
   * Set calculation method
   */
  setCalculationMethod(method: 'muslim_world_league' | 'isna' | 'egyptian' | 'makkah' | 'karachi' | 'tehran'): void {
    const methods: any = {
      muslim_world_league: CalculationMethod.MuslimWorldLeague(),
      isna: CalculationMethod.NorthAmerica(),
      egyptian: CalculationMethod.Egyptian(),
      makkah: CalculationMethod.UmmAlQura(),
      karachi: CalculationMethod.Karachi(),
      tehran: CalculationMethod.Tehran(),
    };

    this.calculationMethod = methods[method] || CalculationMethod.MuslimWorldLeague();
  }

  /**
   * Format prayer time for display
   */
  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  /**
   * Format prayer time in Arabic format
   */
  formatTimeArabic(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}

// Export singleton
const offlinePrayerTimesService = new OfflinePrayerTimesService();
export default offlinePrayerTimesService;
export type { PrayerTimeData, LocationData };
