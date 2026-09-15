import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, ShoppingBag, ArrowRight, CheckCircle2, RefreshCw, Sparkles, Filter } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { useCollections } from '../../hooks/useCollections';
import { getCollectionByHandle } from '../../services/shopify';
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

/**
 * EditorialProductCard — Minimalist Luxury Editorial Commerce Card
 */
function EditorialProductCard({ product, isFeatured = false }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addItemToCart, showToast } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const isFav = product?.id ? isInWishlist(product.id) : false;

  const {
    title,
    handle,
    featuredImage,
    images,
    priceRange,
    compareAtPriceRange,
    variants,
    vendor,
  } = product;

  // Image extraction
  const imageNodes = images?.edges?.map((e) => e.node) || images?.nodes || [];
  const primaryImg = featuredImage?.url || imageNodes[0]?.url || '';
  const secondaryImg = imageNodes[1]?.url || null;

  // Variant & Pricing
  const firstVariant = variants?.nodes?.[0];
  const isAvailable = firstVariant ? firstVariant.availableForSale : true;
  const minPrice = priceRange?.minVariantPrice?.amount || firstVariant?.price?.amount;
  const compareAt = compareAtPriceRange?.minVariantPrice?.amount || firstVariant?.compareAtPrice?.amount;
  const formattedPrice = formatINR(minPrice);
  const formattedCompareAt = compareAt && parseFloat(compareAt) > parseFloat(minPrice) ? formatINR(compareAt) : null;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAvailable) {
      showToast({
        type: 'warning',
        title: 'Out of Stock',
        message: `${title} is currently unavailable.`,
      });
      return;
    }

    if (!firstVariant?.id) return;

    setAdding(true);
    try {
      await addItemToCart(firstVariant.id, 1, title);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch (err) {
      console.error('Failed to add item to bag:', err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div
      className={`group relative rounded-2xl sm:rounded-3xl bg-[#080808] hover:bg-[#0c0c0c] border border-white/[0.08] hover:border-white/[0.22] transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-xl ${
        isFeatured ? 'lg:col-span-2 lg:row-span-2' : 'col-span-1'
      }`}
    >
      {/* Top Hairline Crimson Accent Indicator on Hover */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />

      {/* Product Image Area */}
      <Link
        to={`/products/${handle}`}
        className={`relative w-full bg-[#050505] flex items-center justify-center p-6 sm:p-8 overflow-hidden block ${
          isFeatured ? 'aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3]' : 'aspect-square'
        }`}
      >
        {isFeatured && (
          <div className="absolute top-4 left-4 z-20 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/30 text-red-500 text-[9px] font-mono tracking-widest uppercase">
            <Sparkles className="w-3 h-3" />
            <span>FEATURED PICK</span>
          </div>
        )}

        {primaryImg ? (
          <div className="w-full h-full relative flex items-center justify-center">
            <img
              src={primaryImg}
              alt={featuredImage?.altText || title}
              className={`w-full h-full object-contain filter contrast-105 transition-all duration-500 ease-out group-hover:scale-[1.03] ${
                secondaryImg ? 'group-hover:opacity-0 opacity-100' : 'opacity-100'
              } ${!isAvailable ? 'opacity-40 grayscale' : ''}`}
              loading="lazy"
            />
            {secondaryImg && (
              <img
                src={secondaryImg}
                alt={`${title} alternate view`}
                className="w-full h-full object-contain absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-500 ease-out"
                loading="lazy"
              />
            )}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-600 font-mono text-xs">
            SSD SPORTS
          </div>
        )}

        {/* Wishlist Heart Icon */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 border border-white/10 hover:border-white/30 flex items-center justify-center text-neutral-300 hover:text-red-500 backdrop-blur-md transition-all cursor-pointer focus:outline-none"
          aria-label={isFav ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : 'stroke-current'}`}
          />
        </button>

        {/* Out of Stock Overlay Badge */}
        {!isAvailable && (
          <div className="absolute bottom-4 left-4 z-10 px-2.5 py-0.5 rounded-full bg-neutral-900 border border-white/10 text-neutral-400 text-[10px] font-mono uppercase tracking-wider">
            OUT OF STOCK
          </div>
        )}
      </Link>

      {/* Product Information & Action Area */}
      <div className="p-5 sm:p-6 lg:p-7 flex flex-col justify-between flex-1 space-y-4">
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
            {vendor || 'SSD PERFORMANCE'}
          </span>
          <Link
            to={`/products/${handle}`}
            className="font-['Syne',sans-serif] text-base sm:text-lg lg:text-xl font-bold text-white tracking-wide hover:text-red-500 transition-colors line-clamp-1 block cursor-pointer"
            title={title}
          >
            {title}
          </Link>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-base sm:text-lg font-mono font-black text-white">
              {formattedPrice}
            </span>
            {formattedCompareAt && (
              <span className="text-xs font-mono text-neutral-500 line-through">
                {formattedCompareAt}
              </span>
            )}
          </div>
        </div>

        {/* Minimal Action Bar */}
        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
          <Link
            to={`/products/${handle}`}
            className="text-[11px] font-mono tracking-wider text-neutral-400 hover:text-white uppercase inline-flex items-center gap-1 group/view transition-colors"
          >
            <span>VIEW SPEC</span>
            <ArrowRight className="w-3 h-3 group-hover/view:translate-x-1 transition-transform" />
          </Link>

          <button
            onClick={handleAddToCart}
            disabled={adding || !isAvailable}
            className={`px-4 py-2 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
              !isAvailable
                ? 'opacity-40 text-neutral-500 cursor-not-allowed'
                : added
                ? 'bg-emerald-600 text-white'
                : 'bg-white/[0.06] hover:bg-white text-white hover:text-black border border-white/10 hover:border-white'
            }`}
          >
            {adding ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>ADDING</span>
              </>
            ) : added ? (
              <>
                <CheckCircle2 className="w-3 h-3" />
                <span>ADDED</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3 h-3" />
                <span>ADD TO BAG</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CollectionSection() {
  const sectionRef = useRef(null);
  const lightSweepRef = useRef(null);
  const headlineRef = useRef(null);

  // Live Shopify collections & products
  const { collections } = useCollections({ first: 25 });
  const { products: allProducts, loading: productsLoading } = useProducts({ first: 24 });

  const [activeTab, setActiveTab] = useState('all');
  const [collectionProducts, setCollectionProducts] = useState({});
  const [loadingCollection, setLoadingCollection] = useState(false);

  // Filter valid collections with handles
  const validCollections = useMemo(() => {
    return (collections || []).filter((c) => c && c.handle && c.title);
  }, [collections]);

  // Handle category switching
  const handleCategorySelect = async (handle) => {
    setActiveTab(handle);

    if (handle === 'all') return;

    // Cache products per collection
    if (!collectionProducts[handle]) {
      setLoadingCollection(true);
      try {
        const result = await getCollectionByHandle({ handle, first: 16 });
        setCollectionProducts((prev) => ({
          ...prev,
          [handle]: result.products || [],
        }));
      } catch (err) {
        console.error(`Failed to load collection ${handle}:`, err);
      } finally {
        setLoadingCollection(false);
      }
    }
  };

  // Current active display products
  const displayedProducts = useMemo(() => {
    if (activeTab === 'all') {
      return allProducts || [];
    }
    return collectionProducts[activeTab] || [];
  }, [activeTab, allProducts, collectionProducts]);

  const isLoading = productsLoading || (activeTab !== 'all' && loadingCollection);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Cinematic light sweep entrance on enter
      ScrollTrigger.create({
        trigger: section,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          gsap.fromTo(
            lightSweepRef.current,
            { scaleY: 0, opacity: 0 },
            { scaleY: 1, opacity: 1, duration: 1.2, ease: 'power2.out' }
          );
          gsap.fromTo(
            headlineRef.current,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', delay: 0.2 }
          );
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="act-collection"
      className="relative w-full bg-[#050505] text-white py-24 sm:py-32 lg:py-40 overflow-hidden border-t border-white/[0.08]"
    >
      {/* Subtle Vertical Light Sweep Beam (Opening Transition) */}
      <div
        ref={lightSweepRef}
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-gradient-to-b from-white/[0.06] via-red-950/[0.03] to-transparent blur-3xl transform origin-top"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12 sm:space-y-16">
        
        {/* Section Header: Typographic Moment */}
        <div ref={headlineRef} className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.25em] text-neutral-300 uppercase">
              ACT 07 — THE COLLECTION
            </span>
          </div>

          <h2 className="font-['Syne',sans-serif] text-4xl sm:text-6xl lg:text-7xl font-black uppercase text-white tracking-tight leading-[0.92]">
            NOW CHOOSE <br />
            <span className="bg-gradient-to-r from-white via-neutral-200 to-red-500 bg-clip-text text-transparent">
              YOUR EDGE.
            </span>
          </h2>

          <div className="flex items-center gap-3 text-neutral-400 font-mono text-xs tracking-widest uppercase">
            <span>SSD SPORTS</span>
            <span>//</span>
            <span>PERFORMANCE EQUIPMENT</span>
          </div>

          <p className="text-neutral-400 text-xs sm:text-sm max-w-lg font-normal leading-relaxed">
            Your game. Your equipment. Your choice. Explore bats, gloves, protection, and gear engineered for unyielding precision.
          </p>
        </div>

        {/* Category Navigation Selector (Hairline Horizontal Bar) */}
        <div className="border-b border-white/[0.08] pb-4">
          <div className="flex items-center justify-between gap-4">
            {/* Scrollable Categories Track */}
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none py-1 -mx-2 px-2">
              {/* "ALL" Button */}
              <button
                onClick={() => handleCategorySelect('all')}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs font-mono tracking-widest uppercase transition-all duration-300 shrink-0 cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-white text-black font-extrabold shadow-md'
                    : 'bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                }`}
              >
                ALL EQUIPMENT
              </button>

              {/* Dynamic Shopify Collections */}
              {validCollections.map((col) => {
                const isActive = activeTab === col.handle;
                return (
                  <button
                    key={col.handle}
                    onClick={() => handleCategorySelect(col.handle)}
                    className={`px-4 sm:px-5 py-2 rounded-full text-xs font-mono tracking-widest uppercase transition-all duration-300 shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-white text-black font-extrabold shadow-md'
                        : 'bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                    }`}
                  >
                    {col.title}
                  </button>
                );
              })}
            </div>

            {/* Inventory Counter indicator */}
            <div className="hidden lg:flex items-center gap-2 font-mono text-[11px] text-neutral-500 shrink-0">
              <Filter className="w-3.5 h-3.5 text-neutral-400" />
              <span>{displayedProducts.length} PRODUCTS</span>
            </div>
          </div>
        </div>

        {/* Editorial Asymmetric Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="aspect-[4/5] rounded-2xl bg-neutral-900/50 border border-white/[0.06] animate-pulse p-6 flex flex-col justify-between"
              >
                <div className="w-full h-56 bg-neutral-800/50 rounded-xl" />
                <div className="space-y-3">
                  <div className="w-2/3 h-4 bg-neutral-800 rounded" />
                  <div className="w-1/3 h-4 bg-neutral-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : displayedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayedProducts.map((prod, idx) => (
              <EditorialProductCard
                key={prod.id || `${prod.handle}-${idx}`}
                product={prod}
                isFeatured={idx === 0} // Asymmetric editorial focus on primary product
              />
            ))}
          </div>
        ) : (
          /* Refined Empty State */
          <div className="py-20 text-center rounded-3xl bg-neutral-900/40 border border-white/[0.06] p-8 max-w-xl mx-auto space-y-4">
            <h3 className="font-['Syne',sans-serif] text-xl font-bold text-white uppercase tracking-wider">
              NO PRODUCTS IN THIS COLLECTION
            </h3>
            <p className="text-neutral-400 text-xs font-mono">
              The selected category currently has no available inventory.
            </p>
            <button
              onClick={() => handleCategorySelect('all')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
            >
              <span>EXPLORE ALL EQUIPMENT →</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
