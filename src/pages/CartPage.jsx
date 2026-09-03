import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ShoppingBag, Trash2, ArrowRight, Minus, Plus, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

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

export default function CartPage() {
  const { cart, loading, updateQuantity, removeItem } = useCart();
  const lineItems = cart?.lines?.nodes || [];
  const subtotal = cart?.cost?.subtotalAmount?.amount || 0;
  const checkoutUrl = cart?.checkoutUrl;

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-10 sm:py-16 space-y-8">
        <div className="space-y-2 border-b border-slate-100 pb-6 text-center sm:text-left">
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Your Shopping Cart</h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Review your selected equipment from our live Shopify Storefront before proceeding to checkout.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 space-y-4">
            <RefreshCw className="w-8 h-8 text-red-600 animate-spin mx-auto" />
            <p className="text-slate-500 text-xs">Syncing with Shopify...</p>
          </div>
        ) : lineItems.length === 0 ? (
          /* Empty Cart View */
          <div className="text-center space-y-6 py-12 max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-200 text-slate-400 mx-auto flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Your Shopping Cart is Empty</h2>
              <p className="text-slate-500 text-xs leading-relaxed">
                Add items from our live catalog to view price summaries and instant checkout options.
              </p>
            </div>

            <div>
              <Link
                to="/catalog"
                className="inline-block px-8 py-3.5 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-red-600/20"
              >
                Browse Products
              </Link>
            </div>
          </div>
        ) : (
          /* Populated Cart View */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Cart Items List (Span 8) */}
            <div className="lg:col-span-8 space-y-4">
              {lineItems.map((item) => {
                const variant = item.merchandise;
                const product = variant?.product;
                const image = variant?.image?.url || product?.featuredImage?.url;
                const lineTotal = item.cost?.totalAmount?.amount;

                return (
                  <div
                    key={item.id}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
                  >
                    {/* Item Image */}
                    <div className="w-20 h-20 bg-white rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-2 border border-slate-200">
                      {image ? (
                        <img
                          src={image}
                          alt={product?.title || 'Product'}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <ShoppingBag className="w-6 h-6 text-slate-400" />
                      )}
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 text-center sm:text-left space-y-1">
                      <Link
                        to={product?.handle ? `/products/${product.handle}` : '/catalog'}
                        className="font-bold text-slate-900 text-sm sm:text-base hover:text-red-600 transition-colors line-clamp-1"
                      >
                        {product?.title || 'Product Item'}
                      </Link>
                      
                      {variant?.title && variant.title !== 'Default Title' && (
                        <p className="text-xs text-slate-500">{variant.title}</p>
                      )}

                      <p className="text-xs font-mono text-slate-600 pt-1">
                        {formatINR(variant?.price?.amount)}
                      </p>
                    </div>

                    {/* Quantity & Controls */}
                    <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                      <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-bold text-xs font-mono text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-bold font-mono text-sm text-red-600 block">
                          {formatINR(lineTotal)}
                        </span>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary (Span 4) */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-6 sticky top-24">
              <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-tight border-b border-slate-200 pb-4">
                Order Summary
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-bold font-mono text-slate-900">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Taxes &amp; Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Total</span>
                <span className="text-xl font-black text-red-600 font-mono">{formatINR(subtotal)}</span>
              </div>

              {checkoutUrl ? (
                <a
                  href={checkoutUrl}
                  className="w-full py-4 px-6 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 text-center"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              ) : (
                <button
                  disabled
                  className="w-full py-4 px-6 bg-slate-200 text-slate-400 font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-not-allowed text-center"
                >
                  Checkout Unavailable
                </button>
              )}
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
