import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-white text-[#10231A] flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-12 sm:py-16 space-y-6">
        <div className="text-center space-y-2">
          <span className="inline-block text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#0B7A3B] bg-[#EAF7EE] border border-[#0B7A3B]/20 px-3 py-1 rounded-full">
            MEMBER PORTAL
          </span>
          <h1 className="font-heading text-2xl sm:text-4xl font-black text-[#10231A] uppercase tracking-wider">Customer Account</h1>
          <p className="text-[#52645A] text-xs">Access your SSD Sports orders &amp; profile</p>
        </div>

        <div className="bg-white border border-[#D8E8DD] rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#10231A] uppercase tracking-wider block">Email</label>
            <input
              type="email"
              placeholder="name@example.com"
              className="w-full bg-[#F5FAF6] border border-[#D8E8DD] rounded-xl p-3.5 text-sm text-[#10231A] placeholder-[#7B8A82] focus:outline-none focus:border-[#0B7A3B] focus:ring-1 focus:ring-[#0B7A3B] transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#10231A] uppercase tracking-wider block">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-[#F5FAF6] border border-[#D8E8DD] rounded-xl p-3.5 text-sm text-[#10231A] placeholder-[#7B8A82] focus:outline-none focus:border-[#0B7A3B] focus:ring-1 focus:ring-[#0B7A3B] transition-all"
            />
          </div>

          <button
            type="button"
            className="w-full py-4 bg-[#0B7A3B] hover:bg-[#075E2D] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#0B7A3B]/20 hover:-translate-y-0.5 cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

