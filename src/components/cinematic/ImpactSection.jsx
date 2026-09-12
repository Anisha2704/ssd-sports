import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Crosshair, Zap, Shield, Compass, Sparkles } from 'lucide-react';
import impactImg from '../../assets/cricket_bat_ball_impact.jpg';

gsap.registerPlugin(ScrollTrigger);

const HOTSPOTS = [
  {
    id: 'sweetspot',
    title: 'THE SWEET SPOT',
    subtitle: 'Kinetic Rebound Zone',
    description: 'Enlarged low-to-mid swell engineered for maximum energy restitution on off-center strikes. Every joule transferred directly to the boundary.',
    metric: '98.4%',
    metricLabel: 'ENERGY TRANSFER',
    x: 52, // % from left
    y: 44, // % from top
    icon: Zap,
  },
  {
    id: 'edge',
    title: '40MM POWER EDGES',
    subtitle: 'Aggressive Stroke Profile',
    description: 'Massive, unyielding edge contours distribute mass evenly along the hitting surface, preventing blade twisting against 145 km/h deliveries.',
    metric: '40mm',
    metricLabel: 'EDGE THICKNESS',
    x: 28,
    y: 58,
    icon: Shield,
  },
  {
    id: 'spine',
    title: 'DYNAMIC SPINE',
    subtitle: 'Structural Core Integrity',
    description: 'Full-length spine curvature reinforces the blade against bowing stress while maintaining lightweight pick-up balance for instant stroke reaction.',
    metric: '65mm',
    metricLabel: 'SPINE PEAK',
    x: 44,
    y: 26,
    icon: Compass,
  },
  {
    id: 'balance',
    title: 'ENGINEERED BALANCE',
    subtitle: 'Featherlight Pick-Up Index',
    description: 'Center of mass calibrated precisely 310mm from the toe to create a pickup sensation 50 grams lighter than deadweight scale readings.',
    metric: '310mm',
    metricLabel: 'BALANCE POINT',
    x: 24,
    y: 82,
    icon: Crosshair,
  },
];

