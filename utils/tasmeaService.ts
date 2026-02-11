// TasmeaService.ts - AI-powered Quran dictation checking
import { TasmeaSession, TasmeaError } from '../types';

/**
 * Service for checking Quran recitation accuracy (Tasme'a)
 * Compares user input with correct Quran text using string similarity algorithms
 */
export class TasmeaService {
  /**
   * Create a new Tasme'a session
   */
  static createSession(
    surahId: number,
    surahName: string,
    startAyah: number,
    endAyah: number,
    correctText: string
  ): TasmeaSession {
    return {
      id: this.generateSessionId(),
      surahId,
      surahName,
      startAyah,
      endAyah,
      userText: '',
      correctText,
      accuracy: 0,
      errors: [],
      startTime: Date.now(),
      endTime: undefined,
      duration: undefined,
    };
  }

  /**
   * Check user's Quran recitation against correct text
   * Returns accuracy score and list of errors
   */
  static checkAccuracy(userText: string, correctText: string): {
    accuracy: number;
    errors: TasmeaError[];
  } {
    const normalizedUser = this.normalizeText(userText);
    const normalizedCorrect = this.normalizeText(correctText);

    // Calculate overall similarity score
    const accuracy = this.calculateAccuracy(normalizedUser, normalizedCorrect);

    // Identify specific errors
    const errors = this.identifyErrors(normalizedUser, normalizedCorrect);

    return {
      accuracy: Math.round(accuracy * 100),
      errors,
    };
  }

  /**
   * Calculate overall accuracy score (0-1)
   * Using Levenshtein distance algorithm
   */
  private static calculateAccuracy(userText: string, correctText: string): number {
    const editDistance = this.levenshteinDistance(userText, correctText);
    const maxLength = Math.max(userText.length, correctText.length);

    if (maxLength === 0) {
      return 1; // Both empty = perfect match
    }

    return 1 - editDistance / maxLength;
  }

  /**
   * Identify specific errors in user's recitation
   */
  private static identifyErrors(userText: string, correctText: string): TasmeaError[] {
    const errors: TasmeaError[] = [];
    const userWords = userText.split(/\s+/).filter((w) => w.length > 0);
    const correctWords = correctText.split(/\s+/).filter((w) => w.length > 0);

    // Check for missing words
    let userIndex = 0;
    correctWords.forEach((correctWord, correctIndex) => {
      if (userIndex >= userWords.length) {
        errors.push({
          position: correctIndex,
          userWord: '',
          correctWord,
          type: 'missing',
        });
        return;
      }

      const userWord = userWords[userIndex];
      const similarity = this.calculateSimilarity(userWord, correctWord);

      // If similarity is too low, might be extra word or spelling error
      if (similarity < 0.6) {
        // Check if it's just a spelling error
        if (Math.abs(userWord.length - correctWord.length) <= 2) {
          errors.push({
            position: correctIndex,
            userWord,
            correctWord,
            type: 'spelling',
          });
        }
      }

      userIndex++;
    });

    // Check for extra words
    while (userIndex < userWords.length) {
      errors.push({
        position: correctWords.length,
        userWord: userWords[userIndex],
        correctWord: '',
        type: 'extra',
      });
      userIndex++;
    }

    return errors;
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
   * Calculate similarity score between two strings (0-1)
   */
  private static calculateSimilarity(str1: string, str2: string): number {
    const distance = this.levenshteinDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);
    return maxLength === 0 ? 1 : 1 - distance / maxLength;
  }

  /**
   * Normalize Arabic text for comparison
   */
  private static normalizeText(text: string): string {
    // Remove diacritics
    let normalized = text.replace(/[\u064B-\u0652]/g, '');

    // Normalize various forms of alef
    normalized = normalized.replace(/[أؤإآ]/g, 'ا');

    // Normalize various forms of ya
    normalized = normalized.replace(/[ى]/g, 'ي');

    // Normalize various forms of ha
    normalized = normalized.replace(/[ة]/g, 'ه');

    // Normalize spaces
    normalized = normalized.replace(/\s+/g, ' ').trim();

    return normalized;
  }

  /**
   * Generate unique session ID
   */
  private static generateSessionId(): string {
    return `tasme_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Complete a Tasme'a session
   */
  static completeSession(session: TasmeaSession): TasmeaSession {
    const endTime = Date.now();
    const accuracy = this.checkAccuracy(session.userText, session.correctText);

    return {
      ...session,
      endTime,
      duration: Math.round((endTime - session.startTime) / 1000), // in seconds
      accuracy: accuracy.accuracy,
      errors: accuracy.errors,
    };
  }

  /**
   * Save session to localStorage
   */
  static saveSession(session: TasmeaSession): void {
    try {
      const sessions = this.getSessions();
      sessions.push(session);
      localStorage.setItem('tasme_sessions', JSON.stringify(sessions));
    } catch (error) {
      console.error('Failed to save Tasme\'a session:', error);
    }
  }

  /**
   * Get all saved sessions
   */
  static getSessions(): TasmeaSession[] {
    try {
      const data = localStorage.getItem('tasme_sessions');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get Tasme\'a sessions:', error);
      return [];
    }
  }

  /**
   * Get sessions for a specific Surah
   */
  static getSessionsBySurah(surahId: number): TasmeaSession[] {
    return this.getSessions().filter((session) => session.surahId === surahId);
  }

  /**
   * Calculate average accuracy for a Surah
   */
  static getAverageAccuracyForSurah(surahId: number): number {
    const sessions = this.getSessionsBySurah(surahId);
    if (sessions.length === 0) return 0;

    const total = sessions.reduce((sum, session) => sum + session.accuracy, 0);
    return Math.round(total / sessions.length);
  }

  /**
   * Delete a session
   */
  static deleteSession(sessionId: string): void {
    try {
      const sessions = this.getSessions().filter((session) => session.id !== sessionId);
      localStorage.setItem('tasme_sessions', JSON.stringify(sessions));
    } catch (error) {
      console.error('Failed to delete Tasme\'a session:', error);
    }
  }

  /**
   * Clear all sessions
   */
  static clearAllSessions(): void {
    try {
      localStorage.removeItem('tasme_sessions');
    } catch (error) {
      console.error('Failed to clear Tasme\'a sessions:', error);
    }
  }

  /**
   * Get session statistics
   */
  static getStatistics(): {
    totalSessions: number;
    averageAccuracy: number;
    bestAccuracy: number;
    totalTime: number; // in seconds
  } {
    const sessions = this.getSessions();

    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        averageAccuracy: 0,
        bestAccuracy: 0,
        totalTime: 0,
      };
    }

    const averageAccuracy = Math.round(
      sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length
    );
    const bestAccuracy = Math.max(...sessions.map((s) => s.accuracy));
    const totalTime = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);

    return {
      totalSessions: sessions.length,
      averageAccuracy,
      bestAccuracy,
      totalTime,
    };
  }
}

export default TasmeaService;