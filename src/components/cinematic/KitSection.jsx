import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Heart, ShoppingBag, ShieldCheck, CheckCircle2, RefreshCw } from 'lucide-react';
import dressingRoomImg from '../../assets/elite_cricket_dressing_room_kit.jpg';
import { useProducts } from '../../hooks/useProducts';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

gsap.registerPlugin(ScrollTrigger);

function formatINR(amount) {
  if (amount === undefined || amount === null || amount === '') return '';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '';
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  } catch {
    return `₹${num.toFixed(2)}`;
  }
}

const EQUIPMENT_ZONES = [
  {
    id: 'bat',
    title: 'THE WEAPON',
    name: 'ENGLISH WILLOW BATS',
    description: 'Precision-balanced Grade 1 reserve willow engineered for lethal kinetic exit velocity.',
    cta: 'EXPLORE BATS',
    link: '/catalog?collection=cricket-bats',
    x: 18,
    y: 52,
  },
  {
    id: 'gloves',
    title: 'THE CONTROL',
    name: 'SPLIT-FINGER BATTING GLOVES',
    description: 'High-density multi-flex foam with pittards sheepskin palm for unyielding grip control.',
    cta: 'EXPLORE GLOVES',
    link: '/catalog?collection=gloves',
    x: 42,
    y: 68,
  },
  {
    id: 'protection',
    title: 'THE ARMOUR',
    name: 'TITANIUM LEGGARDS & HELMET',
    description: 'Carbon-reinforced cane construction absorbing 150 km/h impacts without stroke restriction.',
    cta: 'EXPLORE PROTECTION',
    link: '/catalog?collection=protection',
    x: 55,
    y: 72,
  },
  {
    id: 'footwear',
    title: 'THE FOUNDATION',
    name: 'SPIKE TRACTION FOOTWEAR',
    description: 'Ultra-light responsive midsole with customized 22-yard perimeter pitch bite.',
    cta: 'EXPLORE FOOTWEAR',
    link: '/catalog?collection=footwear',
    x: 82,
    y: 65,
  },
];

