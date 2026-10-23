import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useHomepageFeature } from '../hooks/useHomepageFeature';

/**
 * HomepageFeatureSection - Premium split-layout craftsmanship/performance section with video
 */
export default function HomepageFeatureSection() {
  const { feature, loading, error } = useHomepageFeature();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [, setIsLoaded] = useState(false);

  const video = feature?.video;

  // Reliable browser autoplay enforcement
  useEffect(() => {
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
  }, [video?.primaryUrl]);

  const togglePlay = () => {
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

  if (loading) {
    return (
      <section className="w-full bg-white py-16 sm:py-24 border-b border-[#D8E8DD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="w-full aspect-[4/3] bg-[#F5FAF6] rounded-3xl animate-pulse" />
          <div className="space-y-4 animate-pulse">
            <div className="w-3/4 h-10 bg-[#F5FAF6] rounded-xl" />
            <div className="w-full h-24 bg-[#F5FAF6] rounded-xl" />
            <div className="w-40 h-12 bg-[#F5FAF6] rounded-xl" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !feature) {
    return null;
  }

  const { heading, description, buttonText } = feature;

  return (
    <section className="w-full bg-white py-16 sm:py-24 border-b border-[#D8E8DD] text-[#10231A] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Column 1: Large Premium Video Presentation */}
          <div
            onClick={togglePlay}
            className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-lg bg-[#07160E] border border-[#D8E8DD] hover:border-[#0B7A3B]/40 group select-none cursor-pointer"
          >
            {video?.primaryUrl ? (
              <>
                <video
                  ref={videoRef}
                  src={video.primaryUrl}
                  poster={video.posterUrl || undefined}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  onLoadedData={() => setIsLoaded(true)}
                  onError={() => setHasError(true)}
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

                {/* Fallback to poster image if media fails to load */}
                {hasError && video.posterUrl && (
                  <img
                    src={video.posterUrl}
                    alt={video.altText || 'Feature video preview'}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}

                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#10231A]/60 via-transparent to-transparent pointer-events-none" />

                {/* Paused Indicator Overlay */}
                {!isPlaying && (
                  <div className="absolute inset-0 bg-black/35 flex items-center justify-center backdrop-blur-[2px] transition-all z-10 pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-[#0B7A3B] text-white flex items-center justify-center shadow-lg transform scale-100 transition-transform">
                      <Play className="w-7 h-7 fill-current ml-1" />
                    </div>
                  </div>
                )}

                {/* Top Controls: Sound Toggle and Play/Pause indicator */}
                <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
                  {/* Sound toggle button */}
                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                    className="pointer-events-auto w-9 h-9 rounded-full bg-black/50 hover:bg-[#0B7A3B] text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all duration-200 cursor-pointer shadow-xs active:scale-90"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  {/* Micro Play/Pause Badge */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-[#10231A] p-2 rounded-full backdrop-blur-md border border-[#D8E8DD] shadow-xs">
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#F5FAF6] via-[#EAF7EE] to-white text-[#10231A] p-8 text-center">
                <span className="text-2xl font-black tracking-widest uppercase text-[#0B7A3B] font-heading">
                  SSD SPORTS PERFORMANCE
                </span>
              </div>
            )}
          </div>

          {/* Column 2: Heading, Description & Dynamic CTA Button */}
          <div className="space-y-6 lg:pl-4 text-center lg:text-left flex flex-col items-center lg:items-start">
            <div className="space-y-3 w-full">
              <span className="text-xs font-mono uppercase tracking-[0.25em] font-bold text-[#0B7A3B]">
                CRAFTSMANSHIP &amp; PERFORMANCE
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-[#10231A] tracking-wider uppercase leading-tight">
                {heading}
              </h2>
            </div>

            <p className="text-[#52645A] text-xs sm:text-sm leading-relaxed font-medium">
              {description}
            </p>

            <div className="pt-2 flex justify-center lg:justify-start">
              <Link
                to="/catalog"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#0B7A3B] hover:bg-[#075E2D] text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md shadow-[#0B7A3B]/15 hover:-translate-y-0.5 active:translate-y-0 group cursor-pointer"
              >
                <span>{buttonText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
