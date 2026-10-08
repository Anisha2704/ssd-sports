import React, { useState, useEffect, useRef } from 'react';
import { useHomepageFeature } from '../hooks/useHomepageFeature';
import ThreeDTiltCard from './ThreeDTiltCard';

export default function StatsSection() {
  const { feature, loading } = useHomepageFeature();
  const [currentCount, setCurrentCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  const targetNumber = feature?.statNumber || 1000;
  const statLabel = feature?.statLabel || 'Happy Customers';
  const statDescription = feature?.statDescription || 'Worldwide cricketers playing with SSD Sports equipment.';

  useEffect(() => {
    if (hasAnimated || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          let startTime = null;
          const duration = 2200;

          const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
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
    if (currentElem) observer.observe(currentElem);

    return () => {
      if (currentElem) observer.unobserve(currentElem);
    };
  }, [hasAnimated, loading, targetNumber]);

  const formattedCount = currentCount.toLocaleString();

  return (
    <section ref={sectionRef} className="w-full bg-gradient-to-b from-[#EAF7EE] via-white to-[#F5FAF6] py-16 sm:py-24 border-b border-[#D8E8DD] text-[#10231A] relative overflow-hidden cricket-grass-pattern">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(32,169,87,0.1)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-64 h-64 border-2 border-[#0B7A3B]/10 rounded-full pointer-events-none" />
      <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-64 h-64 border-2 border-[#0B7A3B]/10 rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          
          {/* Main Stat: 1,000+ Happy Customers */}
          <ThreeDTiltCard>
            <div className="bg-white border border-[#D8E8DD] p-8 rounded-2xl space-y-2 h-full flex flex-col justify-center shadow-md hover:shadow-xl hover:border-[#0B7A3B]/40 transition-all duration-300">
              <div className="font-heading text-5xl sm:text-6xl lg:text-7xl font-black text-[#10231A] tracking-tight">
                <span className="text-[#0B7A3B]">{formattedCount}</span>+
              </div>
              <h3 className="text-base sm:text-lg font-black text-[#10231A] tracking-widest uppercase font-heading">
                {statLabel}
              </h3>
              <p className="text-xs text-[#52645A] font-medium leading-relaxed">
                {statDescription}
              </p>
            </div>
          </ThreeDTiltCard>

          {/* Secondary Match Grade Stat */}
          <ThreeDTiltCard>
            <div className="bg-white border border-[#D8E8DD] p-8 rounded-2xl space-y-2 h-full flex flex-col justify-center shadow-md hover:shadow-xl hover:border-[#0B7A3B]/40 transition-all duration-300">
              <div className="font-heading text-5xl sm:text-6xl lg:text-7xl font-black text-[#10231A] tracking-tight">
                <span className="text-[#0B7A3B]">100</span>%
              </div>
              <h3 className="text-base sm:text-lg font-black text-[#0B7A3B] tracking-widest uppercase font-heading">
                MATCH GRADE WILLOW
              </h3>
              <p className="text-xs text-[#52645A] font-medium leading-relaxed">
                Hand-selected English & Kashmir willow clefts tested for balance & durability.
              </p>
            </div>
          </ThreeDTiltCard>

          {/* Third Dispatch Stat */}
          <ThreeDTiltCard>
            <div className="bg-white border border-[#D8E8DD] p-8 rounded-2xl space-y-2 h-full flex flex-col justify-center shadow-md hover:shadow-xl hover:border-[#0B7A3B]/40 transition-all duration-300">
              <div className="font-heading text-5xl sm:text-6xl lg:text-7xl font-black text-[#10231A] tracking-tight">
                <span className="text-[#0B7A3B]">24</span>/7
              </div>
              <h3 className="text-base sm:text-lg font-black text-[#10231A] tracking-widest uppercase font-heading">
                PAN-INDIA EXPRESS DELIVERY
              </h3>
              <p className="text-xs text-[#52645A] font-medium leading-relaxed">
                Fast dispatch with full order tracking across India & international destinations.
              </p>
            </div>
          </ThreeDTiltCard>

        </div>
      </div>
    </section>
  );
}
