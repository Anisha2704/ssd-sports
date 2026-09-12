import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, User, Heart, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useHomepageHero } from '../../hooks/useHomepageHero';

export default function CinematicNavbar() {
  const { hero } = useHomepageHero();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname;
      setMobileMenuOpen(false);
      setSearchOpen(false);
    }
  }, [location.pathname]);

  const navLinks = [
    { name: 'SHOP', path: '/catalog' },
    { name: 'BATS', path: '/catalog?collection=cricket-bats' },
    { name: 'APPAREL', path: '/catalog?collection=apparel' },
    { name: 'EQUIPMENT', path: '/catalog?collection=equipment' },
    { name: 'ABOUT', path: '/#brand-story' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 will-change-[background-color,backdrop-filter,border-color] ${
          isScrolled
            ? 'bg-[#050505]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.8)] py-3.5'
            : 'bg-transparent border-b border-transparent py-5 sm:py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* BRAND LOGO */}
            <div className="flex items-center shrink-0">
              <Link
                to="/"
                className="group flex items-center space-x-2 tracking-widest uppercase transition-opacity hover:opacity-90"
              >
                {hero?.logo?.url ? (
                  <img
                    src={hero.logo.url}
                    alt={hero.logo.altText || 'SSD Sports'}
                    className="h-8 sm:h-9 max-w-[150px] object-contain brightness-125"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="bg-red-600 text-white font-black text-xs px-2 py-0.5 rounded tracking-tighter shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                      SSD
                    </span>
                    <span className="font-extrabold text-sm sm:text-base tracking-[0.25em] text-white font-['Syne',sans-serif]">
                      SPORTS
                    </span>
                  </div>
                )}
              </Link>
            </div>

            {/* CENTER NAV LINKS (Desktop) */}
            <nav className="hidden md:flex items-center space-x-7 lg:space-x-9">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-[12px] font-semibold tracking-[0.2em] text-neutral-300 hover:text-white transition-all duration-200 relative py-1 group/nav"
                >
                  <span>{link.name}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-red-600 transition-all duration-300 group-hover/nav:w-full" />
                </Link>
              ))}
            </nav>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center space-x-2.5 sm:space-x-4">
              {/* SEARCH TRIGGER */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] hover:border-white/[0.2] text-neutral-300 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer focus:outline-none"
                aria-label="Search"
                title="Search"
              >
                <Search className="w-4 h-4 stroke-[1.8]" />
              </button>

              {/* USER ACCOUNT */}
              <Link
                to="/account"
                className="hidden sm:flex w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] hover:border-white/[0.2] text-neutral-300 hover:text-white items-center justify-center transition-all duration-200 focus:outline-none"
                aria-label="Account"
                title="Account"
              >
                <User className="w-4 h-4 stroke-[1.8]" />
              </Link>

              {/* WISHLIST */}
              <Link
                to="/wishlist"
                className="hidden sm:flex w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] hover:border-white/[0.2] text-neutral-300 hover:text-white items-center justify-center transition-all duration-200 relative focus:outline-none"
                aria-label="Wishlist"
                title="Wishlist"
              >
                <Heart className="w-4 h-4 stroke-[1.8]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* CART */}
              <Link
                to="/cart"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/[0.06] hover:bg-red-600 hover:border-red-500 border border-white/[0.12] text-white flex items-center justify-center transition-all duration-300 relative focus:outline-none group/cart shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                aria-label="Shopping Bag"
                title="Cart"
              >
                <ShoppingBag className="w-4 h-4 stroke-[2]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-[#050505] shadow-[0_0_10px_rgba(220,38,38,0.8)]">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* MOBILE MENU TOGGLE */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-9 h-9 rounded-full bg-white/[0.05] border border-white/[0.1] text-white flex items-center justify-center transition-colors focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>

          </div>

          {/* SEARCH OVERLAY BAR */}
          {searchOpen && (
            <div className="pt-4 pb-2 border-t border-white/[0.08] mt-3 animate-fadeIn">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    navigate(`/catalog?q=${encodeURIComponent(searchQuery)}`);
                    setSearchOpen(false);
                  }
                }}
                className="relative max-w-2xl mx-auto flex items-center"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="SEARCH CRICKET BATS, BALLS, EQUIPMENT..."
                  className="w-full bg-neutral-900/90 border border-white/[0.15] text-white placeholder-neutral-500 text-xs tracking-widest uppercase rounded-full py-2.5 pl-10 pr-10 focus:outline-none focus:border-red-600 focus:bg-black/90 transition-all font-mono"
                  autoFocus
                />
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 text-neutral-400 hover:text-white text-xs font-mono uppercase"
                  >
                    Clear
                  </button>
                )}
              </form>
            </div>
          )}

        </div>

        {/* MOBILE DRAWER */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#050505]/95 backdrop-blur-2xl border-b border-white/[0.1] px-6 pt-5 pb-8 space-y-4 animate-fadeIn shadow-2xl">
            <nav className="space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block text-lg font-bold tracking-wider text-neutral-200 hover:text-white hover:translate-x-1 transition-all py-1 border-b border-white/[0.04]"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="pt-3 border-t border-white/[0.08] grid grid-cols-2 gap-3">
              <Link
                to="/account"
                className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs font-semibold tracking-wider text-neutral-300"
              >
                <span>ACCOUNT</span>
                <User className="w-3.5 h-3.5 text-neutral-400" />
              </Link>
              <Link
                to="/wishlist"
                className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs font-semibold tracking-wider text-neutral-300"
              >
                <span>WISHLIST ({wishlistCount})</span>
                <Heart className="w-3.5 h-3.5 text-neutral-400" />
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
