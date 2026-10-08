import React from 'react';
import { useInstagramGallery } from '../hooks/useInstagramGallery';

function InstagramIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

/**
 * InstagramCommunityGallery - Full-bleed seamless Instagram Community Gallery collage
 */
export default function InstagramCommunityGallery() {
  const { gallery, loading, error } = useInstagramGallery();

  const images = gallery?.images || [];
  const instagramUrl = gallery?.instagramUrl || 'https://www.instagram.com/';

  if (loading) {
    return (
      <section className="w-full bg-[#EAF7EE] pt-12 sm:pt-16 pb-0 border-b border-[#D8E8DD]">
        <div className="text-center space-y-2 mb-8 sm:mb-12 px-4">
          <div className="w-64 h-8 bg-white rounded-xl mx-auto animate-pulse" />
          <div className="w-28 h-5 bg-white rounded-lg mx-auto animate-pulse" />
        </div>
        <div className="w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-0">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((idx) => (
            <div key={idx} className="w-full aspect-square bg-white animate-pulse border-r border-b border-[#D8E8DD]" />
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
    <section className="w-full bg-[#EAF7EE] pt-16 sm:pt-24 pb-0 border-b border-[#D8E8DD] text-[#10231A] overflow-hidden">
      
      {/* Centered Heading & Subheading Link */}
      <div className="text-center space-y-2 mb-8 sm:mb-12 px-4">
        <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-[#0B7A3B]">
          TAG #SSDSPORTS
        </span>
        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-[#10231A] uppercase tracking-wider">
          The SSD Sports Community
        </h2>
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm sm:text-base font-extrabold text-[#0B7A3B] hover:text-[#075E2D] transition-colors tracking-wide pt-1"
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
            className="group relative block aspect-square w-full overflow-hidden bg-white cursor-pointer border border-[#D8E8DD]/40"
          >
            <img
              src={img.url}
              alt={img.altText || 'SSD Sports Community'}
              className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-500 ease-out"
            />
            
            {/* Subtle Hover Overlay with Instagram Icon */}
            <div className="absolute inset-0 bg-[#0B7A3B]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
              <InstagramIcon className="w-7 h-7 text-white" />
            </div>
          </a>
        ))}
      </div>

    </section>
  );
}

