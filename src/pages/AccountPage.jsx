import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-12 sm:py-16 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-[#FF2E4D]">
            MEMBER PORTAL
          </span>
          <h1 className="font-heading text-2xl sm:text-4xl font-black text-white uppercase tracking-wider">Customer Account</h1>
          <p className="text-slate-300 text-xs">Access your SSD Sports orders &amp; profile</p>
        </div>

        <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl backdrop-blur-md">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Email</label>
            <input
              type="email"
              placeholder="name@example.com"
              className="w-full bg-slate-950 border border-white/15 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FF2E4D] focus:ring-1 focus:ring-[#FF2E4D] transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-white/15 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FF2E4D] focus:ring-1 focus:ring-[#FF2E4D] transition-all"
            />
          </div>

          <button
            type="button"
            className="w-full py-4 bg-gradient-to-r from-red-600 to-[#FF2E4D] hover:from-red-500 hover:to-[#FF4763] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(255,46,77,0.35)] cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

