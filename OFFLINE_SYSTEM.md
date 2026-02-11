# نظام التطبيق بدون اتصال إنترنت (Offline First)

## نظرة عامة
تم تحويل التطبيق إلى تطبيق **web app يعمل بدون إنترنت** (PWA - Progressive Web App) باستخدام:
- **Service Worker** لتخزين مؤقت شامل
- **IndexedDB** للتخزين المحلي للبيانات والصوت
- **Web Audio API** لتشغيل الصوت محليًا
- **MediaRecorder API** لتسجيل الصوت

---

## المعمارية الجديدة

### 1. **Service Worker** (`public/sw.js`)
```
الوظيفة: تخزين مؤقت تلقائي لجميع الأصول
- يعمل عند تحميل الصفحة الأولى
- يخزن جميع الملفات الثابتة
- يوفر الوصول للبيانات المخزنة عند قطع الإنترنت
```

**الملف:** `public/sw.js`

```javascript
// التسجيل التلقائي في index.html:
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js', { scope: './' });
}
```

---

### 2. **نظام التخزين المحلي** (`services/offlineStorage.ts`)

**الميزات:**
- تخزين الصوت (AudioBuffer)
- تخزين البيانات JSON
- تخزين التفضيلات
- إدارة الذاكرة

**الاستخدام:**
```typescript
import offlineStorage from './services/offlineStorage';

// حفظ صوت
await offlineStorage.saveAudio('surah_001_afs', arrayBuffer);

// استرجاع صوت
const audio = await offlineStorage.getAudio('surah_001_afs');

// حفظ بيانات JSON
await offlineStorage.saveData('quran_metadata', { totalSurahs: 114 });

// حفظ إعدادات
await offlineStorage.setPreference('theme', 'dark');
```

**قاعدة البيانات:**
- `audioCache` - تخزين الملفات الصوتية
- `dataCache` - تخزين البيانات JSON
- `preferences` - تخزين الإعدادات والتفضيلات

---

### 3. **مدير تشغيل الصوت** (`services/localAudioManager.ts`)

**الميزات:**
- تحميل صوت من التخزين المحلي أو الإنترنت
- تخزين مؤقت تلقائي للصوت عند التنزيل
- تشغيل متقدم باستخدام Web Audio API
- إنشاء أصوات اصطناعية (Adhan)

**الاستخدام:**
```typescript
import localAudioManager from './services/localAudioManager';

// تشغيل صوت
await localAudioManager.play('surah_001', 'https://mp3quran.net/...', {
  volume: 0.8,
  loop: false
});

// إيقاف
localAudioManager.stop();

// التحكم بالصوت
localAudioManager.setVolume(0.5);
```

---

### 4. **نظام تسجيل الصوت** (`services/microphoneRecorder.ts`)

**الميزات:**
- تسجيل بجودة عالية (44.1 kHz)
- إلغاء الضوضاء تلقائي
- حفظ التسجيلات محليًا
- إدارة الأذونات

**الاستخدام:**
```typescript
import microphoneRecorder from './services/microphoneRecorder';

// طلب الإذن
const hasPermission = await microphoneRecorder.requestPermission();

// بدء التسجيل
await microphoneRecorder.startRecording('recording_001');

// إيقاف التسجيل
const recordingId = await microphoneRecorder.stopRecording();

// استرجاع التسجيل
const recording = await microphoneRecorder.getRecording(recordingId);
```

---

### 5. **مدير نظام offline** (`services/offlineSystemManager.ts`)

**الميزات:**
- مراقبة الاتصال بالإنترنت
- إدارة الأذونات المطلوبة
- تخزين مؤقت للأصول المهمة
- إخطارات تغيير الحالة

**الاستخدام:**
```typescript
import offlineSystemManager from './services/offlineSystemManager';

// الاشتراك في تحديثات الحالة
const unsubscribe = offlineSystemManager.subscribe((status) => {
  console.log('Online:', status.isOnline);
  console.log('Cache size:', status.cacheSize);
});

// التحقق من الحالة
console.log(offlineSystemManager.isOnline());

// تخزين مؤقت لـ assets
await offlineSystemManager.precacheOfflineAssets();
```

---

## مكونات معدلة

### 1. **QuranEnhanced.tsx**
✅ **التحديثات:**
- استخدام `localAudioManager` للتشغيل المحلي
- تخزين مؤقت تلقائي للملفات الصوتية
- fallback إلى Web Speech API عند الحاجة

### 2. **AzkarEnhanced.tsx**
✅ **التحديثات:**
- Web Speech API لنطق الأذكار
- لا توجد ملفات صوتية خارجية

### 3. **AdhanMode.tsx**
✅ **التحديثات:**
- إنشاء صوت Adhan اصطناعي
- fallback إلى Web Speech API
- مؤشرات بصرية لحالة التشغيل

### 4. **Tasme_a.tsx** (جديد)
✅ **ميزات:**
- تسجيل الصوت بالميكروفون
- حفظ التسجيلات محليًا
- تشغيل التسجيلات
- حذف التسجيلات

