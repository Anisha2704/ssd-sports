import React, { useState, useEffect, useRef } from 'react';
import { useHomepageFeature } from '../hooks/useHomepageFeature';

/**
 * StatsSection - Animated Statistics Section driven by Shopify Metaobject
 */
export default function StatsSection() {
  const { feature, loading } = useHomepageFeature();
  const [currentCount, setCurrentCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  const targetNumber = feature?.statNumber || 1000;
  const statLabel = feature?.statLabel || 'Happy Customers';
  const statDescription = feature?.statDescription || 'Explore more. Play better.';

  useEffect(() => {
    if (hasAnimated || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          let startTime = null;
          const duration = 2000; // 2 seconds animation

          const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            
            // Ease out quad formula for smooth decelerating count
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const value = Math.floor(easedProgress * targetNumber);

            setCurrentCount(value);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCurrentCount(targetNumber);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.2 }
    );

    const currentElem = sectionRef.current;
    if (currentElem) {
      observer.observe(currentElem);
    }

    return () => {
      if (currentElem) {
        observer.unobserve(currentElem);
      }
    };
  }, [hasAnimated, loading, targetNumber]);

  if (loading) {
    return (
      <section className="w-full bg-slate-50 py-16 sm:py-24 border-t border-slate-100 flex items-center justify-center">
        <div className="space-y-4 text-center animate-pulse">
          <div className="w-48 h-14 bg-slate-200 rounded-2xl mx-auto"></div>
          <div className="w-36 h-6 bg-slate-200 rounded-lg mx-auto"></div>
          <div className="w-56 h-4 bg-slate-200 rounded-lg mx-auto"></div>
        </div>
      </section>
    );
  }

  const formattedCount = currentCount.toLocaleString();

  return (
    <section ref={sectionRef} className="w-full bg-slate-50 py-16 sm:py-24 border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-3 sm:space-y-4">
        
        {/* Large Animated Statistic */}
        <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-slate-950 tracking-tight font-sans">
          {formattedCount}+
        </div>

        {/* Stat Label */}
        <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-wide uppercase">
          {statLabel}
        </h3>

        {/* Stat Subtitle / Description */}
        <p className="text-sm sm:text-base text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
          {statDescription}
        </p>

      </div>
    </section>
  );
}
