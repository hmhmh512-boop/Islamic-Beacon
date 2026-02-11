# Integration Guide - New Features

## Quick Start

This guide explains how to integrate all the new features into your existing Islamic App.

---

## Files Already Updated

### 1. ✅ `types.ts` - Type System Extended
**Status:** DONE - No action needed
- Added 6 new interfaces (QuranPage, QuranAyah, SearchResult, TasmeaSession, TasmeaError, AzkarItemWithAudio)
- Enhanced Reciter interface with style and country fields
- Added AppTab.TASME_A enum value

### 2. ✅ `constants.ts` - Reciters Expanded
**Status:** DONE - No action needed
- Expanded RECITERS from 7 to 27 reciters
- All reciters now have style (تجويد, ترتيل, حدر, etc.) and country information
- Organized by recitation style

### 3. ✅ `App.tsx` - Tasme'a Component Added
**Status:** DONE - No action needed
- Added import for Tasme_a component
- Added case in renderContent switch for AppTab.TASME_A

---

## New Files Created

### Services (5 files)

#### 1. `utils/quranPageService.ts` (463 lines)
**Purpose:** Convert Quran data to page-based structure
**Usage:**
```typescript
import QuranPageService from '../utils/quranPageService';

// Convert Surah to pages
const pages = QuranPageService.convertToPages(surahId, ayahsData);

// Cache pages
QuranPageService.cachePages(surahId, pages);

// Get cached pages
const cached = QuranPageService.getCachedPages(surahId);
```

#### 2. `utils/searchService.ts` (228 lines)
**Purpose:** Search Surahs and Ayahs with fuzzy matching
**Usage:**
```typescript
import SearchService from '../utils/searchService';

// Search
const results = await SearchService.searchQuran(query, ayahsData);

// Get suggestions
const suggestions = SearchService.getSuggestions(query, limit);

// Fuzzy search
const matches = SearchService.fuzzySearch(query, itemsList, threshold);
```

#### 3. `utils/tasmeaService.ts` (341 lines)
**Purpose:** AI-powered Quran dictation checking
**Usage:**
```typescript
import TasmeaService from '../utils/tasmeaService';

// Create session
const session = TasmeaService.createSession(surahId, surahName, startAyah, endAyah, correctText);

// Check accuracy
const { accuracy, errors } = TasmeaService.checkAccuracy(userText, correctText);

// Save session
TasmeaService.saveSession(session);

// Get statistics
const stats = TasmeaService.getStatistics();
```

#### 4. `utils/azkarService.ts` (323 lines)
**Purpose:** Azkar management with audio support
**Usage:**
```typescript
import AzkarService from '../utils/azkarService';

// Get by category
const azkar = AzkarService.getAzkarByCategory('صباح');

// Search
const results = AzkarService.searchAzkar(query);

// Get random
const random = AzkarService.getRandomAzkar();

// Get all categories
const categories = AzkarService.getCategories();
```

#### 5. `utils/speechRecognitionService.ts` (194 lines)
**Purpose:** Web Speech API wrapper for voice input
**Usage:**
```typescript
import SpeechRecognitionService from '../utils/speechRecognitionService';

const speech = new SpeechRecognitionService();

// Start recording
speech.start(
  (transcript) => console.log(transcript),
  (error) => console.error(error),
  () => console.log('ended')
);

// Stop recording
const transcript = speech.stop();

// Check support
if (SpeechRecognitionService.isSupported()) {
  // Use speech input
}
```

---

### Components (3 files)

#### 1. `components/Tasme_a.tsx` (404 lines) ⭐ NEW FEATURE
**Purpose:** Quranic dictation interface with AI accuracy checking
**Features:**
- Surah selection
- Text input mode
- Voice input mode (with Web Speech API)
- Real-time accuracy checking
- Error highlighting (spelling, missing, extra words)
- Session history with statistics
- Progress tracking

**Integration:**
```tsx
// Already added to App.tsx
case AppTab.TASME_A: return <Tasme_a />;
```

**Usage in Layout:**
Add button to navigation:
```tsx
<button 
  onClick={() => setActiveTab(AppTab.TASME_A)}
  className="your-button-class"
>
  🎤 التسميع
</button>
```

#### 2. `components/QuranEnhanced.tsx` (289 lines)
**Purpose:** Improved Quran reader with page-based display and search
**Features:**
- 25+ reciters with styles and countries
- Search functionality (Surahs and Ayahs)
- Page-based display
- Surah list view
- Dark mode support

