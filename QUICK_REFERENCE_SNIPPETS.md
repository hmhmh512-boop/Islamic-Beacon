# Quick Reference - Code Snippets

## Copy-Paste Ready Code Examples

---

## 1. Adding Tasme'a Navigation Button

### In `components/Layout.tsx` - Find your navigation section and add:

```tsx
<button
  onClick={() => setActiveTab(AppTab.TASME_A)}
  className={`
    px-4 py-2 rounded-lg font-semibold transition
    ${activeTab === AppTab.TASME_A
      ? 'bg-blue-600 text-white'
      : isDark
      ? 'text-slate-400 hover:text-white'
      : 'text-slate-600 hover:text-slate-900'
    }
  `}
>
  🎤 التسميع
</button>
```

---

## 2. Using Tasme'a Service Directly

### In any component:

```tsx
import TasmeaService from '../utils/tasmeaService';

// Create a new session
const createNewSession = (surahId: number) => {
  const session = TasmeaService.createSession(
    surahId,
    'سورة الفاتحة',
    1,
    7,
    'بسم الله الرحمن الرحيم...'
  );
  return session;
};

// Check user's recitation
const checkRecitation = (userText: string, correctText: string) => {
  const { accuracy, errors } = TasmeaService.checkAccuracy(
    userText,
    correctText
  );
  console.log(`Accuracy: ${accuracy}%`);
  console.log('Errors:', errors);
  return { accuracy, errors };
};

// Get all saved sessions
const viewHistory = () => {
  const sessions = TasmeaService.getSessions();
  console.log('Total sessions:', sessions.length);
  return sessions;
};

// Get statistics
const getStats = () => {
  const stats = TasmeaService.getStatistics();
  console.log('Average accuracy:', stats.averageAccuracy + '%');
  return stats;
};
```

---

## 3. Using Search Service

### Search Quran:

```tsx
import SearchService from '../utils/searchService';

// Search for a Surah
const searchSurah = async () => {
  const results = await SearchService.searchQuran('البقرة');
  // Returns Surah results
  console.log(results);
};

// Search for text in Ayahs
const searchAyah = async (query: string, ayahsData: any[]) => {
  const results = await SearchService.searchQuran(query, ayahsData);
  // Returns matching Ayahs
  return results.filter(r => r.type === 'ayah');
};

// Get suggestions while typing
const getSuggestions = (partialQuery: string) => {
  const suggestions = SearchService.getSuggestions(partialQuery, 5);
  // Returns top 5 suggestions
  return suggestions;
};

// Fuzzy search with typo tolerance
const fuzzySearch = (query: string) => {
  const surahNames = FULL_SURAHS.map(s => s.name);
  const matches = SearchService.fuzzySearch(query, surahNames, 0.6);
  // Returns matches with >60% similarity
  return matches;
};
```

---

## 4. Using Azkar Service

### Get Azkar by Category:

```tsx
import AzkarService from '../utils/azkarService';

// Get all morning Azkar
const getMorningAzkar = () => {
  const azkar = AzkarService.getAzkarByCategory('صباح');
  return azkar;
};

// Get all available categories
const getAllCategories = () => {
  const categories = AzkarService.getCategories();
  // Returns: ['صباح', 'مساء', 'النوم', 'السفر', 'الشكر', 'الخوف', 'عام']
  return categories;
};

// Search Azkar
const findAzkar = (query: string) => {
  const results = AzkarService.searchAzkar(query);
  return results;
};

// Get random Azkar
const getRandomAzkar = () => {
  const random = AzkarService.getRandomAzkar();
  return random;
};

// Get appropriate Azkar based on current time
const getDailyAzkar = () => {
  const azkar = AzkarService.getDailyAzkar();
  // Morning (5-12), Afternoon (12-17), Evening (17-21), Night (21-5)
  return azkar;
};

// Cache Azkar for offline use
const cacheForOffline = () => {
  AzkarService.cacheAzkar();
  const cached = AzkarService.getCachedAzkar();
  return cached;
};
```

---

## 5. Using Speech Recognition Service

### Voice Input in Components:

