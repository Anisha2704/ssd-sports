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
        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${
          !activeHandle
            ? 'bg-[#0B7A3B] text-white border-[#0B7A3B] shadow-xs'
            : 'bg-[#F5FAF6] text-[#10231A] border-[#D8E8DD] hover:bg-[#EAF7EE] hover:text-[#0B7A3B] hover:border-[#0B7A3B]/40'
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
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${
              isActive
                ? 'bg-[#0B7A3B] text-white border-[#0B7A3B] shadow-xs'
                : 'bg-[#F5FAF6] text-[#10231A] border-[#D8E8DD] hover:bg-[#EAF7EE] hover:text-[#0B7A3B] hover:border-[#0B7A3B]/40'
            }`}
          >
            {col.title}
          </Link>
        );
      })}
    </div>
  );
}

