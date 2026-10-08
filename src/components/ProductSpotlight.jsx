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

  return (
    <section className="w-full bg-gradient-to-b from-white via-[#F5FAF6] to-[#EAF7EE] py-20 lg:py-28 border-b border-[#D8E8DD] text-[#10231A] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#20A957]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Product Media / 3D Stage */}
          <div className="lg:col-span-6 flex justify-center">
            <ThreeDTiltCard className="w-full max-w-[500px]">
              <div className="relative bg-gradient-to-br from-white via-[#F5FAF6] to-[#EAF7EE] rounded-3xl p-8 border border-[#D8E8DD] shadow-lg flex items-center justify-center min-h-[420px] overflow-hidden group">
                {/* Glow ring behind image */}
                <div className="absolute w-72 h-72 bg-[#0B7A3B]/15 rounded-full blur-2xl group-hover:bg-[#0B7A3B]/25 transition-colors duration-500" />
                
                <img
                  src={imageUrl}
                  alt={title}
                  className="relative z-10 max-h-[380px] w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Floating Pro Badge */}
                <div className="absolute top-6 left-6 z-20 flex items-center space-x-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#0B7A3B]/30 shadow-xs">
                  <Flame className="w-4 h-4 text-[#0B7A3B] animate-bounce" />
                  <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#0B7A3B]">
                    PRO SPOTLIGHT
                  </span>
                </div>
              </div>
            </ThreeDTiltCard>
          </div>

          {/* Right: Storytelling Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 bg-[#EAF7EE] border border-[#0B7A3B]/30 px-3.5 py-1.5 rounded-full">
              <Zap className="w-4 h-4 text-[#0B7A3B]" />
              <span className="text-xs font-mono font-extrabold uppercase tracking-[0.2em] text-[#0B7A3B]">
                FLAGSHIP PERFORMANCE
              </span>
            </div>

            <h2 className="font-heading text-4xl sm:text-6xl font-black uppercase text-[#10231A] tracking-tight leading-tight">
              PLAYER EDITION <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#075E2D] via-[#0B7A3B] to-[#20A957]">
                MASTER SERIES
              </span>
            </h2>

            <p className="text-[#52645A] text-sm sm:text-base leading-relaxed font-normal">
              Built for players who don't compromise. Features an extended sweet spot, pristine grain structure, and razor-sharp balance engineered for maximum stroke power.
            </p>

            {/* Specification Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white border border-[#D8E8DD] p-3.5 rounded-xl text-center shadow-xs">
                <span className="block text-[10px] font-mono text-[#7B8A82] uppercase tracking-widest">WILLOW</span>
                <span className="font-bold text-sm text-[#10231A]">Grade 1 English</span>
              </div>
              <div className="bg-white border border-[#D8E8DD] p-3.5 rounded-xl text-center shadow-xs">
                <span className="block text-[10px] font-mono text-[#7B8A82] uppercase tracking-widest">WEIGHT</span>
                <span className="font-bold text-sm text-[#0B7A3B]">2.8 - 2.10 LB</span>
              </div>
              <div className="bg-white border border-[#D8E8DD] p-3.5 rounded-xl text-center col-span-2 sm:col-span-1 shadow-xs">
                <span className="block text-[10px] font-mono text-[#7B8A82] uppercase tracking-widest">GRAINS</span>
                <span className="font-bold text-sm text-[#10231A]">8 - 12 Straight</span>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4 flex items-center space-x-4">
              <Link
                to={spotlightProduct?.handle ? `/products/${spotlightProduct.handle}` : '/catalog'}
                className="group inline-flex items-center space-x-3 px-8 py-4 bg-[#0B7A3B] hover:bg-[#075E2D] text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md shadow-[#0B7A3B]/20 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
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
