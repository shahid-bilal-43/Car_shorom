import React from 'react';
import { Vehicle } from '../types';
import { formatPKR, formatMileage } from '../utils/formatters';
import { ShieldCheck, CameraOff, ArrowRight } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelect: (vehicleId: string) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onSelect }) => {
  const primaryImage = vehicle.images.length > 0 ? vehicle.images[0] : null;

  return (
    <article
      onClick={() => onSelect(vehicle.id)}
      className="group relative flex flex-col rounded-3xl bg-white border border-slate-200/90 hover:border-[#C6A15B] transition-all duration-300 overflow-hidden cursor-pointer shadow-sm hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1.5"
    >
      {/* Real Vehicle Photography Media Header */}
      <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
        {primaryImage && primaryImage.url ? (
          <img
            src={primaryImage.url}
            alt={primaryImage.altText || `${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                const placeholder = parent.querySelector('.fallback-placeholder') as HTMLElement;
                if (placeholder) placeholder.style.display = 'flex';
              }
            }}
          />
        ) : null}

        {/* Clean Branded Fallback Placeholder */}
        <div
          className={`fallback-placeholder absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center p-6 text-center ${
            primaryImage ? 'hidden' : 'flex'
          }`}
        >
          <CameraOff className="w-8 h-8 text-[#C6A15B] mb-2" />
          <span className="text-xs font-bold text-slate-800">
            {vehicle.make} {vehicle.model}
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5">
            Real Showroom Photos Pending
          </span>
        </div>

        {/* Status Indicators */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {vehicle.status === 'Sold' ? (
            <span className="px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider bg-rose-600 text-white rounded-lg shadow-sm">
              Sold
            </span>
          ) : vehicle.status === 'Reserved' ? (
            <span className="px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider bg-amber-500 text-black rounded-lg shadow-sm">
              Reserved
            </span>
          ) : null}

          {primaryImage?.isVerified && (
            <span className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-emerald-800 bg-white/90 backdrop-blur-md rounded-lg shadow-xs border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified Spec
            </span>
          )}
        </div>

        {/* Subtle bottom scrim */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-6 bg-white">
        {/* Kicker brand & registration */}
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="uppercase tracking-wider font-extrabold text-[#9F7E3B]">
            {vehicle.make}
          </span>
          <span className="font-semibold text-slate-600">{vehicle.registrationCity} Reg</span>
        </div>

        {/* Model Title */}
        <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-[#9F7E3B] transition-colors leading-snug">
          {vehicle.model}{' '}
          <span className="text-sm font-medium text-slate-600 block truncate mt-0.5">
            {vehicle.variant}
          </span>
        </h3>

        {/* Unboxed Metadata with Typographic Separators */}
        <div className="flex items-center flex-wrap gap-2 text-xs text-slate-600 my-4">
          <span className="tabular-nums font-bold text-slate-800">{vehicle.year}</span>
          <span aria-hidden="true" className="text-slate-400">·</span>
          <span>{vehicle.transmission}</span>
          <span aria-hidden="true" className="text-slate-400">·</span>
          <span className="tabular-nums">{formatMileage(vehicle.mileageKm)}</span>
          <span aria-hidden="true" className="text-slate-400">·</span>
          <span>{vehicle.fuelType}</span>
        </div>

        {/* Price & CTA Footer */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">
              Asking Price
            </span>
            <span className="text-xl font-extrabold text-slate-950 tabular-nums tracking-tight">
              {formatPKR(vehicle.pricePKR)}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-[#9F7E3B] group-hover:translate-x-1 transition-transform">
            <span>View Details</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </article>
  );
};
