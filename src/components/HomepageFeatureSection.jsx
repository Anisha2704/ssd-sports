import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useHomepageFeature } from '../hooks/useHomepageFeature';

/**
 * HomepageFeatureSection - Premium split-layout craftsmanship/performance section
 */
export default function HomepageFeatureSection() {
  const { feature, loading, error } = useHomepageFeature();

  if (loading) {
    return (
      <section className="w-full bg-[#0B0F17] py-16 sm:py-24 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="w-full aspect-[4/3] bg-slate-900 rounded-3xl animate-pulse" />
          <div className="space-y-4 animate-pulse">
            <div className="w-3/4 h-10 bg-slate-900 rounded-xl" />
            <div className="w-full h-24 bg-slate-900 rounded-xl" />
            <div className="w-40 h-12 bg-slate-900 rounded-full" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !feature) {
    return null;
  }

  const { heading, description, video, buttonText } = feature;

  return (
    <section className="w-full bg-[#0B0F17] py-16 sm:py-24 border-b border-white/10 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Column 1: Large Premium Video Presentation */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-slate-950 border border-white/15 group">
            {video?.primaryUrl ? (
              <video
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
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-8 text-center">
                <span className="text-2xl font-black tracking-widest uppercase text-slate-400 font-heading">
                  SSD SPORTS PERFORMANCE
                </span>
              </div>
            )}
            
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Column 2: Heading, Description & Dynamic CTA Button */}
          <div className="space-y-6 lg:pl-4">
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-[0.25em] font-bold text-[#FF2E4D]">
                CRAFTSMANSHIP &amp; PERFORMANCE
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-wider uppercase leading-tight">
                {heading}
              </h2>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
              {description}
            </p>

            <div className="pt-2">
              <Link
                to="/catalog"
                className="inline-flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-red-600 to-[#FF2E4D] hover:from-red-500 hover:to-[#FF4763] text-white font-extrabold text-xs uppercase tracking-widest rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(255,46,77,0.35)] hover:scale-105 active:scale-95 group cursor-pointer"
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

