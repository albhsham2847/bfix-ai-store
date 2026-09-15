# B-Fix Store — Android (TWA)

هذا المجلد يحوّل المتجر (PWA) إلى تطبيق Android أصلي عبر **Trusted Web Activity** باستخدام Bubblewrap.
الناتج: `app-release-signed.apk` للتجربة و `app-release-bundle.aab` لـ Google Play.

## الطريقة الآلية (موصى بها) — GitHub Actions
1. انشر المتجر على دومين HTTPS (Vercel / VPS).
2. في GitHub → Settings → Secrets → أضف:
   - `APP_HOST` مثال: `store.bfix.app` (بدون https://)
   - `KEYSTORE_PASSWORD` و `KEY_PASSWORD` (كلمات مرور مفتاح التوقيع — احفظها جيداً)
   - (اختياري) `KEYSTORE_BASE64` لإعادة استخدام مفتاح قديم.
3. Actions → **Build Android APK/AAB** → Run workflow.
4. حمّل الـ APK / AAB من Artifacts، وستجد أيضاً ملف `assetlinks.json` وبصمة SHA-256.
5. أضف البصمة إلى متغير البيئة `ANDROID_SHA256_FINGERPRINT` في استضافة المتجر (يُخدم تلقائياً على `/.well-known/assetlinks.json`) ثم أعد النشر — هذا يزيل شريط المتصفح داخل التطبيق.

## الطريقة اليدوية
```bash
npm i -g @bubblewrap/cli
cd android
# عدّل REPLACE_WITH_YOUR_DOMAIN في twa-manifest.json
bubblewrap update
bubblewrap build
```
أو ارفع رابط المتجر على https://www.pwabuilder.com واضغط Package for Android.
