import Link from "next/link";
import { useRouter } from "next/router";

export default function BottomNav() {
  const router = useRouter();
  const nav = [
    { href: "/", icon: "🏠", label: "Home" },
    { href: "/saved", icon: "♡", label: "Saved" },
    { href: "/list", icon: "➕", label: "List" },
    { href: "/profile", icon: "👤", label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around py-2 pb-6 z-50 max-w-md mx-auto w-full">
      {nav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex flex-col items-center gap-0.5 text-xs py-1 px-3 ${
            router.pathname === item.href ? "text-blue-600 font-semibold" : "text-slate-500"
          }`}
        >
          <span className="text-xl">{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
