export const CONTACT = {
  phone: "+967777728478",
  phoneDisplay: "+967 777 728 478",
  whatsapp: "https://wa.me/967777728478",
  telegram: "https://t.me/bfixSoftware",
  facebook: "https://www.facebook.com/share/1BbyBGMfL2/",
};

export type SeedProduct = {
  name: string;
  description: string;
  price: string;
  unit?: string;
  badge?: string;
  featured?: boolean;
};

export type SeedCategory = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  gradient: string;
  products: SeedProduct[];
};

export const SEED_CATEGORIES: SeedCategory[] = [
  {
    slug: "tools",
    name: "أدوات البرمجة",
    description: "تفعيل رسمي لأشهر أدوات صيانة وبرمجة الهواتف",
    icon: "🛠️",
    gradient: "from-amber-400 to-orange-600",
    products: [
      { name: "Unlock Tool - سنة", description: "تفعيل رسمي لمدة 12 شهر مع دعم فني كامل", price: "45", unit: "سنة", badge: "الأكثر طلباً", featured: true },
      { name: "Unlock Tool - 3 أشهر", description: "تفعيل رسمي لمدة 3 أشهر", price: "18", unit: "3 أشهر" },
      { name: "TSM Tool - سنة", description: "تفعيل رسمي للأداة مع جميع التحديثات", price: "40", unit: "سنة", featured: true },
      { name: "Chimera Tool", description: "ترخيص سنوي كامل لجميع الموديلات", price: "89", unit: "سنة" },
      { name: "Pandora Tool", description: "تفعيل سنوي مع التحديثات", price: "55", unit: "سنة" },
      { name: "Hydra Tool", description: "دونغل + تفعيل سنوي", price: "60", unit: "سنة" },
      { name: "Cheetah Tool", description: "تفعيل سنوي لأجهزة سامسونج و MTK", price: "35", unit: "سنة" },
    ],
  },
  {
    slug: "rent",
    name: "إيجار وشير الأدوات",
    description: "استخدم الأدوات بالساعة أو اليوم بدون شراء ترخيص",
    icon: "⏱️",
    gradient: "from-cyan-400 to-blue-600",
    products: [
      { name: "Unlock Tool - إيجار 6 ساعات", description: "حساب شير لمدة 6 ساعات", price: "3", unit: "6 ساعات", badge: "سريع", featured: true },
      { name: "Unlock Tool - إيجار 24 ساعة", description: "حساب شير لمدة يوم كامل", price: "5", unit: "24 ساعة" },
      { name: "TSM Tool - إيجار يوم", description: "حساب شير لمدة يوم كامل", price: "5", unit: "24 ساعة" },
      { name: "Chimera - إيجار يوم", description: "حساب شير لمدة يوم كامل", price: "8", unit: "24 ساعة" },
      { name: "Pandora - إيجار يوم", description: "حساب شير لمدة يوم كامل", price: "6", unit: "24 ساعة" },
    ],
  },
  {
    slug: "ai",
    name: "اشتراكات الذكاء الاصطناعي",
    description: "Gemini Pro و ChatGPT Plus وأكثر بأفضل الأسعار",
    icon: "🤖",
    gradient: "from-violet-500 to-fuchsia-600",
    products: [
      { name: "ChatGPT Plus - شهر", description: "اشتراك رسمي GPT-4o على حسابك الخاص", price: "20", unit: "شهر", badge: "الأشهر", featured: true },
      { name: "Gemini Pro (Advanced) - سنة", description: "اشتراك Google One AI Premium مع 2TB", price: "35", unit: "سنة", badge: "عرض", featured: true },
      { name: "Claude Pro - شهر", description: "اشتراك رسمي على حسابك", price: "20", unit: "شهر" },
      { name: "Midjourney - شهر", description: "خطة Basic لتوليد الصور", price: "12", unit: "شهر" },
      { name: "Perplexity Pro - سنة", description: "اشتراك سنوي كامل", price: "30", unit: "سنة" },
      { name: "Canva Pro - سنة", description: "اشتراك سنوي مع كل مزايا الذكاء الاصطناعي", price: "10", unit: "سنة" },
    ],
  },
  {
    slug: "topup",
    name: "شحن التطبيقات والألعاب",
    description: "شحن فوري لشدات ببجي، فري فاير، تيك توك وغيرها",
    icon: "🎮",
    gradient: "from-emerald-400 to-teal-600",
    products: [
      { name: "شدات ببجي 60 UC", description: "شحن فوري عبر ID", price: "1", unit: "60 UC" },
      { name: "شدات ببجي 325 UC", description: "شحن فوري عبر ID", price: "5", unit: "325 UC", featured: true },
      { name: "شدات ببجي 660 UC", description: "شحن فوري عبر ID", price: "10", unit: "660 UC" },
      { name: "شدات ببجي 1800 UC", description: "شحن فوري عبر ID", price: "25", unit: "1800 UC", badge: "الأفضل قيمة" },
      { name: "فري فاير 520 جوهرة", description: "شحن فوري عبر ID", price: "5", unit: "520 💎" },
      { name: "تيك توك 1000 كوينز", description: "شحن مباشر على الحساب", price: "13", unit: "1000 كوينز" },
      { name: "يلا لودو 1000 ماسة", description: "شحن فوري", price: "2", unit: "1000 ماسة" },
    ],
  },
  {
    slug: "pubg-accounts",
    name: "حسابات ببجي العالمية",
    description: "حسابات موثوقة ومضمونة بمستويات وسكنات مميزة",
    icon: "🏆",
    gradient: "from-yellow-400 to-amber-600",
    products: [
      { name: "حساب ببجي - مستوى 60+", description: "حساب نظيف مع سكنات متنوعة وربط كامل", price: "25", unit: "حساب" },
      { name: "حساب ببجي - سكنات نادرة", description: "يحتوي على أزياء أسطورية وسلاح مطور", price: "80", unit: "حساب", badge: "مميز", featured: true },
      { name: "حساب ببجي - كونكر", description: "حساب برتبة كونكر مع مقتنيات فاخرة", price: "150", unit: "حساب", badge: "VIP" },
      { name: "حساب ببجي - مبتدئ", description: "حساب جديد مع UC مشحون", price: "10", unit: "حساب" },
    ],
  },
  {
    slug: "cards",
    name: "بطائق إلكترونية",
    description: "iTunes, Google Play, PlayStation, Steam, Razer Gold",
    icon: "💳",
    gradient: "from-rose-400 to-pink-600",
    products: [
      { name: "Google Play 10$", description: "بطاقة أمريكية - تسليم فوري", price: "11", unit: "10$" },
      { name: "iTunes 25$", description: "بطاقة أمريكية - تسليم فوري", price: "26.5", unit: "25$", featured: true },
      { name: "PlayStation 20$", description: "بطاقة أمريكية", price: "21.5", unit: "20$" },
      { name: "Steam 20$", description: "بطاقة عالمية", price: "21.5", unit: "20$" },
      { name: "Razer Gold 10$", description: "بطاقة عالمية", price: "10.8", unit: "10$" },
      { name: "Netflix 25$", description: "بطاقة هدايا", price: "27", unit: "25$" },
    ],
  },
  {
    slug: "ads",
    name: "دعاية وإعلان",
    description: "حملات إعلانية ممولة على فيسبوك، انستقرام، تيك توك وجوجل",
    icon: "📢",
    gradient: "from-sky-400 to-indigo-600",
    products: [
      { name: "إعلان ممول فيسبوك/انستقرام", description: "إدارة وتنفيذ حملة بميزانية 50$", price: "65", unit: "حملة", featured: true },
      { name: "إعلان ممول تيك توك", description: "حملة مستهدفة بميزانية 50$", price: "65", unit: "حملة" },
      { name: "إعلانات جوجل", description: "حملة بحث/يوتيوب بميزانية 100$", price: "125", unit: "حملة" },
      { name: "تصميم بوستر إعلاني", description: "تصميم احترافي بجودة عالية", price: "8", unit: "تصميم" },
    ],
  },
  {
    slug: "marketing",
    name: "خدمات تسويق",
    description: "زيادة متابعين، لايكات، مشاهدات وإدارة حسابات",
    icon: "📈",
    gradient: "from-lime-400 to-green-600",
    products: [
      { name: "1000 متابع انستقرام", description: "متابعين حقيقيين بضمان", price: "6", unit: "1000 متابع" },
      { name: "1000 متابع تيك توك", description: "متابعين حقيقيين بضمان", price: "6", unit: "1000 متابع", featured: true },
      { name: "10,000 مشاهدة يوتيوب", description: "مشاهدات آمنة وتدريجية", price: "12", unit: "10K" },
      { name: "إدارة حساب سوشيال ميديا", description: "إدارة شهرية كاملة مع محتوى", price: "100", unit: "شهر" },
    ],
  },
  {
    slug: "verification",
    name: "توثيق برامج التواصل",
    description: "العلامة الزرقاء لفيسبوك، انستقرام، تيك توك وتليجرام",
    icon: "✅",
    gradient: "from-blue-400 to-blue-700",
    products: [
      { name: "توثيق انستقرام (Meta Verified)", description: "علامة زرقاء رسمية شهرية", price: "20", unit: "شهر", featured: true },
      { name: "توثيق فيسبوك (Meta Verified)", description: "علامة زرقاء رسمية شهرية", price: "20", unit: "شهر" },
      { name: "توثيق تيك توك", description: "خدمة توثيق للحسابات المؤهلة", price: "250", unit: "مرة واحدة", badge: "حصري" },
      { name: "توثيق تليجرام", description: "توثيق للقنوات والحسابات المؤهلة", price: "150", unit: "مرة واحدة" },
    ],
  },
  {
    slug: "tech",
    name: "حلول تقنية متطورة",
    description: "استضافة، سيرفرات، أتمتة، بوتات وحلول ذكاء اصطناعي",
    icon: "⚡",
    gradient: "from-orange-400 to-red-600",
    products: [
      { name: "بوت تليجرام مخصص", description: "بوت متكامل حسب متطلباتك", price: "60", unit: "مشروع", featured: true },
      { name: "سيرفر VPS شهري", description: "4GB RAM - 80GB SSD", price: "12", unit: "شهر" },
      { name: "استضافة + دومين", description: "استضافة سنوية مع دومين .com", price: "35", unit: "سنة" },
      { name: "أتمتة أعمال بالذكاء الاصطناعي", description: "ربط أنظمتك وأتمتتها", price: "150", unit: "مشروع" },
    ],
  },
  {
    slug: "dev",
    name: "برمجة المواقع والتطبيقات",
    description: "متاجر إلكترونية، تطبيقات أندرويد و iOS، أنظمة إدارة",
    icon: "💻",
    gradient: "from-indigo-400 to-purple-700",
    products: [
      { name: "موقع تعريفي احترافي", description: "تصميم عصري متجاوب مع لوحة تحكم", price: "150", unit: "مشروع" },
      { name: "متجر إلكتروني متكامل", description: "بوابات دفع، إدارة منتجات وطلبات", price: "400", unit: "مشروع", featured: true },
      { name: "تطبيق أندرويد", description: "تطبيق أصلي مع لوحة تحكم", price: "500", unit: "مشروع", badge: "مميز" },
      { name: "نظام إدارة مخصص", description: "ERP / CRM حسب احتياج عملك", price: "800", unit: "مشروع" },
    ],
  },
];