export default function ImpactSection() {
  const sectionRef = useRef(null);
  const flashRef = useRef(null);
  const shockwaveRef = useRef(null);
  const imageContainerRef = useRef(null);
  const contentRef = useRef(null);
  const [activeHotspot, setActiveHotspot] = useState(HOTSPOTS[0]);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Timeline triggers impact sequence on enter
      ScrollTrigger.create({
        trigger: section,
        start: 'top 65%',
        once: true,
        onEnter: () => {
          const impactTl = gsap.timeline();

          // 1. White-hot/Crimson Flash
          impactTl.fromTo(
            flashRef.current,
            { opacity: 0.95 },
            { opacity: 0, duration: 0.45, ease: 'power3.out' }
          );

          // 2. Shockwave Expansion
          impactTl.fromTo(
            shockwaveRef.current,
            { scale: 0.2, opacity: 1 },
            { scale: 2.2, opacity: 0, duration: 0.75, ease: 'expo.out' },
            0
          );

          // 3. Camera Shake on Image Container
          impactTl.to(
            imageContainerRef.current,
            {
              x: () => (Math.random() - 0.5) * 16,
              y: () => (Math.random() - 0.5) * 16,
              duration: 0.05,
              repeat: 5,
              yoyo: true,
              ease: 'none',
              onComplete: () => {
                gsap.set(imageContainerRef.current, { x: 0, y: 0 });
              },
            },
            0.05
          );

          // 4. Headline and content settle into place
          impactTl.fromTo(
            contentRef.current,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
            0.3
          );
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="act-impact"
      className="relative w-full bg-[#050505] text-white py-24 sm:py-32 lg:py-40 overflow-hidden border-t border-white/[0.06]"
    >
      {/* Visual Impact Flash Overlay */}
      <div
        ref={flashRef}
        className="pointer-events-none fixed inset-0 z-50 bg-gradient-to-r from-white via-red-500/80 to-white opacity-0 transition-opacity"
      />

      {/* Shockwave Ring Distortion */}
      <div
        ref={shockwaveRef}
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-red-500/60 shadow-[0_0_80px_rgba(220,38,38,0.5)] opacity-0 z-20"
      />

      {/* Atmospheric Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-red-950/[0.12] rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-white/[0.02] rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16 lg:mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/10 border border-red-600/20 text-red-500 text-[10px] sm:text-xs font-mono tracking-[0.25em] uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ACT 02 — THE IMPACT</span>
          </div>

          <h2 className="font-['Syne',sans-serif] text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase leading-[0.95]">
            CRAFTED <br />
            <span className="bg-gradient-to-r from-white via-neutral-200 to-red-600 bg-clip-text text-transparent">
              FOR IMPACT.
            </span>
          </h2>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-neutral-400 font-mono text-xs sm:text-sm tracking-wider">
            <span>EVERY EDGE.</span>
            <span className="hidden sm:inline text-neutral-700">•</span>
            <span>EVERY CURVE.</span>
            <span className="hidden sm:inline text-neutral-700">•</span>
            <span>EVERY GRAM.</span>
          </div>

          <p className="text-neutral-400 text-sm sm:text-base max-w-xl font-normal leading-relaxed pt-2">
            Designed around the millisecond that defines the match. When leather meets English willow at full throttle, there is zero tolerance for energy loss.
          </p>
        </div>

        {/* The Macro Impact Visual & Hotspot Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Main Visual with Hotspot Pins (Col 1-7) */}
          <div
            ref={imageContainerRef}
            className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-950 border border-white/[0.1] shadow-[0_20px_60px_rgba(0,0,0,0.9)] group"
          >
            {/* Impact Close-up Photography */}
            <img
              src={impactImg}
              alt="Cricket Ball colliding with English Willow Bat at high speed"
              className="w-full h-full object-cover object-center filter brightness-95 contrast-110 transition-transform duration-700 group-hover:scale-105 will-change-transform"
            />

            {/* Dark Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Interactive Hotspot Targets */}
            {HOTSPOTS.map((spot) => {
              const isSelected = activeHotspot.id === spot.id;
              return (
                <button
                  key={spot.id}
                  onClick={() => setActiveHotspot(spot)}
                  style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group/pin p-2 cursor-pointer focus:outline-none"
                  aria-label={`Inspect ${spot.title}`}
                >
                  {/* Ping Animation Ring */}
                  <span
                    className={`absolute inset-0 rounded-full bg-red-500 transition-opacity ${
                      isSelected ? 'animate-ping opacity-60' : 'opacity-20 group-hover/pin:opacity-50'
                    }`}
                  />
                  {/* Outer Ring */}
                  <span
                    className={`relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border transition-all duration-300 ${
                      isSelected
                        ? 'bg-red-600 border-white text-white shadow-[0_0_20px_rgba(220,38,38,0.9)] scale-110'
                        : 'bg-black/80 backdrop-blur-md border-white/40 text-neutral-300 hover:border-white hover:text-white'
                    }`}
                  >
                    <spot.icon className="w-3.5 h-3.5 stroke-[2.2]" />
                  </span>
                  {/* Floating Pill Label */}
                  <span
                    className={`hidden sm:block absolute left-full ml-2.5 top-1/2 -translate-y-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase whitespace-nowrap backdrop-blur-md transition-all ${
                      isSelected
                        ? 'bg-red-600/90 text-white border border-red-500 font-bold'
                        : 'bg-black/70 text-neutral-400 border border-white/10 opacity-0 group-hover/pin:opacity-100'
                    }`}
                  >
                    {spot.title}
                  </span>
                </button>
              );
            })}

            {/* Micro Watermark */}
            <div className="absolute bottom-3 left-4 text-[9px] font-mono tracking-widest text-neutral-500 uppercase pointer-events-none">
              FIG. 02 // IMPACT BALLISTICS ANALYSIS
            </div>
          </div>

          {/* Active Hotspot Engineering Telemetry Card (Col 8-12) */}
          <div ref={contentRef} className="lg:col-span-5 space-y-6">
            
            {/* Hotspot Selector Tabs */}
            <div className="flex flex-wrap gap-2">
              {HOTSPOTS.map((spot) => (
                <button
                  key={spot.id}
                  onClick={() => setActiveHotspot(spot)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                    activeHotspot.id === spot.id
                      ? 'bg-white text-black font-bold shadow-md'
                      : 'bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                  }`}
                >
                  {spot.title}
                </button>
              ))}
            </div>

            {/* Detailed Feature Card */}
            <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-neutral-900/60 border border-white/[0.1] backdrop-blur-xl relative overflow-hidden shadow-2xl">
              {/* Subtle top red glow */}
              <div className="absolute -top-12 left-0 right-0 h-24 bg-red-600/10 blur-xl pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                  <div>
                    <span className="text-[10px] font-mono tracking-[0.2em] text-red-500 uppercase font-semibold">
                      {activeHotspot.subtitle}
                    </span>
                    <h3 className="font-['Syne',sans-serif] text-xl sm:text-2xl font-extrabold text-white tracking-wide">
                      {activeHotspot.title}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-white block">
                      {activeHotspot.metric}
                    </span>
                    <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
                      {activeHotspot.metricLabel}
                    </span>
                  </div>
                </div>

                <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
                  {activeHotspot.description}
                </p>

                <div className="pt-2 flex items-center justify-between text-neutral-500 text-[10px] font-mono">
                  <span>SPEC GRADE: TEST MATCH 01</span>
                  <span className="text-emerald-500 font-bold">● VERIFIED TUNED</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
