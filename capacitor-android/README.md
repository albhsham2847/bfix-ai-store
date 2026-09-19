# 📱 تحويل B-Fix Store إلى APK

## الطريقة 1: PWABuilder (الأسهل — بدون تنصيب أي شيء)

1. افتح: **https://www.pwabuilder.com**
2. أدخل: `https://bfix-ai-store.vercel.app`
3. اضغط **Start** → سيكتشف التطبيق تلقائياً
4. اضغط **Package for Stores** → اختر **Android**
5. اضبط:
   - **App name**: `B-Fix Software | AI Store`
   - **Package ID**: `com.bfixsoftware.aistore`
   - **Display**: `Standalone`
   - **Theme color**: `#070A12`
6. اضغط **Generate Package**
7. حمّل **APK** مباشرة!

> ✅ هذه الطريقة لا تحتاج أي برنامج — فقط متصفح

---

## الطريقة 2: على جهازك (Android Studio)

### المتطلبات
- [Android Studio](https://developer.android.com/studio) مثبت
- [Java JDK 17+](https://adoptium.net/)
- [Node.js 18+](https://nodejs.org/)

### الخطوات
```bash
# 1. ادخل مجلد المشروع
cd capacitor-android

# 2. نفّذ أمر البناء
chmod +x build-apk.sh
./build-apk.sh

# 3. الملف الناتج:
# capacitor-android/bfix-store-debug.apk
```

### للإصدار النهائي (Google Play):
```bash
cd android
./gradlew assembleRelease    # APK موقّع
./gradlew bundleRelease      # AAB لـ Google Play
```

---

## الطريقة 3: عبر GitHub Actions (أوتوماتيكي)

انظر ملف `.github/workflows/android.yml` في المستودع.

---

## رفع التطبيق على Google Play

1. أنشئ حساب مطور: https://play.google.com/console/signup ($25)
2. Google Play Console → Create App
3. ارفع ملف `.aab` من البناء
4. أضف وصف + screenshots + أيقونة
5. انشر!