export const SEED_OPTIONS: {
  productName: string;
  options: { name: string; price: string }[];
}[] = [
  { productName: "Unlock Tool - سنة", options: [
    { name: "3 أشهر", price: "18" }, { name: "6 أشهر", price: "30" }, { name: "12 شهر", price: "45" } ] },
  { productName: "TSM Tool - سنة", options: [
    { name: "6 أشهر", price: "25" }, { name: "12 شهر", price: "40" } ] },
  { productName: "Unlock Tool - إيجار 6 ساعات", options: [
    { name: "6 ساعات", price: "3" }, { name: "12 ساعة", price: "4" }, { name: "24 ساعة", price: "5" } ] },
  { productName: "ChatGPT Plus - شهر", options: [
    { name: "شهر", price: "20" }, { name: "3 أشهر", price: "57" }, { name: "سنة", price: "200" } ] },
  { productName: "Gemini Pro (Advanced) - سنة", options: [
    { name: "شهر", price: "5" }, { name: "سنة", price: "35" } ] },
  { productName: "Claude Pro - شهر", options: [
    { name: "شهر", price: "20" }, { name: "3 أشهر", price: "57" } ] },
  { productName: "توثيق انستقرام (Meta Verified)", options: [
    { name: "شهر", price: "20" }, { name: "3 أشهر", price: "57" }, { name: "سنة", price: "220" } ] },
  { productName: "توثيق فيسبوك (Meta Verified)", options: [
    { name: "شهر", price: "20" }, { name: "3 أشهر", price: "57" } ] },
  { productName: "سيرفر VPS شهري", options: [
    { name: "2GB RAM", price: "7" }, { name: "4GB RAM", price: "12" }, { name: "8GB RAM", price: "22" } ] },
];
