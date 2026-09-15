import React, { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [hoverText, setHoverText] = useState('');
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Enable only for desktop fine-pointer devices
    if (window.matchMedia('(pointer: fine)').matches) {
      setIsDesktop(true);
    }

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, [role="button"], .group');
      if (target) {
        setIsHovered(true);
        if (target.closest('#best-sellers') || target.closest('[to*="/products"]')) {
          setHoverText('VIEW');
        } else {
          setHoverText('');
        }
      } else {
        setIsHovered(false);
        setHoverText('');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (!isDesktop) return null;

  return (
    <div
      className="fixed pointer-events-none z-50 transition-transform duration-75 ease-out -translate-x-1/2 -translate-y-1/2 hidden md:block"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {/* Outer Glowing Crimson Ring */}
      <div
        className={`rounded-full border border-[#FF2E4D] transition-all duration-300 flex items-center justify-center ${
          isHovered
            ? 'w-12 h-12 bg-[#FF2E4D]/20 backdrop-blur-xs scale-110 shadow-[0_0_20px_rgba(255,46,77,0.6)]'
            : 'w-8 h-8 bg-transparent shadow-[0_0_10px_rgba(255,46,77,0.3)]'
        }`}
      >
        {hoverText && (
          <span className="text-[9px] font-mono font-extrabold text-white tracking-widest uppercase animate-fadeIn">
            {hoverText}
          </span>
        )}
      </div>

      {/* Inner Precision Dot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full" />
    </div>
  );
}
