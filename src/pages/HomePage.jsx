import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import CategoryGrid from '../components/CategoryGrid';
import NewArrivals from '../components/NewArrivals';
import CategoriesSection from '../components/CategoriesSection';
import VideoSection from '../components/VideoSection';
import StatsSection from '../components/StatsSection';
import HomepageFeatureSection from '../components/HomepageFeatureSection';
import InstagramCommunityGallery from '../components/InstagramCommunityGallery';
import Footer from '../components/Footer';
import { useProducts } from '../hooks/useProducts';

export default function HomePage() {
  const { products, loading } = useProducts({ first: 20 });

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Navigation Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 space-y-0">
        
        {/* Hero Section */}
        <HeroSection />

        {/* Shop Our Best Sellers Carousel Section */}
        <CategoryGrid
          products={products}
          loading={loading}
        />

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
