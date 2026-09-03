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
        className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
          !activeHandle
            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
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
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
              isActive
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            {col.title}
          </Link>
        );
      })}
    </div>
  );
}
