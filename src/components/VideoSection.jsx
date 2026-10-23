import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useHomepageVideos } from '../hooks/useHomepageVideos';

/**
 * Single Media Card Component - Renders either a Video or Photo/Image
 */
function VideoCard({ video: media }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const mediaUrl = media?.url || media?.primaryUrl;
  const altText = media?.altText || 'SSD Sports Highlight';

  const isVideo = Boolean(
    media &&
    (media.type === 'video' ||
      (media.sources && media.sources.length > 0) ||
      (media.primaryUrl && /\.(mp4|webm|mov|m4v|ogv|ogg|m3u8)($|\?)/i.test(media.primaryUrl)))
  );

  const isImage = Boolean(
    media &&
    !isVideo &&
    (media.type === 'image' ||
      media.url ||
      media.primaryUrl)
  );

  // Reset state on media change
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [mediaUrl]);

  // Reliable browser autoplay enforcement for video
  useEffect(() => {
    if (!isVideo) return;

    const vid = videoRef.current;
    if (!vid) return;

    vid.muted = true;
    vid.defaultMuted = true;

    const playPromise = vid.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          setIsPlaying(false);
        });
    }
  }, [isVideo, mediaUrl]);

  const togglePlay = () => {
    if (!isVideo) return;
    const vid = videoRef.current;
    if (!vid) return;

    if (isPlaying) {
      vid.pause();
      setIsPlaying(false);
    } else {
      vid
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;

    const nextMuted = !isMuted;
    vid.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  return (
    <div
      onClick={isVideo ? togglePlay : undefined}
      className={`relative shrink-0 w-[78vw] sm:w-[260px] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] aspect-[9/16] rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:shadow-[#0B7A3B]/15 transition-all duration-300 bg-[#07160E] snap-start group border border-[#D8E8DD] hover:border-[#0B7A3B]/40 select-none ${
        isVideo ? 'cursor-pointer' : ''
      }`}
    >
      {/* Loading Shimmer Placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-[#0B2014] animate-pulse flex items-center justify-center">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#0B7A3B]">
            Loading...
          </span>
        </div>
      )}

      {/* Case 1: Video Player */}
      {isVideo && mediaUrl ? (
        <>
          <video
            ref={videoRef}
            src={mediaUrl}
            poster={media.posterUrl || undefined}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onLoadedData={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {media.sources && media.sources.length > 0 ? (
              media.sources.map((s, idx) => (
                <source key={idx} src={s.url} type={s.mimeType || 'video/mp4'} />
              ))
            ) : (
              <source src={mediaUrl} type="video/mp4" />
            )}
          </video>

          {/* Fallback to poster or image if video media fails */}
          {hasError && (media.posterUrl || media.url) && (
            <img
              src={media.posterUrl || media.url}
              alt={altText}
              onLoad={() => setIsLoaded(true)}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Gradient Bottom Shadow */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#10231A]/85 via-transparent to-transparent pointer-events-none opacity-60 group-hover:opacity-85 transition-opacity" />

          {/* Paused Indicator Overlay */}
          {!isPlaying && (
            <div className="absolute inset-0 bg-black/35 flex items-center justify-center backdrop-blur-[2px] transition-all z-10 pointer-events-none">
              <div className="w-14 h-14 rounded-full bg-[#0B7A3B] text-white flex items-center justify-center shadow-lg transform scale-100 transition-transform">
                <Play className="w-6 h-6 fill-current ml-1" />
              </div>
            </div>
          )}

          {/* Top Controls: Sound Toggle and Play/Pause indicator */}
          <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
            {/* Sound toggle button */}
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              className="pointer-events-auto w-8 h-8 rounded-full bg-black/50 hover:bg-[#0B7A3B] text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all duration-200 cursor-pointer shadow-xs active:scale-90"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {/* Micro Play/Pause Badge */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-[#10231A] p-2 rounded-full backdrop-blur-md border border-[#D8E8DD] shadow-xs">
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
            </div>
          </div>
        </>
      ) : isImage && mediaUrl ? (
        /* Case 2: Photo / Image Card */
        <>
          <img
            src={mediaUrl}
            alt={altText}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Gradient Bottom Shadow */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#10231A]/85 via-transparent to-transparent pointer-events-none opacity-60 group-hover:opacity-85 transition-opacity" />

          {/* Top Corner Pill Badge */}
          <div className="absolute top-3 left-3 z-20 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white text-[9px] font-mono uppercase tracking-widest font-bold shadow-xs">
              <Sparkles className="w-3 h-3 text-[#20A957]" />
              <span>PRO SNAP</span>
            </span>
          </div>
        </>
      ) : (
        /* Case 3: Fallback Media Placeholder */
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#F5FAF6] via-[#EAF7EE] to-white text-[#10231A] p-4 text-center">
          <span className="text-xs font-black tracking-widest uppercase text-[#0B7A3B] font-heading">
            SSD SPORTS
          </span>
        </div>
      )}
    </div>
  );
}


/**
 * VideoSection - Horizontal scrollable video carousel component
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
    <section className="w-full bg-white py-12 sm:py-16 border-b border-[#D8E8DD] overflow-hidden text-[#10231A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-[#0B7A3B]">
            PRO HIGHLIGHTS
          </span>
          <h2 className="font-heading text-2xl sm:text-4xl font-black text-[#10231A] uppercase tracking-wider">
            Gear in Action
          </h2>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="flex gap-4 sm:gap-6 overflow-hidden">
            {[1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                className="shrink-0 w-[78vw] sm:w-[260px] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] aspect-[9/16] bg-[#F5FAF6] border border-[#D8E8DD] rounded-2xl animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Carousel Container with Controls */}
        {!loading && videos.length > 0 && (
          <div className="relative group/carousel">
            
            {/* Left Navigation Arrow */}
            <button
              onClick={() => scroll('left')}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-[#10231A] hover:bg-[#0B7A3B] hover:text-white flex items-center justify-center shadow-md backdrop-blur-md transition-all focus:outline-none cursor-pointer border border-[#D8E8DD]"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>

            {/* Videos Horizontal Track */}
            <div
              ref={carouselRef}
              className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory py-2 scroll-smooth"
            >
              {videos.map((vid) => (
                <VideoCard key={vid.id} video={vid} />
              ))}
            </div>

            {/* Right Navigation Arrow */}
            <button
              onClick={() => scroll('right')}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-[#10231A] hover:bg-[#0B7A3B] hover:text-white flex items-center justify-center shadow-md backdrop-blur-md transition-all focus:outline-none cursor-pointer border border-[#D8E8DD]"
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

