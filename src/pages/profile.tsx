import Link from "next/link";
import BottomNav from "@/components/BottomNav";

export default function Profile() {
  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      <div className="bg-white px-5 pt-16 pb-6 text-center border-b border-slate-100">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold">
          AI
        </div>
        <h2 className="text-lg font-bold">Amina Ibrahim</h2>
        <p className="text-sm text-slate-500">Student • ABU Zaria • Kaduna</p>
        <div className="flex justify-center gap-2 mt-3">
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold">
            ✓ Phone Verified
          </span>
        </div>
      </div>

      <div className="px-5 py-5">
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {[
            { icon: "♡", label: "Saved Properties", badge: "3 →", href: "/saved" },
            { icon: "🔔", label: "Alerts & Notifications", badge: "→", href: "#" },
            { icon: "🛡️", label: "Verification Center", badge: "Pending", href: "#", badgeColor: "bg-amber-50 text-amber-800" },
            { icon: "👥", label: "Find Roommates", badge: "→", href: "#" },
            { icon: "⚙️", label: "Settings", badge: "→", href: "#" },
          ].map((item, i) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-4 ${i !== 4 ? "border-b border-slate-100" : ""}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="flex-1 text-sm font-medium">{item.label}</span>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  item.badgeColor || "text-slate-400"
                }`}
              >
                {item.badge}
              </span>
            </Link>
          ))}
        </div>

        <button className="w-full mt-5 bg-white border border-slate-200 text-slate-700 py-3.5 rounded-xl font-semibold text-sm">
          🚪 Log Out
        </button>
      </div>

      <BottomNav />
    </main>
  );
}
