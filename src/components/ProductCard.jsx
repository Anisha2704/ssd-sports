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
    <div className="group bg-white rounded-2xl flex flex-col justify-between h-full border border-[#D8E8DD] hover:border-[#0B7A3B]/40 hover:shadow-xl hover:shadow-[#0B7A3B]/10 transition-all duration-300 hover:-translate-y-1.5 overflow-hidden">
      
      {/* Product Image Area with Light Fresh Frame */}
      <Link to={productUrl} className="relative bg-[#F5FAF6] aspect-[4/5] sm:aspect-square flex items-center justify-center p-4 block overflow-hidden border-b border-[#E2ECE6]">
        
        {/* Badges Top-Left */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start pointer-events-none">
          {!isAvailable ? (
            <span className="bg-[#10231A]/80 text-white text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border border-[#D8E8DD]/20 tracking-wider">
              Out of Stock
            </span>
          ) : (
            <>
              {isNewTag && (
                <span className="bg-[#20A957] text-white text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full shadow-xs tracking-wide">
                  New!
                </span>
              )}
              {hasCompareAt && discountPercent > 0 && (
                <span className="bg-[#0B7A3B] text-white text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
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
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-[#D8E8DD] flex items-center justify-center text-[#7B8A82] hover:text-[#0B7A3B] hover:border-[#0B7A3B] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer shadow-xs"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFav ? 'fill-[#0B7A3B] text-[#0B7A3B]' : 'fill-none stroke-current'
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
          <div className="w-full h-full flex flex-col items-center justify-center text-[#7B8A82]">
            <span className="text-xs">No image available</span>
          </div>
        )}
      </Link>

      {/* Info below image */}
      <div className="p-4 flex flex-col flex-1 justify-between text-center space-y-3">
        <div>
          {/* Product Title */}
          <Link
            to={productUrl}
            className="font-bold text-[#10231A] text-sm sm:text-base tracking-tight leading-snug line-clamp-2 hover:text-[#0B7A3B] transition-colors cursor-pointer min-h-[2.5rem] block"
            title={title}
          >
            {title}
          </Link>
        </div>

        {/* Pricing */}
        <div className="flex items-center justify-center gap-2.5 flex-wrap">
          <span className="text-[#0B7A3B] font-extrabold text-base sm:text-lg">
            {formatINR(minPrice)}
          </span>
          {hasCompareAt && (
            <span className="text-[#7B8A82] text-xs sm:text-sm line-through font-medium">
              {formatINR(compareAtAmount)}
            </span>
          )}
        </div>

        {/* Direct Add to Cart Button */}
        <div className="pt-1">
          <button
            onClick={handleAddToCartClick}
            disabled={adding || !isAvailable}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
              !isAvailable
                ? 'bg-[#F5FAF6] text-[#7B8A82] border border-[#D8E8DD] cursor-not-allowed'
                : added
                ? 'bg-[#075E2D] text-white shadow-md'
                : 'bg-[#0B7A3B] hover:bg-[#075E2D] text-white shadow-md shadow-[#0B7A3B]/15 hover:-translate-y-0.5 active:translate-y-0'
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

