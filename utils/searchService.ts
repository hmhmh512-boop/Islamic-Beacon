// SearchService.ts - Search functionality for Surahs and Ayahs
import { FULL_SURAHS } from '../constants';
import { SearchResult } from '../types';

export class SearchService {
  /**
   * Search for Surahs and Ayahs in Quran
   * Supports searching by:
   * - Surah name (Arabic)
   * - Surah number
   * - Ayah text content
   */
  static async searchQuran(
    query: string,
    ayahsData?: any[]
  ): Promise<SearchResult[]> {
    const results: SearchResult[] = [];
    const normalizedQuery = this.normalizeText(query);
    
    // Search Surahs first
    const surahResults = this.searchSurahs(normalizedQuery);
    results.push(...surahResults);
    
    // Search Ayahs if data is provided
    if (ayahsData && ayahsData.length > 0) {
      const ayahResults = this.searchAyahs(normalizedQuery, ayahsData);
      results.push(...ayahResults);
    }
    
    return results.sort((a, b) => {
      // Prioritize Surah matches over Ayah matches
      if (a.type !== b.type) {
        return a.type === 'surah' ? -1 : 1;
      }
      return 0;
    });
  }

  /**
   * Search Surahs by name or number
   */
  private static searchSurahs(query: string): SearchResult[] {
    const results: SearchResult[] = [];
    
    FULL_SURAHS.forEach((surah) => {
      const normalizedName = this.normalizeText(surah.name);
      const normalizedEnglish = this.normalizeText(surah.englishName);
      
      // Exact match or substring match
      if (
        normalizedName.includes(query) ||
        normalizedEnglish.toLowerCase().includes(query.toLowerCase()) ||
        surah.id.toString() === query
      ) {
        results.push({
          type: 'surah',
          surahId: surah.id,
          surahName: surah.name,
          ayahNumber: 1,
          ayahText: `سورة ${surah.name} - عدد آياتها ${surah.numberOfAyahs}`,
          page: 1,
        });
      }
    });
    
    return results;
  }

  /**
   * Search Ayahs by text content
   */
  private static searchAyahs(query: string, ayahsData: any[]): SearchResult[] {
    const results: SearchResult[] = [];
    
    ayahsData.forEach((ayah, index) => {
      const normalizedAyahText = this.normalizeText(ayah.text);
      
      // Search in Ayah text
      if (normalizedAyahText.includes(query)) {
        const surah = FULL_SURAHS.find(s => s.id === ayah.surah.number);
        results.push({
          type: 'ayah',
          surahId: ayah.surah.number,
          surahName: surah?.name || 'unknown',
          ayahNumber: ayah.numberInSurah,
          ayahText: ayah.text,
          page: Math.ceil(index / 15), // Approximate page
        });
      }
    });
    
    return results;
  }

  /**
   * Fuzzy search with typo tolerance
   * Uses Levenshtein distance for similarity matching
   */
  static fuzzySearch(
    query: string,
    items: string[],
    threshold: number = 0.6
  ): string[] {
    return items.filter((item) => {
      const similarity = this.calculateSimilarity(query, item);
      return similarity >= threshold;
    });
  }

  /**
   * Calculate similarity score between two strings (0-1)
   * Using Levenshtein distance algorithm
   */
  private static calculateSimilarity(str1: string, str2: string): number {
    const shorter = str1.length < str2.length ? str1 : str2;
    const longer = str1.length < str2.length ? str2 : str1;
    
    const editDistance = this.levenshteinDistance(shorter, longer);
    return 1 - editDistance / longer.length;
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        const cost = str1[j - 1] === str2[i - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i][j - 1] + 1, // deletion
          matrix[i - 1][j] + 1, // insertion
          matrix[i - 1][j - 1] + cost // substitution
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  /**
   * Normalize Arabic text for search
   * Removes diacritics and extra spaces
   */
  private static normalizeText(text: string): string {
    return text
      .replace(/[\u064B-\u0652]/g, '') // Remove Arabic diacritics
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
  }

  /**
   * Get suggestions based on partial query
   */
  static getSuggestions(query: string, limit: number = 5): string[] {
    const normalizedQuery = this.normalizeText(query);
    const suggestions: Set<string> = new Set();
    
    // Add Surah suggestions
    FULL_SURAHS.forEach((surah) => {
      if (this.normalizeText(surah.name).includes(normalizedQuery)) {
        suggestions.add(surah.name);
      }
      if (surah.id.toString().includes(query)) {
        suggestions.add(`${surah.name} - الرقم ${surah.id}`);
      }
    });
    
    return Array.from(suggestions).slice(0, limit);
  }
}

export default SearchService;