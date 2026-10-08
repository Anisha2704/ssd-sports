import React from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest', value: 'newest' },
  { label: 'Alphabetical: A-Z', value: 'title-asc' },
];

export default function FilterDrawer({
  isOpen,
  onClose,
  collections = [],
  activeHandle = null,
  sortOption = 'featured',
  onSortChange,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div className="bg-white w-full max-w-xs h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#0B7A3B]" />
              <h2 className="font-extrabold text-base text-[#10231A] uppercase tracking-tight">
                Filter &amp; Sort
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-[#7B8A82] hover:text-[#10231A] hover:bg-[#F5FAF6] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Collections List */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#7B8A82]">
              Collections
            </h3>
            <div className="space-y-1">
              <Link
                to="/catalog"
                onClick={onClose}
                className={`block px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  !activeHandle
                    ? 'bg-[#0B7A3B] text-white'
                    : 'text-[#10231A] hover:bg-[#F5FAF6]'
                }`}
              >
                All Products
              </Link>
              {collections.map((col) => (
                <Link
                  key={col.id || col.handle}
                  to={`/catalog/${col.handle}`}
                  onClick={onClose}
                  className={`block px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    activeHandle === col.handle
                      ? 'bg-[#0B7A3B] text-white'
                      : 'text-[#10231A] hover:bg-[#F5FAF6]'
                  }`}
                >
                  {col.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div className="space-y-3 pt-4 border-t border-[#D8E8DD]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#7B8A82]">
              Sort By
            </h3>
            <div className="space-y-1">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onSortChange && onSortChange(opt.value);
                    onClose();
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    sortOption === opt.value
                      ? 'bg-[#EAF7EE] text-[#0B7A3B] font-bold border border-[#0B7A3B]/30'
                      : 'text-[#10231A] hover:bg-[#F5FAF6]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Apply / Close Button */}
        <div className="pt-6 border-t border-[#D8E8DD]">
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#0B7A3B] hover:bg-[#075E2D] text-white text-xs font-bold uppercase rounded-xl tracking-wider shadow-xs transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
