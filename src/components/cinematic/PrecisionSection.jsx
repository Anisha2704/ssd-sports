import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Cpu, Layers, Gauge } from 'lucide-react';
import batHeroImg from '../../assets/cinematic_bat_hero.jpg';

gsap.registerPlugin(ScrollTrigger);

export default function PrecisionSection() {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const gridRef = useRef(null);
  const batContainerRef = useRef(null);
  const batImgRef = useRef(null);
  const scanBeamRef = useRef(null);
  const svgOverlayRef = useRef(null);
  const telemetryLeftRef = useRef(null);
  const numbersGroupRef = useRef(null);
  const stat1Ref = useRef(null);
  const stat2Ref = useRef(null);
  const stat3Ref = useRef(null);
  const resolutionGroupRef = useRef(null);
  const calibrationBadgeRef = useRef(null);

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
      // 320vh Master Pinned Stage Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
          pin: stage,
          anticipatePin: 1,
        },
      });

      // Initial State: Void darkness, faint silhouette, dormant telemetry
      gsap.set(gridRef.current, { opacity: 0 });
      gsap.set(calibrationBadgeRef.current, { opacity: 0, y: -20 });
      gsap.set(batImgRef.current, {
        opacity: 0.15,
        filter: 'brightness(0.2) contrast(1.5) grayscale(100%)',
        scale: 0.9,
        rotationY: -12,
      });
      gsap.set(scanBeamRef.current, { yPercent: -120, opacity: 0 });
      gsap.set(svgOverlayRef.current, { opacity: 0 });
      gsap.set(telemetryLeftRef.current, { opacity: 0, x: -30 });
      gsap.set([stat1Ref.current, stat2Ref.current, stat3Ref.current], {
        opacity: 0,
        x: 40,
        scale: 0.95,
      });
      gsap.set(resolutionGroupRef.current, { opacity: 0, y: 50 });

      // -------------------------------------------------------------------
      // 00–20%: Calibration
      // Technical grid fades in, calibration headers activate, silhouette outlines
      // -------------------------------------------------------------------
      tl.to(
        gridRef.current,
        { opacity: 0.8, duration: 0.2, ease: 'power1.inOut' },
        0
      );

      tl.to(
        calibrationBadgeRef.current,
        { opacity: 1, y: 0, duration: 0.15, ease: 'power2.out' },
        0.05
      );

      tl.to(
        batImgRef.current,
        {
          opacity: 0.5,
          scale: 0.95,
          filter: 'brightness(0.5) contrast(1.4) grayscale(80%) drop-shadow(0 0 20px rgba(220,38,38,0.2))',
          duration: 0.2,
          ease: 'power2.out',
        },
        0.05
      );

      // -------------------------------------------------------------------
      // 20–40%: Geometry & LiDAR Scanning Beam
      // Laser scan passes down the blade; technical measurement callouts appear
      // -------------------------------------------------------------------
      tl.to(
        scanBeamRef.current,
        {
          yPercent: 120,
          opacity: 1,
          duration: 0.25,
          ease: 'power1.inOut',
        },
        0.18
      );

      tl.to(
        svgOverlayRef.current,
        { opacity: 1, duration: 0.15, ease: 'power2.out' },
        0.22
      );

      tl.to(
        telemetryLeftRef.current,
        { opacity: 1, x: 0, duration: 0.18, ease: 'power2.out' },
        0.25
      );

      tl.to(
        batImgRef.current,
        {
          rotationY: 0,
          filter: 'brightness(0.85) contrast(1.3) grayscale(20%) drop-shadow(0 0 35px rgba(220,38,38,0.3))',
          scale: 1.0,
          duration: 0.2,
          ease: 'power1.out',
        },
        0.2
      );

      // -------------------------------------------------------------------
      // 40–60%: Material Intelligence
      // Micro-telemetry readouts stabilize; bat color & wood fidelity emerge
      // -------------------------------------------------------------------
      tl.to(
        batImgRef.current,
        {
          opacity: 1,
          filter: 'brightness(1.05) contrast(1.2) grayscale(0%) drop-shadow(0 15px 45px rgba(0,0,0,0.9))',
          scale: 1.05,
          duration: 0.2,
          ease: 'power2.out',
        },
        0.4
      );

      // -------------------------------------------------------------------
      // 60–80%: The Numbers
      // Staggered monumental engineering telemetry cards
      // -------------------------------------------------------------------
      tl.to(
        stat1Ref.current, // 310 MM BALANCE POINT
        { opacity: 1, x: 0, scale: 1, duration: 0.08, ease: 'power3.out' },
        0.58
      );

      tl.to(
        stat2Ref.current, // 67 MM SPINE HEIGHT
        { opacity: 1, x: 0, scale: 1, duration: 0.08, ease: 'power3.out' },
        0.65
      );

      tl.to(
        stat3Ref.current, // 40 MM POWER EDGE
        { opacity: 1, x: 0, scale: 1, duration: 0.08, ease: 'power3.out' },
        0.72
      );

      // -------------------------------------------------------------------
      // 80–100%: Precision → Performance
      // Technical overlays dissolve; final statement & CTA emerge
      // -------------------------------------------------------------------
      tl.to(
        [svgOverlayRef.current, scanBeamRef.current, telemetryLeftRef.current, numbersGroupRef.current],
        { opacity: 0, duration: 0.12, ease: 'power1.in' },
        0.82
      );

      tl.to(
        batImgRef.current,
        {
          scale: 0.98,
          filter: 'brightness(1) contrast(1.15) grayscale(0%)',
          duration: 0.15,
          ease: 'power2.out',
        },
        0.85
      );

      tl.to(
        resolutionGroupRef.current,
        { opacity: 1, y: 0, duration: 0.15, ease: 'expo.out' },
        0.86
      );
    }, container);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      id="act-precision"
      className={`relative w-full ${prefersReducedMotion ? 'min-h-screen py-24' : 'h-[320vh]'}`}
    >
      {/* Pinned Fullscreen Engineering Chamber Stage */}
      <div
        ref={stageRef}
        className="sticky top-0 w-full h-screen overflow-hidden bg-[#050505] text-white flex items-center justify-center select-none"
      >
        {/* Precision HUD Grid System */}
        <div
          ref={gridRef}
          className="absolute inset-0 pointer-events-none z-0 transition-opacity"
        >
          {/* 40px Coordinate Matrix */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
          
          {/* Axis Crosshairs & Coordinates */}
          <div className="absolute top-24 left-8 font-mono text-[9px] tracking-widest text-neutral-600 uppercase hidden sm:block">
            GRID_REF: 43.19°N // CALIBRATION_STAGE_04
          </div>
          <div className="absolute top-24 right-8 font-mono text-[9px] tracking-widest text-neutral-600 uppercase hidden sm:block">
            TOLERANCE: ±0.25MM // MCC LAW 5 COMPLIANT
          </div>
          <div className="absolute bottom-10 left-8 font-mono text-[9px] tracking-widest text-neutral-600 uppercase hidden sm:block">
            SPECTRAL_BAND: 780NM LASER METROLOGY
          </div>

          {/* Radial Studio Backlight */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-red-950/[0.06] rounded-full blur-[160px]" />
        </div>

        {/* Top Header & Telemetry Badge */}
        <div
          ref={calibrationBadgeRef}
          className="absolute top-20 sm:top-24 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.1] backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
            <span className="text-[10px] font-mono tracking-[0.25em] text-neutral-300 uppercase">
              ACT 04 — THE PRECISION
            </span>
          </div>
          <h2 className="font-['Syne',sans-serif] text-xs sm:text-sm font-extrabold tracking-[0.3em] uppercase text-neutral-400">
            METROLOGY &amp; SPECIFICATION
          </h2>
        </div>

        {/* Central Inspection Subject: The Bat with Scanning & Measurement Layers */}
        <div
          ref={batContainerRef}
          className="relative w-full max-w-[420px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[680px] h-[68vh] sm:h-[75vh] flex items-center justify-center z-20"
        >
          {/* The Cricket Bat Asset */}
          <img
            ref={batImgRef}
            src={batHeroImg}
            alt="SSD Sports Precision Cricket Bat Engineering"
            className="w-full h-full object-contain filter transition-all duration-300 transform-gpu will-change-transform"
          />

          {/* Precision Laser Scan Beam */}
          <div
            ref={scanBeamRef}
            className="absolute inset-x-0 h-16 pointer-events-none z-30 flex items-center justify-center"
          >
            <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_15px_#dc2626]" />
            <div className="absolute w-full h-12 bg-gradient-to-b from-red-600/10 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Precision SVG Measurement Calipers & Dimension Lines */}
          <svg
            ref={svgOverlayRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-30 overflow-visible"
            viewBox="0 0 600 800"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <marker
                id="caliperArrow"
                viewBox="0 0 10 10"
                refX="5"
                refY="5"
                markerWidth="4"
                markerHeight="4"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#dc2626" />
              </marker>
            </defs>

            {/* Dimension 1: 40mm Power Edge Caliper (Left Blade Edge) */}
            <g className="transition-opacity duration-300">
              <line
                x1="180"
                y1="460"
                x2="180"
                y2="540"
                stroke="#dc2626"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />
              <line
                x1="160"
                y1="500"
                x2="220"
                y2="500"
                stroke="#dc2626"
                strokeWidth="1.2"
                markerStart="url(#caliperArrow)"
                markerEnd="url(#caliperArrow)"
              />
              <text
                x="145"
                y="504"
                fill="#ffffff"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="700"
                textAnchor="end"
              >
                40.0 MM
              </text>
              <text
                x="145"
                y="518"
                fill="#888888"
                fontSize="8"
                fontFamily="monospace"
                textAnchor="end"
              >
                EDGE THICKNESS
              </text>
            </g>

            {/* Dimension 2: 67mm Spine Apex Caliper (Spine Center) */}
            <g className="transition-opacity duration-300">
              <line
                x1="300"
                y1="280"
                x2="300"
                y2="340"
                stroke="#ffffff"
                strokeWidth="1"
                strokeDasharray="2 2"
                strokeOpacity="0.4"
              />
              <circle cx="300" cy="310" r="3" fill="#dc2626" />
              <line
                x1="300"
                y1="310"
                x2="390"
                y2="310"
                stroke="#dc2626"
                strokeWidth="1.2"
              />
              <text
                x="400"
                y="314"
                fill="#ffffff"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="700"
              >
                67.0 MM
              </text>
              <text
                x="400"
                y="326"
                fill="#888888"
                fontSize="8"
                fontFamily="monospace"
              >
                SPINE APEX
              </text>
            </g>

            {/* Dimension 3: 310mm Balance Vector Datum (Sweet Spot Balance Point) */}
            <g className="transition-opacity duration-300">
              <line
                x1="120"
                y1="580"
                x2="480"
                y2="580"
                stroke="#ffffff"
                strokeWidth="1"
                strokeDasharray="4 4"
                strokeOpacity="0.3"
              />
              {/* Target Crosshair */}
              <circle
                cx="300"
                cy="580"
                r="14"
                fill="none"
                stroke="#dc2626"
                strokeWidth="1"
                strokeDasharray="3 2"
              />
              <circle cx="300" cy="580" r="2" fill="#dc2626" />
              <text
                x="400"
                y="576"
                fill="#ffffff"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="700"
              >
                310 MM
              </text>
              <text
                x="400"
                y="590"
                fill="#888888"
                fontSize="8"
                fontFamily="monospace"
              >
                BALANCE COG VECTOR
              </text>
            </g>
          </svg>
        </div>

        {/* Left Telemetry HUD (Desktop & Tablet) */}
        <div
          ref={telemetryLeftRef}
          className="absolute left-6 sm:left-10 lg:left-16 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-5 max-w-[240px] pointer-events-none"
        >
          <div className="p-4 rounded-xl bg-neutral-950/80 border border-white/[0.08] backdrop-blur-md space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-wider text-red-500 font-bold">
              <Cpu className="w-3.5 h-3.5" />
              <span>TIMBER METRICS</span>
            </div>
            <div className="space-y-1 text-[11px] font-mono text-neutral-400">
              <div className="flex justify-between">
                <span>SPECIES:</span>
                <span className="text-white">SALIX ALBA</span>
              </div>
              <div className="flex justify-between">
                <span>GRAIN DENSITY:</span>
                <span className="text-white">10 STRAITS</span>
              </div>
              <div className="flex justify-between">
                <span>MOISTURE:</span>
                <span className="text-white">10.8% EQ</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-neutral-950/80 border border-white/[0.08] backdrop-blur-md space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-wider text-red-500 font-bold">
              <Gauge className="w-3.5 h-3.5" />
              <span>DYNAMICS</span>
            </div>
            <div className="space-y-1 text-[11px] font-mono text-neutral-400">
              <div className="flex justify-between">
                <span>TORSION REST:</span>
                <span className="text-white">99.2%</span>
              </div>
              <div className="flex justify-between">
                <span>SWING WEIGHT:</span>
                <span className="text-white">2.85 LB/IN²</span>
              </div>
              <div className="flex justify-between">
                <span>RESTITUTION:</span>
                <span className="text-emerald-400">0.984 COR</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Telemetry: The Monumental Numbers (Desktop & Tablet) */}
        <div
          ref={numbersGroupRef}
          className="absolute right-6 sm:right-10 lg:right-16 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-4 sm:gap-6 pointer-events-none"
        >
          {/* Stat 1: 310 MM */}
          <div
            ref={stat1Ref}
            className="p-4 sm:p-5 rounded-2xl bg-neutral-900/80 border border-white/[0.1] backdrop-blur-xl shadow-2xl min-w-[200px] sm:min-w-[240px]"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-['Syne',sans-serif] text-3xl sm:text-4xl font-black text-white tracking-tight">
                310<span className="text-sm font-mono text-red-500 ml-1">MM</span>
              </span>
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                DATUM 01
              </span>
            </div>
            <span className="text-[11px] font-mono tracking-wider uppercase text-neutral-300 font-bold block mt-1">
              BALANCE POINT
            </span>
            <span className="text-[10px] text-neutral-500 leading-snug block mt-0.5">
              Center-of-gravity calibrated for instant pickup acceleration.
            </span>
          </div>

          {/* Stat 2: 67 MM */}
          <div
            ref={stat2Ref}
            className="p-4 sm:p-5 rounded-2xl bg-neutral-900/80 border border-white/[0.1] backdrop-blur-xl shadow-2xl min-w-[200px] sm:min-w-[240px]"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-['Syne',sans-serif] text-3xl sm:text-4xl font-black text-white tracking-tight">
                67<span className="text-sm font-mono text-red-500 ml-1">MM</span>
              </span>
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                DATUM 02
              </span>
            </div>
            <span className="text-[11px] font-mono tracking-wider uppercase text-neutral-300 font-bold block mt-1">
              SPINE HEIGHT
            </span>
            <span className="text-[10px] text-neutral-500 leading-snug block mt-0.5">
              Full-length contour maximizing sweet spot depth.
            </span>
          </div>

          {/* Stat 3: 40 MM */}
          <div
            ref={stat3Ref}
            className="p-4 sm:p-5 rounded-2xl bg-neutral-900/80 border border-white/[0.1] backdrop-blur-xl shadow-2xl min-w-[200px] sm:min-w-[240px]"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-['Syne',sans-serif] text-3xl sm:text-4xl font-black text-white tracking-tight">
                40<span className="text-sm font-mono text-red-500 ml-1">MM</span>
              </span>
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                DATUM 03
              </span>
            </div>
            <span className="text-[11px] font-mono tracking-wider uppercase text-neutral-300 font-bold block mt-1">
              POWER EDGE
            </span>
            <span className="text-[10px] text-neutral-500 leading-snug block mt-0.5">
              Massive edge allowance for aggressive boundary clearing.
            </span>
          </div>
        </div>

        {/* 80–100% Final Resolution Stage: PRECISION CHANGES PERFORMANCE. */}
        <div
          ref={resolutionGroupRef}
          className="absolute inset-0 z-40 flex flex-col items-center justify-center pointer-events-auto px-6 text-center"
        >
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/10 border border-red-600/30 text-red-500 text-xs font-mono tracking-[0.25em] uppercase">
              <Layers className="w-3.5 h-3.5" />
              <span>ENGINEERED MASTERY</span>
            </div>

            <h3 className="font-['Syne',sans-serif] text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase text-white tracking-tight leading-[0.92]">
              PRECISION <br />
              <span className="bg-gradient-to-r from-white via-neutral-100 to-red-500 bg-clip-text text-transparent filter drop-shadow-[0_4px_25px_rgba(220,38,38,0.4)]">
                CHANGES PERFORMANCE.
              </span>
            </h3>

            <p className="text-neutral-400 text-sm sm:text-base max-w-lg mx-auto font-normal leading-relaxed">
              When every millimeter is verified to international test standards, your confidence at the crease becomes absolute.
            </p>

            <div className="pt-4">
              <Link
                to="/catalog"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-extrabold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 hover:bg-red-600 hover:text-white shadow-[0_10px_30px_rgba(255,255,255,0.15)] hover:shadow-[0_10px_30px_rgba(220,38,38,0.4)] active:scale-95 cursor-pointer"
              >
                <span>EXPLORE THE ENGINEERING</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
