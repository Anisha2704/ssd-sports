import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Crosshair, Award, ArrowUpRight } from 'lucide-react';
import macroGrainImg from '../../assets/english_willow_macro_grain.jpg';

gsap.registerPlugin(ScrollTrigger);

const CRAFT_ZONES = [
  {
    key: 'sweetspot',
    title: 'THE SWEET SPOT',
    subtitle: 'Kinetic Energy Core',
    body: 'Individually pressed to 180 PSI to compress willow fibers for maximum trampolining rebound.',
    stat: '180 PSI',
    statLabel: 'COMPRESSION',
    scale: 2.4,
    originX: '52%',
    originY: '58%',
  },
  {
    key: 'edge',
    title: 'THE 40MM EDGE',
    subtitle: 'Boundary Clearance',
    body: 'Maximum profile allowance under MCC laws, preventing blade twist on off-center thunderbolts.',
    stat: '40 MM',
    statLabel: 'CONTOUR',
    scale: 2.8,
    originX: '20%',
    originY: '62%',
  },
  {
    key: 'spine',
    title: 'THE SPINE',
    subtitle: 'Structural Spine Peak',
    body: 'Aerodynamic spine channels impact energy straight through the toe, eliminating blade shudder.',
    stat: '67 MM',
    statLabel: 'PEAK HEIGHT',
    scale: 2.5,
    originX: '50%',
    originY: '38%',
  },
  {
    key: 'balance',
    title: 'THE PICKUP',
    subtitle: 'Dynamic Balance Ratio',
    body: 'Triple-spring Singapore cane handle counterbalances the blade for instantaneous shot execution.',
    stat: '1180 G',
    statLabel: 'WEIGHT RATIO',
    scale: 1.7,
    originX: '50%',
    originY: '18%',
  },
];

