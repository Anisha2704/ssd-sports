import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronDown, ChevronRight, Loader2, ArrowRight } from 'lucide-react';
import { useHomepageHero } from '../hooks/useHomepageHero';
import { useCollections } from '../hooks/useCollections';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { searchProducts } from '../services/shopify';
import defaultLogo from '../assets/logo.png';

export default function Header() {
  const { hero } = useHomepageHero();
  const { collections } = useCollections({ first: 25 });
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [liveResults, setLiveResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const dropdownRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Filter collections: all active collections except New Arrivals (reliable case-insensitive title & handle checks)
  const productCollections = useMemo(() => {
    return (collections || []).filter((col) => {
      if (!col || !col.handle) return false;
      const title = (col.title || '').trim().toLowerCase();
      const handle = (col.handle || '').trim().toLowerCase();
      return (
        title !== 'new arrivals' &&
        title !== 'new arrival' &&
        handle !== 'new-arrivals' &&
        handle !== 'new-arrival'
      );
    });
  }, [collections]);

  // Handle scroll shadow & opacity state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setProductsDropdownOpen(false);
    setMobileProductsOpen(false);
    setLiveResults([]);
  }, [location.pathname]);

  // Focus search input when search opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Debounced live search autocomplete
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setLiveResults([]);
      setIsSearching(false);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchProducts({ query: q, first: 6 });
        setLiveResults(results);
        setHasSearched(true);
      } catch (err) {
        console.error('Failed to perform live search:', err);
        setLiveResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside and Escape key to close desktop dropdown and search overlay
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setProductsDropdownOpen(false);
        setSearchOpen(false);
      }
    };

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProductsDropdownOpen(false);
      }
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target) &&
        !e.target.closest('#search-toggle-btn')
      ) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  const handleDropdownMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setProductsDropdownOpen(true);
  };

  const handleDropdownMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setProductsDropdownOpen(false);
    }, 200);
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/catalog?q=${encodeURIComponent(q)}`);
      setSearchOpen(false);
      setLiveResults([]);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/catalog', hasDropdown: true },
    { name: 'Bulk Order', path: '/bulk-order' },
    { name: 'Track Order', path: '/track-order' },
  ];

  const logoSrc = hero?.logo?.url
    ? `${hero.logo.url}${hero.logo.url.includes('?') ? '&' : '?'}width=280`
    : defaultLogo;

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md border-b border-[#D8E8DD] shadow-md shadow-[#0B7A3B]/5' 
        : 'bg-white/90 backdrop-blur-sm border-b border-[#E2ECE6]'
    }`}>
      {/* Main Compact Navbar */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* LEFT: Compact SSD Sports Branding / Official Logo without fallback badge */}
          <div className="flex items-center space-x-3 shrink-0">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="flex items-center space-x-2">
                <img
                  src={logoSrc}
                  alt={hero?.logo?.altText || 'SSD Sports'}
                  className="h-10 sm:h-11 w-auto max-w-[140px] object-contain transition-transform group-hover:scale-105"
                  loading="eager"
                  fetchPriority="high"
                />
                <span className="font-heading font-black text-lg sm:text-xl tracking-widest text-[#10231A] uppercase group-hover:text-[#0B7A3B] transition-colors">
                  SPORTS
                </span>
              </div>
            </Link>
          </div>

          {/* CENTER: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-8 sm:space-x-9">
            {navLinks.map((link) => {
              const isActive = link.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(link.path);

              if (link.hasDropdown) {
                return (
                  <div
                    key={link.name}
                    ref={dropdownRef}
                    className="relative"
                    onMouseEnter={handleDropdownMouseEnter}
                    onMouseLeave={handleDropdownMouseLeave}
                  >
                    <div className="flex items-center">
                      <Link
                        to={link.path}
                        id="products-menu-button"
                        aria-haspopup="true"
                        aria-expanded={productsDropdownOpen}
                        aria-controls="products-menu-dropdown"
                        onFocus={() => setProductsDropdownOpen(true)}
                        className={`text-xs font-extrabold uppercase tracking-widest transition-all py-1.5 flex items-center gap-1 relative focus:outline-none focus:ring-2 focus:ring-[#0B7A3B]/40 focus:rounded-md ${
                          isActive
                            ? 'text-[#0B7A3B] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#0B7A3B] after:rounded-full'
                            : 'text-[#10231A] hover:text-[#0B7A3B] hover:after:content-[""] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-0.5 hover:after:bg-[#20A957]/50'
                        }`}
                      >
                        {link.name}
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            productsDropdownOpen ? 'rotate-180 text-[#0B7A3B]' : 'text-[#7B8A82]'
                          }`}
                        />
                      </Link>
                    </div>

                    {/* Products Dropdown Menu */}
                    {productsDropdownOpen && (
                      <div
                        id="products-menu-dropdown"
                        role="menu"
                        aria-labelledby="products-menu-button"
                        className="absolute left-0 top-full pt-2 z-50 w-64 animate-fadeIn"
                        onFocus={() => setProductsDropdownOpen(true)}
                        onBlur={(e) => {
                          if (!e.currentTarget.contains(e.relatedTarget)) {
                            setProductsDropdownOpen(false);
                          }
                        }}
                      >
                        <div className="bg-white/95 backdrop-blur-md border border-[#D8E8DD] rounded-2xl shadow-xl shadow-[#0B7A3B]/10 p-2 space-y-1">
                          {/* All Products link */}
                          <Link
                            to="/catalog"
                            role="menuitem"
                            onClick={() => setProductsDropdownOpen(false)}
                            className="px-3.5 py-2 text-xs font-bold text-[#10231A] hover:text-[#0B7A3B] hover:bg-[#EAF7EE] rounded-xl transition-colors flex items-center justify-between group/all"
                          >
                            <span>All Products</span>
                            <span className="text-[10px] font-mono uppercase text-[#0B7A3B] bg-[#EAF7EE] group-hover/all:bg-white px-1.5 py-0.5 rounded font-extrabold">
                              Shop All
                            </span>
                          </Link>

                          {productCollections.length > 0 && (
                            <div className="my-1 border-t border-[#E2ECE6]" />
                          )}

                          {/* Dynamic Shopify Collections */}
                          <div className="max-h-72 overflow-y-auto space-y-0.5 pr-1">
                            {productCollections.map((col) => (
                              <Link
                                key={col.id || col.handle}
                                to={`/catalog/${encodeURIComponent(col.handle)}`}
                                role="menuitem"
                                onClick={() => setProductsDropdownOpen(false)}
                                className="px-3.5 py-2 text-xs font-medium text-[#52645A] hover:text-[#0B7A3B] hover:bg-[#EAF7EE] rounded-xl transition-colors flex items-center justify-between group/col"
                              >
                                <span className="font-semibold text-[#10231A] group-hover/col:text-[#0B7A3B]">
                                  {col.title}
                                </span>
                                <ChevronRight className="w-3.5 h-3.5 text-[#7B8A82] group-hover/col:text-[#0B7A3B] group-hover/col:translate-x-0.5 transition-all" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

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
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            
            {/* Search Icon Button */}
            <button
              id="search-toggle-btn"
              onClick={() => setSearchOpen(!searchOpen)}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border transition-all flex items-center justify-center focus:outline-none cursor-pointer ${
                searchOpen
                  ? 'bg-[#0B7A3B] text-white border-[#0B7A3B]'
                  : 'bg-[#F5FAF6] hover:bg-[#EAF7EE] text-[#10231A] hover:text-[#0B7A3B] border-[#D8E8DD] hover:border-[#0B7A3B]/40'
              }`}
              aria-label="Search site"
              aria-expanded={searchOpen}
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
            </button>

            {/* Account / User Icon Button */}
            <Link
              to="/account"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#F5FAF6] hover:bg-[#EAF7EE] text-[#10231A] hover:text-[#0B7A3B] border border-[#D8E8DD] hover:border-[#0B7A3B]/40 hidden sm:flex items-center justify-center transition-all focus:outline-none"
              aria-label="User Account"
            >
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
            </Link>

            {/* Wishlist Heart Icon Button */}
            <Link
              to="/wishlist"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#F5FAF6] hover:bg-[#EAF7EE] text-[#10231A] hover:text-[#0B7A3B] border border-[#D8E8DD] hover:border-[#0B7A3B]/40 hidden sm:flex items-center justify-center transition-all relative focus:outline-none"
              aria-label="Wishlist"
            >
              <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#0B7A3B] text-white text-[10px] font-extrabold min-w-[1.125rem] h-4.5 px-1 rounded-full flex items-center justify-center border border-white shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag / Cart Icon Button */}
            <Link
              to="/cart"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#F5FAF6] hover:bg-[#EAF7EE] text-[#10231A] hover:text-[#0B7A3B] border border-[#D8E8DD] hover:border-[#0B7A3B]/40 flex items-center justify-center transition-all relative focus:outline-none"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#0B7A3B] text-white text-[10px] font-extrabold min-w-[1.125rem] h-4.5 px-1 rounded-full flex items-center justify-center border border-white shadow-xs">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-8 h-8 rounded-full bg-[#F5FAF6] text-[#10231A] border border-[#D8E8DD] flex items-center justify-center transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 stroke-[2.2]" />
              ) : (
                <Menu className="w-4 h-4 stroke-[2.2]" />
              )}
            </button>
          </div>
        </div>

        {/* Search Overlay Bar & Live Autocomplete Dropdown */}
        {searchOpen && (
          <div ref={searchContainerRef} className="py-3 border-t border-[#D8E8DD] animate-fadeIn relative">
            <form
              onSubmit={handleSearchSubmit}
              className="relative max-w-xl mx-auto flex items-center"
            >
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cricket bats, balls, protective gear..."
                className="w-full bg-[#F5FAF6] border border-[#D8E8DD] text-[#10231A] text-sm rounded-full py-2.5 pl-10 pr-20 focus:outline-none focus:border-[#0B7A3B] focus:ring-2 focus:ring-[#0B7A3B]/20 transition-all placeholder-[#7B8A82]"
                autoFocus
              />
              <Search className="w-4 h-4 text-[#7B8A82] absolute left-3.5" />
              <div className="absolute right-3.5 flex items-center gap-2">
                {isSearching && (
                  <Loader2 className="w-4 h-4 text-[#0B7A3B] animate-spin" />
                )}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setLiveResults([]);
                      setHasSearched(false);
                    }}
                    className="text-[#7B8A82] hover:text-[#0B7A3B] text-xs font-bold uppercase tracking-wider"
                  >
                    Clear
                  </button>
                )}
              </div>
            </form>

            {/* Live Autocomplete Suggestions Dropdown */}
            {searchQuery.trim().length >= 2 && (
              <div className="max-w-xl mx-auto mt-2 bg-white/95 backdrop-blur-md border border-[#D8E8DD] rounded-2xl shadow-2xl p-3 z-50 animate-fadeIn space-y-2">
                {isSearching && liveResults.length === 0 ? (
                  <div className="py-6 text-center text-xs text-[#52645A] flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 text-[#0B7A3B] animate-spin" />
                    <span>Searching official SSD equipment...</span>
                  </div>
                ) : liveResults.length > 0 ? (
                  <div>
                    <div className="flex items-center justify-between px-2 py-1 text-[11px] font-mono uppercase tracking-wider text-[#7B8A82] border-b border-[#E2ECE6] mb-1">
                      <span>Products</span>
                      <span>{liveResults.length} {liveResults.length === 1 ? 'match' : 'matches'}</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto space-y-1 pr-1">
                      {liveResults.map((product) => {
                        const price = product.priceRange?.minVariantPrice;
                        const formattedPrice = price
                          ? `₹${parseFloat(price.amount).toLocaleString('en-IN')}`
                          : '';

                        return (
                          <Link
                            key={product.id || product.handle}
                            to={`/products/${product.handle}`}
                            onClick={() => {
                              setSearchOpen(false);
                              setLiveResults([]);
                            }}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#EAF7EE] transition-all group"
                          >
                            <div className="w-12 h-12 rounded-lg bg-[#F5FAF6] border border-[#D8E8DD] overflow-hidden shrink-0 flex items-center justify-center">
                              {product.featuredImage?.url ? (
                                <img
                                  src={product.featuredImage.url}
                                  alt={product.featuredImage.altText || product.title}
                                  className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform"
                                />
                              ) : (
                                <ShoppingBag className="w-5 h-5 text-[#7B8A82]" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-[#10231A] group-hover:text-[#0B7A3B] truncate transition-colors">
                                {product.title}
                              </h4>
                              {formattedPrice && (
                                <p className="text-xs font-black text-[#0B7A3B]">
                                  {formattedPrice}
                                </p>
                              )}
                            </div>
                            <ChevronRight className="w-4 h-4 text-[#7B8A82] group-hover:text-[#0B7A3B] group-hover:translate-x-0.5 transition-all" />
                          </Link>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="w-full mt-2 pt-2 border-t border-[#E2ECE6] text-xs font-bold text-[#0B7A3B] hover:text-[#075E2D] flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-[#EAF7EE] transition-colors cursor-pointer"
                    >
                      <span>View all results for &ldquo;{searchQuery}&rdquo;</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : hasSearched && !isSearching ? (
                  <div className="py-6 text-center space-y-2">
                    <p className="text-xs font-semibold text-[#10231A]">
                      No equipment found matching &ldquo;{searchQuery}&rdquo;
                    </p>
                    <p className="text-[11px] text-[#7B8A82]">
                      Try searching for bat, ball, tennis, or player edition.
                    </p>
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="text-xs font-bold text-[#0B7A3B] hover:underline cursor-pointer"
                    >
                      Search catalog anyway &rarr;
                    </button>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#D8E8DD] px-6 pt-3 pb-6 space-y-3 animate-fadeIn shadow-lg">
          {/* Mobile Search Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                navigate(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
                setMobileMenuOpen(false);
              }
            }}
            className="relative"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search equipment..."
              className="w-full bg-[#F5FAF6] border border-[#D8E8DD] text-[#10231A] text-xs rounded-xl py-2.5 pl-9 pr-8 focus:outline-none focus:border-[#0B7A3B]"
            />
            <Search className="w-3.5 h-3.5 text-[#7B8A82] absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#7B8A82]"
              >
                &times;
              </button>
            )}
          </form>
          {navLinks.map((link) => {
            if (link.hasDropdown) {
              return (
                <div key={link.name} className="border-b border-[#E2ECE6]">
                  <div className="flex items-center justify-between py-2.5">
                    <Link
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-[#10231A] hover:text-[#0B7A3B] font-bold text-sm uppercase tracking-wider transition-colors"
                    >
                      {link.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                      className="p-1 rounded-lg text-[#52645A] hover:text-[#0B7A3B] focus:outline-none"
                      aria-label="Toggle Products sub-collections"
                      aria-expanded={mobileProductsOpen}
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          mobileProductsOpen ? 'rotate-180 text-[#0B7A3B]' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Expandable Mobile Submenu */}
                  {mobileProductsOpen && (
                    <div className="pl-3 pb-2 space-y-1 animate-fadeIn">
                      <Link
                        to="/catalog"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-1.5 text-xs font-bold text-[#0B7A3B] uppercase tracking-wider"
                      >
                        All Products
                      </Link>
                      {productCollections.map((col) => (
                        <Link
                          key={col.id || col.handle}
                          to={`/catalog/${encodeURIComponent(col.handle)}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-1.5 text-xs font-medium text-[#52645A] hover:text-[#0B7A3B] transition-colors"
                        >
                          {col.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-[#10231A] hover:text-[#0B7A3B] font-bold text-sm uppercase tracking-wider py-2.5 border-b border-[#E2ECE6] transition-colors"
              >
                {link.name}
              </Link>
            );
          })}
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