export default function KitSection() {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const roomBgRef = useRef(null);
  const spotlightRef = useRef(null);
  const telemetryBadgeRef = useRef(null);
  const headlineRef = useRef(null);
  const hotspotsContainerRef = useRef(null);
  const [activeZone, setActiveZone] = useState(EQUIPMENT_ZONES[0]);
  const [addingId, setAddingId] = useState(null);
  const [addedId, setAddedId] = useState(null);

  // Live Shopify products
  const { products, loading: productsLoading } = useProducts({ first: 6 });
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addItemToCart, showToast } = useCart();

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
      // 300vh Continuous Dressing Room Camera Dolly Timeline
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

      // Initial State: Pitch dark dressing room, dormant spotlight
      gsap.set(roomBgRef.current, {
        opacity: 0.12,
        scale: 1.08,
        filter: 'brightness(0.2) contrast(1.4)',
      });
      gsap.set(spotlightRef.current, { opacity: 0, scale: 0.8 });
      gsap.set(telemetryBadgeRef.current, { opacity: 0, y: -20 });
      gsap.set(headlineRef.current, { opacity: 0, y: 40 });
      gsap.set(hotspotsContainerRef.current, { opacity: 0 });

      // -------------------------------------------------------------------
      // 00–20%: The Empty Room
      // Atmospheric spotlight turns on, overhead haze illuminates bench
      // -------------------------------------------------------------------
      tl.to(
        spotlightRef.current,
        { opacity: 0.85, scale: 1, duration: 0.2, ease: 'power2.inOut' },
        0
      );

      tl.to(
        roomBgRef.current,
        {
          opacity: 0.6,
          scale: 1.04,
          filter: 'brightness(0.6) contrast(1.25)',
          duration: 0.25,
          ease: 'power1.out',
        },
        0.05
      );

      tl.to(
        telemetryBadgeRef.current,
        { opacity: 1, y: 0, duration: 0.15, ease: 'power2.out' },
        0.08
      );

      // -------------------------------------------------------------------
      // 20–50%: The Equipment Reveal & Camera Dolly
      // Camera dollies across the bench revealing the full kit & hotspots
      // -------------------------------------------------------------------
      tl.to(
        roomBgRef.current,
        {
          opacity: 1,
          scale: 1.0,
          filter: 'brightness(0.95) contrast(1.15)',
          duration: 0.3,
          ease: 'sine.inOut',
        },
        0.2
      );

      tl.to(
        hotspotsContainerRef.current,
        { opacity: 1, duration: 0.2, ease: 'power2.out' },
        0.3
      );

      // -------------------------------------------------------------------
      // 50–80%: The Major Statement
      // "THE KIT. EVERYTHING YOU NEED FOR THE MOMENT."
      // -------------------------------------------------------------------
      tl.to(
        headlineRef.current,
        { opacity: 1, y: 0, duration: 0.25, ease: 'expo.out' },
        0.48
      );

      // -------------------------------------------------------------------
      // 80–100%: Transition into Product Discovery
      // -------------------------------------------------------------------
      tl.to(
        [headlineRef.current, hotspotsContainerRef.current],
        { opacity: 0.2, duration: 0.15, ease: 'power1.in' },
        0.82
      );
    }, container);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Handle Add to Cart on Discovery Card
  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    const firstVariant = product?.variants?.nodes?.[0];
    if (!firstVariant?.availableForSale) {
      showToast({
        type: 'warning',
        title: 'Unavailable',
        message: `${product.title} is out of stock.`,
      });
      return;
    }

    setAddingId(product.id);
    try {
      await addItemToCart(firstVariant.id, 1, product.title);
      setAddedId(product.id);
      setTimeout(() => setAddedId(null), 2500);
    } catch (err) {
      console.error('Failed to add item to cart:', err);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="relative w-full bg-[#050505] text-white">
      {/* ------------------------------------------------------------------ */}
      {/* PART 1: CINEMATIC DRESSING ROOM CHOREOGRAPHY (300VH PINNED)         */}
      {/* ------------------------------------------------------------------ */}
      <div
        ref={containerRef}
        id="act-kit"
        className={`relative w-full ${prefersReducedMotion ? 'min-h-screen py-20' : 'h-[300vh]'}`}
      >
        <div
          ref={stageRef}
          className="sticky top-0 w-full h-screen overflow-hidden bg-[#050505] flex items-center justify-center select-none"
        >
          {/* Atmospheric Dressing Room Master Photography */}
          <div
            ref={roomBgRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0 transform-gpu will-change-transform"
          >
            <img
              src={dressingRoomImg}
              alt="Elite Cricket Dressing Room Kit Preparation"
              className="w-full h-full object-cover object-center filter"
            />
            {/* Dark Studio Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/80 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/90 via-transparent to-[#050505]/90 pointer-events-none" />
          </div>

          {/* Volumetric Overhead Lamp Spotlight Beam */}
          <div
            ref={spotlightRef}
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[900px] bg-gradient-to-b from-white/10 via-amber-500/[0.03] to-transparent rounded-full blur-3xl pointer-events-none z-10 transform-gpu"
          />

          {/* Top Telemetry Badge */}
          <div
            ref={telemetryBadgeRef}
            className="absolute top-20 sm:top-24 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 text-center pointer-events-none"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              <span className="text-[10px] font-mono tracking-[0.25em] text-neutral-300 uppercase">
                ACT 05 — THE KIT
              </span>
            </div>
            <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
              PREPARATION SEQUENCE // 05
            </span>
          </div>

          {/* Interactive Equipment Zones Hotspots (Desktop & Tablet) */}
          <div
            ref={hotspotsContainerRef}
            className="absolute inset-0 z-30 pointer-events-none"
          >
            {EQUIPMENT_ZONES.map((zone) => {
              const isSelected = activeZone.id === zone.id;
              return (
                <div
                  key={zone.id}
                  style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto group/kitpin"
                >
                  <button
                    onClick={() => setActiveZone(zone)}
                    className={`relative p-2 rounded-full cursor-pointer focus:outline-none transition-transform duration-300 ${
                      isSelected ? 'scale-110' : 'hover:scale-105'
                    }`}
                    aria-label={`Inspect ${zone.name}`}
                  >
                    {/* Pulsing Target Ring */}
                    <span
                      className={`absolute inset-0 rounded-full bg-red-600 ${
                        isSelected ? 'animate-ping opacity-60' : 'opacity-20 group-hover/kitpin:opacity-40'
                      }`}
                    />
                    <span
                      className={`relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border text-xs font-mono font-bold transition-all duration-300 ${
                        isSelected
                          ? 'bg-red-600 border-white text-white shadow-[0_0_20px_rgba(220,38,38,0.8)]'
                          : 'bg-black/80 border-white/30 text-neutral-300 hover:border-white hover:text-white backdrop-blur-md'
                      }`}
                    >
                      +
                    </span>
                  </button>

                  {/* Hotspot Floating Tooltip Card */}
                  <div
                    className={`hidden md:block absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-64 p-4 rounded-xl bg-neutral-950/90 border border-white/[0.12] backdrop-blur-xl shadow-2xl transition-all duration-300 pointer-events-auto ${
                      isSelected
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-2 pointer-events-none group-hover/kitpin:opacity-100 group-hover/kitpin:translate-y-0'
                    }`}
                  >
                    <span className="text-[9px] font-mono tracking-[0.2em] text-red-500 uppercase font-semibold block">
                      {zone.title}
                    </span>
                    <span className="text-xs font-extrabold text-white tracking-wide uppercase block mt-0.5">
                      {zone.name}
                    </span>
                    <p className="text-[11px] text-neutral-400 leading-snug mt-1.5 font-normal">
                      {zone.description}
                    </p>
                    <Link
                      to={zone.link}
                      className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-wider text-white hover:text-red-500 font-bold uppercase mt-2.5 transition-colors"
                    >
                      <span>{zone.cta}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Major Editorial Headline Overlay */}
          <div
            ref={headlineRef}
            className="relative z-30 max-w-4xl w-full mx-auto px-6 text-center space-y-4 pointer-events-auto"
          >
            <h2 className="font-['Syne',sans-serif] text-5xl sm:text-7xl md:text-8xl font-black tracking-tight uppercase text-white leading-[0.88]">
              THE KIT.
            </h2>
            <p className="text-sm sm:text-base md:text-lg font-mono tracking-[0.2em] uppercase text-neutral-300 max-w-xl mx-auto">
              EVERYTHING YOU NEED FOR THE MOMENT.
            </p>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed pt-1">
              The bat is only the beginning. Complete the system engineered for maximum impact.
            </p>
          </div>

        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* PART 2: PRODUCT DISCOVERY TRANSITION — "BUILD YOUR KIT."          */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative w-full py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-20 border-t border-white/[0.08]">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-red-600/10 border border-red-600/20 text-red-500 text-[10px] sm:text-xs font-mono tracking-[0.2em] uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>THE EQUIPMENT SYSTEM</span>
            </div>
            <h3 className="font-['Syne',sans-serif] text-3xl sm:text-5xl font-black tracking-tight uppercase text-white">
              BUILD YOUR KIT.
            </h3>
            <p className="text-neutral-400 text-xs sm:text-sm max-w-md font-normal">
              Authentic gear from SSD Sports Storefront. Select equipment engineered to function together seamlessly.
            </p>
          </div>

          <Link
            to="/catalog"
            className="group inline-flex items-center gap-2 text-xs font-mono tracking-widest text-neutral-300 hover:text-white uppercase transition-colors"
          >
            <span>VIEW FULL INVENTORY</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Live Shopify Products Discovery Cards */}
        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="aspect-[4/5] rounded-2xl bg-neutral-900/60 border border-white/[0.06] animate-pulse p-6 flex flex-col justify-between"
              >
                <div className="w-full h-48 bg-neutral-800/60 rounded-xl" />
                <div className="space-y-2">
                  <div className="w-2/3 h-4 bg-neutral-800 rounded" />
                  <div className="w-1/3 h-4 bg-neutral-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {products.slice(0, 6).map((product) => {
              const firstImage = product.featuredImage?.url || product.images?.nodes?.[0]?.url;
              const title = product.title || 'SSD Sports Equipment';
              const minPrice = product.priceRange?.minVariantPrice?.amount;
              const formattedPrice = formatINR(minPrice);
              const firstVariant = product.variants?.nodes?.[0];
              const isAvailable = firstVariant ? firstVariant.availableForSale : true;
              const isFav = isInWishlist(product.id);
              const isAdding = addingId === product.id;
              const isAdded = addedId === product.id;

              return (
                <div
                  key={product.id}
                  className="group relative rounded-2xl sm:rounded-3xl bg-neutral-900/50 hover:bg-neutral-900/80 border border-white/[0.08] hover:border-white/[0.2] transition-all duration-300 flex flex-col overflow-hidden shadow-xl"
                >
                  {/* Product Image Area */}
                  <Link
                    to={`/products/${product.handle}`}
                    className="relative aspect-square w-full bg-neutral-950 flex items-center justify-center p-6 overflow-hidden cursor-pointer"
                  >
                    {firstImage ? (
                      <img
                        src={firstImage}
                        alt={product.featuredImage?.altText || title}
                        className="w-full h-full object-contain filter contrast-105 group-hover:scale-105 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-600 font-mono text-xs">
                        SSD EQUIPMENT
                      </div>
                    )}

                    {/* Subtle Overlay Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    {/* Wishlist Toggle Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 border border-white/10 hover:border-white/30 flex items-center justify-center text-neutral-300 hover:text-red-500 backdrop-blur-md transition-all cursor-pointer focus:outline-none"
                      aria-label="Wishlist"
                    >
                      <Heart
                        className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : 'stroke-current'}`}
                      />
                    </button>
                  </Link>

                  {/* Product Details & Action Bottom */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                        {product.vendor || 'SSD PROFESSIONAL'}
                      </span>
                      <Link
                        to={`/products/${product.handle}`}
                        className="font-['Syne',sans-serif] text-base sm:text-lg font-bold text-white tracking-wide hover:text-red-500 transition-colors line-clamp-1 block cursor-pointer"
                        title={title}
                      >
                        {title}
                      </Link>
                      <span className="text-sm sm:text-base font-mono font-black text-white block pt-1">
                        {formattedPrice}
                      </span>
                    </div>

                    {/* Direct Add to Cart Action */}
                    <div className="pt-2">
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={isAdding || !isAvailable}
                        className={`w-full py-3 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                          !isAvailable
                            ? 'bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed'
                            : isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white text-black hover:bg-red-600 hover:text-white shadow-md active:scale-95'
                        }`}
                      >
                        {!isAvailable ? (
                          <span>OUT OF STOCK</span>
                        ) : isAdding ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>ADDING...</span>
                          </>
                        ) : isAdded ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>ADDED TO KIT</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>ADD TO KIT</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 rounded-2xl bg-neutral-900/40 border border-white/[0.06] p-6 text-neutral-400 font-mono text-xs">
            Shopify products are being calibrated. Check back shortly.
          </div>
        )}

      </section>
    </div>
  );
}
