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


  // Handle scroll shadow state
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
    <header className="sticky top-0 z-50 bg-white text-slate-900 transition-shadow duration-300">
      {/* Main Compact Navbar */}
      <div
        className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-200 ${
          isScrolled ? 'shadow-sm' : ''
        }`}
      >
        <div className="flex items-center justify-between h-16">
          
          {/* LEFT: Compact SSD Sports Branding / Shopify Logo */}
          <div className="flex items-center space-x-3 shrink-0">
            <Link to="/" className="flex items-center space-x-2 group">
              {hero?.logo?.url ? (
                <img
                  src={hero.logo.url}
                  alt={hero.logo.altText || 'SSD Sports'}
                  className="h-9 max-w-[160px] object-contain"
                />
              ) : (
                <>
                  <div className="bg-slate-950 text-white font-black text-base tracking-tighter px-2 py-0.5 rounded shadow-sm group-hover:bg-red-600 transition-colors">
                    SSD
                  </div>
                  <span className="font-black text-lg tracking-widest text-slate-950 uppercase group-hover:text-red-600 transition-colors">
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
                  className={`text-sm font-semibold tracking-wide transition-colors py-1 relative ${
                    isActive
                      ? 'text-slate-950 font-bold border-b-2 border-slate-950'
                      : 'text-slate-700 hover:text-slate-950'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT: Circular Icon Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            
            {/* Search Icon Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
              aria-label="Search site"
            >
              <Search className="w-4 h-4 stroke-[2.2]" />
            </button>

            {/* Account / User Icon Button */}
            <Link
              to="/account"
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 hidden sm:flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
              aria-label="User Account"
            >
              <User className="w-4 h-4 stroke-[2.2]" />
            </Link>

            {/* Wishlist Heart Icon Button */}
            <Link
              to="/wishlist"
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 hidden sm:flex items-center justify-center transition-colors relative focus:outline-none focus:ring-2 focus:ring-slate-300"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4 stroke-[2.2]" />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold min-w-[1.125rem] h-4 px-1 rounded-full flex items-center justify-center border border-white">
                {wishlistCount}
              </span>
            </Link>

            {/* Shopping Bag / Cart Icon Button */}
            <Link
              to="/cart"
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 flex items-center justify-center transition-colors relative focus:outline-none focus:ring-2 focus:ring-slate-300"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold min-w-[1.125rem] h-4 px-1 rounded-full flex items-center justify-center border border-white">
                {cartCount}
              </span>
            </Link>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-colors focus:outline-none"
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
          <div className="py-2.5 border-t border-slate-100 animate-fadeIn">
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
                placeholder="Search cricket bats, balls, equipment..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-full py-2 pl-9 pr-9 focus:outline-none focus:border-slate-400 focus:bg-white"
                autoFocus
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 text-xs font-bold"
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
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-5 space-y-1.5 animate-fadeIn">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="block text-slate-800 hover:text-black font-semibold text-sm py-2 border-b border-slate-100"
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/account"
            className="block text-slate-800 hover:text-black font-semibold text-sm py-2 border-b border-slate-100 flex items-center justify-between"
          >
            <span>My Account</span>
            <User className="w-4 h-4 text-slate-500" />
          </Link>
          <Link
            to="/wishlist"
            className="block text-slate-800 hover:text-black font-semibold text-sm py-2 border-b border-slate-100 flex items-center justify-between"
          >
            <span>Wishlist</span>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full font-bold">0</span>
              <Heart className="w-4 h-4 text-slate-500" />
            </div>
          </Link>
          <Link
            to="/cart"
            className="block text-slate-800 hover:text-black font-semibold text-sm py-2 flex items-center justify-between"
          >
            <span>Shopping Bag</span>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full font-bold">0</span>
              <ShoppingBag className="w-4 h-4 text-slate-500" />
            </div>
          </Link>
        </div>
      )}
    </header>
  );
}
