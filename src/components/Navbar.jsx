import React from 'react';
import { isShopifyConfigured, getShopifyDomain } from '../services/shopify';
import { useHomepageHero } from '../hooks/useHomepageHero';

export default function Navbar() {
  const configured = isShopifyConfigured();
  const domain = getShopifyDomain();
  const { hero } = useHomepageHero();

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {hero?.logo?.url ? (
            <img
              src={hero.logo.url}
              alt={hero.logo.altText || 'SSD Sports'}
              className="h-8 max-w-[160px] object-contain"
            />
          ) : (
            <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white font-black text-xl tracking-wider px-3 py-1 rounded shadow-sm">
              SSD SPORTS
            </div>
          )}
          <span className="text-xs uppercase tracking-widest text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            Headless Storefront Test
          </span>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <span className="text-slate-400 hidden sm:inline">Shopify Backend Status:</span>
          {configured ? (
            <span className="inline-flex items-center gap-1.5 bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-1 rounded-full font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {domain || 'Configured'}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 bg-amber-950 text-amber-400 border border-amber-800 px-2.5 py-1 rounded-full font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Credentials Missing
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