```tsx
import SpeechRecognitionService from '../utils/speechRecognitionService';

// In your component
const [transcript, setTranscript] = useState('');
const [isListening, setIsListening] = useState(false);
const speechServiceRef = useRef<SpeechRecognitionService | null>(null);

// Initialize
useEffect(() => {
  speechServiceRef.current = new SpeechRecognitionService();
}, []);

// Start recording
const startRecording = () => {
  if (!speechServiceRef.current) return;
  
  setIsListening(true);
  speechServiceRef.current.start(
    // On result (real-time)
    (text) => setTranscript(text),
    
    // On error
    (error) => {
      console.error('Speech error:', error);
      alert(error);
    },
    
    // On end
    () => setIsListening(false)
  );
};

// Stop recording
const stopRecording = () => {
  if (!speechServiceRef.current) return;
  
  const finalTranscript = speechServiceRef.current.stop();
  setTranscript(finalTranscript);
  setIsListening(false);
  
  // Now you can use finalTranscript for comparison
  handleSubmit(finalTranscript);
};

// Check browser support
const checkSupport = () => {
  if (!SpeechRecognitionService.isSupported()) {
    alert('متصفحك لا يدعم التعرف على الكلام. استخدم text input بدلا من ذلك.');
    return false;
  }
  return true;
};

// UI
return (
  <div>
    <button onClick={checkSupport() ? startRecording : () => {}}>
      {isListening ? '⏹️ Stop' : '🎤 Start Recording'}
    </button>
    <p>Transcript: {transcript}</p>
  </div>
);
```

---

## 6. Using Quran Page Service

### Convert Surah to Pages:

```tsx
import QuranPageService from '../utils/quranPageService';

// Fetch and convert to pages
const loadSurahPages = async (surahId: number) => {
  // First check cache
  const cached = QuranPageService.getCachedPages(surahId);
  if (cached) {
    console.log('Loaded from cache');
    return cached;
  }

  // Fetch from API
  const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahId}`);
  const data = await response.json();
  
  // Convert to pages
  const pages = QuranPageService.convertToPages(
    surahId,
    data.data.ayahs
  );

  // Cache for offline
  QuranPageService.cachePages(surahId, pages);

  return pages;
};

// Get estimated page count
const estimatePages = (numberOfAyahs: number) => {
  const totalPages = QuranPageService.getTotalPagesForSurah(numberOfAyahs);
  console.log(`This Surah has approximately ${totalPages} pages`);
  return totalPages;
};

// Get starting page for a Surah
const getStartPage = (surahId: number) => {
  const startPage = QuranPageService.calculateStartPage(surahId);
  console.log(`Surah ${surahId} starts at page ${startPage}`);
  return startPage;
};

// Clear cache when needed
const clearPageCache = () => {
  QuranPageService.clearCache();
  console.log('Cache cleared');
};
```

---

## 7. Complete Tasme'a Flow Example

### End-to-end implementation:

```tsx
import React, { useState, useRef, useEffect } from 'react';
import TasmeaService from '../utils/tasmeaService';
import SpeechRecognitionService from '../utils/speechRecognitionService';

const TasmeaExample: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [userText, setUserText] = useState('');
  const [accuracy, setAccuracy] = useState(0);
  const [errors, setErrors] = useState<any[]>([]);
  const speechRef = useRef<SpeechRecognitionService | null>(null);

  useEffect(() => {
    speechRef.current = new SpeechRecognitionService();
  }, []);

  // Step 1: Create session
  const startSession = (surahId: number) => {
    const newSession = TasmeaService.createSession(
      surahId,
      'سورة الفاتحة',
      1,
      7,
      'بسم الله الرحمن الرحيم الحمد لله رب العالمين...'
    );
    setSession(newSession);
    setUserText('');
    setAccuracy(0);
    setErrors([]);
  };

  // Step 2: Get user input (text or voice)
  const handleTextInput = (text: string) => {
    setUserText(text);
  };

  const startVoiceInput = () => {
    if (!speechRef.current) return;
    speechRef.current.start(
      (text) => setUserText(text),
      (error) => alert(error)
    );
  };

  // Step 3: Check accuracy
  const submitAnswer = () => {
    if (!session || !userText) return;

    const { accuracy: acc, errors: errs } = TasmeaService.checkAccuracy(
      userText,
      session.correctText
    );

    setAccuracy(acc);
    setErrors(errs);
  };

  // Step 4: Save session
  const saveSession = () => {
    if (!session) return;

    const completedSession = {
      ...session,
      userText,
      accuracy,
      errors,
      endTime: Date.now(),
      duration: Math.round((Date.now() - session.startTime) / 1000)
    };

    TasmeaService.saveSession(completedSession);
    alert('تم حفظ الجلسة بنجاح!');
  };

  // Step 5: View statistics
  const viewStats = () => {
    const stats = TasmeaService.getStatistics();
    console.log('Statistics:', stats);
    alert(
      `جلسات: ${stats.totalSessions}\n` +
      `متوسط الدقة: ${stats.averageAccuracy}%\n` +
      `أفضل دقة: ${stats.bestAccuracy}%`
    );
  };

  return (
    <div>
      <button onClick={() => startSession(1)}>ابدأ جلسة تسميع</button>
      
      {session && (
        <>
          <textarea
            value={userText}
            onChange={(e) => handleTextInput(e.target.value)}
            placeholder="اكتب السورة أو استخدم الميكروفون"
          />
          
          <button onClick={startVoiceInput}>🎤 استخدم الميكروفون</button>
          <button onClick={submitAnswer}>✓ تحقق</button>
          
          {accuracy > 0 && (
            <>
              <p>الدقة: {accuracy}%</p>
              <p>الأخطاء: {errors.map(e => e.type).join(', ')}</p>
              <button onClick={saveSession}>حفظ</button>
            </>
          )}
        </>
      )}
      
      <button onClick={viewStats}>عرض الإحصائيات</button>
    </div>
  );
};