export default function BatStorySection() {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const cameraTargetRef = useRef(null);
  const [activeZoneIndex, setActiveZoneIndex] = useState(0);
  const [prefersReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  useEffect(() => {
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    const stage = stageRef.current;
    if (!container || !stage) return;

    const ctx = gsap.context(() => {
      // Pinned inspection timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          pin: stage,
          anticipatePin: 1,
          onUpdate: (self) => {
            const idx = Math.min(
              CRAFT_ZONES.length - 1,
              Math.floor(self.progress * CRAFT_ZONES.length)
            );
            setActiveZoneIndex(idx);
          },
        },
      });

      // Macro camera movement sequence across the 4 zones
      // Zone 1: Sweet Spot (0 - 25%)
      tl.to(cameraTargetRef.current, {
        scale: 2.4,
        transformOrigin: '52% 58%',
        duration: 0.25,
        ease: 'power2.inOut',
      });

      // Zone 2: Edge (25 - 50%)
      tl.to(cameraTargetRef.current, {
        scale: 2.8,
        transformOrigin: '20% 62%',
        duration: 0.25,
        ease: 'power2.inOut',
      });

      // Zone 3: Spine (50 - 75%)
      tl.to(cameraTargetRef.current, {
        scale: 2.5,
        transformOrigin: '50% 38%',
        duration: 0.25,
        ease: 'power2.inOut',
      });

      // Zone 4: Pickup / Handle (75 - 100%)
      tl.to(cameraTargetRef.current, {
        scale: 1.7,
        transformOrigin: '50% 18%',
        duration: 0.25,
        ease: 'power2.inOut',
      });
    }, container);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const activeZone = CRAFT_ZONES[activeZoneIndex];

  return (
    <div
      ref={containerRef}
      id="act-craft"
      className={`relative w-full ${prefersReducedMotion ? 'min-h-screen py-24' : 'h-[320vh]'}`}
    >
      <div
        ref={stageRef}
        className="sticky top-0 w-full h-screen overflow-hidden bg-[#080808] text-white flex items-center justify-center select-none"
      >
        {/* Background Subtle HUD Grid */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* Ambient Raking Studio Lighting */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 right-10 w-[600px] h-[600px] bg-red-950/[0.08] rounded-full blur-[140px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[120px]" />
        </div>

        {/* Main Content Viewport */}
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-between py-16 sm:py-20 relative z-10">
          
          {/* Top Telemetry Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.1] text-neutral-400 text-[10px] font-mono tracking-[0.25em] uppercase">
                <Award className="w-3 h-3 text-red-500" />
                <span>ACT 03 — THE CRAFT</span>
              </div>
              <h2 className="font-['Syne',sans-serif] text-2xl sm:text-4xl font-extrabold tracking-tight uppercase text-white">
                THE CRAFT OF WILLOW.
              </h2>
            </div>

            {/* Live Camera Telemetry Readout */}
            <div className="flex items-center gap-6 font-mono text-[11px] text-neutral-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                <span className="text-white font-bold">OPTICAL MACRO SCAN</span>
              </div>
              <div className="hidden md:block">
                <span>GRADE: </span>
                <span className="text-white">LIMITED RESERVE</span>
              </div>
              <div>
                <span>INDEX: </span>
                <span className="text-red-500 font-bold">0{activeZoneIndex + 1} / 04</span>
              </div>
            </div>
          </div>

          {/* Center Stage: Macro Inspection Camera Pan & Interactive Data Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1 my-6 sm:my-8">
            
            {/* The Macro Camera Viewport (Col 1-8) */}
            <div className="lg:col-span-8 relative h-[45vh] sm:h-[55vh] lg:h-[60vh] rounded-3xl overflow-hidden border border-white/[0.12] bg-[#050505] shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
              
              {/* Macro Inspection Target (Pans and Zooms via GSAP) */}
              <div
                ref={cameraTargetRef}
                className="w-full h-full relative will-change-transform transform-gpu"
                style={{
                  transform: prefersReducedMotion
                    ? 'none'
                    : `scale(${activeZone.scale})`,
                  transformOrigin: `${activeZone.originX} ${activeZone.originY}`,
                  transition: prefersReducedMotion ? 'all 0.5s ease-out' : 'none',
                }}
              >
                <img
                  src={macroGrainImg}
                  alt="English Willow Macro Wood Grain Inspection"
                  className="w-full h-full object-cover filter contrast-125 brightness-95"
                />
                
                {/* Visual Raking Light Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-black/30 pointer-events-none" />
              </div>

              {/* Optical Inspection Crosshairs */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <Crosshair className="w-12 h-12 text-white/30 stroke-[1]" />
                <div className="absolute top-4 left-4 font-mono text-[9px] text-white/40 tracking-widest">
                  CAM_FOCAL_LENGTH: 105MM MACRO
                </div>
                <div className="absolute bottom-4 right-4 font-mono text-[9px] text-red-500/70 tracking-widest">
                  [SURFACE_PROFILE_ACTIVE]
                </div>
              </div>

              {/* Zone Navigation Pills on Bottom Left */}
              <div className="absolute bottom-4 left-4 z-20 flex gap-1.5">
                {CRAFT_ZONES.map((zone, idx) => (
                  <button
                    key={zone.key}
                    onClick={() => setActiveZoneIndex(idx)}
                    className={`px-3 py-1 rounded-full text-[10px] font-mono tracking-wider transition-all duration-300 ${
                      activeZoneIndex === idx
                        ? 'bg-red-600 text-white font-bold shadow-lg'
                        : 'bg-black/60 backdrop-blur-md text-neutral-400 hover:text-white border border-white/10'
                    }`}
                  >
                    0{idx + 1}
                  </button>
                ))}
              </div>

            </div>

            {/* Right Telemetry Information Panel (Col 9-12) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Dynamic Zone Readout Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/80 border border-white/[0.1] backdrop-blur-xl space-y-5 shadow-2xl relative overflow-hidden">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono tracking-[0.25em] text-red-500 uppercase font-semibold block">
                    {activeZone.subtitle}
                  </span>
                  <h3 className="font-['Syne',sans-serif] text-2xl sm:text-3xl font-black text-white tracking-wide uppercase">
                    {activeZone.title}
                  </h3>
                </div>

                <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed font-normal">
                  {activeZone.body}
                </p>

                {/* Key Spec Highlight */}
                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                  <div>
                    <span className="text-3xl sm:text-4xl font-black font-mono text-white block">
                      {activeZone.stat}
                    </span>
                    <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
                      {activeZone.statLabel}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-neutral-400">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Material Certification Tag */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-neutral-400">
                <span>HAND-SELECTED SALIX ALBA</span>
                <span className="text-neutral-200">100% UNBLEACHED</span>
              </div>

            </div>

          </div>

          {/* Bottom Step Indicator Bar */}
          <div className="border-t border-white/[0.08] pt-4 flex items-center justify-between text-neutral-500 text-[10px] font-mono">
            <span className="uppercase tracking-widest">CONTINUE SCROLL FOR THE SEAM</span>
            <div className="flex gap-2">
              {CRAFT_ZONES.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    activeZoneIndex === idx ? 'w-8 bg-red-600' : 'w-2 bg-neutral-800'
                  }`}
                />
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
