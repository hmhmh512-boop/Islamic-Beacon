/**
 * Tassem (Quran Dictation) Corrector Service
 * Compares recorded text against Quranic text for pronunciation/recitation verification
 */

export interface CorrectionResult {
  score: number; // 0-100
  correct: boolean; // true if >= 90%
  matchedAyahs: {
    ayah: string;
    similarity: number;
    issues: string[];
  }[];
  suggestions: string[];
  feedback: string;
}

export interface TassemSession {
  surahId: number;
  ayahNumber: number;
  recordedText: string;
  score: number;
  timestamp: number;
  isCorrect: boolean;
}

class TassemCorrectorService {
  /**
   * Correct a recorded Tassem session
   */
  correctTassem(surahNumber: number, ayahNumber: number, recordedText: string): CorrectionResult {
    // Get the expected text
    const expectedText = this.getExpectedText(surahNumber, ayahNumber);
    
    if (!expectedText) {
      return {
        score: 0,
        correct: false,
        matchedAyahs: [],
        suggestions: ['لم نتمكن من العثور على الآية المطلوبة'],
        feedback: 'خطأ في البحث عن الآية'
      };
    }

    // Calculate similarity
    const similarity = this.calculateSimilarity(recordedText, expectedText);
    const score = Math.round(similarity * 100);

    // Get detailed feedback
    const issues = this.findDifferences(recordedText, expectedText);
    const suggestions = this.generateSuggestions(recordedText, expectedText, issues);

    return {
      score,
      correct: score >= 85, // 85% or higher is considered correct
      matchedAyahs: [{
        ayah: expectedText,
        similarity,
        issues
      }],
      suggestions,
      feedback: this.generateFeedback(score, issues)
    };
  }

  /**
   * Get expected Quranic text
   */
  private getExpectedText(surahNumber: number, ayahNumber: number): string {
    // This would normally fetch from a Quranic database
    // For now, return a sample
    const quranData: Record<number, Record<number, string>> = {
      1: {
        1: 'الحمد لله رب العالمين',
        2: 'الرحمن الرحيم',
        3: 'مالك يوم الدين'
      },
      112: {
        1: 'قل هو الله أحد',
        2: 'الله الصمد',
        3: 'لم يلد ولم يولد',
        4: 'ولم يكن له كفوا أحد'
      }
    };

    return quranData[surahNumber]?.[ayahNumber] || '';
  }

  /**
   * Calculate text similarity using Levenshtein distance
   */
  private calculateSimilarity(text1: string, text2: string): number {
    // Normalize text
    const normalize = (text: string) => {
      return text
        .toLowerCase()
        .replace(/[\s\p{P}]/gu, '') // Remove spaces and punctuation
        .replace(/ء/g, ''); // Remove hamza variations
    };

    const n1 = normalize(text1);
    const n2 = normalize(text2);

    if (n1 === n2) return 1;
    if (n1.length === 0 || n2.length === 0) return 0;

    // Calculate Levenshtein distance
    const distance = this.levenshteinDistance(n1, n2);
    const maxLength = Math.max(n1.length, n2.length);

    return 1 - (distance / maxLength);
  }

  /**
   * Levenshtein distance algorithm for string similarity
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * Find specific differences
   */
  private findDifferences(recorded: string, expected: string): string[] {
    const issues: string[] = [];

    // Check length difference
    if (recorded.length < expected.length) {
      issues.push(`النص الموثق أقصر من المتوقع بـ ${expected.length - recorded.length} حروف`);
    } else if (recorded.length > expected.length) {
      issues.push(`النص الموثق أطول من المتوقع بـ ${recorded.length - expected.length} حروف`);
    }

    // Find missing words
    const recordedWords = recorded.split(' ').filter(w => w);
    const expectedWords = expected.split(' ').filter(w => w);

    for (const word of expectedWords) {
      if (!recordedWords.includes(word)) {
        issues.push(`كلمة مفقودة: "${word}"`);
      }
    }

    // Find extra words
    for (const word of recordedWords) {
      if (!expectedWords.includes(word)) {
        issues.push(`كلمة إضافية: "${word}"`);
      }
    }

    return issues;
  }

  /**
   * Generate suggestions for improvement
   */
  private generateSuggestions(recorded: string, expected: string, issues: string[]): string[] {
    const suggestions: string[] = [];

    if (issues.length === 0) {
      suggestions.push('ما شاء الله! النص صحيح تماماً');
      return suggestions;
    }

    if (recorded.trim() === '') {
      suggestions.push('يبدو أن النص المسجل فارغ. حاول مرة أخرى');
      return suggestions;
    }

    // Add context-specific suggestions
    suggestions.push('انتبه لتشكيل الكلمات والحروف');
    suggestions.push('تأكد من نطق جميع الحروف بشكل صحيح');
    suggestions.push('حاول مرة أخرى ببطء أكثر');

    if (issues.some(i => i.includes('مفقودة'))) {
      suggestions.push('تأكد من عدم تخطي أي كلمات');
    }

    if (issues.some(i => i.includes('إضافية'))) {
      suggestions.push('لا تضف كلمات زائدة عن النص');
    }

    return suggestions;
  }

  /**
   * Generate feedback message based on score
   */
  private generateFeedback(score: number, issues: string[]): string {
    if (score >= 95) {
      return 'ممتاز جداً! أداؤك متطابق مع المتوقع ✓';
    } else if (score >= 85) {
      return 'جيد جداً! مع عدة نقاط صغيرة للتحسين ✓';
    } else if (score >= 70) {
      return 'جيد! لكن هناك عدة نقاط تحتاج تحسين';
    } else if (score >= 50) {
      return 'مقبول. حاول مرة أخرى بتركيز أكثر';
    } else {
      return 'يحتاج إلى مزيد من الممارسة. حاول مرة أخرى';
    }
  }

  /**
   * Save session to history
   */
  saveSession(session: TassemSession): void {
    try {
      const history = this.getSessionHistory();
      history.push(session);
      
      // Keep only last 100 sessions
      const recentHistory = history.slice(-100);
      localStorage.setItem('tassem_sessions_v1', JSON.stringify(recentHistory));
    } catch (error) {
      console.error('Failed to save Tassem session:', error);
    }
  }

  /**
   * Get session history
   */
  getSessionHistory(): TassemSession[] {
    try {
      const saved = localStorage.getItem('tassem_sessions_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  /**
   * Get statistics
   */
  getStatistics() {
    const sessions = this.getSessionHistory();
    const totalSessions = sessions.length;
    const correctSessions = sessions.filter(s => s.isCorrect).length;
    const averageScore = sessions.length > 0
      ? Math.round(sessions.reduce((sum, s) => sum + s.score, 0) / sessions.length)
      : 0;

    return {
      totalSessions,
      correctSessions,
      successRate: totalSessions > 0 ? Math.round((correctSessions / totalSessions) * 100) : 0,
      averageScore,
      recentSessions: sessions.slice(-10)
    };
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    try {
      localStorage.removeItem('tassem_sessions_v1');
    } catch (error) {
      console.error('Failed to clear Tassem history:', error);
    }
  }
}

// Export singleton
const tassemCorrectorService = new TassemCorrectorService();
export default tassemCorrectorService;