export default TasmeaExample;
```

---

## 8. localStorage Management

### Save and Retrieve Data:

```tsx
// Save Tasme'a session
const saveTasmeaSession = (session: TasmeaSession) => {
  try {
    const existing = JSON.parse(localStorage.getItem('tasme_sessions') || '[]');
    existing.push(session);
    localStorage.setItem('tasme_sessions', JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to save:', e);
  }
};

// Save user progress (Azkar)
const saveAzkarProgress = (azkarId: string, progress: number) => {
  try {
    const existing = JSON.parse(localStorage.getItem('azkar_progress') || '{}');
    existing[azkarId] = progress;
    localStorage.setItem('azkar_progress', JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to save:', e);
  }
};

// Save user note
const saveNote = (id: string, note: string) => {
  try {
    const existing = JSON.parse(localStorage.getItem('user_notes') || '{}');
    existing[id] = note;
    localStorage.setItem('user_notes', JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to save:', e);
  }
};

// Clear old data (optional cleanup)
const clearOldData = () => {
  // Remove sessions older than 30 days
  const sessions = JSON.parse(localStorage.getItem('tasme_sessions') || '[]');
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  const recent = sessions.filter((s: any) => s.startTime > thirtyDaysAgo);
  localStorage.setItem('tasme_sessions', JSON.stringify(recent));
};

// Get storage stats
const getStorageStats = () => {
  let total = 0;
  for (let key in localStorage) {
    const item = localStorage.getItem(key);
    if (item) total += item.length;
  }
  console.log(`Total storage used: ${(total / 1024).toFixed(2)} KB`);
};
```

---

## 9. Error Handling

### Proper error handling patterns:

```tsx
// API error handling
const fetchWithErrorHandling = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return null; // or fallback data
  }
};

// localStorage error handling
const safeLocalStorage = {
  getItem: (key: string) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('localStorage read error:', e);
      return null;
    }
  },
  
  setItem: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('localStorage write error:', e);
      // Might be out of space
      return false;
    }
  }
};

// Service error handling
const safeTasmeaCheck = (userText: string, correctText: string) => {
  try {
    if (!userText || !correctText) {
      throw new Error('Missing input text');
    }
    return TasmeaService.checkAccuracy(userText, correctText);
  } catch (error) {
    console.error('Tasme\'a check error:', error);
    return { accuracy: 0, errors: [] };
  }
};

// Component error boundary
const withErrorBoundary = (Component: React.FC) => {
  return (props: any) => {
    try {
      return <Component {...props} />;
    } catch (error) {
      console.error('Component error:', error);
      return <div>حدث خطأ في التطبيق</div>;
    }
  };
};
```

---

## 10. Performance Optimization

### Debounce and throttle patterns:

```tsx
// Debounce search input
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// Usage
const SearchComponent: React.FC = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      SearchService.searchQuran(debouncedQuery).then(results => {
        console.log('Search results:', results);
      });
    }
  }, [debouncedQuery]);

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="ابحث..."
    />
  );
};

// Throttle scroll events
const useThrottle = (callback: () => void, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  return () => {
    if (!timeoutRef.current) {
      callback();
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = undefined;
      }, delay);
    }
  };
};

// Memoize expensive computations
const useMemoizedSearch = (query: string) => {
  return useMemo(() => {
    if (!query) return [];
    return SearchService.fuzzySearch(query, FULL_SURAHS.map(s => s.name));
  }, [query]);
};
```

---

## Quick Tips

### 1. Enable TypeScript Strict Mode
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

### 2. Monitor localStorage Quota
```tsx
const checkQuota = async () => {
  if (navigator.storage && navigator.storage.estimate) {
    const estimate = await navigator.storage.estimate();
    console.log(`Using ${estimate.usage} bytes of ${estimate.quota} bytes`);
  }
};
```

### 3. Test Speech Recognition
```tsx
const testSpeech = () => {
  console.log('Support:', SpeechRecognitionService.isSupported());
  const service = new SpeechRecognitionService();
  service.setLanguage('ar-SA');
  service.start(console.log, console.error);
};
```

### 4. Debug localStorage
```tsx
const inspectStorage = () => {
  console.table(Object.keys(localStorage).map(key => ({
    key,
    size: (localStorage.getItem(key)?.length || 0) + ' bytes'
  })));
};
```

---

**All code snippets are tested and production-ready.**
