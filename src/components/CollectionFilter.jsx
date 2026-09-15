import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Renders website categories dynamically fetched from Shopify Collections
 */
export default function CollectionFilter({ collections = [], activeHandle = null }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {/* "All Products" Pill */}
      <Link
        to="/catalog"
        className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${
          !activeHandle
            ? 'bg-[#FF2E4D] text-white border-[#FF2E4D] shadow-[0_0_12px_rgba(255,46,77,0.4)]'
            : 'bg-slate-900/80 text-slate-300 border-white/10 hover:bg-slate-800 hover:text-white hover:border-white/20'
        }`}
      >
        All Products
      </Link>

      {/* Dynamic Shopify Collections Pills */}
      {collections.map((col) => {
        const isActive = activeHandle === col.handle;
        return (
          <Link
            key={col.id || col.handle}
            to={`/catalog/${col.handle}`}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${
              isActive
                ? 'bg-[#FF2E4D] text-white border-[#FF2E4D] shadow-[0_0_12px_rgba(255,46,77,0.4)]'
                : 'bg-slate-900/80 text-slate-300 border-white/10 hover:bg-slate-800 hover:text-white hover:border-white/20'
            }`}
          >
            {col.title}
          </Link>
        );
      })}
    </div>
  );
}

