import React from 'react';
import { ArrowUpDown } from 'lucide-react';

const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest', value: 'newest' },
  { label: 'Alphabetical: A-Z', value: 'title-asc' },
];

export default function SortDropdown({ value = 'featured', onChange }) {
  return (
    <div className="relative flex items-center gap-2">
      <label htmlFor="sort-by" className="text-xs font-bold uppercase tracking-wider text-slate-400 hidden sm:inline-block">
        Sort By:
      </label>
      <div className="relative">
        <select
          id="sort-by"
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          className="appearance-none bg-slate-900 border border-white/15 text-white text-xs font-bold rounded-full py-2 pl-4 pr-9 hover:border-[#FF2E4D] focus:outline-none focus:ring-1 focus:ring-[#FF2E4D] cursor-pointer shadow-sm"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
              {opt.label}
            </option>
          ))}
        </select>
        <ArrowUpDown className="w-3.5 h-3.5 text-[#FF2E4D] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}

