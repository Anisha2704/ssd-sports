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
      <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-4">
            <div className="space-y-4">
              <div className="bg-slate-200 rounded-2xl aspect-square w-full"></div>
              <div className="flex gap-3">
                <div className="bg-slate-200 rounded-lg w-20 h-20"></div>
                <div className="bg-slate-200 rounded-lg w-20 h-20"></div>
                <div className="bg-slate-200 rounded-lg w-20 h-20"></div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-slate-200 rounded w-3/4"></div>
              <div className="h-6 bg-slate-200 rounded w-1/3"></div>
              <div className="h-24 bg-slate-200 rounded w-full"></div>
              <div className="h-12 bg-slate-200 rounded w-1/2"></div>
              <div className="h-12 bg-slate-200 rounded w-full"></div>
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
      <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
        <Header />
        <main className="flex-1 max-w-xl w-full mx-auto px-4 py-20 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 mx-auto flex items-center justify-center border border-red-100">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-slate-900">Failed to Load Product</h1>
            <p className="text-slate-500 text-sm">{error}</p>
          </div>
          <button
            onClick={refetch}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-full transition-all shadow-md"
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
      <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
        <Header />
        <main className="flex-1 max-w-xl w-full mx-auto px-4 py-20 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 mx-auto flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-slate-900 uppercase tracking-tight">Product Not Found</h1>
            <p className="text-slate-500 text-sm">
              The product you are looking for does not exist or may have been removed from our catalog.
            </p>
          </div>
          <div>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-full transition-all shadow-lg shadow-red-600/20"
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
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12">
        
        {/* 1. Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center text-xs font-semibold text-slate-500 space-x-2">
          <Link to="/" className="hover:text-slate-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/catalog" className="hover:text-slate-900 transition-colors">
            Catalog
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold truncate max-w-[240px] sm:max-w-md">
            {product.title}
          </span>
        </nav>

        {/* Success Toast Floating Alert */}
        {addedToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-slide-up">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-white">Added to cart!</p>
              <p className="text-slate-400">{product.title} (x{quantity})</p>
            </div>
            <Link
              to="/cart"
              className="ml-3 text-xs font-bold text-red-400 hover:text-red-300 underline underline-offset-2 shrink-0"
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
            <div className="relative bg-[#f4f5f7] rounded-3xl overflow-hidden aspect-[4/5] sm:aspect-square flex items-center justify-center p-6 border border-slate-100 group shadow-inner">
              
              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
                {product.vendor && (
                  <span className="bg-slate-900 text-white text-[11px] font-extrabold uppercase px-3 py-1 rounded-full shadow-sm tracking-wider">
                    {product.vendor}
                  </span>
                )}
                {hasDiscount && discountPercent > 0 && (
                  <span className="bg-red-600 text-white text-[11px] font-black font-mono px-3 py-1 rounded-full shadow-sm">
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
                <div className="flex flex-col items-center justify-center text-slate-400 space-y-2">
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
                      className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 bg-[#f4f5f7] shrink-0 transition-all duration-200 snap-start p-1 ${
                        isSelected
                          ? 'border-red-600 shadow-md ring-2 ring-red-600/20 scale-105'
                          : 'border-slate-200 hover:border-slate-400 opacity-75 hover:opacity-100'
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
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                    }`}
                  ></span>
                  {isAvailable ? 'In Stock' : 'Currently Unavailable'}
                </span>

                {product.category?.name && (
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {product.category.name}
                  </span>
                )}
              </div>

              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
                  {product.title}
                </h1>
                <button
                  onClick={() => toggleWishlist(product)}
                  aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
                  className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 hover:text-red-600 hover:scale-110 active:scale-95 transition-all shrink-0 mt-1"
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      isFav ? 'fill-red-500 text-red-500' : 'fill-none stroke-current'
                    }`}
                    strokeWidth={1.8}
                  />
                </button>
              </div>
            </div>

            {/* Price Display */}
            <div className="flex items-baseline gap-3 pt-1 border-t border-slate-100">
              <span className="text-3xl font-black text-red-600 tracking-tight font-mono">
                {formatINR(numCurrentPrice)}
              </span>
              {hasDiscount && (
                <span className="text-base text-slate-400 line-through font-normal font-mono">
                  {formatINR(numCompareAtPrice)}
                </span>
              )}
            </div>

            {/* Product Rich Text Description */}
            {product.descriptionHtml && (
              <div
                className="text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 pt-4 prose prose-slate max-w-none [&_p]:mb-2 [&_strong]:text-slate-900 [&_ul]:list-disc [&_ul]:pl-5"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            )}

            {/* Dynamic Variant Selectors */}
            {visibleOptions && visibleOptions.length > 0 && (
              <div className="space-y-4 border-t border-slate-100 pt-4">
                {visibleOptions.map((option) => (
                  <div key={option.id} className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>{option.name}</span>
                      <span className="text-slate-500 font-normal">
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
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border ${
                              isSelected
                                ? 'bg-slate-900 text-white border-slate-900 shadow-sm scale-105'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
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
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-2.5 text-xs text-amber-800 font-medium">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>The selected option combination is currently out of stock.</span>
              </div>
            )}

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-4 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-800">Quantity</span>
                <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || !isAvailable}
                    aria-label="Decrease quantity"
                    className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-white transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-bold text-xs font-mono">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    disabled={!isAvailable}
                    aria-label="Increase quantity"
                    className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-white transition-colors"
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
                  className="w-full py-4 px-6 rounded-2xl bg-white border-2 border-slate-900 text-slate-900 font-extrabold text-xs uppercase tracking-wider hover:bg-slate-900 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
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
                  className="w-full py-4 px-6 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-red-600/25"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>

            {/* Value Highlights */}
            <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-6 text-center">
              <div className="p-3 bg-slate-50 rounded-2xl space-y-1">
                <Truck className="w-5 h-5 text-red-600 mx-auto" />
                <p className="text-[11px] font-bold text-slate-900">Fast Shipping</p>
                <p className="text-[10px] text-slate-500">Pan India Delivery</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl space-y-1">
                <ShieldCheck className="w-5 h-5 text-red-600 mx-auto" />
                <p className="text-[11px] font-bold text-slate-900">100% Authentic</p>
                <p className="text-[10px] text-slate-500">Direct from SSD</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl space-y-1">
                <RotateCcw className="w-5 h-5 text-red-600 mx-auto" />
                <p className="text-[11px] font-bold text-slate-900">Easy Returns</p>
                <p className="text-[10px] text-slate-500">Hassle Free Policy</p>
              </div>
            </div>

          </div>
        </div>

        {/* 3. Product Specifications Table */}
        {specifications.length > 0 && (
          <div className="border-t border-slate-100 pt-10 space-y-6">
            <h2 className="text-xl font-extrabold text-slate-900 uppercase tracking-tight">
              Product Specifications
            </h2>

            <div className="bg-slate-50 rounded-3xl border border-slate-200/80 overflow-hidden max-w-3xl">
              <dl className="divide-y divide-slate-200">
                {specifications.map((spec, index) => (
                  <div
                    key={index}
                    className="px-6 py-4 grid grid-cols-3 gap-4 hover:bg-slate-100/50 transition-colors"
                  >
                    <dt className="text-xs font-bold text-slate-600">{spec.label}</dt>
                    <dd className="text-xs font-semibold text-slate-900 col-span-2">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        )}

        {/* 4. Related Products Section ("YOU MAY ALSO LIKE") */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-slate-100 pt-12 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-slate-900 uppercase tracking-tight">
                You May Also Like
              </h2>
              <Link
                to="/catalog"
                className="text-xs font-bold text-red-600 hover:text-red-500 transition-colors"
              >
                View All Catalog &rarr;
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
