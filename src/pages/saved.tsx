import Link from "next/link";
import BottomNav from "@/components/BottomNav";

export default function Saved() {
  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      <div className="bg-white px-5 pt-12 pb-4 border-b border-slate-100">
        <Link href="/" className="text-slate-400 text-sm mb-4 inline-block">← Back</Link>
        <h1 className="text-xl font-bold">Saved Properties</h1>
        <p className="text-sm text-slate-500 mt-1">3 properties saved</p>
      </div>

      <div className="px-5 py-4">
        <div className="bg-white rounded-2xl p-6 text-center border border-slate-200">
          <div className="text-4xl mb-2">♡</div>
          <p className="text-slate-500 text-sm">Your saved properties will appear here.</p>
          <Link href="/" className="text-blue-600 font-semibold text-sm mt-3 inline-block">
            Browse Properties →
          </Link>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
