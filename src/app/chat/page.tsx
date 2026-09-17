import ChatBox from "@/components/ChatBox";
export const dynamic = "force-dynamic";
export const metadata = { title: "الدردشة" };
export default function ChatPage() {
  return <div className="pt-4"><h1 className="text-xl font-black mb-3">💬 الدردشة مع الإدارة</h1><ChatBox /></div>;
}
