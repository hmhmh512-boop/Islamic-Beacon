# Android Audio Assets Guide - Local Audio Setup

## Critical: All audio playback is now configured for LOCAL ASSETS ONLY

The app has been refactored to remove all streaming URLs. Audio will be loaded from:
- `file:///android_asset/audio/...` (Android native path)
- Local IndexedDB for offline access

## Folder Structure Required

Create the following folder structure in your Android project:

```
android/app/src/main/assets/audio/
├── adhan/
│   ├── adhan_default.mp3      (15-30 seconds)
│   ├── adhan_makkah.mp3       (15-30 seconds)
│   └── adhan_madinah.mp3      (15-30 seconds)
│
├── quran/
│   ├── afs/                   (Mishary Al-Afasi)
│   │   ├── 001.mp3            (Surah Al-Fatiha)
│   │   ├── 002.mp3            (Surah Al-Baqarah)
│   │   └── ...114.mp3         (Surah An-Nas)
│   ├── yasser/                (Yasser Al-Dosari)
│   │   ├── 001.mp3
│   │   └── ...114.mp3
│   ├── qtm/                   (Nasser Al-Qatami)
│   ├── basit/                 (Abdul Basit)
│   ├── maher/                 (Maher Al-Mueaqly)
│   ├── minshawi/              (Muhammad Al-Minshawi)
│   ├── shuraim/               (Saud Al-Shuraim)
│   ├── sudais/                (Abdul Rahman Al-Sudais)
│   ├── otibi/                 (Salman Al-Utaybi)
│   ├── ajm/                   (Ahmad Al-Ajmi)
│   ├── akhdar/                (Ibrahim Al-Akhdar)
│   ├── tablawi/               (Muhammad Al-Tablawi)
│   ├── ajmi/                  (Ahmad Al-Ajmi - Fast)
│   ├── husary/                (Mahmoud Al-Husary)
│   ├── haneef/                (Abdulwodoud Haneef)
│   ├── fares/                 (Fares Abbad)
│   ├── khalifah/              (Khalifah Al-Tunaiji)
│   ├── sharqawi/              (Amro Al-Sharqawi)
│   ├── barak/                 (Muhammad Al-Barak)
│   ├── khomais/               (Abdul Rahman Al-Khomais)
│   ├── hafyan/                (Mahmoud Al-Hafyan)
│   ├── jibril/                (Muhammad Jibril)
│   ├── huthayfi/              (Ali Al-Huthayfi)
│   ├── sharqawi_new/          (Ahmad Al-Sharqawi)
│   ├── shatri/                (Abu Bakr Al-Shatri)
│   ├── shahin/                (Ahmad Khalil Shahin)
│   └── omara/                 (Muhammad Omara)
│
└── azkar/
    ├── morning.mp3            (Morning supplications)
    ├── evening.mp3            (Evening supplications)
    ├── fear.mp3               (Supplications for fear)
    ├── travel.mp3             (Travel supplications)
    ├── gratitude.mp3          (Gratitude supplications)
    ├── general.mp3            (General supplications)
    └── sleep.mp3              (Sleep supplications)
```

## Surah File Naming Convention

Each Surah must be named with:
- **Format:** `{surah_number}.mp3`
- **Padding:** Zero-padded to 3 digits
- **Examples:**
  - Surah 1 (Al-Fatiha) = `001.mp3`
  - Surah 2 (Al-Baqarah) = `002.mp3`
  - Surah 114 (An-Nas) = `114.mp3`

## Audio File Requirements

### Format Specifications
- **Container:** MP3 (.mp3)
- **Bitrate:** 128-192 kbps (recommended for mobile)
- **Sample Rate:** 44.1 kHz or 48 kHz
- **Channels:** Mono or Stereo

### Adhan Audio
- **Duration:** 15-30 seconds
- **Volume:** Normalized to -3dB to prevent clipping
- **Type:** High-quality Adhan recordings from authentic sources

### Quran Audio
- **Duration:** Variable (3-20 minutes per surah)
- **Volume:** Normalized to -3dB
- **Quality:** Full Quranic recitations
- **Total:** 114 MP3 files per reciter

### Azkar Audio (Optional but recommended)
- **Duration:** 2-5 minutes
- **Volume:** Normalized to -3dB
- **Content:** Traditional supplications with proper tajweed

## How the App Loads Audio

### 1. **AdhanMode.tsx** - Adhan Settings
```typescript
// Loads: file:///android_asset/audio/adhan/{muadhin}.mp3
const adhanAssets = {
  default: 'adhan/adhan_default.mp3',
  makkah: 'adhan/adhan_makkah.mp3',
  madinah: 'adhan/adhan_madinah.mp3'
};
```

