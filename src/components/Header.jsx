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
        ? 'bg-white/95 backdrop-blur-md border-b border-[#D8E8DD] shadow-md shadow-[#0B7A3B]/5' 
        : 'bg-white/90 backdrop-blur-sm border-b border-[#E2ECE6]'
    }`}>
      {/* Main Compact Navbar */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'h-16' : 'h-20'}`}>
          
          {/* LEFT: Compact SSD Sports Branding / Shopify Logo */}
          <div className="flex items-center space-x-3 shrink-0">
            <Link to="/" className="flex items-center space-x-2.5 group">
              {hero?.logo?.url ? (
                <img
                  src={hero.logo.url}
                  alt={hero.logo.altText || 'SSD Sports'}
                  className="h-9 sm:h-10 max-w-[170px] object-contain transition-transform group-hover:scale-105"
                />
              ) : (
                <>
                  <div className="bg-gradient-to-r from-[#075E2D] to-[#0B7A3B] text-white font-extrabold text-base tracking-tighter px-2.5 py-1 rounded shadow-sm group-hover:scale-105 transition-transform">
                    SSD
                  </div>
                  <span className="font-heading font-black text-xl tracking-widest text-[#10231A] uppercase group-hover:text-[#0B7A3B] transition-colors">
                    SPORTS
                  </span>
                </>
              )}
            </Link>
          </div>

          {/* CENTER: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-9">
            {navLinks.map((link) => {
              const isActive = link.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-xs font-extrabold uppercase tracking-widest transition-all py-1.5 relative ${
                    isActive
                      ? 'text-[#0B7A3B] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#0B7A3B] after:rounded-full'
                      : 'text-[#10231A] hover:text-[#0B7A3B] hover:after:content-[""] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-0.5 hover:after:bg-[#20A957]/50'
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
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F5FAF6] hover:bg-[#EAF7EE] text-[#10231A] hover:text-[#0B7A3B] border border-[#D8E8DD] hover:border-[#0B7A3B]/40 flex items-center justify-center transition-all focus:outline-none cursor-pointer"
              aria-label="Search site"
            >
              <Search className="w-4 h-4 stroke-[2.2]" />
            </button>

            {/* Account / User Icon Button */}
            <Link
              to="/account"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F5FAF6] hover:bg-[#EAF7EE] text-[#10231A] hover:text-[#0B7A3B] border border-[#D8E8DD] hover:border-[#0B7A3B]/40 hidden sm:flex items-center justify-center transition-all focus:outline-none"
              aria-label="User Account"
            >
              <User className="w-4 h-4 stroke-[2.2]" />
            </Link>

            {/* Wishlist Heart Icon Button */}
            <Link
              to="/wishlist"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F5FAF6] hover:bg-[#EAF7EE] text-[#10231A] hover:text-[#0B7A3B] border border-[#D8E8DD] hover:border-[#0B7A3B]/40 hidden sm:flex items-center justify-center transition-all relative focus:outline-none"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4 stroke-[2.2]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#0B7A3B] text-white text-[10px] font-extrabold min-w-[1.25rem] h-5 px-1 rounded-full flex items-center justify-center border border-white shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag / Cart Icon Button */}
            <Link
              to="/cart"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F5FAF6] hover:bg-[#EAF7EE] text-[#10231A] hover:text-[#0B7A3B] border border-[#D8E8DD] hover:border-[#0B7A3B]/40 flex items-center justify-center transition-all relative focus:outline-none"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#0B7A3B] text-white text-[10px] font-extrabold min-w-[1.25rem] h-5 px-1 rounded-full flex items-center justify-center border border-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-full bg-[#F5FAF6] text-[#10231A] border border-[#D8E8DD] flex items-center justify-center transition-colors focus:outline-none"
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
          <div className="py-3 border-t border-[#D8E8DD] animate-fadeIn">
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
                className="w-full bg-[#F5FAF6] border border-[#D8E8DD] text-[#10231A] text-sm rounded-full py-2.5 pl-10 pr-10 focus:outline-none focus:border-[#0B7A3B] focus:ring-2 focus:ring-[#0B7A3B]/20 transition-all placeholder-[#7B8A82]"
                autoFocus
              />
              <Search className="w-4 h-4 text-[#7B8A82] absolute left-3.5" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 text-[#7B8A82] hover:text-[#0B7A3B] text-xs font-bold uppercase tracking-wider"
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
        <div className="md:hidden bg-white border-b border-[#D8E8DD] px-6 pt-3 pb-6 space-y-2 animate-fadeIn shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="block text-[#10231A] hover:text-[#0B7A3B] font-bold text-sm uppercase tracking-wider py-2.5 border-b border-[#E2ECE6] transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/account"
            className="block text-[#10231A] hover:text-[#0B7A3B] font-bold text-sm uppercase tracking-wider py-2.5 border-b border-[#E2ECE6] flex items-center justify-between"
          >
            <span>My Account</span>
            <User className="w-4 h-4 text-[#7B8A82]" />
          </Link>
          <Link
            to="/wishlist"
            className="block text-[#10231A] hover:text-[#0B7A3B] font-bold text-sm uppercase tracking-wider py-2.5 border-b border-[#E2ECE6] flex items-center justify-between"
          >
            <span>Wishlist</span>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-[#0B7A3B] text-white px-2 py-0.5 rounded-full font-extrabold">{wishlistCount}</span>
              <Heart className="w-4 h-4 text-[#7B8A82]" />
            </div>
          </Link>
          <Link
            to="/cart"
            className="block text-[#10231A] hover:text-[#0B7A3B] font-bold text-sm uppercase tracking-wider py-2.5 flex items-center justify-between"
          >
            <span>Shopping Cart</span>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-[#0B7A3B] text-white px-2 py-0.5 rounded-full font-extrabold">{cartCount}</span>
              <ShoppingBag className="w-4 h-4 text-[#7B8A82]" />
            </div>
          </Link>
        </div>
      )}
    </header>
  );
}


