import React from 'react';

export default function MarqueeSection() {
  const marqueeItems = [
    'BUILT FOR PERFORMANCE',
    '•',
    'PLAY WITH CONFIDENCE',
    '•',
    'ENGINEERED TO PERFORM',
    '•',
    'SSD SPORTS',
    '•',
    'HANDCRAFTED ENGLISH WILLOW',
    '•',
    'PRO MATCH GRADE',
    '•',
  ];

  return (
    <div className="w-full bg-[#0D131F] border-y border-white/10 py-3.5 overflow-hidden select-none relative z-20">
      <div className="animate-marquee flex items-center space-x-8 text-xs sm:text-sm font-heading font-black tracking-[0.25em] text-slate-300 uppercase">
        {/* Repeat 4 times for infinite loop smoothness */}
        {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => (
          <span
            key={idx}
            className={item === '•' ? 'text-[#FF2E4D] font-extrabold text-base' : 'hover:text-[#FF2E4D] transition-colors cursor-default'}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
