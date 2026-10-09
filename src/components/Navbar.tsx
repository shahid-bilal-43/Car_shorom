import React, { useState } from 'react';
import { Search, Shield, Menu, X, PhoneCall } from 'lucide-react';
import { BusinessSettings } from '../types';

interface NavbarProps {
  currentView: 'home' | 'inventory' | 'detail' | 'admin';
  onNavigate: (view: 'home' | 'inventory' | 'admin', extra?: { carId?: string; brand?: string }) => void;
  businessSettings: BusinessSettings;
  onOpenSearch?: () => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  businessSettings,
  onOpenSearch,
  isAdminLoggedIn,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: 'home' | 'inventory' | 'admin', extra?: { brand?: string }) => {
    onNavigate(view, extra);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strict 3-zone contract: Zone 1 (Brand) — Zone 2 (Nav links) — Zone 3 (Action) */}
        <div className="flex items-center justify-between gap-8 h-20">
          {/* Zone 1: Brand wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B] rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-[#C6A15B] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-[#C6A15B] text-base tracking-tighter">LM</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-[#C6A15B] transition-colors">
                LEGHARI MOTORS
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold -mt-0.5">
                Dera Ghazi Khan
              </span>
            </div>
          </button>

          {/* Zone 2: Concise single-line navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-700">
            <button
              onClick={() => handleNavClick('home')}
              className={`hover:text-[#C6A15B] transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'home' ? 'text-[#C6A15B] font-bold' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('inventory')}
              className={`hover:text-[#C6A15B] transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'inventory' ? 'text-[#C6A15B] font-bold' : ''
              }`}
            >
              Explore Cars
            </button>
            <a
              href="#brands-section"
              onClick={(e) => {
                if (currentView !== 'home') {
                  e.preventDefault();
                  handleNavClick('home');
                  setTimeout(() => {
                    document.getElementById('brands-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 150);
                }
              }}
              className="hover:text-[#C6A15B] transition-colors whitespace-nowrap shrink-0"
            >
              Brands
            </a>
            <a
              href="#about-showroom"
              onClick={(e) => {
                if (currentView !== 'home') {
                  e.preventDefault();
                  handleNavClick('home');
                  setTimeout(() => {
                    document.getElementById('about-showroom')?.scrollIntoView({ behavior: 'smooth' });
                  }, 150);
                }
              }}
              className="hover:text-[#C6A15B] transition-colors whitespace-nowrap shrink-0"
            >
              About Showroom
            </a>
            <a
              href="#contact-section"
              onClick={(e) => {
                if (currentView !== 'home') {
                  e.preventDefault();
                  handleNavClick('home');
                  setTimeout(() => {
                    document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 150);
                }
              }}
              className="hover:text-[#C6A15B] transition-colors whitespace-nowrap shrink-0"
            >
              Contact
            </a>
          </nav>

          {/* Zone 3: Primary Action & Search & Admin portal */}
          <div className="flex items-center gap-3 shrink-0">
            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                aria-label="Search Inventory"
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 transition-colors"
                title="Search Vehicles"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => handleNavClick('inventory')}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-black bg-[#C6A15B] hover:bg-[#D4B26F] rounded-xl transition-all shadow-[0_4px_14px_rgba(198,161,91,0.25)] whitespace-nowrap shrink-0 active:scale-95"
            >
              Browse Inventory
            </button>

            {/* Quiet Owner / Admin Portal Entry */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`p-2.5 rounded-xl border transition-colors ${
                currentView === 'admin'
                  ? 'bg-[#C6A15B]/20 border-[#C6A15B] text-[#9F7E3B]'
                  : isAdminLoggedIn
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
              title={isAdminLoggedIn ? 'Owner Dashboard (Shahid Leghari)' : 'Administrator Login'}
              aria-label="Admin Portal"
            >
              <Shield className="w-4 h-4" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer in Crisp White */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-6 py-5 space-y-4 shadow-lg">
          <nav className="flex flex-col space-y-3">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left text-base font-bold text-slate-800 hover:text-[#C6A15B] py-1"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('inventory')}
              className="text-left text-base font-bold text-slate-800 hover:text-[#C6A15B] py-1"
            >
              Explore Cars
            </button>
            <button
              onClick={() => {
                handleNavClick('home');
                setTimeout(() => {
                  document.getElementById('brands-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-left text-base font-bold text-slate-800 hover:text-[#C6A15B] py-1"
            >
              Brands
            </button>
            <button
              onClick={() => {
                handleNavClick('home');
                setTimeout(() => {
                  document.getElementById('about-showroom')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-left text-base font-bold text-slate-800 hover:text-[#C6A15B] py-1"
            >
              About Showroom
            </button>
            <button
              onClick={() => {
                handleNavClick('home');
                setTimeout(() => {
                  document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-left text-base font-bold text-slate-800 hover:text-[#C6A15B] py-1"
            >
              Contact Showroom
            </button>
            <button
              onClick={() => handleNavClick('admin')}
              className="text-left text-sm font-bold text-[#9F7E3B] py-1 flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              {isAdminLoggedIn ? 'Owner Dashboard (Shahid Leghari)' : 'Administrator Login'}
            </button>
          </nav>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Dera Ghazi Khan, Punjab</span>
            <a href={`tel:${businessSettings.phone}`} className="flex items-center gap-1 font-bold text-[#9F7E3B]">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Showroom</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
