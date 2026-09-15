import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [searched, setSearched] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
        <div className="border-b border-white/10 pb-6 text-center">
          <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-[#FF2E4D]">
            REAL-TIME TRACKING
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-black text-white uppercase tracking-wider mt-1">
            Track Your Order
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Enter your order number and email to check real-time order status.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSearched(true);
          }}
          className="bg-slate-900/90 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-md"
        >
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Order Number</label>
            <input
              type="text"
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. #SSD-1001"
              className="w-full bg-slate-950 border border-white/15 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FF2E4D] focus:ring-1 focus:ring-[#FF2E4D] font-mono transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email used during checkout"
              className="w-full bg-slate-950 border border-white/15 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FF2E4D] focus:ring-1 focus:ring-[#FF2E4D] transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-red-600 to-[#FF2E4D] hover:from-red-500 hover:to-[#FF4763] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(255,46,77,0.35)] cursor-pointer"
          >
            Check Status
          </button>
        </form>

        {searched && (
          <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 text-center space-y-2 animate-fadeIn">
            <span className="text-xs font-mono text-slate-400">Order Inquiry: <code className="text-[#FF2E4D] font-bold">{orderNumber}</code></span>
            <p className="text-xs text-slate-300">
              Orders placed on SSD Sports are processed through Shopify. Order status notifications are sent directly to <code className="text-white font-bold">{email}</code>.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

