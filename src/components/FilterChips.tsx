interface FilterChipsProps {
  options: string[];
  selected: string;
  onSelect: (val: string) => void;
}

export default function FilterChips({ options, selected, onSelect }: FilterChipsProps) {
  return (
    <div className="flex gap-2 px-5 py-4 overflow-x-auto scrollbar-hide">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            selected === opt
              ? "bg-blue-600 text-white"
              : "bg-white border border-slate-200 text-slate-700"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
