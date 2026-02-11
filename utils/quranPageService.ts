// QuranPageService.ts - Converts Quran data to Ottoman Mushaf-style pages
import { QuranPage, QuranAyah } from '../types';

const AYAHS_PER_PAGE = 15; // Approximate ayahs per page (varies in Ottoman Mushaf)
const CACHE_KEY = 'quran_pages_cache';
const CACHE_VERSION = 1;

export class QuranPageService {
  /**
   * Converts raw Quran data to page-based structure
   * Mimics Ottoman Mushaf layout with proper page boundaries
   */
  static convertToPages(surahId: number, ayahsData: any[]): QuranPage[] {
    const pages: QuranPage[] = [];
    let currentPageNumber = this.calculateStartPage(surahId);
    let pageAyahs: QuranAyah[] = [];
    
    for (let i = 0; i < ayahsData.length; i++) {
      const ayah = ayahsData[i];
      const quranAyah: QuranAyah = {
        numberInSurah: ayah.numberInSurah,
        numberInQuran: ayah.number,
        text: ayah.text,
        juzNumber: Math.ceil((ayah.number) / 238), // Approx calculation
        hizbNumber: Math.ceil((ayah.number) / 60), // Approx calculation
      };
      
      pageAyahs.push(quranAyah);
      
      // Check if page should break based on text length or ayah count
      if (pageAyahs.length >= AYAHS_PER_PAGE) {
        const page = this.createPage(
          currentPageNumber,
          surahId,
          pageAyahs[0].numberInSurah,
          pageAyahs[pageAyahs.length - 1].numberInSurah,
          pageAyahs
        );
        pages.push(page);
        pageAyahs = [];
        currentPageNumber++;
      }
    }
    
    // Push remaining ayahs
    if (pageAyahs.length > 0) {
      const page = this.createPage(
        currentPageNumber,
        surahId,
        pageAyahs[0].numberInSurah,
        pageAyahs[pageAyahs.length - 1].numberInSurah,
        pageAyahs
      );
      pages.push(page);
    }
    
    return pages;
  }

  private static createPage(
    pageNumber: number,
    surahId: number,
    startAyah: number,
    endAyah: number,
    ayahs: QuranAyah[]
  ): QuranPage {
    return {
      pageNumber,
      surahId,
      startAyah,
      endAyah,
      ayahs,
    };
  }

  /**
   * Calculate starting page number based on Surah
   * Approximate based on traditional Mushaf layout
   */
  static calculateStartPage(surahId: number): number {
    const surahStartPages: { [key: number]: number } = {
      1: 1,
      2: 2,
      3: 50,
      4: 77,
      5: 106,
      6: 128,
      7: 151,
      8: 177,
      9: 187,
      10: 209,
      11: 221,
      12: 235,
      13: 249,
      14: 255,
      15: 262,
      16: 267,
      17: 282,
      18: 293,
      19: 305,
      20: 312,
      21: 322,
      22: 332,
      23: 342,
      24: 350,
      25: 359,
      26: 367,
      27: 377,
      28: 385,
      29: 395,
      30: 404,
      31: 415,
      32: 420,
      33: 423,
      34: 431,
      35: 438,
      36: 443,
      37: 450,
      38: 458,
      39: 467,
      40: 477,
      41: 486,
      42: 494,
      43: 500,
      44: 506,
      45: 511,
      46: 516,
      47: 520,
      48: 524,
      49: 528,
      50: 531,
      51: 534,
      52: 536,
      53: 538,
      54: 540,
      55: 543,
      56: 546,
      57: 550,
      58: 553,
      59: 556,
      60: 558,
      61: 560,
      62: 562,
      63: 563,
      64: 564,
      65: 565,
      66: 566,
      67: 568,
      68: 570,
      69: 571,
      70: 573,
      71: 574,
      72: 575,
      73: 577,
      74: 578,
      75: 579,
      76: 580,
      77: 582,
      78: 583,
      79: 584,
      80: 585,
      81: 586,
      82: 587,
      83: 588,
      84: 589,
      85: 590,
      86: 591,
      87: 592,
      88: 592,
      89: 593,
      90: 594,
      91: 595,
      92: 595,
      93: 596,
      94: 596,
      95: 597,
      96: 597,
      97: 598,
      98: 598,
      99: 599,
      100: 600,
      101: 600,
      102: 600,
      103: 601,
      104: 601,
      105: 601,
      106: 602,
      107: 602,
      108: 602,
      109: 603,
      110: 603,
      111: 603,
      112: 604,
      113: 604,
      114: 604,
    };
    
    return surahStartPages[surahId] || 1;
  }

  /**
   * Cache pages to localStorage for offline access
   */
  static cachePages(surahId: number, pages: QuranPage[]): void {
    try {
      const cache = this.getCache();
      cache[surahId] = {
        pages,
        timestamp: Date.now(),
        version: CACHE_VERSION,
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
      console.error('Failed to cache Quran pages:', error);
    }
  }

  /**
   * Retrieve cached pages from localStorage
   */
  static getCachedPages(surahId: number): QuranPage[] | null {
    try {
      const cache = this.getCache();
      const cached = cache[surahId];
      
      if (cached && cached.version === CACHE_VERSION) {
        return cached.pages;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to retrieve cached Quran pages:', error);
      return null;
    }
  }

  private static getCache(): any {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  }

  /**
   * Clear all cached pages
   */
  static clearCache(): void {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch (error) {
      console.error('Failed to clear Quran pages cache:', error);
    }
  }

  /**
   * Get total pages for a Surah (approximation)
   */
  static getTotalPagesForSurah(numberOfAyahs: number): number {
    return Math.ceil(numberOfAyahs / AYAHS_PER_PAGE);
  }
}

export default QuranPageService;