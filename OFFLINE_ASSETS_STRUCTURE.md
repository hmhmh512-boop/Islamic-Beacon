# Offline Audio Assets Folder Structure

## Overview
All audio files for the Islamic app must be stored locally in the `android/app/src/main/assets/audio/` directory. These files are accessed via the `file:///android_asset/` URI scheme and do NOT require internet connectivity.

## Folder Structure

```
android/app/src/main/assets/audio/
├── quran/                          # Quran reciters with all 114 surahs
│   ├── afs/                        # Reciters: afs, yasser, qtm, basit, maher, minshawi, shuraim, sudais, otibi
│   │   ├── 001.mp3 (Al-Fatiha)
│   │   ├── 002.mp3 (Al-Baqarah)
│   │   ├── ...
│   │   └── 114.mp3 (An-Nas)
│   ├── yasser/
│   │   ├── 001.mp3
│   │   ├── 002.mp3
│   │   └── ...114.mp3
│   ├── qtm/
│   ├── basit/
│   ├── maher/
│   ├── minshawi/
│   ├── shuraim/
│   ├── sudais/
│   ├── otibi/
│   ├── ajm/
│   ├── akhdar/
│   ├── tablawi/
│   ├── ajmi/
│   ├── husary/
│   ├── haneef/
│   ├── fares/
│   ├── khalifah/
│   ├── sharqawi/
│   ├── barak/
│   ├── khomais/
│   ├── hafyan/
│   ├── jibril/
│   ├── huthayfi/
│   ├── sharqawi_new/
│   ├── shatri/
│   ├── shahin/
│   └── omara/
├── azkar/                          # Daily Azkar categories
│   ├── morning.mp3                 # صباح (Morning supplications)
│   ├── evening.mp3                 # مساء (Evening supplications)
│   ├── fear.mp3                    # الخوف (Fear/Anxiety supplications)
│   ├── travel.mp3                  # السفر (Travel supplications)
│   ├── gratitude.mp3               # الشكر (Gratitude supplications)
│   ├── general.mp3                 # عام (General supplications)
│   └── sleep.mp3                   # النوم (Sleep supplications)
├── adhan/                          # Adhan calls for each prayer
│   ├── adhan_default.mp3           # Default Adhan (30 sec max)
│   ├── adhan_makkah.mp3            # Makkah style Adhan
│   └── adhan_madinah.mp3           # Madinah style Adhan
├── tasbih/                         # Tasbeeh counting sounds
│   └── click_sound.mp3             # Short click (0.2-0.5 sec) for counting beads
└── public/                         # React app is auto-copied here
    ├── index.html
    ├── vite.svg
    └── ...
```

## File Specifications

### Quran Reciters (27 total)
- **Format:** MP3 (AAC audio)
- **Sample Rate:** 44.1 kHz or 48 kHz
- **Bitrate:** 128-192 kbps (balance quality vs size)
- **Duration:** ~5-10 minutes per surah (varies)
- **Total Surahs per Reciter:** 114
- **Directory Pattern:** `audio/quran/{reciter_folder}/{surah_number_3_digits}.mp3`
  - Example: `audio/quran/afs/001.mp3` (Surah Al-Fatiha by Reciter AFS)
- **Reciter IDs:** afs, yasser, qtm, basit, maher, minshawi, shuraim, sudais, otibi, ajm, akhdar, tablawi, ajmi, husary, haneef, fares, khalifah, sharqawi, barak, khomais, hafyan, jibril, huthayfi, sharqawi_new, shatri, shahin, omara

### Azkar Audio Files (7 total)
- **Format:** MP3 (AAC audio)
- **Sample Rate:** 44.1 kHz or 48 kHz
- **Bitrate:** 128 kbps
- **Duration:** 5-15 minutes per category
- **Language:** Arabic (Quranic pronunciation)
- **Categories:**
  1. `morning.mp3` - صباح (7-10 min)
  2. `evening.mp3` - مساء (7-10 min)
  3. `fear.mp3` - الخوف (5-7 min)
  4. `travel.mp3` - السفر (5-7 min)
  5. `gratitude.mp3` - الشكر (5-7 min)
  6. `general.mp3` - عام (10-15 min)
  7. `sleep.mp3` - النوم (5-7 min)

