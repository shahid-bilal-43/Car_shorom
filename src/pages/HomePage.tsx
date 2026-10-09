import React from 'react';
import { Vehicle, BusinessSettings } from '../types';
import { VehicleCard } from '../components/VehicleCard';
import { ThreeCarShowroom } from '../components/ThreeCarShowroom';
import {
  ArrowRight,
  Shield,
  FileCheck2,
  MessageSquare,
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  Car,
  Camera,
  CheckCircle2
} from 'lucide-react';

interface HomePageProps {
  featuredVehicles: Vehicle[];
  availableBrands: { name: string; count: number }[];
  businessSettings: BusinessSettings;
  onNavigate: (view: 'home' | 'inventory' | 'admin', extra?: { carId?: string; brand?: string }) => void;
  onSelectVehicle: (id: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  featuredVehicles,
  availableBrands,
  businessSettings,
  onNavigate,
  onSelectVehicle,
}) => {
  return (
    <div className="bg-[#FAFAFB] text-slate-900 space-y-24 pb-20">
      {/* B. Cinematic Bright White Hero Section with Real Showroom Photography */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden pt-4 pb-16">
        {/* Real White Luxury Showroom Photo Backdrop */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_white_luxury_showroom_1791520269063.jpg"
            alt="Leghari Motors Pristine White Luxury Showroom in Dera Ghazi Khan"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-102 transition-transform duration-1000"
          />
          {/* Subtle luminous white gradient scrim for crystal clear readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAFB] via-[#FAFAFB]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAFAFB]/80 via-transparent to-[#FAFAFB]/80" />
        </div>

        {/* Hero Foreground Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 mt-12 sm:mt-16">
          {/* Real Photography & Showroom Trust Kicker */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 text-xs text-slate-800 shadow-md">
            <Camera className="w-3.5 h-3.5 text-[#C6A15B]" />
            <span className="font-bold tracking-wide">100% Real Vehicle Photos</span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-600 font-semibold">Dera Ghazi Khan, Pakistan</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-950 tracking-tight leading-[1.08]">
              Discover Your <span className="text-[#9F7E3B]">Next Drive</span>.
            </h1>
            <p className="text-base sm:text-xl text-slate-700 max-w-2xl mx-auto leading-relaxed font-medium">
              Explore verified luxury vehicles with genuine photographs, model-accurate specifications, and direct showroom inspection at Leghari Motors.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('inventory')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-black bg-[#C6A15B] hover:bg-[#D4B26F] transition-all shadow-[0_8px_25px_rgba(198,161,91,0.35)] flex items-center justify-center gap-2 group active:scale-95"
            >
              <span>Explore Real Stock</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="#contact-section"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-slate-800 bg-white/95 hover:bg-white border border-slate-200/90 shadow-md backdrop-blur-md transition-all text-center"
            >
              Contact Showroom
            </a>
          </div>

          {/* Micro Trust Indicators (Clean unboxed text) */}
          <div className="pt-6 flex items-center justify-center flex-wrap gap-8 text-xs text-slate-600 font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="text-[#9F7E3B] font-extrabold">Owner:</span>
              <span className="text-slate-900">{businessSettings.ownerName}</span>
            </div>
            <span className="text-slate-300 hidden sm:inline">·</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[#9F7E3B] font-extrabold">Location:</span>
              <span className="text-slate-900">Indus Highway, D.G. Khan</span>
            </div>
            <span className="text-slate-300 hidden sm:inline">·</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[#9F7E3B] font-extrabold">Currency:</span>
              <span className="text-slate-900">Pakistani Rupees (Rs. / PKR)</span>
            </div>
          </div>
        </div>
      </section>

      {/* C. Interactive 3D Animated White Showroom Studio */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#9F7E3B]">
              <Sparkles className="w-4 h-4" />
              <span>3D Animated Experience</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 mt-1">
              Virtual 3D Showroom Turntable
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl font-medium">
              Interactive 3D vehicle visualizer on a polished white showroom turntable. Rotate 360°, inspect custom paint colors, and adjust studio lighting in real-time.
            </p>
          </div>
        </div>

        {/* 3D Component */}
        <ThreeCarShowroom />
      </section>

      {/* D. Featured Cars Section with Real Photography */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#9F7E3B]">
                Curated Inventory
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Real Vehicle Photos
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 mt-1">
              Featured Showroom Stock
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              Authentic vehicles currently parked on the showroom floor in Dera Ghazi Khan.
            </p>
          </div>

          <button
            onClick={() => onNavigate('inventory')}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#9F7E3B] hover:text-black transition-colors"
          >
            <span>View All Stock</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Featured Real Vehicle Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredVehicles.map((car) => (
            <VehicleCard
              key={car.id}
              vehicle={car}
              onSelect={onSelectVehicle}
            />
          ))}
        </div>
      </section>

      {/* E. Browse by Brand */}
      <section id="brands-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#9F7E3B]">
            Automotive Brands
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-1">
            Browse by Brand
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Explore listings categorized by Japanese and leading international manufacturers.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {availableBrands.map((brand) => (
            <button
              key={brand.name}
              onClick={() => onNavigate('inventory', { brand: brand.name })}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-[#C6A15B] hover:shadow-lg transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#9F7E3B] mb-3 group-hover:scale-105 transition-transform">
                <Car className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 group-hover:text-[#9F7E3B] transition-colors text-base">
                {brand.name}
              </h3>
              <span className="text-xs text-slate-500 block mt-0.5 tabular-nums font-semibold">
                {brand.count} {brand.count === 1 ? 'vehicle' : 'vehicles'}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* F. Why Leghari Motors */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#9F7E3B]">
              Authentic Standards
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-1">
              Why Choose Leghari Motors
            </h2>
            <p className="text-sm text-slate-600 mt-2 font-medium">
              We focus on genuine physical inventory, transparent Pakistani pricing, and direct customer communication.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#FAFAFB] border border-slate-200/80 space-y-3">
              <Camera className="w-6 h-6 text-[#9F7E3B]" />
              <h3 className="font-bold text-slate-900 text-base">100% Real Photography</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Every vehicle profile displays authentic photos of the actual car for sale, never stock or generic illustrations.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAFAFB] border border-slate-200/80 space-y-3">
              <FileCheck2 className="w-6 h-6 text-[#9F7E3B]" />
              <h3 className="font-bold text-slate-900 text-base">Verified Specifications</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Accurate documentation, genuine mileage, registration history, engine CC, and complete feature checklists.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAFAFB] border border-slate-200/80 space-y-3">
              <MessageSquare className="w-6 h-6 text-[#9F7E3B]" />
              <h3 className="font-bold text-slate-900 text-base">Direct WhatsApp Inquiries</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Pre-formatted WhatsApp messages addressed directly to Shahid Leghari with full vehicle reference codes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAFAFB] border border-slate-200/80 space-y-3">
              <Building2 className="w-6 h-6 text-[#9F7E3B]" />
              <h3 className="font-bold text-slate-900 text-base">Physical Showroom Inspection</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Conveniently located on Indus Highway in Dera Ghazi Khan, Punjab, with test drives and walkthroughs welcomed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* G. About the Showroom & Contact Information */}
      <section id="about-showroom" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* About Showroom Story */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#9F7E3B]">
                About Showroom
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
                Leghari Motors · Dera Ghazi Khan
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                Managed by <strong>{businessSettings.ownerName}</strong>, Leghari Motors is a trusted automotive showroom serving customers across Dera Ghazi Khan, Multan, Bahawalpur, and southern Punjab with premium Japanese imports and quality local assemblies.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our showroom is committed to honest trade, authentic photographs of listed stock, and transparent vehicle deals.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block uppercase tracking-wider font-semibold">
                  Showroom Administrator
                </span>
                <span className="text-base font-extrabold text-slate-900">
                  {businessSettings.ownerName}
                </span>
              </div>
              <button
                onClick={() => onNavigate('inventory')}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white transition-colors"
              >
                Browse Available Stock
              </button>
            </div>
          </div>

          {/* Contact Details Card */}
          <div id="contact-section" className="lg:col-span-5 p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#9F7E3B]">
                Visit & Contact
              </span>
              <h3 className="text-xl font-extrabold text-slate-950">Showroom Address</h3>

              <div className="space-y-3.5 text-xs text-slate-700 font-medium">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#9F7E3B] shrink-0 mt-0.5" />
                  <span>{businessSettings.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#9F7E3B] shrink-0" />
                  <a href={`tel:${businessSettings.phone}`} className="hover:text-black font-bold">
                    {businessSettings.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#9F7E3B] shrink-0" />
                  <a href={`mailto:${businessSettings.email}`} className="hover:text-black font-bold">
                    {businessSettings.email}
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#9F7E3B] shrink-0 mt-0.5" />
                  <span>{businessSettings.businessHours}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <a
                href={businessSettings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-[#FAFAFB] hover:bg-slate-100 border border-slate-200 text-xs font-bold text-[#9F7E3B] flex items-center justify-center gap-2 transition-colors"
              >
                <MapPin className="w-4 h-4" />
                <span>Open in Google Maps</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
