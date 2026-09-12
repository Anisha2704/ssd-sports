import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUp, MapPin, Phone, Mail } from 'lucide-react';
import { useHomepageHero } from '../../hooks/useHomepageHero';
import { useFooter } from '../../hooks/useFooter';

export default function FinalFrameSection() {
  const { hero } = useHomepageHero();
  const { footerSettings } = useFooter();

  const [prefersReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  // Social Channels availability from Shopify
  const hasInstagram = Boolean(footerSettings?.instagramUrl);
  const hasFacebook = Boolean(footerSettings?.facebookUrl);
  const hasYoutube = Boolean(footerSettings?.youtubeUrl);
  const hasSocials = hasInstagram || hasFacebook || hasYoutube;

  // Contact Info availability from Shopify
  const hasAddress = Boolean(footerSettings?.address);
  const hasPhone = Boolean(footerSettings?.phone);
  const hasEmail = Boolean(footerSettings?.email);
  const hasContact = hasAddress || hasPhone || hasEmail;

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };

  const secondaryNav = [
    { label: 'SHOP', path: '/catalog' },
    { label: 'BATS', path: '/catalog/cricket-bats' },
    { label: 'APPAREL', path: '/catalog/apparel' },
    { label: 'EQUIPMENT', path: '/catalog/equipment' },
    { label: 'ABOUT', path: '/#act-brand-film' },
  ];

  return (
    <section
      id="act-final-frame"
      className="relative w-full bg-[#050505] text-white overflow-hidden"
    >
      {/* Subtle Atmospheric Ambient Lighting */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-red-950/[0.12] rounded-full blur-[160px] pointer-events-none ${
          prefersReducedMotion ? '' : 'animate-pulse'
        }`}
        style={{ animationDuration: '8s' }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,#050505_85%)] pointer-events-none" />

      {/* ─────────────────────────────────────────────────────────────
          1. THE FINAL RESOLUTION FRAME (Compact Cinematic Climax)
          ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 pt-28 sm:pt-36 md:pt-44 pb-20 sm:pb-28 text-center flex flex-col items-center justify-center">
        
        {/* SSD Brand Lockup */}
        <div className="mb-10 sm:mb-12">
          {hero?.logo?.url ? (
            <img
              src={hero.logo.url}
              alt={hero.logo.altText || 'SSD Sports'}
              className="h-12 sm:h-16 w-auto object-contain brightness-125 mx-auto filter drop-shadow-[0_4px_24px_rgba(255,255,255,0.15)]"
            />
          ) : (
            <div className="inline-flex items-center gap-3">
              <span className="bg-red-600 text-white font-black text-sm sm:text-base px-3 py-1 rounded tracking-tighter shadow-[0_0_25px_rgba(220,38,38,0.5)]">
                SSD
              </span>
              <span className="font-extrabold text-xl sm:text-2xl tracking-[0.35em] text-white font-['Syne',sans-serif]">
                SPORTS
              </span>
            </div>
          )}
        </div>

        {/* Monumental Final Statement */}
        <h1 className="font-['Syne',sans-serif] text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase text-white tracking-tight leading-[0.9] select-none max-w-5xl">
          MAKE THE <span className="text-red-500">MOMENT</span> <br />
          YOURS.
        </h1>

        {/* Supporting Philosophical Anchor */}
        <p className="mt-8 sm:mt-10 font-mono text-xs sm:text-sm md:text-base tracking-[0.28em] text-neutral-400 uppercase max-w-xl">
          BUILT FOR THE ONES WHO SHOW UP READY.
        </p>

        {/* Primary Call to Action */}
        <div className="mt-12 sm:mt-14">
          <Link
            to="/catalog"
            className="group relative inline-flex items-center gap-4 px-10 sm:px-12 py-5 rounded-full bg-white text-black font-extrabold text-xs sm:text-sm tracking-[0.2em] uppercase transition-all duration-500 hover:bg-red-600 hover:text-white shadow-[0_10px_40px_rgba(255,255,255,0.12)] hover:shadow-[0_15px_50px_rgba(220,38,38,0.45)] active:scale-95 cursor-pointer"
          >
            <span>EXPLORE THE COLLECTION</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-500 ease-out group-hover:translate-x-2" />
          </Link>
        </div>

        {/* Secondary Navigation Links */}
        <nav
          aria-label="Final Chapter Secondary Navigation"
          className="mt-16 sm:mt-20 pt-8 border-t border-white/[0.08] w-full max-w-xl flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono tracking-[0.25em] text-neutral-400"
        >
          {secondaryNav.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className="hover:text-white hover:text-red-400 transition-colors uppercase py-1"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. LUXURY EDITORIAL FOOTER (Integrated Filmic Architecture)
          ───────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/[0.08] bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Column 1: Brand & Philosophy Note (Spans 4 cols) */}
            <div className="md:col-span-4 space-y-6">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
                <span className="font-['Syne',sans-serif] font-black tracking-widest text-base sm:text-lg uppercase text-white">
                  SSD SPORTS
                </span>
              </div>
              <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-sm">
                Engineered in willow. Tested under floodlights. We build high-performance cricket systems for players who dictate the moment.
              </p>
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-neutral-600">
                CRICKET PERFORMANCE SYSTEMS // WORLDWIDE
              </div>
            </div>

            {/* Column 2: Equipment Catalogue (Spans 2 cols) */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-neutral-300 font-semibold">
                EQUIPMENT
              </h3>
              <ul className="space-y-2.5 text-xs text-neutral-400 font-normal">
                <li>
                  <Link to="/catalog/cricket-bats" className="hover:text-white transition-colors">
                    Cricket Bats
                  </Link>
                </li>
                <li>
                  <Link to="/catalog/apparel" className="hover:text-white transition-colors">
                    Match Apparel
                  </Link>
                </li>
                <li>
                  <Link to="/catalog/equipment" className="hover:text-white transition-colors">
                    Protective Gear
                  </Link>
                </li>
                <li>
                  <Link to="/catalog" className="hover:text-white transition-colors">
                    Full Catalogue
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Client Services (Spans 3 cols) */}
            <div className="md:col-span-3 space-y-4">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-neutral-300 font-semibold">
                SERVICES
              </h3>
              <ul className="space-y-2.5 text-xs text-neutral-400 font-normal">
                <li>
                  <Link to="/track-order" className="hover:text-white transition-colors">
                    Track Order
                  </Link>
                </li>
                <li>
                  <Link to="/bulk-order" className="hover:text-white transition-colors">
                    Bulk Inquiries & Teams
                  </Link>
                </li>
                <li>
                  <Link to="/account" className="hover:text-white transition-colors">
                    Player Account
                  </Link>
                </li>
                <li>
                  <Link to="/wishlist" className="hover:text-white transition-colors">
                    Saved Items (Wishlist)
                  </Link>
                </li>
                <li>
                  <Link to="/cart" className="hover:text-white transition-colors">
                    Kit Bag (Cart)
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact & Concierge (Spans 3 cols, real Shopify data) */}
            <div className="md:col-span-3 space-y-4">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-neutral-300 font-semibold">
                CONCIERGE
              </h3>
              {hasContact ? (
                <ul className="space-y-3 text-xs text-neutral-400">
                  {hasAddress && (
                    <li className="flex items-start gap-2.5 leading-relaxed">
                      <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span className="whitespace-pre-line break-words">{footerSettings.address}</span>
                    </li>
                  )}
                  {hasPhone && (
                    <li className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-red-500 shrink-0" />
                      <a
                        href={`tel:${footerSettings.phone.replace(/\s+/g, '')}`}
                        className="hover:text-white transition-colors"
                      >
                        {footerSettings.phone}
                      </a>
                    </li>
                  )}
                  {hasEmail && (
                    <li className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-red-500 shrink-0" />
                      <a
                        href={`mailto:${footerSettings.email}`}
                        className="hover:text-white transition-colors break-all"
                      >
                        {footerSettings.email}
                      </a>
                    </li>
                  )}
                </ul>
              ) : (
                <p className="text-neutral-500 text-xs leading-relaxed">
                  Direct support available via official player channels.
                </p>
              )}

              {/* Social Channels (From real Shopify footer settings) */}
              {hasSocials && (
                <div className="pt-2 flex items-center gap-3">
                  {hasInstagram && (
                    <a
                      href={footerSettings.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="w-8 h-8 rounded-full border border-white/[0.1] flex items-center justify-center text-neutral-400 hover:text-white hover:border-red-500 hover:bg-red-950/30 transition-all duration-300"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                  )}
                  {hasFacebook && (
                    <a
                      href={footerSettings.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="w-8 h-8 rounded-full border border-white/[0.1] flex items-center justify-center text-neutral-400 hover:text-white hover:border-red-500 hover:bg-red-950/30 transition-all duration-300"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                  )}
                  {hasYoutube && (
                    <a
                      href={footerSettings.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="YouTube"
                      className="w-8 h-8 rounded-full border border-white/[0.1] flex items-center justify-center text-neutral-400 hover:text-white hover:border-red-500 hover:bg-red-950/30 transition-all duration-300"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Bottom Copyright & Top Trigger */}
          <div className="mt-16 sm:mt-20 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono tracking-widest text-neutral-500">
            <p>© 2026 SSD SPORTS. ALL RIGHTS RESERVED.</p>
            <div className="flex items-center gap-6">
              <span className="hidden sm:inline text-neutral-600">
                ENGINEERED FOR THE CREASE
              </span>
              <button
                onClick={handleScrollToTop}
                className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors cursor-pointer group"
                aria-label="Scroll back to top of the page"
              >
                <span>BACK TO TOP</span>
                <ArrowUp className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-y-1 text-red-500" />
              </button>
            </div>
          </div>

        </div>
      </footer>
    </section>
  );
}
