import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';
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

export default function ProductCard({ product }) {
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
    tags = [],
    availableForSale: productAvailable,
  } = product;

  // Extract images array
  const imageNodes = images?.edges?.map((e) => e.node) || [];
  const firstImageUrl = imageNodes[0]?.url || featuredImage?.url || '';
  const secondImageUrl = imageNodes[1]?.url || null;

  // Variant availability
  const firstVariant = variants?.nodes?.[0];
  const isAvailable = firstVariant
    ? firstVariant.availableForSale
    : productAvailable ?? true;

  // Pricing
  const minPrice = priceRange?.minVariantPrice?.amount;
  const compareAtAmount =
    compareAtPriceRange?.minVariantPrice?.amount ||
    firstVariant?.compareAtPrice?.amount;

  const numericPrice = parseFloat(minPrice || 0);
  const numericCompareAt = compareAtAmount ? parseFloat(compareAtAmount) : 0;
  const hasCompareAt = numericCompareAt > numericPrice;

  let discountPercent = 0;
  if (hasCompareAt && numericCompareAt > 0) {
    discountPercent = Math.round(((numericCompareAt - numericPrice) / numericCompareAt) * 100);
  }

  const isNewTag = tags?.some(
    (t) => typeof t === 'string' && t.toLowerCase().includes('new')
  );

  const productUrl = `/products/${handle}`;

  // Handle Add to Cart button click on Card
  const handleAddToCartClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAvailable) {
      showToast({
        type: 'warning',
        title: 'Out of Stock',
        message: `${title || 'Product'} is currently unavailable.`,
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
      console.error('Failed to add card item to cart:', err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="group bg-[#111827] rounded-2xl flex flex-col justify-between h-full border border-white/10 hover:border-[#FF2E4D]/40 hover:shadow-[0_12px_30px_rgba(255,46,77,0.15)] transition-all duration-500 hover:-translate-y-1 overflow-hidden">
      
      {/* Product Image Area with Dark Frame -> Links to Product Details Page */}
      <Link to={productUrl} className="relative bg-[#1A2234] aspect-[4/5] sm:aspect-square flex items-center justify-center p-4 block overflow-hidden">
        
        {/* Badges Top-Left */}
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

        {/* Wishlist Heart Icon Top-Right */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/15 flex items-center justify-center text-slate-300 hover:text-[#FF2E4D] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFav ? 'fill-[#FF2E4D] text-[#FF2E4D]' : 'fill-none stroke-current'
            }`}
            strokeWidth={2}
          />
        </button>

        {/* Product Main & Hover Images */}
        {firstImageUrl ? (
          <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
            {/* Default First Image */}
            <img
              src={firstImageUrl}
              alt={title || 'Product'}
              className={`w-full h-full object-contain transform group-hover:scale-105 transition-all duration-500 ${
                secondImageUrl ? 'group-hover:opacity-0 opacity-100' : 'opacity-100'
              } ${!isAvailable ? 'opacity-50 grayscale-[40%]' : ''}`}
              loading="lazy"
            />

            {/* Hover Second Image */}
            {secondImageUrl && (
              <img
                src={secondImageUrl}
                alt={`${title || 'Product'} alternate view`}
                className="w-full h-full object-contain absolute inset-0 opacity-0 group-hover:opacity-100 transform group-hover:scale-105 transition-all duration-500"
                loading="lazy"
              />
            )}
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
            <span className="text-xs">No image available</span>
          </div>
        )}
      </Link>

      {/* Info below image */}
      <div className="p-4 flex flex-col flex-1 justify-between text-center space-y-3">
        <div>
          {/* Product Title -> Links to Product Details Page */}
          <Link
            to={productUrl}
            className="font-bold text-white text-sm sm:text-base tracking-tight leading-snug line-clamp-2 hover:text-[#FF2E4D] transition-colors cursor-pointer min-h-[2.5rem] block"
            title={title}
          >
            {title}
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

        {/* Direct Add to Cart Button / Out of Stock button */}
        <div className="pt-1">
          <button
            onClick={handleAddToCartClick}
            disabled={adding || !isAvailable}
            className={`w-full py-2.5 px-4 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
              !isAvailable
                ? 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed opacity-75'
                : added
                ? 'bg-emerald-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                : 'bg-[#FF2E4D] hover:bg-red-600 text-white shadow-[0_0_12px_rgba(255,46,77,0.35)] hover:scale-102 active:scale-95'
            }`}
          >
            {!isAvailable ? (
              <>
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Sold Out</span>
              </>
            ) : adding ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Adding...</span>
              </>
            ) : added ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                <span>Added to Cart</span>
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
  );
}