**Optional Integration:**
Can replace current `Quran.tsx` component
```tsx
// Backup original first
// Then replace in App.tsx:
import Quran from './components/QuranEnhanced';
// Rename QuranEnhanced.tsx to Quran.tsx
```

#### 3. `components/AzkarEnhanced.tsx` (347 lines)
**Purpose:** Enhanced Azkar component with audio playback
**Features:**
- 7 Azkar categories
- Audio playback per Azkar
- Transliteration and meaning
- Progress tracking
- Custom notes per Azkar
- Random Azkar suggestion
- Search functionality
- Dark mode support

**Optional Integration:**
Can replace current `Azkar.tsx` component
```tsx
// Backup original first
// Then replace in App.tsx:
import Azkar from './components/AzkarEnhanced';
// Rename AzkarEnhanced.tsx to Azkar.tsx
```

---

## Step-by-Step Integration

### Step 1: Add Services to Your Project
All services are already created. No additional steps needed:
- ✅ `utils/quranPageService.ts`
- ✅ `utils/searchService.ts`
- ✅ `utils/tasmeaService.ts`
- ✅ `utils/azkarService.ts`
- ✅ `utils/speechRecognitionService.ts`

### Step 2: Verify Tasme'a Component Integration
1. Check `App.tsx` has the import:
```typescript
import Tasme_a from './components/Tasme_a';
```

2. Check renderContent case:
```typescript
case AppTab.TASME_A: return <Tasme_a />;
```

3. Add navigation button in `components/Layout.tsx` (find the navigation section):
```tsx
<button 
  onClick={() => setActiveTab(AppTab.TASME_A)}
  className="nav-button-class"
>
  🎤 التسميع
</button>
```

### Step 3 (Optional): Upgrade Quran Component
1. Backup original `components/Quran.tsx`
2. Rename `components/QuranEnhanced.tsx` to `components/Quran.tsx`
3. Delete old backup
4. Test all features:
   - ✅ Reciter selection
   - ✅ Audio playback
   - ✅ Search functionality
   - ✅ Dark mode

### Step 4 (Optional): Upgrade Azkar Component
1. Backup original `components/Azkar.tsx`
2. Rename `components/AzkarEnhanced.tsx` to `components/Azkar.tsx`
3. Delete old backup
4. Test all features:
   - ✅ Category filtering
   - ✅ Audio playback
   - ✅ Progress tracking
   - ✅ Notes functionality

### Step 5: Test Everything
```bash
# Build
npm run build

# Run dev server
npm run dev

# Test in browser
# Check each tab for errors
# Verify dark mode works
# Test on mobile
```

---

## Navigation Updates (Layout.tsx)

Add these buttons to your navigation menu:

```tsx
// Find your navigation buttons section and add:

<button 
  onClick={() => setActiveTab(AppTab.TASME_A)}
  className={`${
    activeTab === AppTab.TASME_A 
      ? 'your-active-class' 
      : 'your-inactive-class'
  }`}
>
  🎤 التسميع
</button>

// If using enhanced Quran
<button 
  onClick={() => setActiveTab(AppTab.QURAN)}
  className={`${
    activeTab === AppTab.QURAN 
      ? 'your-active-class' 
      : 'your-inactive-class'
  }`}
>
  📖 القرآن الكريم
</button>
```

---

## TypeScript Configuration

All types are already defined in `types.ts`. No additional configuration needed:

```typescript
// Available types:
import { 
  AppTab,           // Updated with TASME_A
  QuranPage,        // NEW
  QuranAyah,        // NEW
  SearchResult,     // NEW
  TasmeaSession,    // NEW
  TasmeaError,      // NEW
  AzkarItemWithAudio, // NEW
  Reciter           // Enhanced
} from './types';
```

---

## Error Handling

### Common Issues & Solutions

**Issue:** "Module not found" errors
```
Solution: Ensure all files are in correct directories:
- Services in utils/
- Components in components/
- Types in types.ts
```

**Issue:** Dark mode colors not right
```
Solution: Check isDark variable is properly imported:
import { useTheme } from '../context/ThemeContext';
const { theme } = useTheme();
const isDark = theme === 'dark';
```

**Issue:** Search results empty
```
Solution: Ensure Surah ayahs are loaded:
const ayahsData = await fetchAyahsForSurah(surahId);
const results = SearchService.searchQuran(query, ayahsData);
```

