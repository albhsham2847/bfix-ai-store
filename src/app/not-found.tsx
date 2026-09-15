import Link from "next/link";
export default function NotFound() {
  return (
    <div className="glass mt-10 rounded-3xl p-8 text-center">
      <div className="text-5xl">🔍</div>
      <h1 className="mt-2 text-xl font-black">الصفحة غير موجودة</h1>
      <Link href="/" className="gold-btn mt-4 inline-block rounded-xl px-5 py-2.5 text-sm font-black">العودة للرئيسية</Link>
    </div>
  );
}
