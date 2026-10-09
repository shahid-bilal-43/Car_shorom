import React, { useState } from 'react';
import { Vehicle, BusinessSettings } from '../types';
import { formatPKR, formatMileage, formatEngineCc, buildWhatsAppInquiryUrl, buildCallShowroomUrl } from '../utils/formatters';
import { VehicleCard } from '../components/VehicleCard';
import {
  ArrowLeft,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
  Check,
  CameraOff,
  Maximize2,
  X,
  Share2,
  MapPin,
  Camera
} from 'lucide-react';

interface VehicleDetailPageProps {
  vehicle: Vehicle;
  similarVehicles: Vehicle[];
  businessSettings: BusinessSettings;
  onBack: () => void;
  onSelectSimilar: (id: string) => void;
}

export const VehicleDetailPage: React.FC<VehicleDetailPageProps> = ({
  vehicle,
  similarVehicles,
  businessSettings,
  onBack,
  onSelectSimilar,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const images = vehicle.images || [];
  const currentImage = images[selectedImageIndex] || null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const whatsappUrl = buildWhatsAppInquiryUrl(vehicle, businessSettings);
  const callUrl = buildCallShowroomUrl(businessSettings);

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-700 hover:text-black hover:border-slate-400 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Inventory</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:text-black transition-colors shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Link Copied' : 'Share Listing'}</span>
          </button>
        </div>

        {/* Main Grid: Gallery on Left (60%), Details & Inquiry on Right (40%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Gallery Column */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Image Viewport */}
            <div className="relative aspect-[16/10] w-full rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-md group">
              {currentImage ? (
                <>
                  <img
                    src={currentImage.url}
                    alt={currentImage.altText || `${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setLightboxOpen(true)}
                    className="absolute bottom-4 right-4 p-2.5 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200 text-slate-800 hover:bg-white transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
                    title="Expand Fullscreen"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-slate-100 to-slate-200">
                  <CameraOff className="w-12 h-12 text-[#9F7E3B] mb-3" />
                  <h4 className="text-lg font-extrabold text-slate-900">Real Photos Pending</h4>
                  <p className="text-xs text-slate-600 max-w-sm mt-1 font-medium">
                    Genuine showroom photography for this vehicle is being prepared. Contact Shahid Leghari for immediate video inspection.
                  </p>
                </div>
              )}

              {/* Status Overlay */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span
                  className={`px-3 py-1 text-xs font-extrabold uppercase tracking-wider rounded-lg shadow-sm ${
                    vehicle.status === 'Available'
                      ? 'bg-emerald-600 text-white'
                      : vehicle.status === 'Reserved'
                      ? 'bg-amber-500 text-black'
                      : 'bg-rose-600 text-white'
                  }`}
                >
                  {vehicle.status}
                </span>

                {currentImage?.isVerified && (
                  <span className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-emerald-800 bg-white/95 backdrop-blur-md rounded-lg shadow-xs border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Photo
                  </span>
                )}
              </div>

              {/* View Label */}
              {currentImage?.viewLabel && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-xs font-bold text-slate-800 border border-slate-200 shadow-xs">
                  {currentImage.viewLabel}
                </div>
              )}
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-24 h-16 rounded-2xl overflow-hidden shrink-0 border-2 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-[#C6A15B] shadow-md ring-2 ring-[#C6A15B]/30'
                        : 'border-slate-200 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.altText}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Description & Overview */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <span>Vehicle Overview</span>
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                {vehicle.description}
              </p>

              {/* Verified Features */}
              {vehicle.features && vehicle.features.length > 0 && (
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <h4 className="text-xs uppercase tracking-wider font-extrabold text-[#9F7E3B]">
                    Features & Equipment
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {vehicle.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                        <div className="w-4 h-4 rounded-full bg-[#C6A15B]/20 text-[#9F7E3B] flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 font-bold" />
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Purchasing & Specification Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
              <div>
                <div className="flex items-center justify-between text-xs mb-1 font-semibold">
                  <span className="uppercase tracking-wider font-extrabold text-[#9F7E3B]">
                    {vehicle.make}
                  </span>
                  <span className="text-slate-500">Ref: {vehicle.id}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950 leading-tight">
                  {vehicle.model}
                </h1>
                <p className="text-base text-slate-600 mt-0.5 font-medium">{vehicle.variant}</p>
              </div>

              {/* Asking Price in PKR */}
              <div className="p-5 rounded-2xl bg-[#FAFAFB] border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider block font-semibold">
                    Asking Price (PKR)
                  </span>
                  <span className="text-2xl md:text-3xl font-extrabold text-slate-950 tabular-nums tracking-tight">
                    {formatPKR(vehicle.pricePKR)}
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-lg">
                  {vehicle.condition}
                </span>
              </div>

              {/* Direct Actions */}
              <div className="space-y-3">
                {whatsappUrl ? (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl font-bold text-black bg-[#C6A15B] hover:bg-[#D4B26F] transition-all shadow-[0_4px_18px_rgba(198,161,91,0.3)] active:scale-98"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Inquire on WhatsApp</span>
                  </a>
                ) : (
                  <button
                    disabled
                    className="w-full py-4 px-6 rounded-2xl font-bold text-slate-400 bg-slate-100 cursor-not-allowed"
                  >
                    WhatsApp Setup Pending
                  </button>
                )}

                <a
                  href={callUrl}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
                >
                  <PhoneCall className="w-4 h-4 text-[#9F7E3B]" />
                  <span>Call Showroom ({businessSettings.phone})</span>
                </a>
              </div>

              {/* Inspection Trust Box */}
              <div className="p-4 rounded-2xl bg-[#FAFAFB] border border-slate-200/80 flex items-start gap-3 text-xs text-slate-600 font-medium">
                <MapPin className="w-4 h-4 text-[#9F7E3B] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Available for Physical Inspection</span>
                  <span>{businessSettings.showroomName}, {businessSettings.city}, Pakistan. Owner: {businessSettings.ownerName}</span>
                </div>
              </div>

              {/* Verified Specifications */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h3 className="text-xs uppercase tracking-wider font-extrabold text-[#9F7E3B]">
                  Verified Specifications
                </h3>

                <dl className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs font-medium">
                  <div className="border-b border-slate-100 pb-2">
                    <dt className="text-slate-500">Model Year</dt>
                    <dd className="font-extrabold text-slate-900 tabular-nums">{vehicle.year}</dd>
                  </div>
                  <div className="border-b border-slate-100 pb-2">
                    <dt className="text-slate-500">Mileage</dt>
                    <dd className="font-extrabold text-slate-900 tabular-nums">{formatMileage(vehicle.mileageKm)}</dd>
                  </div>
                  <div className="border-b border-slate-100 pb-2">
                    <dt className="text-slate-500">Transmission</dt>
                    <dd className="font-extrabold text-slate-900">{vehicle.transmission}</dd>
                  </div>
                  <div className="border-b border-slate-100 pb-2">
                    <dt className="text-slate-500">Fuel Type</dt>
                    <dd className="font-extrabold text-slate-900">{vehicle.fuelType}</dd>
                  </div>
                  <div className="border-b border-slate-100 pb-2">
                    <dt className="text-slate-500">Engine Capacity</dt>
                    <dd className="font-extrabold text-slate-900 tabular-nums">{formatEngineCc(vehicle.engineCapacityCc)}</dd>
                  </div>
                  <div className="border-b border-slate-100 pb-2">
                    <dt className="text-slate-500">Body Type</dt>
                    <dd className="font-extrabold text-slate-900">{vehicle.bodyType}</dd>
                  </div>
                  <div className="border-b border-slate-100 pb-2">
                    <dt className="text-slate-500">Exterior Color</dt>
                    <dd className="font-extrabold text-slate-900">{vehicle.exteriorColor}</dd>
                  </div>
                  <div className="border-b border-slate-100 pb-2">
                    <dt className="text-slate-500">Interior Color</dt>
                    <dd className="font-extrabold text-slate-900">{vehicle.interiorColor || 'Not provided'}</dd>
                  </div>
                  <div className="border-b border-slate-100 pb-2">
                    <dt className="text-slate-500">Registration</dt>
                    <dd className="font-extrabold text-slate-900">{vehicle.registrationCity}</dd>
                  </div>
                  <div className="border-b border-slate-100 pb-2">
                    <dt className="text-slate-500">Import Status</dt>
                    <dd className="font-extrabold text-slate-900">{vehicle.importStatus}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Vehicles */}
        {similarVehicles.length > 0 && (
          <section className="pt-12 border-t border-slate-200 space-y-6">
            <div>
              <h3 className="text-xl md:text-2xl font-extrabold text-slate-950">Similar Vehicles in Showroom</h3>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                Other available stock of matching brand or body style in Dera Ghazi Khan
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarVehicles.map((simCar) => (
                <VehicleCard
                  key={simCar.id}
                  vehicle={simCar}
                  onSelect={onSelectSimilar}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && currentImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={currentImage.url}
            alt={currentImage.altText}
            referrerPolicy="no-referrer"
            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
          />
          <div className="text-center mt-4 text-white">
            <span className="text-sm font-bold">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </span>
            <span className="text-xs text-slate-300 block mt-0.5">
              {currentImage.viewLabel}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
