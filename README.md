# B-Fix Software | AI Store

متجر رقمي فخم وسريع — تطبيق Android (TWA) مبني على PWA بـ **Next.js 16 + PostgreSQL (Drizzle ORM)**.

## المزايا
- واجهة عربية RTL فاخرة، سريعة، قريبة من تطبيقات Android الأصلية.
- 11 قسم خدمات: أدوات البرمجة، إيجار الأدوات، اشتراكات الذكاء الاصطناعي، شحن الألعاب، حسابات ببجي، بطائق إلكترونية، دعاية وإعلان، تسويق، توثيق، حلول تقنية، برمجة المواقع والتطبيقات.
- مسار طلب كامل: اختيار المدة/الباقة → بيانات العميل → ملخص → إنشاء طلب برقم `BF-XXXXXXXX` → إرسال عبر WhatsApp / Telegram برسالة احترافية جاهزة.
- تتبع الطلب بالرقم من صفحة "طلباتي".
- لوحة إدارة `/admin`: الأقسام، الخدمات، الأسعار، الخيارات، الصور، الطلبات وحالاتها.
- PWA + Service Worker + Android APK/AAB عبر GitHub Actions.

## التشغيل محلياً
```bash
npm install
cp .env.example .env      # عدّل DATABASE_URL و ADMIN_PASSWORD
npx drizzle-kit push
npm run dev
```

## متغيرات البيئة
| المتغير | الوصف |
|---|---|
| `DATABASE_URL` | اتصال PostgreSQL |
| `ADMIN_PASSWORD` | كلمة مرور لوحة الإدارة `/admin` |
| `ANDROID_SHA256_FINGERPRINT` | بصمة مفتاح توقيع Android (لملف assetlinks) |

## قاعدة البيانات
`categories` · `products` · `product_options` · `customers` · `orders` · `order_items`
(يتم تعبئة الأقسام والخدمات تلقائياً عند أول تشغيل إذا كانت فارغة.)

## Android APK / AAB
راجع [`android/README.md`](android/README.md) — بناء آلي عبر GitHub Actions أو يدوياً بـ Bubblewrap.

## التواصل
- الإدارة: +967777728478 · تليجرام: https://t.me/bfixSoftware · فيسبوك: https://www.facebook.com/share/1BbyBGMfL2/

---

## بناء Android APK/AAB (خطوات مطلوبة منك)

### الخطوة 1: إنشاء ملف workflow يدوياً
بسبب صلاحية التوكن، يجب إنشاء ملف workflow يدوياً:

1. ادخل: https://github.com/albhsham2847/bfix-ai-store/new/main?filename=.github%2Fworkflows%2Fandroid.yml
2. انسخ محتوى الملف من: [`android/workflow-reference.md`](android/workflow-reference.md)
3. Commit مباشرة على branch `main`

### الخطوة 2: أضف Secrets في GitHub
https://github.com/albhsham2847/bfix-ai-store/settings/secrets/actions

| Secret | Value |
|---|---|
| `APP_HOST` | رابط استضافتك (بدون https://) |
| `KEYSTORE_PASSWORD` | كلمة مرور اختيارية |
| `KEY_PASSWORD` | كلمة مرور اختيارية |

### الخطوة 3: شغّل الـ workflow
GitHub → Actions → Build Android APK/AAB → Run workflow
