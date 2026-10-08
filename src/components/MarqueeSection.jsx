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
    <div className="w-full bg-[#EAF7EE] border-y border-[#D8E8DD] py-3.5 overflow-hidden select-none relative z-20">
      <div className="animate-marquee flex items-center space-x-8 text-xs sm:text-sm font-heading font-black tracking-[0.25em] text-[#10231A] uppercase">
        {/* Repeat 4 times for infinite loop smoothness */}
        {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => (
          <span
            key={idx}
            className={item === '•' ? 'text-[#0B7A3B] font-extrabold text-base' : 'hover:text-[#0B7A3B] transition-colors cursor-default'}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

