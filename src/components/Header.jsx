import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, Heart, ShoppingBag, Menu, X } from 'lucide-react';
import { useHomepageHero } from '../hooks/useHomepageHero';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function Header() {
  const { hero } = useHomepageHero();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll shadow & opacity state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Catalog', path: '/catalog' },
    { name: 'Bulk Order', path: '/bulk-order' },
    { name: 'Track Order', path: '/track-order' },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#0B0F17]/95 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/40' 
        : 'bg-[#0B0F17]/85 backdrop-blur-sm border-b border-white/5'
    }`}>
      {/* Main Compact Navbar */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* LEFT: Compact SSD Sports Branding / Shopify Logo */}
          <div className="flex items-center space-x-3 shrink-0">
            <Link to="/" className="flex items-center space-x-2.5 group">
              {hero?.logo?.url ? (
                <img
                  src={hero.logo.url}
                  alt={hero.logo.altText || 'SSD Sports'}
                  className="h-9 sm:h-10 max-w-[170px] object-contain filter brightness-110"
                />
              ) : (
                <>
                  <div className="bg-gradient-to-r from-red-600 to-[#FF2E4D] text-white font-extrabold text-base tracking-tighter px-2.5 py-1 rounded shadow-[0_0_12px_rgba(255,46,77,0.4)] group-hover:scale-105 transition-transform">
                    SSD
                  </div>
                  <span className="font-heading font-black text-xl tracking-widest text-white uppercase group-hover:text-[#FF2E4D] transition-colors">
                    SPORTS
                  </span>
                </>
              )}
            </Link>
          </div>

          {/* CENTER: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = link.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-xs font-bold uppercase tracking-wider transition-all py-1.5 relative ${
                    isActive
                      ? 'text-white font-extrabold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#FF2E4D] after:shadow-[0_0_8px_#FF2E4D]'
                      : 'text-slate-300 hover:text-white hover:after:content-[""] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-0.5 hover:after:bg-[#FF2E4D]/50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT: Icon Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Search Icon Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/10 hover:border-[#FF2E4D]/50 flex items-center justify-center transition-all focus:outline-none cursor-pointer"
              aria-label="Search site"
            >
              <Search className="w-4 h-4 stroke-[2.2]" />
            </button>

            {/* Account / User Icon Button */}
            <Link
              to="/account"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/10 hover:border-[#FF2E4D]/50 hidden sm:flex items-center justify-center transition-all focus:outline-none"
              aria-label="User Account"
            >
              <User className="w-4 h-4 stroke-[2.2]" />
            </Link>

            {/* Wishlist Heart Icon Button */}
            <Link
              to="/wishlist"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/10 hover:border-[#FF2E4D]/50 hidden sm:flex items-center justify-center transition-all relative focus:outline-none"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4 stroke-[2.2]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF2E4D] text-white text-[10px] font-extrabold min-w-[1.25rem] h-5 px-1 rounded-full flex items-center justify-center border border-[#0B0F17] shadow-[0_0_8px_rgba(255,46,77,0.8)]">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag / Cart Icon Button */}
            <Link
              to="/cart"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/10 hover:border-[#FF2E4D]/50 flex items-center justify-center transition-all relative focus:outline-none"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF2E4D] text-white text-[10px] font-extrabold min-w-[1.25rem] h-5 px-1 rounded-full flex items-center justify-center border border-[#0B0F17] shadow-[0_0_8px_rgba(255,46,77,0.8)]">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-full bg-slate-900 text-slate-200 border border-white/10 flex items-center justify-center transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 stroke-[2.2]" />
              ) : (
                <Menu className="w-5 h-5 stroke-[2.2]" />
              )}
            </button>
          </div>
        </div>

        {/* Search Overlay Bar */}
        {searchOpen && (
          <div className="py-3 border-t border-white/10 animate-fadeIn">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/catalog?q=${encodeURIComponent(searchQuery)}`;
                }
              }}
              className="relative max-w-xl mx-auto flex items-center"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cricket bats, balls, protective gear..."
                className="w-full bg-slate-900/90 border border-white/20 text-white text-sm rounded-full py-2.5 pl-10 pr-10 focus:outline-none focus:border-[#FF2E4D] focus:ring-1 focus:ring-[#FF2E4D] transition-all"
                autoFocus
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider"
                >
                  Clear
                </button>
              )}
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0D131F] border-b border-slate-800 px-6 pt-3 pb-6 space-y-2 animate-fadeIn">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="block text-slate-200 hover:text-[#FF2E4D] font-bold text-sm uppercase tracking-wider py-2.5 border-b border-slate-800/60 transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/account"
            className="block text-slate-200 hover:text-[#FF2E4D] font-bold text-sm uppercase tracking-wider py-2.5 border-b border-slate-800/60 flex items-center justify-between"
          >
            <span>My Account</span>
            <User className="w-4 h-4 text-slate-400" />
          </Link>
          <Link
            to="/wishlist"
            className="block text-slate-200 hover:text-[#FF2E4D] font-bold text-sm uppercase tracking-wider py-2.5 border-b border-slate-800/60 flex items-center justify-between"
          >
            <span>Wishlist</span>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-[#FF2E4D] text-white px-2 py-0.5 rounded-full font-extrabold">{wishlistCount}</span>
              <Heart className="w-4 h-4 text-slate-400" />
            </div>
          </Link>
          <Link
            to="/cart"
            className="block text-slate-200 hover:text-[#FF2E4D] font-bold text-sm uppercase tracking-wider py-2.5 flex items-center justify-between"
          >
            <span>Shopping Cart</span>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-[#FF2E4D] text-white px-2 py-0.5 rounded-full font-extrabold">{cartCount}</span>
              <ShoppingBag className="w-4 h-4 text-slate-400" />
            </div>
          </Link>
        </div>
      )}
    </header>
  );
}

