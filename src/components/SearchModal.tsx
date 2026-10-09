import React, { useState, useEffect } from 'react';
import { Vehicle } from '../types';
import { vehicleRepository } from '../repositories/MockVehicleRepository';
import { formatPKR, formatMileage } from '../utils/formatters';
import { Search, X, ArrowRight, Car } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVehicle: (id: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectVehicle,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Vehicle[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      return;
    }

    if (!query.trim()) {
      vehicleRepository.getAllVehicles().then((cars) => setResults(cars.slice(0, 4)));
      return;
    }

    const timer = setTimeout(() => {
      vehicleRepository
        .getFilteredVehicles({ searchQuery: query, brand: 'All' }, 'newest')
        .then(setResults);
    }, 150);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl space-y-4 p-5 sm:p-7 animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input Box */}
        <div className="relative flex items-center border-b border-slate-100 pb-3">
          <Search className="w-5 h-5 text-[#9F7E3B] mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search make, model, registration city (e.g. Land Cruiser, Civic, Lahore)..."
            className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-sm font-semibold focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
          <div className="text-[11px] text-slate-500 uppercase font-bold tracking-wider px-2">
            {query.trim() ? `Search Results (${results.length})` : 'Popular Real Inventory'}
          </div>

          {results.length > 0 ? (
            results.map((car) => (
              <button
                key={car.id}
                onClick={() => {
                  onSelectVehicle(car.id);
                  onClose();
                }}
                className="w-full p-3 rounded-2xl hover:bg-slate-50 transition-colors flex items-center justify-between text-left group border border-transparent hover:border-slate-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-11 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                    {car.images[0] ? (
                      <img
                        src={car.images[0].url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-500">
                        <Car className="w-4 h-4 text-slate-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 group-hover:text-[#9F7E3B] transition-colors block">
                      {car.year} {car.make} {car.model}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {car.variant} · {car.registrationCity} Reg · {formatMileage(car.mileageKm)}
                    </span>
                  </div>
                </div>

                <div className="text-right flex items-center gap-2">
                  <span className="text-sm font-extrabold text-slate-900 tabular-nums">
                    {formatPKR(car.pricePKR)}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#9F7E3B] group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-slate-500 font-medium">
              No matching vehicles found for "{query}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
