import React from 'react';
import CinematicNavbar from '../components/cinematic/CinematicNavbar';
import CinematicHero from '../components/cinematic/CinematicHero';
import CategoriesSection from '../components/CategoriesSection';
import CollectionSection from '../components/cinematic/CollectionSection';
import FinalFrameSection from '../components/cinematic/FinalFrameSection';
import ScrollProgress from '../components/cinematic/ScrollProgress';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-red-600 selection:text-white relative">
      {/* Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Navigation Header */}
      <CinematicNavbar />

      {/* Main Content Flow */}
      <main className="flex-1 space-y-0 relative z-10">
        {/* 1. THE HERO — Visual Impact & Direct CTAs */}
        <CinematicHero />

        {/* 2. THE CATEGORIES — Fast Visual Navigation (Bats, Pads, Gloves, Gear) */}
        <CategoriesSection />

        {/* 3. THE COLLECTION — Live Shopify Products with Instant Add to Bag */}
        <CollectionSection />

        {/* 4. THE FOOTER & CTA — Statement, Links & Checkout Entry */}
        <FinalFrameSection />
      </main>
    </div>
  );
}


