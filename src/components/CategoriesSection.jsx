import React from 'react';
import { Link } from 'react-router-dom';
import { useCollections } from '../hooks/useCollections';

/**
 * CategoriesSection - Renders Shopify Collections as compact visual category cards with light theme
 */
export default function CategoriesSection() {
  const { collections, loading, error, isConfigured } = useCollections({ first: 25 });

  // Use all valid Shopify collections returned from Storefront API
  const categoryCollections = (collections || []).filter((col) => col && col.handle);

  return (
    <section className="w-full bg-white py-8 sm:py-12 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Section Heading */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Categories
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            Explore our high-performance gear sorted by sports categories
          </p>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2].map((idx) => (
              <div
                key={idx}
                className="w-full h-48 sm:h-56 lg:h-60 bg-slate-100 rounded-2xl animate-pulse flex items-end justify-center p-4 border border-slate-200"
              >
                <div className="w-28 h-8 bg-slate-200 rounded-full"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error or Not Configured State */}
        {!loading && (error || !isConfigured) && (
          <div className="text-center py-8 bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-md mx-auto">
            <p className="text-slate-500 text-xs sm:text-sm">
              {!isConfigured
                ? 'Shopify Storefront credentials missing.'
                : 'Unable to load categories at this moment.'}
            </p>
          </div>
        )}

        {/* Categories Grid */}
        {!loading && !error && categoryCollections.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {categoryCollections.map((col) => {
              const imageUrl = col.image?.url || col.products?.nodes?.[0]?.featuredImage?.url;
              const altText = col.image?.altText || col.products?.nodes?.[0]?.featuredImage?.altText || col.title;

              return (
                <Link
                  key={col.id || col.handle}
                  to={`/catalog?collection=${encodeURIComponent(col.handle)}`}
                  className="group relative w-full h-48 sm:h-56 lg:h-60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-200 transition-all duration-300 bg-slate-50 block"
                >
                  {/* Collection Image / Light Theme Fallback */}
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={altText}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 group-hover:scale-105 transition-transform duration-500 ease-out flex flex-col items-center justify-center p-4 border border-slate-100">
                      <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-2 border border-slate-200 text-slate-800 font-extrabold text-base">
                        {col.title.charAt(0)}
                      </div>
                    </div>
                  )}

                  {/* Subtle Light-Friendly Contrast Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent group-hover:from-slate-900/50 transition-opacity duration-300" />

                  {/* Category Title White Pill Button */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-auto">
                    <div className="bg-white text-slate-900 font-bold text-xs sm:text-sm px-5 py-2 rounded-full shadow-md border border-slate-200/80 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all duration-300 whitespace-nowrap tracking-wide text-center">
                      {col.title}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Empty Collection State */}
        {!loading && !error && categoryCollections.length === 0 && (
          <div className="text-center py-8 bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-md mx-auto">
            <p className="text-slate-500 text-xs sm:text-sm">
              No categories available at this time.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
