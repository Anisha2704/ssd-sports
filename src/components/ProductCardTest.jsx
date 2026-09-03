import React from 'react';
import { formatPrice } from '../utils/formatters';

export default function ProductCardTest({ product }) {
  if (!product) return null;

  const {
    id,
    title,
    handle,
    description,
    featuredImage,
    priceRange,
    compareAtPriceRange,
    variants,
  } = product;

  const minPrice = priceRange?.minVariantPrice?.amount;
  const currencyCode = priceRange?.minVariantPrice?.currencyCode || 'USD';
  const formattedPrice = formatPrice(minPrice, currencyCode);

  const compareAtAmount = compareAtPriceRange?.minVariantPrice?.amount;
  const hasCompareAtPrice = compareAtAmount && parseFloat(compareAtAmount) > parseFloat(minPrice || 0);
  const formattedCompareAtPrice = hasCompareAtPrice ? formatPrice(compareAtAmount, currencyCode) : null;

  const variantList = variants?.nodes || [];
  const availableVariantsCount = variantList.filter((v) => v.availableForSale).length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl hover:border-slate-700 transition-all duration-300 flex flex-col">
      {/* Product Image */}
      <div className="relative aspect-square bg-slate-950 overflow-hidden group">
        {featuredImage?.url ? (
          <img
            src={featuredImage.url}
            alt={featuredImage.altText || title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 bg-slate-950 p-4">
            <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs">No image provided</span>
          </div>
        )}

        {hasCompareAtPrice && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow uppercase tracking-wider">
            Sale
          </span>
        )}

        <span className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700">
          {availableVariantsCount} / {variantList.length} variants available
        </span>
      </div>

      {/* Product Information */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-slate-100 text-lg leading-snug line-clamp-2">
              {title}
            </h3>
          </div>

          <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
            <span>Handle: <code className="text-indigo-300">{handle}</code></span>
          </div>

          {description && (
            <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Pricing & Variants Section */}
        <div className="pt-3 border-t border-slate-800 space-y-3">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-emerald-400 tracking-tight">
                {formattedPrice}
              </span>
              {formattedCompareAtPrice && (
                <span className="text-xs text-slate-500 line-through">
                  {formattedCompareAtPrice}
                </span>
              )}
            </div>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">
              Shopify Price
            </span>
          </div>

          {/* Variants Detail List */}
          {variantList.length > 0 && (
            <div className="bg-slate-950/80 rounded-lg p-2.5 border border-slate-800/80 space-y-1.5">
              <div className="text-[11px] font-medium text-slate-400 flex justify-between">
                <span>Variants ({variantList.length})</span>
                <span>Status</span>
              </div>
              <div className="max-h-24 overflow-y-auto space-y-1 pr-1 custom-scrollbar text-xs">
                {variantList.map((variant) => (
                  <div
                    key={variant.id}
                    className="flex justify-between items-center text-[11px] py-0.5 border-b border-slate-900/60 last:border-0"
                  >
                    <span className="text-slate-300 font-mono truncate max-w-[150px]">
                      {variant.title}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">
                        {formatPrice(variant.price?.amount, variant.price?.currencyCode)}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                          variant.availableForSale
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-900'
                            : 'bg-red-950 text-red-400 border border-red-900'
                        }`}
                      >
                        {variant.availableForSale ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Raw Shopify ID */}
          <div className="text-[10px] text-slate-600 font-mono truncate pt-1">
            ID: {id}
          </div>
        </div>
      </div>
    </div>
  );
}
