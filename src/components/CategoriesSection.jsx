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
    <section className="w-full bg-[#050505] py-12 sm:py-16 border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        
        {/* Section Heading */}
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono tracking-widest text-red-500 uppercase block">
            EXPLORE EQUIPMENT
          </span>
          <h2 className="font-['Syne',sans-serif] text-2xl sm:text-4xl font-extrabold text-white tracking-wide uppercase">
            COLLECTION CATEGORIES
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto font-mono">
            Professional Grade Willow, Protective Gear & Equipment
          </p>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                className="w-full h-48 sm:h-56 lg:h-60 bg-[#0c0c0c] rounded-2xl animate-pulse flex items-end justify-center p-4 border border-white/10"
              >
                <div className="w-28 h-8 bg-white/10 rounded-full"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error or Not Configured State */}
        {!loading && (error || !isConfigured) && (
          <div className="text-center py-8 bg-[#0c0c0c] border border-white/10 rounded-xl p-4 max-w-md mx-auto">
            <p className="text-neutral-400 text-xs sm:text-sm font-mono">
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
                  className="group relative w-full h-52 sm:h-64 lg:h-72 rounded-2xl overflow-hidden border border-white/[0.08] hover:border-white/30 transition-all duration-500 bg-[#0a0a0a] block shadow-xl"
                >
                  {/* Collection Image */}
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={altText}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out filter contrast-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-neutral-900 via-[#0a0a0a] to-red-950/20 group-hover:scale-105 transition-transform duration-700 ease-out flex flex-col items-center justify-center p-4">
                      <div className="w-12 h-12 rounded-full bg-red-600/20 border border-red-600/40 flex items-center justify-center mb-2 text-red-500 font-extrabold text-lg">
                        {col.title.charAt(0)}
                      </div>
                    </div>
                  )}

                  {/* Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-opacity duration-300" />

                  {/* Category Title Pill Button */}
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 w-auto">
                    <div className="bg-black/80 backdrop-blur-md text-white font-mono font-bold text-xs px-5 py-2.5 rounded-full border border-white/15 group-hover:bg-red-600 group-hover:border-red-600 group-hover:text-white transition-all duration-300 tracking-wider text-center uppercase shadow-lg">
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
          <div className="text-center py-8 bg-[#0c0c0c] border border-white/10 rounded-xl p-4 max-w-md mx-auto">
            <p className="text-neutral-400 text-xs sm:text-sm font-mono">
              No categories available at this time.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
