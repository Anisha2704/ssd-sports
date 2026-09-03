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
      <section className="w-full bg-white pt-12 sm:pt-16 pb-0 border-t border-slate-100">
        <div className="text-center space-y-2 mb-8 sm:mb-12 px-4">
          <div className="w-64 h-8 bg-slate-200 rounded-xl mx-auto animate-pulse" />
          <div className="w-28 h-5 bg-slate-100 rounded-lg mx-auto animate-pulse" />
        </div>
        <div className="w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-0">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((idx) => (
            <div key={idx} className="w-full aspect-square bg-slate-100 animate-pulse border-r border-b border-slate-200" />
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
    <section className="w-full bg-white pt-12 sm:pt-16 pb-0 border-t border-slate-100 overflow-hidden">
      
      {/* Centered Heading & Subheading Link */}
      <div className="text-center space-y-2 mb-8 sm:mb-12 px-4">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight">
          Join The SSD Sports Community
        </h2>
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-base sm:text-lg font-medium text-slate-800 hover:text-black hover:underline transition-colors tracking-wide"
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
            className="group relative block aspect-square w-full overflow-hidden bg-slate-100 cursor-pointer"
          >
            <img
              src={img.url}
              alt={img.altText}
              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-out"
            />
            
            {/* Subtle Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300 pointer-events-none" />
          </a>
        ))}
      </div>

    </section>
  );
}
