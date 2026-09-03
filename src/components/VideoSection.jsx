import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { useHomepageVideos } from '../hooks/useHomepageVideos';

/**
 * Single Video Card Component with Play/Pause toggle
 */
function VideoCard({ video }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  return (
    <div
      onClick={togglePlay}
      className="relative shrink-0 w-[78vw] sm:w-[260px] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] aspect-[9/16] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-slate-950 cursor-pointer snap-start group border border-slate-200/60"
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
      >
        {video.sources && video.sources.length > 0 ? (
          video.sources.map((s, idx) => (
            <source key={idx} src={s.url} type={s.mimeType || 'video/mp4'} />
          ))
        ) : (
          <source src={video.primaryUrl} type="video/mp4" />
        )}
      </video>

      {/* Gradient Bottom Shadow */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none opacity-60 group-hover:opacity-80 transition-opacity" />

      {/* Paused Indicator Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px] transition-all z-10">
          <div className="w-14 h-14 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-xl transform scale-100 transition-transform">
            <Play className="w-6 h-6 fill-current ml-1" />
          </div>
        </div>
      )}

      {/* Micro Hover Play/Pause Badge */}
      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white p-2 rounded-full backdrop-blur-md">
        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
      </div>
    </div>
  );
}

/**
 * VideoSection - Horizontal scrollable video carousel component without section header
 */
export default function VideoSection() {
  const { videos, loading, error } = useHomepageVideos();
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    if (!carouselRef.current) return;
    const scrollAmount = carouselRef.current.clientWidth * 0.75;
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Hide section gracefully if no videos exist or error occurs
  if (!loading && (error || !videos || videos.length === 0)) {
    return null;
  }

  return (
    <section className="w-full bg-white py-6 sm:py-10 border-t border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Loading Skeleton */}
        {loading && (
          <div className="flex gap-4 sm:gap-6 overflow-hidden">
            {[1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                className="shrink-0 w-[78vw] sm:w-[260px] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] aspect-[9/16] bg-slate-100 rounded-xl animate-pulse border border-slate-200"
              />
            ))}
          </div>
        )}

        {/* Carousel Container with Start and End Arrow Controls */}
        {!loading && videos.length > 0 && (
          <div className="relative group/carousel">
            
            {/* Left Navigation Arrow (Start) */}
            <button
              onClick={() => scroll('left')}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-slate-900 flex items-center justify-center shadow-xl backdrop-blur-sm transition-all opacity-80 hover:opacity-100 focus:outline-none cursor-pointer border border-slate-200/80"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>

            {/* Videos Horizontal Track */}
            <div
              ref={carouselRef}
              className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory py-1 scroll-smooth"
            >
              {videos.map((vid) => (
                <VideoCard key={vid.id} video={vid} />
              ))}
            </div>

            {/* Right Navigation Arrow (End) */}
            <button
              onClick={() => scroll('right')}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-slate-900 flex items-center justify-center shadow-xl backdrop-blur-sm transition-all opacity-80 hover:opacity-100 focus:outline-none cursor-pointer border border-slate-200/80"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 stroke-[2.5]" />
            </button>

          </div>
        )}

      </div>
    </section>
  );
}
