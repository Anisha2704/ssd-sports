import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCollections } from '../hooks/useCollections';
import ThreeDTiltCard from './ThreeDTiltCard';

export default function CategoriesSection() {
  const { collections, loading, error, isConfigured } = useCollections({ first: 25 });

  const categoryCollections = (collections || []).filter((col) => col && col.handle);

  return (
    <section className="w-full bg-[#0B0F17] py-16 sm:py-24 border-b border-white/10 text-white relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        
        {/* Section Heading */}
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-[#FF2E4D]">
            GEAR BY CATEGORY
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-black text-white tracking-wider uppercase">
            Shop By Collection
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            Find specialized cricket equipment crafted for your position and style of play.
          </p>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                className="w-full h-56 sm:h-64 bg-slate-900 border border-white/10 rounded-2xl animate-pulse flex items-end justify-center p-4"
              >
                <div className="w-32 h-8 bg-slate-800 rounded-full"></div>
              </div>
            ))}
          </div>
        )}

        {/* Categories Grid */}
        {!loading && !error && categoryCollections.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {categoryCollections.map((col) => {
              const imageUrl = col.image?.url || col.products?.nodes?.[0]?.featuredImage?.url;
              const altText = col.image?.altText || col.products?.nodes?.[0]?.featuredImage?.altText || col.title;

              return (
                <ThreeDTiltCard key={col.id || col.handle} className="h-64 sm:h-80">
                  <Link
                    to={`/catalog?collection=${encodeURIComponent(col.handle)}`}
                    className="group relative w-full h-full rounded-2xl overflow-hidden border border-white/10 hover:border-[#FF2E4D]/50 transition-all duration-500 bg-slate-950 block shadow-xl flex flex-col justify-between p-6"
                  >
                    {/* Collection Image */}
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={altText}
                        className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black group-hover:scale-105 transition-transform duration-500 ease-out border border-white/10" />
                    )}

                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/50 to-transparent group-hover:via-[#0B0F17]/30 transition-all duration-300" />

                    {/* Category Header */}
                    <div className="relative z-10 flex justify-between items-start">
                      <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-[#FF2E4D] bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#FF2E4D]/30">
                        OFFICIAL COLLECTION
                      </span>
                    </div>

                    {/* Category Title & Arrow */}
                    <div className="relative z-10 space-y-2">
                      <div className="flex items-center justify-between text-white group-hover:text-[#FF2E4D] transition-colors">
                        <h3 className="font-heading font-black text-2xl uppercase tracking-wide">
                          {col.title}
                        </h3>
                        <ArrowRight className="w-5 h-5 stroke-[2.5] transform group-hover:translate-x-2 transition-transform duration-300" />
                      </div>
                      <p className="text-xs text-slate-300 font-medium line-clamp-1">
                        Explore SSD {col.title} series
                      </p>
                    </div>
                  </Link>
                </ThreeDTiltCard>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