### 2. **Quran.tsx** - Quran Recitations
```typescript
// Loads: file:///android_asset/audio/quran/{reciter}/{surah}.mp3
// Example: file:///android_asset/audio/quran/afs/001.mp3
const url = `${selectedReciter.server}/${formattedId}.mp3`;
```

### 3. **AzkarService.ts** - Supplications (Future)
```typescript
// Would load: file:///android_asset/audio/azkar/{type}/{number}.mp3
// Currently uses Web Audio API synthesis
```

## Testing Locally (Before Android Build)

### Option 1: Browser Testing
```bash
# Create a local web server to test file:// paths
# Note: file:// URLs work directly in WebView on Android
# But won't work in browser due to CORS restrictions
```

### Option 2: Android Emulator/Device
```bash
# Build and deploy to Android device
npm run build
npx cap build android
# Or use Android Studio to build and run
```

## Verification Checklist

- [ ] Created `android/app/src/main/assets/audio/` directory
- [ ] Added all Adhan files (3 MP3s)
- [ ] Added Quran files for at least 1 reciter (114 MP3s minimum)
- [ ] All files have correct naming (001.mp3, 002.mp3, etc.)
- [ ] All MP3 files are valid and playable
- [ ] Audio normalized to prevent distortion
- [ ] Total asset size acceptable (typically 500MB - 2GB for full Quran collection)
- [ ] Tested on Android device/emulator

## File Size Estimates

| Content | Typical Size | Notes |
|---------|------------|-------|
| 1 Adhan | 300 KB - 1 MB | Brief recording |
| 1 Quran Reciter | 500 MB - 1 GB | Full 114 Surahs at 128-192kbps |
| All Azkar (7 files) | 10-20 MB | Short recordings |
| **TOTAL (1 Reciter)** | ~510 MB | Reasonable app size |
| **TOTAL (5 Reciters)** | ~2.5 GB | Larger app, excellent offline support |

## Storage Considerations for Android

### Recommended Setup
1. **App assets:** 500 MB - 1 GB (included in APK)
2. **External storage:** Optional additional reciters
3. **IndexedDB:** Text content caching (small)

### For Very Large Datasets
Consider downloading additional reciters on-demand:
1. Package 1-2 reciters with the app
2. Allow user to download additional reciters from within app
3. Store downloaded files in `context.getExternalFilesDir()`

## Native Android Integration

### AlarmManager (Adhan Scheduling)
Located in: `android/app/src/main/java/com/noorhuda/islamic/AlarmReceiver.java`

Triggers audio playback via:
```java
mediaPlayer.setDataSource("android.resource://" + getPackageName() + "/" + R.raw.adhan_default);
mediaPlayer.start();
```

### MediaPlayer (Audio Playback)
The Android native service uses MediaPlayer to play:
- Adhan audio files
- Quran recitations (via file:// URIs in WebView)
- Pre-recorded supplications

## Troubleshooting

### Audio Not Playing
1. Check file exists at: `/android/app/src/main/assets/audio/...`
2. Verify file naming (must be exactly as specified)
3. Check MP3 file validity: `ffmpeg -v error -i file.mp3 -f null - > /dev/null`
4. Ensure audio has proper permissions in AndroidManifest.xml

### Wrong Audio Playing
1. Verify surah number is zero-padded (001 not 1)
2. Check reciter identifier matches folder name
3. Verify localStorage settings are correct

### App Size Too Large
1. Use lossy compression (128 kbps sufficient)
2. Include fewer reciters initially
3. Implement on-demand download system

## Next Steps

1. **Gather Audio Files:**
   - Download Adhan recordings from trusted Islamic sources
   - Download Quran recitations (mp3quran.net has free downloads)
   - Create Azkar audio recordings

2. **Organize Files:**
   - Follow folder structure exactly as specified
   - Ensure all files are named correctly

3. **Build APK:**
   ```bash
   npm run build
   npx cap copy
   npx cap build android
   ```

4. **Test on Device:**
   - Verify Adhan plays at scheduled times
   - Test Quran recitation playback
   - Verify offline functionality works

5. **Release:**
   - Sign APK with keystore
   - Upload to Play Store or distribute directly

## Important Notes

⚠️ **Audio is CRITICAL for this app** - without proper audio files, core features won't work.

⚠️ **Use authorized content** - Ensure you have rights to use/distribute the audio files.

⚠️ **Optimize file sizes** - Compress audio appropriately for mobile devices.

⚠️ **Test thoroughly** - Test all audio playback paths before release.
