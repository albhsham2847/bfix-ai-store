import TopUpForm from "@/components/TopUpForm";
export const dynamic = "force-dynamic";
export const metadata = { title: "شحن الرصيد" };
import BackButton from "@/components/BackButton";

export default function TopUpPage() {
  return <div className="pt-4"><div className="mb-3"><BackButton /></div>
      <h1 className="text-xl font-black mb-3">شحن الرصيد</h1><TopUpForm /></div>;
}
