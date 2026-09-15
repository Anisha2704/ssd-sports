import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Minus,
  Plus,
  ArrowLeft,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Heart,
} from 'lucide-react';

import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { useProduct } from '../hooks/useProduct';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

/**
 * Format amount as INR currency (e.g. ₹3,700.00)
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

export default function ProductDetailsPage() {
  const { handle } = useParams();
  const navigate = useNavigate();
  const { product, relatedProducts, loading, error, refetch } = useProduct(handle);
  const { addItemToCart, buyNow, addingItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isFav = product?.id ? isInWishlist(product.id) : false;

  // State for user interactions
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Update page SEO title when product loads
  useEffect(() => {
    if (product?.title) {
      document.title = `${product.title} | SSD Sports`;
    } else {
      document.title = 'Product Details | SSD Sports';
    }
  }, [product]);

  // Extract all images array safely
  const images = useMemo(() => {
    if (!product) return [];
    const imageEdges = product.images?.edges?.map((e) => e.node) || [];
    if (imageEdges.length > 0) return imageEdges;
    if (product.featuredImage) return [product.featuredImage];
    return [];
  }, [product]);

  // Initialize selected options when product loads
  useEffect(() => {
    if (product?.options && product.options.length > 0) {
      const initial = {};
      // By default select options matching first available variant or first values
      const firstVariant = product.variants?.nodes?.find((v) => v.availableForSale) || product.variants?.nodes?.[0];
      
      product.options.forEach((opt) => {
        const matchingOpt = firstVariant?.selectedOptions?.find((so) => so.name === opt.name);
        initial[opt.name] = matchingOpt ? matchingOpt.value : opt.values[0];
      });
      
      setSelectedOptions(initial);
      setSelectedImageIndex(0);
      setQuantity(1);
    }
  }, [product]);

  // Find exact matching Shopify variant based on selectedOptions
  const selectedVariant = useMemo(() => {
    if (!product?.variants?.nodes || !product?.options) return null;
    return product.variants.nodes.find((variant) => {
      return variant.selectedOptions.every(
        (so) => selectedOptions[so.name] === so.value
      );
    }) || null;
  }, [product, selectedOptions]);

  // Update selected image if selected variant has a specific image
  useEffect(() => {
    if (selectedVariant?.image?.url && images.length > 0) {
      const idx = images.findIndex((img) => img.url === selectedVariant.image.url);
      if (idx !== -1) {
        setSelectedImageIndex(idx);
      }
    }
  }, [selectedVariant, images]);

  // Check availability
  const isAvailable = selectedVariant
    ? selectedVariant.availableForSale
    : product?.availableForSale ?? false;

  // Active pricing calculation
  const currentPrice = selectedVariant?.price?.amount || product?.priceRange?.minVariantPrice?.amount;
  const compareAtPrice = selectedVariant?.compareAtPrice?.amount || product?.compareAtPriceRange?.minVariantPrice?.amount;

  const numCurrentPrice = parseFloat(currentPrice || 0);
  const numCompareAtPrice = compareAtPrice ? parseFloat(compareAtPrice) : 0;
  const hasDiscount = numCompareAtPrice > numCurrentPrice;

  let discountPercent = 0;
  if (hasDiscount && numCompareAtPrice > 0) {
    discountPercent = Math.round(((numCompareAtPrice - numCurrentPrice) / numCompareAtPrice) * 100);
  }

  // Handle option selection
  const handleOptionChange = (optionName, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
  };

  // Handle Add to Cart submission
  const handleAddToCart = async () => {
    if (!selectedVariant?.id || !isAvailable) return;
    try {
      await addItemToCart(selectedVariant.id, quantity);
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 3500);
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  // Handle Buy Now submission
  const handleBuyNow = async () => {
    if (!selectedVariant?.id || !isAvailable) return;
    try {
      await buyNow(selectedVariant.id, quantity);
    } catch (err) {
      console.error('Failed buy now execution:', err);
    }
  };

  // Filter out default single options like "Title: Default Title"
  const visibleOptions = useMemo(() => {
    if (!product?.options) return [];
    return product.options.filter((option) => {
      const isDefaultTitle =
        (option.name.toLowerCase() === 'title' || option.name === 'Title') &&
        (option.values.includes('Default Title') || (option.values.length === 1 && option.values[0] === 'Default Title'));
      return !isDefaultTitle;
    });
  }, [product]);

  // Build product specifications dynamically (omit empty fields)
  const specifications = useMemo(() => {
    if (!product) return [];
    const list = [];

    if (product.vendor) {
      list.push({ label: 'Vendor / Brand', value: product.vendor });
    }
    if (product.category?.name) {
      list.push({ label: 'Category', value: product.category.name });
    }
    if (product.productType) {
      list.push({ label: 'Product Type', value: product.productType });
    }
    if (product.tags && product.tags.length > 0) {
      list.push({ label: 'Tags', value: product.tags.join(', ') });
    }

    // Selected variant options info (exclude Default Title)
    if (selectedVariant?.selectedOptions) {
      selectedVariant.selectedOptions.forEach((so) => {
        if (so.name.toLowerCase() !== 'title' && so.value !== 'Default Title') {
          list.push({ label: so.name.charAt(0).toUpperCase() + so.name.slice(1), value: so.value });
        }
      });
    }

    return list;
  }, [product, selectedVariant]);

  // Loading Skeleton State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col font-sans">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
          <div className="h-4 bg-slate-900 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-4">
            <div className="space-y-4">
              <div className="bg-slate-900 border border-white/10 rounded-2xl aspect-square w-full"></div>
              <div className="flex gap-3">
                <div className="bg-slate-900 rounded-lg w-20 h-20"></div>
                <div className="bg-slate-900 rounded-lg w-20 h-20"></div>
                <div className="bg-slate-900 rounded-lg w-20 h-20"></div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-slate-900 rounded w-3/4"></div>
              <div className="h-6 bg-slate-900 rounded w-1/3"></div>
              <div className="h-24 bg-slate-900 rounded w-full"></div>
              <div className="h-12 bg-slate-900 rounded w-1/2"></div>
              <div className="h-12 bg-slate-900 rounded w-full"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col font-sans">
        <Header />
        <main className="flex-1 max-w-xl w-full mx-auto px-4 py-20 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-950 text-[#FF2E4D] border border-red-800 mx-auto flex items-center justify-center">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-white">Failed to Load Product</h1>
            <p className="text-slate-400 text-sm">{error}</p>
          </div>
          <button
            onClick={refetch}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF2E4D] hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all shadow-md cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  // Product Not Found State
  if (!product) {
    return (
      <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col font-sans">
        <Header />
        <main className="flex-1 max-w-xl w-full mx-auto px-4 py-20 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-slate-900 text-slate-400 border border-white/10 mx-auto flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
          </div>
          <div className="space-y-2">
            <h1 className="font-heading text-2xl font-black text-white uppercase tracking-wider">Product Not Found</h1>
            <p className="text-slate-400 text-sm">
              The product you are looking for does not exist or may have been removed from our catalog.
            </p>
          </div>
          <div>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF2E4D] hover:bg-red-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-full transition-all shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Catalog</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentMainImage = images[selectedImageIndex] || images[0] || product.featuredImage;

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12">
        
        {/* 1. Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center text-xs font-semibold text-slate-400 space-x-2">
          <Link to="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          <Link to="/catalog" className="hover:text-white transition-colors">
            Catalog
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-[#FF2E4D] font-bold truncate max-w-[240px] sm:max-w-md">
            {product.title}
          </span>
        </nav>

        {/* Success Toast Floating Alert */}
        {addedToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-white/15 flex items-center gap-3 animate-slide-up">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-white">Added to cart!</p>
              <p className="text-slate-400">{product.title} (x{quantity})</p>
            </div>
            <Link
              to="/cart"
              className="ml-3 text-xs font-bold text-[#FF2E4D] hover:underline shrink-0"
            >
              View Cart
            </Link>
          </div>
        )}

        {/* 2. Main Product Hero Section (Image Gallery + Info) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Image Gallery (Span 7) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            
            {/* Main Product Display Container */}
            <div className="relative bg-[#1A2234] rounded-3xl overflow-hidden aspect-[4/5] sm:aspect-square flex items-center justify-center p-6 border border-white/10 group shadow-2xl">
              
              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
                {product.vendor && (
                  <span className="bg-slate-950/90 border border-white/15 text-slate-200 text-[11px] font-mono font-extrabold uppercase px-3 py-1 rounded-full shadow-sm tracking-wider">
                    {product.vendor}
                  </span>
                )}
                {hasDiscount && discountPercent > 0 && (
                  <span className="bg-[#FF2E4D] text-white text-[11px] font-black font-mono px-3 py-1 rounded-full shadow-sm">
                    -{discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Main Image */}
              {currentMainImage?.url ? (
                <img
                  src={currentMainImage.url}
                  alt={currentMainImage.altText || product.title}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-500 space-y-2">
                  <ShoppingBag className="w-12 h-12 stroke-1" />
                  <span className="text-xs">No image available</span>
                </div>
              )}
            </div>

            {/* Thumbnail Navigation Gallery */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none snap-x">
                {images.map((img, index) => {
                  const isSelected = index === selectedImageIndex;
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 bg-[#1A2234] shrink-0 transition-all duration-200 snap-start p-1 cursor-pointer ${
                        isSelected
                          ? 'border-[#FF2E4D] shadow-lg scale-105'
                          : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                      }`}
                      aria-label={`View image ${index + 1}`}
                    >
                      <img
                        src={img.url}
                        alt={img.altText || `${product.title} thumbnail ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Product Information (Span 5) */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            
            {/* Title & Availability */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    isAvailable
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                      : 'bg-red-950/80 text-red-400 border border-red-800'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'
                    }`}
                  ></span>
                  {isAvailable ? 'In Stock' : 'Currently Unavailable'}
                </span>

                {product.category?.name && (
                  <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
                    {product.category.name}
                  </span>
                )}
              </div>

              <div className="flex items-start justify-between gap-4">
                <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-wider uppercase leading-snug">
                  {product.title}
                </h1>
                <button
                  onClick={() => toggleWishlist(product)}
                  aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
                  className="w-10 h-10 rounded-full bg-slate-900 hover:bg-slate-800 border border-white/15 shadow-sm flex items-center justify-center text-slate-300 hover:text-[#FF2E4D] hover:scale-110 active:scale-95 transition-all shrink-0 mt-1 cursor-pointer"
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      isFav ? 'fill-[#FF2E4D] text-[#FF2E4D]' : 'fill-none stroke-current'
                    }`}
                    strokeWidth={2}
                  />
                </button>
              </div>
            </div>

            {/* Price Display */}
            <div className="flex items-baseline gap-3 pt-1 border-t border-white/10">
              <span className="text-3xl font-black text-[#FF2E4D] tracking-tight font-mono">
                {formatINR(numCurrentPrice)}
              </span>
              {hasDiscount && (
                <span className="text-base text-slate-400 line-through font-medium font-mono">
                  {formatINR(numCompareAtPrice)}
                </span>
              )}
            </div>

            {/* Product Rich Text Description */}
            {product.descriptionHtml && (
              <div
                className="text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-white/10 pt-4 prose prose-invert max-w-none [&_p]:mb-2 [&_strong]:text-white [&_ul]:list-disc [&_ul]:pl-5"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            )}

            {/* Dynamic Variant Selectors */}
            {visibleOptions && visibleOptions.length > 0 && (
              <div className="space-y-4 border-t border-white/10 pt-4">
                {visibleOptions.map((option) => (
                  <div key={option.id} className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-white uppercase tracking-wider">
                      <span>{option.name}</span>
                      <span className="text-slate-400 font-normal">
                        {selectedOptions[option.name] || 'Select'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {option.values.map((val) => {
                        const isSelected = selectedOptions[option.name] === val;
                        return (
                          <button
                            key={val}
                            onClick={() => handleOptionChange(option.name, val)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 border cursor-pointer ${
                              isSelected
                                ? 'bg-[#FF2E4D] text-white border-[#FF2E4D] shadow-[0_0_12px_rgba(255,46,77,0.4)] scale-105'
                                : 'bg-slate-900 text-slate-300 border-white/10 hover:bg-slate-800 hover:border-white/20'
                            }`}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Unavailable variant warning notice */}
            {selectedVariant && !isAvailable && (
              <div className="p-3.5 bg-amber-950/80 border border-amber-800 rounded-2xl flex items-center gap-2.5 text-xs text-amber-200 font-medium">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>The selected option combination is currently out of stock.</span>
              </div>
            )}

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-4 border-t border-white/10 pt-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Quantity</span>
                <div className="flex items-center bg-slate-900 border border-white/15 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || !isAvailable}
                    aria-label="Decrease quantity"
                    className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-white hover:bg-[#FF2E4D] disabled:opacity-40 disabled:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-bold text-xs font-mono text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    disabled={!isAvailable}
                    aria-label="Increase quantity"
                    className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-white hover:bg-[#FF2E4D] disabled:opacity-40 disabled:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons: ADD TO CART & BUY NOW */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={!isAvailable || addingItem}
                  className="w-full py-4 px-6 rounded-2xl bg-slate-900 border border-white/20 text-white font-extrabold text-xs uppercase tracking-wider hover:bg-slate-800 hover:border-white/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  {addingItem ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={!isAvailable || addingItem}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-[#FF2E4D] hover:from-red-500 hover:to-[#FF4763] text-white font-extrabold text-xs uppercase tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,46,77,0.35)] cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>

            {/* Value Highlights */}
            <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-6 text-center">
              <div className="p-3 bg-slate-900/80 border border-white/10 rounded-2xl space-y-1">
                <Truck className="w-5 h-5 text-[#FF2E4D] mx-auto" />
                <p className="text-[11px] font-bold text-white">Fast Shipping</p>
                <p className="text-[10px] text-slate-400">Pan India Delivery</p>
              </div>
              <div className="p-3 bg-slate-900/80 border border-white/10 rounded-2xl space-y-1">
                <ShieldCheck className="w-5 h-5 text-[#FF2E4D] mx-auto" />
                <p className="text-[11px] font-bold text-white">100% Authentic</p>
                <p className="text-[10px] text-slate-400">Direct from SSD</p>
              </div>
              <div className="p-3 bg-slate-900/80 border border-white/10 rounded-2xl space-y-1">
                <RotateCcw className="w-5 h-5 text-[#FF2E4D] mx-auto" />
                <p className="text-[11px] font-bold text-white">Easy Returns</p>
                <p className="text-[10px] text-slate-400">Hassle Free Policy</p>
              </div>
            </div>

          </div>
        </div>

        {/* 3. Product Specifications Table */}
        {specifications.length > 0 && (
          <div className="border-t border-white/10 pt-10 space-y-6">
            <h2 className="font-heading text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
              Product Specifications
            </h2>

            <div className="bg-slate-900/80 rounded-3xl border border-white/10 overflow-hidden max-w-3xl">
              <dl className="divide-y divide-white/10">
                {specifications.map((spec, index) => (
                  <div
                    key={index}
                    className="px-6 py-4 grid grid-cols-3 gap-4 hover:bg-slate-800/50 transition-colors"
                  >
                    <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">{spec.label}</dt>
                    <dd className="text-xs font-semibold text-white col-span-2">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        )}

        {/* 4. Related Products Section ("YOU MAY ALSO LIKE") */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-white/10 pt-12 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
                You May Also Like
              </h2>
              <Link
                to="/catalog"
                className="text-xs font-bold uppercase tracking-wider text-[#FF2E4D] hover:underline transition-colors"
              >
                View Catalog &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard
                  key={relProduct.id}
                  product={relProduct}
                />
              ))}
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

