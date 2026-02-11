// SpeechRecognitionService.ts - Web Speech API wrapper for Arabic recognition
/**
 * Wrapper for Web Speech API with support for Arabic language
 */

type SpeechRecognitionCallback = (transcript: string) => void;
type SpeechErrorCallback = (error: string) => void;
type SpeechEndCallback = () => void;

export class SpeechRecognitionService {
  private recognition: any;
  private isListening: boolean = false;
  private transcript: string = '';
  private isFinal: boolean = false;

  constructor() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Speech Recognition API not supported in this browser');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.setupRecognition();
  }

  /**
   * Setup speech recognition instance
   */
  private setupRecognition(): void {
    if (!this.recognition) return;

    // Set language to Arabic
    this.recognition.lang = 'ar-SA';

    // Set recognition parameters for better accuracy
    this.recognition.continuous = true; // Keep recording until stopped
    this.recognition.interimResults = true; // Get interim results
    this.recognition.maxAlternatives = 1;
  }

  /**
   * Start listening to user voice input
   */
  start(
    onResult: SpeechRecognitionCallback,
    onError?: SpeechErrorCallback,
    onEnd?: SpeechEndCallback
  ): void {
    if (!this.recognition) {
      if (onError) {
        onError('Speech Recognition API not supported');
      }
      return;
    }

    if (this.isListening) {
      return;
    }

    this.isListening = true;
    this.transcript = '';

    this.recognition.onstart = () => {
      console.log('Speech recognition started');
    };

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          this.transcript += transcript + ' ';
          this.isFinal = true;
        } else {
          interimTranscript += transcript;
        }
      }

      // Return both final and interim results
      onResult(this.transcript + interimTranscript);
    };

    this.recognition.onerror = (event: any) => {
      const errorMessage = this.getErrorMessage(event.error);
      console.error('Speech recognition error:', errorMessage);

      if (onError) {
        onError(errorMessage);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      console.log('Speech recognition ended');

      if (onEnd) {
        onEnd();
      }
    };

    try {
      this.recognition.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      this.isListening = false;

      if (onError) {
        onError('Failed to start speech recognition');
      }
    }
  }

  /**
   * Stop listening to user voice input
   */
  stop(): string {
    if (!this.recognition || !this.isListening) {
      return this.transcript;
    }

    try {
      this.recognition.stop();
    } catch (error) {
      console.error('Failed to stop speech recognition:', error);
    }

    this.isListening = false;
    return this.transcript;
  }

  /**
   * Abort the current recognition
   */
  abort(): void {
    if (!this.recognition) return;

    try {
      this.recognition.abort();
    } catch (error) {
      console.error('Failed to abort speech recognition:', error);
    }

    this.isListening = false;
    this.transcript = '';
  }

  /**
   * Check if speech recognition is currently listening
   */
  getIsListening(): boolean {
    return this.isListening;
  }

  /**
   * Get current transcript
   */
  getTranscript(): string {
    return this.transcript;
  }

  /**
   * Clear transcript
   */
  clearTranscript(): void {
    this.transcript = '';
  }

  /**
   * Set language for recognition (default: ar-SA for Arabic)
   */
  setLanguage(lang: string): void {
    if (!this.recognition) return;

    this.recognition.lang = lang;
  }

  /**
   * Get browser support status
   */
  static isSupported(): boolean {
    return !!(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );
  }

  /**
   * Get user-friendly error messages
   */
  private getErrorMessage(error: string): string {
    const errorMessages: { [key: string]: string } = {
      'no-speech':
        'لم يتم التقاط أي صوت. يرجى التحدث بوضوح.',
      'audio-capture':
        'لا يتوفر جهاز تسجيل صوت. تأكد من إذن الميكروفون.',
      'network':
        'خطأ في الشبكة. تحقق من الاتصال بالإنترنت.',
      'aborted':
        'تم إيقاف التعرف على الكلام.',
      'service-not-available':
        'خدمة التعرف على الكلام غير متاحة حالياً.',
      'bad-grammar':
        'حدث خطأ في معالجة النص.',
      'network-timeout':
        'انتهت مهلة الاتصال. حاول مجدداً.',
    };

    return errorMessages[error] || `خطأ: ${error}`;
  }
}

export default SpeechRecognitionService;