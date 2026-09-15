import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import MarqueeSection from '../components/MarqueeSection';
import CategoryGrid from '../components/CategoryGrid';
import NewArrivals from '../components/NewArrivals';
import CategoriesSection from '../components/CategoriesSection';
import ProductSpotlight from '../components/ProductSpotlight';
import VideoSection from '../components/VideoSection';
import StatsSection from '../components/StatsSection';
import HomepageFeatureSection from '../components/HomepageFeatureSection';
import InstagramCommunityGallery from '../components/InstagramCommunityGallery';
import Footer from '../components/Footer';
import CustomCursor from '../components/CustomCursor';
import { useProducts } from '../hooks/useProducts';

export default function HomePage() {
  const { products, loading } = useProducts({ first: 20 });

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col font-sans selection:bg-[#FF2E4D] selection:text-white">
      {/* Desktop Custom Glowing Cursor */}
      <CustomCursor />

      {/* Navigation Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 space-y-0">
        
        {/* Cinematic 3D Hero Section */}
        <HeroSection />

        {/* Continuous Sports Marquee */}
        <MarqueeSection />

        {/* Shop Our Best Sellers Carousel Section */}
        <CategoryGrid
          products={products}
          loading={loading}
        />

        {/* Flagship Product Spotlight Storytelling Section */}
        <ProductSpotlight />

        {/* New Arrivals Shopify Collection Section */}
        <NewArrivals />

        {/* Dynamic Shopify Categories Grid Section */}
        <CategoriesSection />

        {/* Dynamic Shopify Homepage Video Section */}
        <VideoSection />

        {/* Animated Statistics Section */}
        <StatsSection />

        {/* Dynamic Shopify Craftsmanship/Performance Feature Section */}
        <HomepageFeatureSection />

        {/* Dynamic Shopify Instagram Community Gallery Section */}
        <InstagramCommunityGallery />

      </main>

      <Footer />
    </div>
  );
}
