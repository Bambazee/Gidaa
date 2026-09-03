import Link from "next/link";

interface PropertyCardProps {
  id: string;
  title: string;
  price: number;
  location: string;
  beds: number;
  baths: number;
  badge: string;
  power: string;
  water: string;
  security: string;
  bq: boolean;
  studentFriendly: boolean;
}

export default function PropertyCard({
  id,
  title,
  price,
  location,
  beds,
  baths,
  badge,
  power,
  water,
  security,
  bq,
  studentFriendly,
}: PropertyCardProps) {
  const formatPrice = (n: number) => "₦" + n.toLocaleString();

  return (
    <Link href={`/property/${id}`}>
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 mb-4 active:scale-[0.98] transition-transform cursor-pointer">
        <div className="h-44 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-5xl relative">
          🏠
          <span
            className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold text-white ${
              badge === "verified"
                ? "bg-emerald-500"
                : badge === "secure"
                ? "bg-amber-500 text-amber-900"
                : "bg-blue-500"
            }`}
          >
            {badge === "verified" ? "✓ Verified" : badge === "secure" ? "🛡️ Secure" : "New"}
          </span>
          <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-sm">
            ♡
          </button>
        </div>
        <div className="p-4">
          <div className="text-lg font-extrabold text-blue-700 mb-0.5">
            {formatPrice(price)} <span className="text-sm font-medium text-slate-500">/ year</span>
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
          <p className="text-sm text-slate-500 mb-3 flex items-center gap-1">📍 {location}</p>
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2.5 py-1 bg-slate-100 rounded-md text-xs font-medium text-slate-600">{beds} Beds</span>
            <span className="px-2.5 py-1 bg-slate-100 rounded-md text-xs font-medium text-slate-600">{baths} Baths</span>
            <span className="px-2.5 py-1 bg-amber-50 rounded-md text-xs font-medium text-amber-800">⚡ {power}</span>
            <span className="px-2.5 py-1 bg-blue-50 rounded-md text-xs font-medium text-blue-800">💧 {water}</span>
            <span className="px-2.5 py-1 bg-emerald-50 rounded-md text-xs font-medium text-emerald-800">🔒 {security}</span>
            {bq && <span className="px-2.5 py-1 bg-purple-50 rounded-md text-xs font-medium text-purple-800">🏠 BQ</span>}
            {studentFriendly && <span className="px-2.5 py-1 bg-pink-50 rounded-md text-xs font-medium text-pink-800">🎓 Student</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}
