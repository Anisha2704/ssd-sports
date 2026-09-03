import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import { useHomepageHero } from '../hooks/useHomepageHero';
import { useFooter } from '../hooks/useFooter';

export default function Footer() {
  const { hero } = useHomepageHero();
  const { footerSettings } = useFooter();

  // Social Links availability
  const hasInstagram = Boolean(footerSettings?.instagramUrl);
  const hasFacebook = Boolean(footerSettings?.facebookUrl);
  const hasYoutube = Boolean(footerSettings?.youtubeUrl);
  const hasSocials = hasInstagram || hasFacebook || hasYoutube;

  // Contact Info availability
  const hasAddress = Boolean(footerSettings?.address);
  const hasPhone = Boolean(footerSettings?.phone);
  const hasEmail = Boolean(footerSettings?.email);
  const hasContact = hasAddress || hasPhone || hasEmail;

  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Column 1: Logo & Brand Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              {hero?.logo?.url ? (
                <img
                  src={hero.logo.url}
                  alt={hero.logo.altText || 'SSD Sports Logo'}
                  className="h-10 w-auto max-w-[200px] object-contain brightness-110"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="bg-gradient-to-br from-red-600 to-orange-500 text-white font-black text-xl tracking-tighter px-2.5 py-0.5 rounded">
                    SSD
                  </div>
                  <span className="font-extrabold text-lg tracking-wider text-slate-100 uppercase">
                    SPORTS
                  </span>
                </div>
              )}
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Premium cricket gear built for performance.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-200 uppercase tracking-wider text-xs">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-red-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="text-slate-400 hover:text-red-500 transition-colors">
                  Catalog
                </Link>
              </li>
              <li>
                <Link to="/#about" className="text-slate-400 hover:text-red-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <a href="#contact" className="text-slate-400 hover:text-red-500 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <Link to="/track-order" className="text-slate-400 hover:text-red-500 transition-colors">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          {hasContact && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-200 uppercase tracking-wider text-xs">
                Contact Info
              </h3>
              <ul className="space-y-3 text-sm">
                {hasAddress && (
                  <li className="flex items-start space-x-3 text-slate-400">
                    <MapPin className="w-5 h-5 text-white shrink-0 mt-0.5" />
                    <span className="whitespace-pre-line leading-relaxed break-words">
                      {footerSettings.address}
                    </span>
                  </li>
                )}
                {hasPhone && (
                  <li className="flex items-center space-x-3 text-slate-400">
                    <Phone className="w-5 h-5 text-white shrink-0" />
                    <a
                      href={`tel:${footerSettings.phone.replace(/\s+/g, '')}`}
                      className="hover:text-red-500 transition-colors"
                    >
                      {footerSettings.phone}
                    </a>
                  </li>
                )}
                {hasEmail && (
                  <li className="flex items-center space-x-3 text-slate-400">
                    <Mail className="w-5 h-5 text-white shrink-0" />
                    <a
                      href={`mailto:${footerSettings.email}`}
                      className="hover:text-red-500 transition-colors break-all"
                    >
                      {footerSettings.email}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Column 4: Follow Us */}
          {hasSocials && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-200 uppercase tracking-wider text-xs">
                Follow Us
              </h3>
              <div className="flex items-center space-x-3">
                {hasInstagram && (
                  <a
                    href={footerSettings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:border-white hover:bg-white/20 transition-all duration-200"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                )}
                {hasFacebook && (
                  <a
                    href={footerSettings.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:border-white hover:bg-white/20 transition-all duration-200"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                )}
                {hasYoutube && (
                  <a
                    href={footerSettings.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:border-white hover:bg-white/20 transition-all duration-200"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-slate-900 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 SSD Sports. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
