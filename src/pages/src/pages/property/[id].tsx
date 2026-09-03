import { useState, useMemo } from "react";
import { properties, areas, types } from "@/lib/data";
import SearchBar from "@/components/SearchBar";
import FilterChips from "@/components/FilterChips";
import PropertyCard from "@/components/PropertyCard";
import BottomNav from "@/components/BottomNav";

export default function Home() {
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      const matchesSearch =
        !search ||
        p.location.toLowerCase().includes(search.toLowerCase()) ||
        p.title.toLowerCase().includes(search.toLowerCase());
      const matchesArea = areaFilter === "All" || p.area === areaFilter;
      const matchesType = typeFilter === "All" || p.type === typeFilter;
      return matchesSearch && matchesArea && matchesType;
    });
  }, [search, areaFilter, typeFilter]);

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white px-5 pt-12 pb-6 rounded-b-3xl">
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium mb-3 border border-white/20">
          📍 Kaduna, Nigeria
        </div>
        <h1 className="text-xl font-bold mb-4">Find Your Home 🏠</h1>
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {/* Security Banner */}
      <div className="mx-5 mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-3">
        <span className="text-xl">🛡️</span>
        <p className="text-xs text-amber-900 font-medium leading-relaxed">
          All listings are verified. We check IDs, match photo locations, and spot-check properties.
        </p>
      </div>

      {/* Filters */}
      <FilterChips options={types} selected={typeFilter} onSelect={setTypeFilter} />
      <div className="px-5 -mt-2 mb-2">
        <select
          value={areaFilter}
          onChange={(e) => setAreaFilter(e.target.value)}
          className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none"
        >
          {areas.map((a) => (
            <option key={a} value={a}>
              {a === "All" ? "All Areas" : a}
            </option>
          ))}
        </select>
      </div>

      {/* Results */}
      <div className="px-5 mt-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-slate-900">{filtered.length} Properties Found</h3>
        </div>
        {filtered.map((p) => (
          <PropertyCard key={p.id} {...p} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <div className="text-4xl mb-2">🔍</div>
            <p>No properties found. Try a different search.</p>
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
