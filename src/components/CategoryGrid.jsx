import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, CheckCircle2, RefreshCw } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

/**
 * Format price in INR (e.g. ₹2,889.00)
 */
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
  } catch (e) {
    return `₹${num.toFixed(2)}`;
  }
}

export default function CategoryGrid({ products: propProducts, loading: propLoading }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addItemToCart } = useCart();
  const [addingId, setAddingId] = useState(null);
  const [addedId, setAddedId] = useState(null);
  // Fetch dynamic products from Shopify Storefront API if not provided via props
  const hookResult = useProducts({ first: 20 });
  const rawProducts = propProducts && propProducts.length > 0 ? propProducts : hookResult.products;
  const isLoading = propLoading !== undefined ? propLoading : hookResult.loading;

  const products = useMemo(() => rawProducts || [], [rawProducts]);

  // References for continuous marquee animation
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const offsetRef = useRef(0);
  const isHoveredRef = useRef(false);

  const [visibleCount, setVisibleCount] = useState(4); // 4 for desktop, 2 for tablet, 1 for mobile

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Responsive breakpoint detection
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleCount(1);
      } else if (width < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Build extended product list for seamless continuous marquee loop
  const displayProducts = useMemo(() => {
    if (!products.length) return [];
    let list = products;
    // Repeat list enough times to ensure seamless infinite looping
    while (list.length < 12) {
      list = [...list, ...products];
    }
    return [...list, ...list, ...list];
  }, [products]);

  // Continuous linear marquee loop using requestAnimationFrame
  useEffect(() => {
    if (isLoading || !products.length) return;

    let animId;
    let lastTime = performance.now();
    const speedPixelsPerSecond = 45; // Smooth marquee speed (pixels per sec)

    const animate = (now) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (!isHoveredRef.current && trackRef.current && containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        if (containerWidth > 0) {
          const cardWidth = containerWidth / visibleCount;
          const singleSetWidth = cardWidth * products.length;

          // Continuously advance offset from right to left
          offsetRef.current += speedPixelsPerSecond * delta;

          // Seamless infinite loop wrap-around
          if (offsetRef.current >= singleSetWidth) {
            offsetRef.current %= singleSetWidth;
          } else if (offsetRef.current < 0) {
            offsetRef.current = (offsetRef.current % singleSetWidth) + singleSetWidth;
          }

          trackRef.current.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
        }
      }

      animId = requestAnimationFrame(animate);
    };

    // Ensure DOM refs are attached after loading finishes before starting animation loop
    const timerId = setTimeout(() => {
      lastTime = performance.now();
      animId = requestAnimationFrame(animate);
    }, 50);

    return () => {
      clearTimeout(timerId);
      if (animId) {
        cancelAnimationFrame(animId);
      }
    };
  }, [products, isLoading, visibleCount]);

  // Manual navigation handlers that shift the marquee position smoothly
  const handleNext = () => {
    if (!containerRef.current || !trackRef.current || !products.length) return;
    const containerWidth = containerRef.current.clientWidth;
    const cardWidth = containerWidth / visibleCount;
    const singleSetWidth = cardWidth * products.length;

    offsetRef.current += cardWidth;
    if (offsetRef.current >= singleSetWidth) {
      offsetRef.current %= singleSetWidth;
    }

    trackRef.current.style.transition = 'transform 350ms cubic-bezier(0.25, 1, 0.5, 1)';
    trackRef.current.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;

    setTimeout(() => {
      if (trackRef.current) {
        trackRef.current.style.transition = 'none';
      }
    }, 350);
  };

  const handlePrev = () => {
    if (!containerRef.current || !trackRef.current || !products.length) return;
    const containerWidth = containerRef.current.clientWidth;
    const cardWidth = containerWidth / visibleCount;
    const singleSetWidth = cardWidth * products.length;

    offsetRef.current -= cardWidth;
    if (offsetRef.current < 0) {
      offsetRef.current = (offsetRef.current % singleSetWidth) + singleSetWidth;
    }

    trackRef.current.style.transition = 'transform 350ms cubic-bezier(0.25, 1, 0.5, 1)';
    trackRef.current.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;

    setTimeout(() => {
      if (trackRef.current) {
        trackRef.current.style.transition = 'none';
      }
    }, 350);
  };

  // Mouse hover event handlers
  const handleMouseEnter = () => {
    isHoveredRef.current = true;
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
  };

  // Touch gesture support for mobile touch devices
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
    isHoveredRef.current = true;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current && touchEndX.current) {
      const diff = touchStartX.current - touchEndX.current;
      if (diff > 40) {
        handleNext();
      } else if (diff < -40) {
        handlePrev();
      }
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
    isHoveredRef.current = false;
  };

  return (
    <section id="best-sellers" className="py-16 sm:py-24 bg-[#0B0F17] border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-[#FF2E4D]">
            MATCH-WINNING GEAR
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-black text-white tracking-wider uppercase">
            Shop Our Best Sellers
          </h2>
        </div>

        {/* Carousel Container */}
        <div
          ref={containerRef}
          className="relative group/carousel"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {isLoading ? (
            /* Loading Skeleton */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 animate-pulse space-y-4">
                  <div className="bg-slate-800 aspect-square rounded-xl"></div>
                  <div className="h-4 bg-slate-800 rounded w-3/4 mx-auto"></div>
                  <div className="h-4 bg-slate-800 rounded w-1/2 mx-auto"></div>
                  <div className="h-10 bg-slate-800 rounded-full w-3/4 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              No best sellers available at the moment.
            </div>
          ) : (
            <div className="relative overflow-hidden px-1 py-2">
              
              {/* Left Navigation Arrow */}
              <button
                onClick={handlePrev}
                aria-label="Previous product"
                className="absolute left-2 sm:left-4 top-[40%] -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/90 text-white shadow-2xl border border-white/15 flex items-center justify-center z-20 hover:bg-[#FF2E4D] hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Right Navigation Arrow */}
              <button
                onClick={handleNext}
                aria-label="Next product"
                className="absolute right-2 sm:right-4 top-[40%] -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/90 text-white shadow-2xl border border-white/15 flex items-center justify-center z-20 hover:bg-[#FF2E4D] hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Continuous Marquee Track */}
              <div
                ref={trackRef}
                className="flex will-change-transform"
                style={{
                  transform: 'translate3d(0px, 0, 0)',
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {displayProducts.map((product, idx) => {
                  // Extract image array from Shopify product response
                  const imageNodes = product.images?.edges?.map((e) => e.node) || [];
                  const firstImageUrl = imageNodes[0]?.url || product.featuredImage?.url || '';
                  const secondImageUrl = imageNodes[1]?.url || null;

                  // Pricing details
                  const minPrice = product.priceRange?.minVariantPrice?.amount;
                  const compareAtAmount =
                    product.compareAtPriceRange?.minVariantPrice?.amount ||
                    product.variants?.nodes?.[0]?.compareAtPrice?.amount;

                  const numericPrice = parseFloat(minPrice || 0);
                  const numericCompareAt = compareAtAmount ? parseFloat(compareAtAmount) : 0;
                  const hasCompareAt = numericCompareAt > numericPrice;

                  let discountPercent = 0;
                  if (hasCompareAt && numericCompareAt > 0) {
                    discountPercent = Math.round(((numericCompareAt - numericPrice) / numericCompareAt) * 100);
                  }

                  const isNewTag = product.tags?.some(
                    (t) => typeof t === 'string' && t.toLowerCase().includes('new')
                  );

                  const firstVariant = product.variants?.nodes?.[0];
                  const isAvailable = firstVariant
                    ? firstVariant.availableForSale
                    : product.availableForSale ?? true;

                  const isFav = product?.id ? isInWishlist(product.id) : false;

                  return (
                    <div
                      key={`${product.id}-${idx}`}
                      style={{ width: `${100 / visibleCount}%` }}
                      className="flex-shrink-0 px-2 sm:px-3"
                    >
                      <div className="group bg-[#111827] rounded-2xl flex flex-col justify-between h-full border border-white/10 hover:border-[#FF2E4D]/40 transition-all duration-500 overflow-hidden hover:shadow-[0_12px_25px_rgba(255,46,77,0.15)]">
                        
                        {/* Product Image Container */}
                        <Link
                          to={`/products/${product.handle}`}
                          className="relative bg-[#1A2234] aspect-[4/5] sm:aspect-square flex items-center justify-center p-4 block overflow-hidden"
                        >
                          {/* Badges in Top-Left */}
                          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start pointer-events-none">
                            {!isAvailable ? (
                              <span className="bg-slate-900/90 text-slate-300 text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border border-white/10 tracking-wider">
                                Out of Stock
                              </span>
                            ) : (
                              <>
                                {isNewTag && (
                                  <span className="bg-[#10b981] text-white text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full shadow-sm tracking-wide">
                                    New!
                                  </span>
                                )}
                                {hasCompareAt && discountPercent > 0 && (
                                  <span className="bg-[#FF2E4D] text-white text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full shadow-sm">
                                    -{discountPercent}%
                                  </span>
                                )}
                              </>
                            )}
                          </div>

                          {/* Wishlist Button Top-Right */}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleWishlist(product);
                            }}
                            aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
                            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/15 flex items-center justify-center text-slate-300 hover:text-[#FF2E4D] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
                          >
                            <svg
                              className={`w-4 h-4 transition-colors ${
                                isFav ? 'fill-[#FF2E4D] text-[#FF2E4D]' : 'fill-none stroke-current'
                              }`}
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.684a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>

                          {/* Images */}
                          {firstImageUrl ? (
                            <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
                              <img
                                src={firstImageUrl}
                                alt={product.title || 'Product'}
                                className={`w-full h-full object-contain transform group-hover:scale-105 transition-all duration-500 ${
                                  secondImageUrl ? 'group-hover:opacity-0 opacity-100' : 'opacity-100'
                                } ${!isAvailable ? 'opacity-50 grayscale-[40%]' : ''}`}
                                loading="lazy"
                              />
                              {secondImageUrl && (
                                <img
                                  src={secondImageUrl}
                                  alt={`${product.title || 'Product'} alt`}
                                  className="w-full h-full object-contain absolute inset-0 opacity-0 group-hover:opacity-100 transform group-hover:scale-105 transition-all duration-500"
                                  loading="lazy"
                                />
                              )}
                            </div>
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                              <span className="text-xs">No image</span>
                            </div>
                          )}
                        </Link>

                        {/* Info below image */}
                        <div className="p-4 flex flex-col flex-1 justify-between text-center space-y-3">
                          <div>
                            <Link
                              to={`/products/${product.handle}`}
                              className="font-bold text-white text-sm sm:text-base tracking-tight leading-snug line-clamp-2 hover:text-[#FF2E4D] transition-colors cursor-pointer min-h-[2.5rem] block"
                              title={product.title}
                            >
                              {product.title}
                            </Link>
                          </div>

                          {/* Pricing */}
                          <div className="flex items-center justify-center gap-2.5 flex-wrap">
                            <span className="text-[#FF2E4D] font-extrabold text-base sm:text-lg">
                              {formatINR(minPrice)}
                            </span>
                            {hasCompareAt && (
                              <span className="text-slate-400 text-xs sm:text-sm line-through font-medium">
                                {formatINR(compareAtAmount)}
                              </span>
                            )}
                          </div>

                          {/* Add to Cart Button */}
                          <div className="pt-1">
                            <button
                              onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!isAvailable) return;
                                const firstVariantId = firstVariant?.id;
                                if (!firstVariantId) return;
                                setAddingId(product.id);
                                try {
                                  await addItemToCart(firstVariantId, 1, product.title);
                                  setAddedId(product.id);
                                  setTimeout(() => setAddedId(null), 2500);
                                } catch (err) {
                                  console.error('Failed to add to cart:', err);
                                } finally {
                                  setAddingId(null);
                                }
                              }}
                              disabled={addingId === product.id || !isAvailable}
                              className={`w-full py-2.5 px-4 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                                !isAvailable
                                  ? 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed opacity-75'
                                  : addedId === product.id
                                  ? 'bg-emerald-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                                  : 'bg-[#FF2E4D] hover:bg-red-600 text-white shadow-[0_0_12px_rgba(255,46,77,0.35)] hover:scale-102 active:scale-95'
                              }`}
                            >
                              {!isAvailable ? (
                                <span>Sold Out</span>
                              ) : addingId === product.id ? (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  <span>Adding...</span>
                                </>
                              ) : addedId === product.id ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                  <span>Added!</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingBag className="w-3.5 h-3.5" />
                                  <span>Add to Cart</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}
        </div>

      </div>
    </section>
  );
}
