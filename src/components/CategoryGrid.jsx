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
    <section id="best-sellers" className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
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
                <div key={n} className="bg-slate-50 rounded-2xl p-4 animate-pulse space-y-4">
                  <div className="bg-slate-200 aspect-square rounded-xl"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto"></div>
                  <div className="h-10 bg-slate-200 rounded-full w-3/4 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No best sellers available at the moment.
            </div>
          ) : (
            <div className="relative overflow-hidden px-1 py-2">
              
              {/* Left Navigation Arrow */}
              <button
                onClick={handlePrev}
                aria-label="Previous product"
                className="absolute left-2 sm:left-4 top-[40%] -translate-y-1/2 w-11 h-11 rounded-full bg-white text-slate-800 shadow-xl border border-slate-200 flex items-center justify-center z-20 hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Right Navigation Arrow */}
              <button
                onClick={handleNext}
                aria-label="Next product"
                className="absolute right-2 sm:right-4 top-[40%] -translate-y-1/2 w-11 h-11 rounded-full bg-white text-slate-800 shadow-xl border border-slate-200 flex items-center justify-center z-20 hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none"
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
                      <div className="group bg-white rounded-2xl flex flex-col justify-between h-full transition-all duration-300">
                        
                        {/* Product Image Container with Light Gray Background */}
                        <Link
                          to={`/products/${product.handle}`}
                          className="relative bg-[#f3f4f6] rounded-2xl overflow-hidden aspect-[4/5] sm:aspect-square flex items-center justify-center p-4 block"
                        >
                          {/* Badges in Top-Left */}
                          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start pointer-events-none">
                            {!isAvailable ? (
                              <span className="bg-slate-800 text-white text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full shadow-sm tracking-wider">
                                Out of Stock
                              </span>
                            ) : (
                              <>
                                {isNewTag && (
                                  <span className="bg-[#10b981] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm tracking-wide">
                                    New!
                                  </span>
                                )}
                                {hasCompareAt && discountPercent > 0 && (
                                  <span className="bg-[#ef4444] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full font-mono shadow-sm">
                                    -{discountPercent}%
                                  </span>
                                )}
                              </>
                            )}
                          </div>

                          {/* Heart / Wishlist Icon in Top-Right */}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleWishlist(product);
                            }}
                            aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
                            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 hover:text-red-500 hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none"
                          >
                            <svg
                              className={`w-5 h-5 transition-colors ${
                                isFav ? 'fill-red-500 text-red-500' : 'fill-none stroke-current'
                              }`}
                              viewBox="0 0 24 24"
                              strokeWidth={1.8}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                              />
                            </svg>
                          </button>

                          {/* Product Main & Hover Images */}
                          {firstImageUrl ? (
                            <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
                              {/* Default First Image */}
                              <img
                                src={firstImageUrl}
                                alt={product.title || 'Product'}
                                className={`w-full h-full object-contain transition-opacity duration-500 ${
                                  secondImageUrl ? 'group-hover:opacity-0 opacity-100' : 'opacity-100'
                                } ${!isAvailable ? 'opacity-60 grayscale-[30%]' : ''}`}
                                loading="lazy"
                              />

                              {/* Hover Second Image */}
                              {secondImageUrl && (
                                <img
                                  src={secondImageUrl}
                                  alt={`${product.title || 'Product'} alternate view`}
                                  className="w-full h-full object-contain absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                  loading="lazy"
                                />
                              )}
                            </div>
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                              <svg className="w-10 h-10 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="text-xs">No image</span>
                            </div>
                          )}
                        </Link>

                        {/* Product Title, Prices & Action Button below image */}
                        <div className="pt-4 pb-2 px-1 flex flex-col flex-1 justify-between text-center space-y-2">
                          <div>
                            <Link
                              to={`/products/${product.handle}`}
                              className="font-bold text-slate-900 text-sm sm:text-base tracking-tight leading-snug line-clamp-2 hover:text-red-600 transition-colors cursor-pointer min-h-[2.5rem] block"
                              title={product.title}
                            >
                              {product.title}
                            </Link>
                          </div>

                          {/* Pricing */}
                          <div className="flex items-center justify-center gap-2 flex-wrap pt-1">
                            <span className="text-red-500 font-extrabold text-sm sm:text-base">
                              {formatINR(minPrice)}
                            </span>
                            {hasCompareAt && (
                              <span className="text-slate-400 text-xs sm:text-sm line-through font-normal">
                                {formatINR(compareAtAmount)}
                              </span>
                            )}
                          </div>

                          {/* Add to Cart Button */}
                          <div className="pt-2">
                            <button
                              onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!isAvailable) {
                                  showToast({
                                    type: 'warning',
                                    title: 'Out of Stock',
                                    message: `${product.title || 'Product'} is currently out of stock.`,
                                  });
                                  return;
                                }
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
                              className={`w-full max-w-[210px] mx-auto py-2.5 px-5 rounded-full border text-xs sm:text-sm font-bold transition-all duration-300 shadow-sm flex items-center justify-center gap-2 ${
                                !isAvailable
                                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-80'
                                  : addedId === product.id
                                  ? 'bg-emerald-600 text-white border-emerald-600'
                                  : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-900 hover:text-white hover:border-slate-900 active:scale-95'
                              }`}
                            >
                              {!isAvailable ? (
                                <span>Out of Stock</span>
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
