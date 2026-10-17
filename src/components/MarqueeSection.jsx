import React from 'react';
import { useHomepageHero } from '../hooks/useHomepageHero';

export default function MarqueeSection({ items: propItems, textSlider: propTextSlider, isList: propIsList }) {
  const { hero, loading, error } = useHomepageHero();

  // If loading or error, handle gracefully without breaking the homepage or showing old hardcoded phrases
  if (loading || error) {
    return null;
  }

  // Resolve items from props or hero metaobject
  const rawItems = propItems || propTextSlider || hero?.textSlider;

  // If Text Slider field is empty or unavailable, do NOT show the old hardcoded phrases
  if (!rawItems || !Array.isArray(rawItems) || rawItems.length === 0) {
    return null;
  }

  const isList = propIsList !== undefined ? propIsList : (hero?.isTextSliderList ?? (rawItems.length > 1));

  // Build one full cycle of the marquee content
  // If list: render with separator styling ('•')
  // If single value: display that value directly without splitting arbitrarily
  const cycle = [];
  if (isList && rawItems.length > 1) {
    rawItems.forEach((text) => {
      cycle.push({ type: 'text', content: text });
      cycle.push({ type: 'separator', content: '•' });
    });
  } else {
    cycle.push({ type: 'text', content: rawItems[0] });
  }

  // Ensure enough repetitions to fill screen width and loop seamlessly (translateX(-50%))
  const minItems = 24;
  const repeatCount = Math.max(4, Math.ceil(minItems / Math.max(cycle.length, 1)));
  const marqueeElements = Array.from({ length: repeatCount }).flatMap(() => cycle);

  return (
    <div className="w-full bg-[#EAF7EE] border-y border-[#D8E8DD] py-3.5 overflow-hidden select-none relative z-20">
      <div className="animate-marquee flex items-center space-x-8 text-xs sm:text-sm font-heading font-black tracking-[0.25em] text-[#10231A] uppercase">
        {marqueeElements.map((el, idx) => (
          <span
            key={idx}
            className={
              el.type === 'separator'
                ? 'text-[#0B7A3B] font-extrabold text-base'
                : 'hover:text-[#0B7A3B] transition-colors cursor-default whitespace-nowrap'
            }
          >
            {el.content}
          </span>
        ))}
      </div>
    </div>
  );
}