### Adhan Audio Files (3 total)
- **Format:** MP3 (AAC audio)
- **Sample Rate:** 44.1 kHz or 48 kHz
- **Bitrate:** 128-192 kbps
- **Duration:** 25-35 seconds (maximum 1 minute recommended)
- **Variations:**
  1. `adhan_default.mp3` - Standard traditional Adhan
  2. `adhan_makkah.mp3` - Makkah style (if different)
  3. `adhan_madinah.mp3` - Madinah style (if different)

### Tasbeeh Click Sound
- **Format:** MP3 (WAV also acceptable)
- **Sample Rate:** 44.1 kHz
- **Duration:** 0.2-0.5 seconds (very short click)
- **Volume:** Medium (normalized to -3dB)
- **Type:** Soft wooden click or beep sound
- **File:** `click_sound.mp3`

## Implementation Examples

### Playing Quran Surah by Reciter
```typescript
import nativeMediaPlayerService from './services/nativeMediaPlayerService';

const reciterFolder = 'afs';  // Reciter ID
const surahNumber = 1;         // Surah number (1-114)
const surahId = String(surahNumber).padStart(3, '0'); // "001"
const audioPath = `audio/quran/${reciterFolder}/${surahId}.mp3`;

await nativeMediaPlayerService.play(
  `quran-${reciterFolder}-${surahId}`,
  audioPath,
  (position, duration) => {
    console.log(`Playing ${position}ms / ${duration}ms`);
  },
  () => {
    console.log('Surah finished');
  }
);
```

### Playing Azkar by Category
```typescript
const azkarCategory = 'morning'; // صباح
const audioPath = `audio/azkar/${azkarCategory}.mp3`;

await nativeMediaPlayerService.play(
  `azkar-${azkarCategory}`,
  audioPath,
  undefined,
  () => {
    console.log('Azkar finished');
  }
);
```

### Playing Tasbeeh Click Sound
```typescript
const clickId = `tasbih-click-${Date.now()}`;
const audioPath = 'audio/tasbih/click_sound.mp3';

await nativeMediaPlayerService.play(
  clickId,
  audioPath,
  undefined,
  () => {
    // Auto-cleanup when done
    nativeMediaPlayerService.stop(clickId).catch(() => {});
  }
);
```

## Asset Total Size Estimates

| Category | Files | Est. Size | Notes |
|----------|-------|-----------|-------|
| Quran (all 27 reciters) | 27 × 114 = 3,078 | ~12-15 GB | Largest component |
| Azkar (7 categories) | 7 | ~100-150 MB | One file per category |
| Adhan (3 variations) | 3 | ~5-10 MB | Short files |
| Tasbeeh Click | 1 | ~50-100 KB | Very small |
| **TOTAL** | **3,089** | **~12-15 GB** | Can be split into versions |

## Optimization Tips

1. **Compression:** Use ffmpeg to optimize:
   ```bash
   ffmpeg -i input.mp3 -q:a 6 -codec:a libmp3lame output.mp3
   ```

2. **Split by Reciter:** Create separate APKs or use dynamic asset loading for different reciters

3. **On-Demand Download:** Consider lazy-loading less-used reciters

4. **Streaming Alternative:** Use offline cache with occasional streaming option

## Configuration in Constants

Update `constants.ts` with reciter information:

```typescript
export const RECITERS: Reciter[] = [
  {
    id: 'afs',
    name: 'عفيفي',
    folder: 'afs',
    server: 'audio/quran/afs'
  },
  // ... 26 more reciters
];
```

## Native Asset Access

### Android Path Pattern
```
file:///android_asset/audio/quran/afs/001.mp3
```

### Path Construction
```typescript
const path = `audio/quran/${reciterFolder}/${surahId}.mp3`;
// nativeMediaPlayerService automatically converts to:
// file:///android_asset/audio/quran/afs/001.mp3
```

## Notes

- All files are embedded in the APK - no external downloads needed
- Files persist even if app is uninstalled (user manual deletion required)
- Read-only access to assets folder
- No write permissions to assets folder
- Maximum APK size: Keep ≤ 4GB for most app stores
- Consider using App Bundle format for size optimization

## Future Considerations

- **Stream Caching:** Cache streamed reciters locally after first play
- **Multiple Builds:** Create "lite" versions with selected reciters only
- **Dynamic Loading:** Download additional reciters on-demand
- **Compression:** Use WebM or Opus format for better compression (requires codec support)

