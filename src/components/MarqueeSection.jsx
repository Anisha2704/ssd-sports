import React from 'react';
import { useHomepageHero } from '../hooks/useHomepageHero';

const DEFAULT_MARQUEE_ITEMS = [
  'BUILT FOR PERFORMANCE',
  'PLAY WITH CONFIDENCE',
  'ENGINEERED TO PERFORM',
  'SSD SPORTS',
  'HANDCRAFTED ENGLISH WILLOW',
  'PRO MATCH GRADE',
];

export default function MarqueeSection({ items: propItems, textSlider: propTextSlider, isList: propIsList }) {
  const { hero, loading } = useHomepageHero();

  // Resolve items from props or hero metaobject or fallback
  const resolvedFromShopify = propItems || propTextSlider || hero?.textSlider;
  const hasShopifyItems = Array.isArray(resolvedFromShopify) && resolvedFromShopify.length > 0;

  // If loading and no props provided yet, show subtle placeholder
  if (loading && !propItems && !propTextSlider && !hero) {
    return (
      <div className="w-full bg-[#EAF7EE] border-t border-[#D8E8DD] py-2.5 sm:py-3 h-10 sm:h-11 animate-pulse" />
    );
  }

  const rawItems = hasShopifyItems ? resolvedFromShopify : DEFAULT_MARQUEE_ITEMS;
  const isList = propIsList !== undefined
    ? propIsList
    : (hasShopifyItems ? (hero?.isTextSliderList ?? (rawItems.length > 1)) : true);

  // Build one full repeating cycle of items
  const cycle = [];
  if (isList && rawItems.length > 1) {
    rawItems.forEach((text) => {
      cycle.push({ type: 'text', content: text });
      cycle.push({ type: 'separator', content: '•' });
    });
  } else {
    cycle.push({ type: 'text', content: rawItems[0] || 'SSD SPORTS' });
    cycle.push({ type: 'separator', content: '•' });
  }

  // To guarantee a 100% seamless infinite marquee loop with CSS translateX(-50%),
  // we build two identical halves: blockA and blockB.
  // blockA must be wide enough to fill screens up to 2560px ultrawide (at least ~16 elements).
  const minItemsPerBlock = 16;
  const repeatCount = Math.max(2, Math.ceil(minItemsPerBlock / Math.max(cycle.length, 1)));
  const blockA = Array.from({ length: repeatCount }).flatMap(() => cycle);
  const blockB = blockA; // Exact clone for seamless transition

  return (
    <div
      className="w-full bg-[#EAF7EE] border-t border-[#D8E8DD] py-2.5 sm:py-3 overflow-hidden select-none relative z-20"
      role="region"
      aria-label="Highlights and Offers Marquee"
    >
      {/* Left gradient fade for smooth edge entry/exit */}
      <div
        className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#EAF7EE] to-transparent z-10"
        aria-hidden="true"
      />

      {/* Scrolling Track: Block A + Block B = translateX(-50%) seamless loop */}
      <div className="animate-marquee flex items-center space-x-6 sm:space-x-8 text-[11px] sm:text-xs md:text-sm font-heading font-black tracking-[0.2em] text-[#10231A] uppercase will-change-transform">
        {/* Primary Block (Visible to screen readers) */}
        <div className="flex items-center space-x-6 sm:space-x-8 shrink-0">
          {blockA.map((el, idx) => (
            <span
              key={`a-${idx}`}
              className={
                el.type === 'separator'
                  ? 'text-[#0B7A3B] font-extrabold text-sm sm:text-base select-none px-1'
                  : 'hover:text-[#0B7A3B] transition-colors cursor-default whitespace-nowrap'
              }
              aria-hidden={el.type === 'separator' ? 'true' : undefined}
            >
              {el.content}
            </span>
          ))}
        </div>

        {/* Cloned Duplicate Block (Hidden from screen readers to prevent duplicate announcements) */}
        <div className="flex items-center space-x-6 sm:space-x-8 shrink-0" aria-hidden="true">
          {blockB.map((el, idx) => (
            <span
              key={`b-${idx}`}
              className={
                el.type === 'separator'
                  ? 'text-[#0B7A3B] font-extrabold text-sm sm:text-base select-none px-1'
                  : 'hover:text-[#0B7A3B] transition-colors cursor-default whitespace-nowrap'
              }
            >
              {el.content}
            </span>
          ))}
        </div>
      </div>

      {/* Right gradient fade for smooth edge entry/exit */}
      <div
        className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#EAF7EE] to-transparent z-10"
        aria-hidden="true"
      />
    </div>
  );
}
