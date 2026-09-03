import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getCollectionByHandle, getCollections, isShopifyConfigured } from '../services/shopify';
import ProductCard from './ProductCard';

export default function NewArrivals({ onQuickView }) {
  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const configured = isShopifyConfigured();

  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const offsetRef = useRef(0);
  const isHoveredRef = useRef(false);

  const [visibleCount, setVisibleCount] = useState(4); // 4 for desktop, 2 for tablet, 1 for mobile

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Fetch "New Arrivals" collection specifically from Shopify Storefront API
  useEffect(() => {
    let isMounted = true;

    async function fetchNewArrivals() {
      if (!configured) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 1. Fetch collection by handle "new-arrivals"
        let result = await getCollectionByHandle({ handle: 'new-arrivals', first: 20 });

        // 2. Fallback: Search all collections if specific handle is formatted differently
        if (!result.collection) {
          const allCollections = await getCollections({ first: 25 });
          const matched = allCollections.find(
            (c) =>
              c.handle === 'new-arrivals' ||
              c.title.toLowerCase().includes('new arrival') ||
              c.title.toLowerCase().includes('new arrivals')
          );
          if (matched) {
            result = await getCollectionByHandle({ handle: matched.handle, first: 20 });
          }
        }

        if (isMounted) {
          setCollection(result.collection);
          setProducts(result.products || []);
        }
      } catch (err) {
        console.error('Failed to fetch New Arrivals collection from Shopify:', err);
        if (isMounted) {
          setError('Unable to load new arrivals.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchNewArrivals();

    return () => {
      isMounted = false;
    };
  }, [configured]);

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

  // Build extended product list for seamless infinite loop
  const displayProducts = useMemo(() => {
    if (!products.length) return [];
    let list = products;
    while (list.length < 12) {
      list = [...list, ...products];
    }
    return [...list, ...list, ...list];
  }, [products]);

  // Continuous linear marquee animation loop using requestAnimationFrame
  useEffect(() => {
    if (loading || !products.length) return;

    // Check prefers-reduced-motion accessibility preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let animId;
    let lastTime = performance.now();
    const speedPixelsPerSecond = 45; // Smooth continuous speed

    const animate = (now) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (!isHoveredRef.current && trackRef.current && containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        if (containerWidth > 0) {
          const cardWidth = containerWidth / visibleCount;
          const singleSetWidth = cardWidth * products.length;

          // Advance offset right-to-left
          offsetRef.current += speedPixelsPerSecond * delta;

          // Seamless loop wrap-around
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

    // Delay initialization until DOM elements attach after loading completes
    const timerId = setTimeout(() => {
      lastTime = performance.now();
      animId = requestAnimationFrame(animate);
    }, 50);

    return () => {
      clearTimeout(timerId);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [products, loading, visibleCount]);

  // Manual navigation handlers
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

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
  };

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
    <section id="new-arrivals" className="py-16 sm:py-20 bg-[#f5f5f5] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            {collection?.title || 'New Arrivals'}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            {collection?.description || 'Discover the latest gear from SSD Sports.'}
          </p>
        </div>

        {/* Carousel Container */}
        <div
          ref={containerRef}
          className="relative group/carousel"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {loading ? (
            /* Skeleton Loading on Light Grey Background */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white border border-slate-200 rounded-2xl p-4 animate-pulse space-y-4 shadow-sm">
                  <div className="bg-slate-100 aspect-square rounded-2xl w-full"></div>
                  <div className="h-4 bg-slate-100 rounded w-3/4 mx-auto"></div>
                  <div className="h-4 bg-slate-100 rounded w-1/2 mx-auto"></div>
                  <div className="h-10 bg-slate-100 rounded-full w-3/4 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            /* Technical Error Fallback */
            <div className="text-center py-12 text-slate-600 text-sm font-semibold">
              {error}
            </div>
          ) : products.length === 0 ? (
            /* Empty Collection or Collection Not Found Fallback */
            <div className="text-center py-12 text-slate-600 text-sm font-semibold">
              New arrivals are coming soon.
            </div>
          ) : (
            /* Product Carousel Track */
            <div className="relative overflow-hidden px-1 py-2">
              
              {/* Left Arrow */}
              <button
                onClick={handlePrev}
                aria-label="Previous product"
                className="absolute left-2 sm:left-4 top-[40%] -translate-y-1/2 w-11 h-11 rounded-full bg-white text-slate-800 shadow-xl border border-slate-200 flex items-center justify-center z-20 hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Right Arrow */}
              <button
                onClick={handleNext}
                aria-label="Next product"
                className="absolute right-2 sm:right-4 top-[40%] -translate-y-1/2 w-11 h-11 rounded-full bg-white text-slate-800 shadow-xl border border-slate-200 flex items-center justify-center z-20 hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Carousel Track */}
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
                {displayProducts.map((product, idx) => (
                  <div
                    key={`${product.id}-${idx}`}
                    style={{ width: `${100 / visibleCount}%` }}
                    className="flex-shrink-0 px-2 sm:px-3"
                  >
                    <ProductCard product={product} onQuickView={onQuickView} />
                  </div>
                ))}
              </div>

            </div>
          )}
        </div>

      </div>
    </section>
  );
}
