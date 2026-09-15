import React from 'react';
import { useInstagramGallery } from '../hooks/useInstagramGallery';

/**
 * InstagramCommunityGallery - Full-bleed seamless Instagram Community Gallery collage
 */
export default function InstagramCommunityGallery() {
  const { gallery, loading, error } = useInstagramGallery();

  const images = gallery?.images || [];
  const instagramUrl = gallery?.instagramUrl || 'https://www.instagram.com/';

  if (loading) {
    return (
      <section className="w-full bg-[#0B0F17] pt-12 sm:pt-16 pb-0 border-b border-white/10">
        <div className="text-center space-y-2 mb-8 sm:mb-12 px-4">
          <div className="w-64 h-8 bg-slate-900 rounded-xl mx-auto animate-pulse" />
          <div className="w-28 h-5 bg-slate-900 rounded-lg mx-auto animate-pulse" />
        </div>
        <div className="w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-0">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((idx) => (
            <div key={idx} className="w-full aspect-square bg-slate-900 animate-pulse border-r border-b border-white/10" />
          ))}
        </div>
      </section>
    );
  }

  // Hide gracefully if error or no images found
  if (error || !gallery || images.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-[#0B0F17] pt-16 sm:pt-24 pb-0 border-b border-white/10 text-white overflow-hidden">
      
      {/* Centered Heading & Subheading Link */}
      <div className="text-center space-y-2 mb-8 sm:mb-12 px-4">
        <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-[#FF2E4D]">
          TAG #SSDSPORTS
        </span>
        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-wider">
          The SSD Sports Community
        </h2>
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm sm:text-base font-bold text-slate-300 hover:text-[#FF2E4D] transition-colors tracking-wide pt-1"
        >
          Join us now &gt;
        </a>
      </div>

      {/* Full-width Edge-to-Edge Seamless Image Collage Wall */}
      <div className="w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-0">
        {images.map((img, idx) => (
          <a
            key={img.id || idx}
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block aspect-square w-full overflow-hidden bg-slate-950 cursor-pointer border border-white/5"
          >
            <img
              src={img.url}
              alt={img.altText}
              className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-500 ease-out"
            />
            
            {/* Subtle Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-[#FF2E4D]/20 transition-colors duration-300 pointer-events-none" />
          </a>
        ))}
      </div>

    </section>
  );
}

