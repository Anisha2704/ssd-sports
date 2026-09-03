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
      <section className="w-full bg-white py-16 sm:py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="w-full aspect-[4/3] bg-slate-100 rounded-3xl animate-pulse" />
          <div className="space-y-4 animate-pulse">
            <div className="w-3/4 h-10 bg-slate-200 rounded-xl" />
            <div className="w-full h-24 bg-slate-100 rounded-xl" />
            <div className="w-40 h-12 bg-slate-200 rounded-full" />
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
    <section className="w-full bg-white py-16 sm:py-24 border-t border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Column 1: Large Premium Video Presentation */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-xl bg-slate-950 border border-slate-200/80 group">
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
                <span className="text-2xl font-black tracking-widest uppercase text-slate-400">
                  SSD SPORTS PERFORMANCE
                </span>
              </div>
            )}
            
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Column 2: Heading, Description & Dynamic CTA Button */}
          <div className="space-y-6 lg:pl-4">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-widest font-extrabold text-red-600">
                Craftsmanship &amp; Quality
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-tight">
                {heading}
              </h2>
            </div>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
              {description}
            </p>

            <div className="pt-2">
              <Link
                to="/catalog"
                className="inline-flex items-center gap-3 px-8 py-3.5 bg-slate-950 text-white font-bold text-sm rounded-full transition-all duration-300 shadow-md hover:shadow-xl group cursor-pointer"
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
