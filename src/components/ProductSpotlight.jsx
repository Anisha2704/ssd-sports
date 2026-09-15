import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, ArrowRight, Flame, Layers } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import ThreeDTiltCard from './ThreeDTiltCard';

export default function ProductSpotlight() {
  const { products } = useProducts({ first: 5 });

  const spotlightProduct = products && products.length > 0 ? products[0] : null;

  const imageUrl =
    spotlightProduct?.images?.edges?.[0]?.node?.url ||
    spotlightProduct?.featuredImage?.url ||
    'https://cdn.shopify.com/s/files/1/0654/1234/files/player-edition-bat.png';

  const title = spotlightProduct?.title || 'PLAYER EDITION PRO';
  const price = spotlightProduct?.priceRange?.minVariantPrice?.amount;

  return (
    <section className="w-full bg-gradient-to-b from-[#0B0F17] via-[#0D1320] to-[#0B0F17] py-20 lg:py-28 border-b border-white/10 text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF2E4D]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Product Media / 3D Stage */}
          <div className="lg:col-span-6 flex justify-center">
            <ThreeDTiltCard className="w-full max-w-[500px]">
              <div className="relative bg-gradient-to-br from-[#111827] via-[#1A2234] to-[#0D131F] rounded-3xl p-8 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex items-center justify-center min-h-[420px] overflow-hidden group">
                {/* Glow ring behind image */}
                <div className="absolute w-72 h-72 bg-[#FF2E4D]/20 rounded-full blur-2xl group-hover:bg-[#FF2E4D]/35 transition-colors duration-500" />
                
                <img
                  src={imageUrl}
                  alt={title}
                  className="relative z-10 max-h-[380px] w-auto object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Floating Pro Badge */}
                <div className="absolute top-6 left-6 z-20 flex items-center space-x-2 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#FF2E4D]/40">
                  <Flame className="w-4 h-4 text-[#FF2E4D] animate-bounce" />
                  <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-white">
                    PRO SPOTLIGHT
                  </span>
                </div>
              </div>
            </ThreeDTiltCard>
          </div>

          {/* Right: Storytelling Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 bg-[#FF2E4D]/20 border border-[#FF2E4D]/40 px-3.5 py-1.5 rounded-full">
              <Zap className="w-4 h-4 text-[#FF2E4D]" />
              <span className="text-xs font-mono font-extrabold uppercase tracking-[0.2em] text-[#FF2E4D]">
                FLAGSHIP PERFORMANCE
              </span>
            </div>

            <h2 className="font-heading text-4xl sm:text-6xl font-black uppercase text-white tracking-tight leading-tight">
              PLAYER EDITION <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E4D] via-orange-400 to-white">
                MASTER SERIES
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
              Built for players who don't compromise. Features an extended sweet spot, pristine grain structure, and razor-sharp balance engineered for maximum stroke power.
            </p>

            {/* Specification Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-slate-900/90 border border-white/10 p-3.5 rounded-xl text-center">
                <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest">WILLOW</span>
                <span className="font-bold text-sm text-white">Grade 1 English</span>
              </div>
              <div className="bg-slate-900/90 border border-white/10 p-3.5 rounded-xl text-center">
                <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest">WEIGHT</span>
                <span className="font-bold text-sm text-[#FF2E4D]">2.8 - 2.10 LB</span>
              </div>
              <div className="bg-slate-900/90 border border-white/10 p-3.5 rounded-xl text-center col-span-2 sm:col-span-1">
                <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest">GRAINS</span>
                <span className="font-bold text-sm text-white">8 - 12 Straight</span>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4 flex items-center space-x-4">
              <Link
                to={spotlightProduct?.handle ? `/products/${spotlightProduct.handle}` : '/catalog'}
                className="group inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-red-600 to-[#FF2E4D] hover:from-red-500 hover:to-[#FF4763] text-white font-extrabold text-xs uppercase tracking-widest rounded-full transition-all duration-300 shadow-[0_0_25px_rgba(255,46,77,0.4)] hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>EXPLORE PLAYER EDITION</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
