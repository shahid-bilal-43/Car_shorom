import React, { useState, useEffect } from 'react';
import { Vehicle, BusinessSettings } from './types';
import { vehicleRepository } from './repositories/MockVehicleRepository';
import { businessSettingsRepository } from './repositories/MockBusinessSettingsRepository';
import { authService } from './services/MockAuthenticationService';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { InventoryPage } from './pages/InventoryPage';
import { VehicleDetailPage } from './pages/VehicleDetailPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { SearchModal } from './components/SearchModal';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'inventory' | 'detail' | 'admin'>('home');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string | undefined>(undefined);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Loaded Data
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [availableBrands, setAvailableBrands] = useState<{ name: string; count: number }[]>([]);
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [similarVehicles, setSimilarVehicles] = useState<Vehicle[]>([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Sync hash routing on mount and hash changes
  useEffect(() => {
    const parseHash = async () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/car/')) {
        const id = hash.replace('#/car/', '');
        setSelectedVehicleId(id);
        setCurrentView('detail');
      } else if (hash.startsWith('#/inventory')) {
        const params = new URLSearchParams(hash.split('?')[1] || '');
        const brand = params.get('brand');
        if (brand) setSelectedBrandFilter(brand);
        setCurrentView('inventory');
      } else if (hash.startsWith('#/admin')) {
        setCurrentView('admin');
      } else {
        setCurrentView('home');
      }
    };

    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, []);

  // Check auth session
  useEffect(() => {
    authService.isAuthenticated().then(setIsAdminLoggedIn);
  }, [currentView]);

  // Load global data
  useEffect(() => {
    vehicleRepository.getFeaturedVehicles().then(setFeaturedVehicles);
    vehicleRepository.getAvailableBrands().then(setAvailableBrands);
    businessSettingsRepository.getSettings().then(setBusinessSettings);
  }, [currentView]);

  // Load detail vehicle when ID changes
  useEffect(() => {
    if (selectedVehicleId && currentView === 'detail') {
      vehicleRepository.getVehicleById(selectedVehicleId).then((car) => {
        if (car) {
          setSelectedVehicle(car);
          vehicleRepository.getSimilarVehicles(car.id).then(setSimilarVehicles);
        } else {
          // If vehicle not found, fallback to inventory
          setCurrentView('inventory');
        }
      });
    }
  }, [selectedVehicleId, currentView]);

  // Navigation handlers
  const handleNavigate = (
    view: 'home' | 'inventory' | 'admin',
    extra?: { carId?: string; brand?: string }
  ) => {
    if (view === 'home') {
      window.location.hash = '#/';
      setCurrentView('home');
    } else if (view === 'inventory') {
      setSelectedBrandFilter(extra?.brand);
      window.location.hash = extra?.brand ? `#/inventory?brand=${encodeURIComponent(extra.brand)}` : '#/inventory';
      setCurrentView('inventory');
    } else if (view === 'admin') {
      window.location.hash = '#/admin';
      setCurrentView('admin');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectVehicle = (id: string) => {
    setSelectedVehicleId(id);
    window.location.hash = `#/car/${id}`;
    setCurrentView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!businessSettings) {
    return (
      <div className="min-h-screen bg-[#090A0C] flex items-center justify-center text-white">
        <div className="w-8 h-8 border-2 border-[#C6A15B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-slate-900 flex flex-col font-sans selection:bg-[#C6A15B] selection:text-white">
      {/* Top Navbar (Hidden on Admin screen to give full workspace area) */}
      {currentView !== 'admin' && (
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          businessSettings={businessSettings}
          onOpenSearch={() => setIsSearchOpen(true)}
          isAdminLoggedIn={isAdminLoggedIn}
        />
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            featuredVehicles={featuredVehicles}
            availableBrands={availableBrands}
            businessSettings={businessSettings}
            onNavigate={handleNavigate}
            onSelectVehicle={handleSelectVehicle}
          />
        )}

        {currentView === 'inventory' && (
          <InventoryPage
            initialBrand={selectedBrandFilter}
            onSelectVehicle={handleSelectVehicle}
          />
        )}

        {currentView === 'detail' && selectedVehicle && (
          <VehicleDetailPage
            vehicle={selectedVehicle}
            similarVehicles={similarVehicles}
            businessSettings={businessSettings}
            onBack={() => handleNavigate('inventory')}
            onSelectSimilar={handleSelectVehicle}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboardPage
            onBackToSite={() => handleNavigate('home')}
            onPreviewVehicle={(id) => handleSelectVehicle(id)}
          />
        )}
      </main>

      {/* Footer (Hidden on Admin screen) */}
      {currentView !== 'admin' && (
        <Footer
          businessSettings={businessSettings}
          onNavigateAdmin={() => handleNavigate('admin')}
          isAdminLoggedIn={isAdminLoggedIn}
        />
      )}

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectVehicle={handleSelectVehicle}
      />
    </div>
  );
}