**Issue:** Speech Recognition not working
```
Solution: Check browser support:
if (!SpeechRecognitionService.isSupported()) {
  console.log('Browser does not support Web Speech API');
  // Use text input as fallback
}
```

---

## Performance Optimization Tips

1. **Lazy Load Quran Data:**
```typescript
useEffect(() => {
  // Load ayahs on demand, not all at once
  if (selectedSurah) {
    loadSurahAyahs(selectedSurah.id);
  }
}, [selectedSurah]);
```

2. **Cache Search Results:**
```typescript
const [searchCache, setSearchCache] = useState({});
// Before searching, check cache
if (searchCache[query]) return searchCache[query];
```

3. **Debounce Search:**
```typescript
const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout>();
const handleSearch = (query: string) => {
  clearTimeout(searchTimeout);
  setSearchTimeout(
    setTimeout(() => {
      SearchService.searchQuran(query);
    }, 300)
  );
};
```

4. **Memoize Components:**
```typescript
const Tasme_a = React.memo(() => { ... });
```

---

## Browser Support

### Required APIs:
- ✅ Fetch API - Standard (all modern browsers)
- ✅ localStorage - Standard (all modern browsers)
- ⚠️ Web Speech API - Limited support (Chrome, Safari, Edge)
- ⚠️ Notification API - Requires HTTPS

### Testing Checklist:
- [ ] Chrome 90+
- [ ] Firefox 88+
- [ ] Safari 14+
- [ ] Edge 90+
- [ ] Mobile Chrome
- [ ] Mobile Safari

---

## Deployment Checklist

Before deploying to production:

- [ ] All services are imported correctly
- [ ] Tasme'a component is integrated
- [ ] Navigation buttons are added
- [ ] Dark mode works everywhere
- [ ] Audio playback tested with real speakers
- [ ] Speech recognition tested in Chrome
- [ ] localStorage not exceeding limits (~10MB)
- [ ] No console errors
- [ ] Performance tested on slow network
- [ ] Mobile responsiveness verified
- [ ] Build succeeds without warnings
- [ ] All TypeScript types are correct

---

## Documentation Files

### Created Documentation:
1. **NEW_FEATURES_DOCUMENTATION.md** - Comprehensive feature documentation
2. **INTEGRATION_GUIDE.md** - This file

### Read These First:
1. NEW_FEATURES_DOCUMENTATION.md - Full feature descriptions
2. Code comments in service files - Implementation details
3. Type definitions in types.ts - Data structures

---

## Support Resources

### Code Examples:

**Using Tasme'a Service:**
```typescript
// Create a session
const session = TasmeaService.createSession(
  1,                    // Surah ID
  'الفاتحة',           // Surah name
  1,                    // Start ayah
  7,                    // End ayah
  'سورة الفاتحة...'    // Correct text
);

// User inputs text
const userText = 'سورة الفاتحة...';

// Check accuracy
const { accuracy, errors } = TasmeaService.checkAccuracy(userText, session.correctText);

// Save session
TasmeaService.saveSession({
  ...session,
  userText,
  accuracy,
  errors,
  endTime: Date.now(),
  duration: 45 // seconds
});
```

**Using Search:**
```typescript
// Search with fuzzy matching
const results = await SearchService.searchQuran('البقرة', ayahsData);

// Suggestions
const suggestions = SearchService.getSuggestions('الف', 5);
// Returns: ['الفاتحة', 'الفلق', ...]
```

**Using Azkar:**
```typescript
// Get category azkar
const morningAzkar = AzkarService.getAzkarByCategory('صباح');

// Search azkar
const results = AzkarService.searchAzkar('الله');

// Get statistics
const stats = AzkarService.getStatistics();
```

---

## Next Steps

1. **Test Integration:**
   - Run the app
   - Navigate to Tasme'a tab
   - Test all features

2. **Optimize Performance:**
   - Test on slow networks
   - Check localStorage usage
   - Profile component renders

3. **Add More Features:**
   - Tasme'a teacher feedback
   - Quran memorization tracking
   - Achievement badges
   - Social sharing

4. **Polish UI:**
   - Review all colors in dark mode
   - Test on different screen sizes
   - Add loading skeletons
   - Improve error messages

---

**End of Integration Guide**

All files are ready to use. Start with Step 1 and follow sequentially.
