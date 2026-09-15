import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 px-4 pt-[env(safe-area-inset-top)]">
      <div className="glass mt-3 flex items-center justify-between rounded-2xl px-3 py-2">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/icons/icon-192.png"
            alt="B-Fix"
            width={40}
            height={40}
            priority
            className="rounded-xl ring-1 ring-gold/40"
          />
          <div className="leading-tight">
            <div className="text-[15px] font-black tracking-wide">
              <span className="gold-text">B-Fix</span> Software
            </div>
            <div className="text-[11px] text-white/55">AI Store</div>
          </div>
        </Link>
        <Link
          href="/search"
          aria-label="بحث"
          className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-white/80 ring-1 ring-white/10"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </Link>
      </div>
    </header>
  );
}
