import React from 'react';
import CinematicNavbar from '../components/cinematic/CinematicNavbar';
import CinematicHero from '../components/cinematic/CinematicHero';
import ImpactSection from '../components/cinematic/ImpactSection';
import BatStorySection from '../components/cinematic/BatStorySection';
import PrecisionSection from '../components/cinematic/PrecisionSection';
import KitSection from '../components/cinematic/KitSection';
import PlayerSection from '../components/cinematic/PlayerSection';
import CollectionSection from '../components/cinematic/CollectionSection';
import BrandFilmSection from '../components/cinematic/BrandFilmSection';
import FinalFrameSection from '../components/cinematic/FinalFrameSection';
import SmoothScroll from '../components/cinematic/SmoothScroll';
import CustomCursor from '../components/cinematic/CustomCursor';
import ScrollProgress from '../components/cinematic/ScrollProgress';

export default function HomePage() {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-red-600 selection:text-white relative">
        {/* Custom Desktop Interactive Cursor */}
        <CustomCursor />

        {/* Scroll Progress Indicator */}
        <ScrollProgress />

        {/* Cinematic Film-Grade Navigation Header */}
        <CinematicNavbar />

        {/* Main Content Flow: The 9 Cinematic Acts */}
        <main className="flex-1 space-y-0 relative z-10">
          {/* ACT 01: THE MOMENT — Cinematic Hero */}
          <CinematicHero />

          {/* ACT 02: THE IMPACT — Bat & Ball Collision & Hotspots */}
          <ImpactSection />

          {/* ACT 03: THE CRAFT — Macro Optical Camera Inspection */}
          <BatStorySection />

          {/* ACT 04: THE PRECISION — Metrology, Laser LiDAR Scanning & Dimension Calipers */}
          <PrecisionSection />

          {/* ACT 05: THE KIT — Dressing Room Preparation & Live Shopify Equipment System */}
          <KitSection />

          {/* ACT 06: THE PLAYER — The Crease Stance, Time Dilation & Human Ambition */}
          <PlayerSection />

          {/* ACT 07: THE COLLECTION — Asymmetric Editorial Product Grid & Live Shopify Discovery */}
          <CollectionSection />

          {/* ACT 08: THE BRAND FILM — Philosophy & Climax Manifesto */}
          <BrandFilmSection />

          {/* ACT 09: THE FINAL FRAME — Climax Resolution, Primary CTA & Luxury Footer */}
          <FinalFrameSection />
        </main>
      </div>
    </SmoothScroll>
  );
}