### 5. **OfflineIndicator.tsx** (جديد)
✅ **ميزات:**
- مؤشر حالة الاتصال
- عرض حجم الذاكرة المستخدمة
- يظهر فقط عند قطع الإنترنت

---

## كيفية النشر كـ PWA

### 1. تحديث `metadata.json`:
```json
{
  "name": "نور الهدى الملكي",
  "short_name": "نور الهدى",
  "description": "تطبيق إسلامي شامل بدون إنترنت",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#7f1d1d",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 2. تثبيت على الهاتف:
- **iOS:** اضغط على مشاركة > أضف إلى الشاشة الرئيسية
- **Android:** اضغط على ⋮ > تثبيت التطبيق

### 3. بعد التثبيت:
- يعمل بدون إنترنت تمامًا
- يتحدث تلقائيًا عند توفر إنترنت
- يحتفظ بجميع البيانات محليًا

---

## حدود تقنية وحل بديل

### ❌ ما لا يمكن في Web App:
- تشغيل Adhan عند **إغلاق التطبيق**
- أذونات نظام Android (background audio)
- تشغيل في الخلفية لمدة طويلة

### ✅ الحل الموصى به:
لتحقيق **جميع المتطلبات** بالكامل، تحتاج إلى تحويل التطبيق إلى:
1. **React Native** (Android/iOS)
2. **Flutter** (Android/iOS)  
3. **Electron** (Windows/Mac/Linux)

---

## الملفات الجديدة والمعدلة

### ملفات جديدة:
```
services/
├── offlineStorage.ts          ✨ نظام التخزين
├── localAudioManager.ts       ✨ مدير الصوت
├── microphoneRecorder.ts      ✨ تسجيل الميكروفون
├── offlineSystemManager.ts    ✨ مدير النظام
└── soundPlayer.ts             (موجود)

components/
├── OfflineIndicator.tsx       ✨ مؤشر الاتصال
├── Tasme_a.tsx                ✨ مكون التسميع المحدث
└── ...

public/
└── sw.js                       ✨ Service Worker
```

### ملفات معدلة:
```
App.tsx                         - إضافة OfflineIndicator
index.html                      - تسجيل Service Worker
QuranEnhanced.tsx              - استخدام localAudioManager
AzkarEnhanced.tsx              - Web Speech API
AdhanMode.tsx                  - Adhan اصطناعي
```

---

## استخدام الخدمات في مكونات جديدة

### مثال: تشغيل الصوت في مكون جديد
```typescript
import localAudioManager from '../services/localAudioManager';

const MyComponent = () => {
  const handlePlaySurah = async () => {
    await localAudioManager.play('surah_001_afs', undefined, {
      volume: 0.8
    });
  };

  return <button onClick={handlePlaySurah}>تشغيل</button>;
};
```

### مثال: حفظ البيانات
```typescript
import offlineStorage from '../services/offlineStorage';

const saveUserData = async () => {
  await offlineStorage.saveData('user_profile', {
    name: 'أحمد',
    preferences: { theme: 'dark' }
  });
};
```

### مثال: تسجيل الصوت
```typescript
import microphoneRecorder from '../services/microphoneRecorder';

const recordVoice = async () => {
  const hasPermission = await microphoneRecorder.requestPermission();
  if (hasPermission) {
    await microphoneRecorder.startRecording('my_recording');
    // ... بعد 10 ثوانٍ
    await microphoneRecorder.stopRecording();
  }
};
```

---

## الأداء والتحسينات

| الميزة | الحالة | الملاحظات |
|------|--------|----------|
| تحميل بدون إنترنت | ✅ كامل | Service Worker يتعامل مع كل شيء |
| تخزين الصوت | ✅ كامل | IndexedDB يدعم حجم كبير (عادة 50GB+) |
| تشغيل الصوت | ✅ كامل | Web Audio API سريع وموثوق |
| تسجيل الصوت | ✅ كامل | جودة 44.1 kHz مع إلغاء ضوضاء |
| Offline Adhan | ⚠️ محدود | يحتاج تطبيق native للخلفية |
| Dark Mode | ✅ كامل | معمم على جميع الصفحات |

---

## التالي: خطوات إضافية اختيارية

1. **تنزيل الملفات الصوتية الفعلية:**
   - استخدم scripts لتنزيل تسجيلات حقيقية من mp3quran.net
   - احفظها في IndexedDB عند أول تشغيل

2. **تحسين حجم التطبيق:**
   - استخدم code splitting
   - lazy load المكونات الثقيلة

3. **إضافة sync في الخلفية:**
   - Background Sync API (للمتصفحات المدعومة)
   - تزامن البيانات عند عودة الإنترنت

4. **تحويل لـ Native:**
   - استخدم React Native أو Flutter
   - احصل على أذونات System-level
   - شغّل Adhan في الخلفية

---

## الدعم والمساعدة

للأسئلة حول النظام الجديد:
- افحص console browser للأخطاء
- تحقق من DevTools → Application → Storage
- اختبر الاتصال بالإنترنت

---

**آخر تحديث:** فبراير 2026
**الإصدار:** 2.0 (Offline First)
