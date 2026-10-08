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
      <label htmlFor="sort-by" className="text-xs font-bold uppercase tracking-wider text-[#52645A] hidden sm:inline-block">
        Sort By:
      </label>
      <div className="relative">
        <select
          id="sort-by"
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          className="appearance-none bg-white border border-[#D8E8DD] text-[#10231A] text-xs font-bold rounded-xl py-2 pl-4 pr-9 hover:border-[#0B7A3B] focus:outline-none focus:ring-2 focus:ring-[#0B7A3B]/20 cursor-pointer shadow-xs"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white text-[#10231A]">
              {opt.label}
            </option>
          ))}
        </select>
        <ArrowUpDown className="w-3.5 h-3.5 text-[#0B7A3B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}

