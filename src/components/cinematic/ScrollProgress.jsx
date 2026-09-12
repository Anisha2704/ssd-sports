import React, { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-3 pointer-events-none select-none">
      <span className="text-[9px] font-mono tracking-widest text-neutral-500 transform -rotate-90 origin-center mb-2">
        {Math.round(progress)}%
      </span>
      <div className="w-[1.5px] h-24 bg-white/[0.08] rounded-full overflow-hidden relative">
        <div
          className="w-full bg-gradient-to-b from-red-500 to-red-600 rounded-full transition-all duration-150 ease-out"
          style={{ height: `${progress}%` }}
        />
      </div>
      <span className="text-[8px] font-mono tracking-widest text-neutral-600 uppercase transform -rotate-90 origin-center mt-2">
        SCROLL
      </span>
    </div>
  );
}
