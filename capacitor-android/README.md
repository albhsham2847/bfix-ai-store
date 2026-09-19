# 📱 B-Fix Software | AI Store — تطبيق Android

تطبيق Android أصلي بالكامل — الواجهة مدمجة داخل APK، يعمل بدون رابط خارجي.

## ⚡ الطريقة الأسرع (5 دقائق)

### المتطلبات
- [Node.js 18+](https://nodejs.org/)
- [Java JDK 17](https://adoptium.net/)
- [Android Studio](https://developer.android.com/studio) (أو فقط Command-line tools)

### البناء
```bash
cd capacitor-android
chmod +x build-apk.sh
./build-apk.sh
```

### الناتج
```
capacitor-android/bfix-store-v1.0.0.apk
```
ثبّته على هاتفك مباشرة! 🎉

---

## 📋 ما يتضمنه التطبيق

| الميزة | الوصف |
|---|---|
| 🏠 الرئيسية | أقسام + خدمات مميزة + إحصائيات |
| 🔍 البحث | بحث فئرتر بالقسم والاسم |
| 📦 تفاصيل المنتج | خيارات + كمية + اختيار الدفع |
| 💳 الدفع | 6 طرق دفع + إرسال واتساب |
| 💰 شحن الرصيد | مبلغ + طريقة دفع + واتساب |
| 💬 الدردشة | محادثة مباشرة مع الإدارة |
| 📋 الطلبات | تتبع الطلبات المحلية |
| 👤 الملف الشخصي | رصيد + بيانات + تسجيل خروج |
| 🔐 تسجيل دخول | هاتف + كلمة مرور + حفظ تلقائي |

---

## 🔧 تعديلات

### تغيير رابط الـ API
في `www/app.js`، سطر 8:
```javascript
const API = 'https://bfix-ai-store.vercel.app';
```

### تغيير الألوان
في `www/style.css`، متغيرات `:root`

### تغيير اسم التطبيق
في `capacitor.config.json`:
```json
"appName": "اسم التطبيق الجديد"
```

---

## 🏪 رفع على Google Play

```bash
cd capacitor-android/android
./gradlew bundleRelease
```
الملل الناتج: `app/build/outputs/bundle/release/app-release.aab`

