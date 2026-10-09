import React, { useState, useEffect } from 'react';
import { Vehicle, InventoryFilterState, SortOption } from '../types';
import { vehicleRepository } from '../repositories/MockVehicleRepository';
import { VehicleCard } from '../components/VehicleCard';
import { Search, Filter, RotateCcw, Car, ArrowUpDown, SlidersHorizontal } from 'lucide-react';

interface InventoryPageProps {
  initialBrand?: string;
  onSelectVehicle: (id: string) => void;
}

export const InventoryPage: React.FC<InventoryPageProps> = ({
  initialBrand,
  onSelectVehicle,
}) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [filters, setFilters] = useState<InventoryFilterState>({
    searchQuery: '',
    brand: initialBrand || 'All',
    minPrice: undefined,
    maxPrice: undefined,
    minYear: undefined,
    maxYear: undefined,
    transmission: 'All',
    fuelType: 'All',
    bodyType: 'All',
    status: 'All',
  });

  const [sort, setSort] = useState<SortOption>('newest');
  const [availableBrands, setAvailableBrands] = useState<{ name: string; count: number }[]>([]);

  useEffect(() => {
    if (initialBrand) {
      setFilters((prev) => ({ ...prev, brand: initialBrand }));
    }
  }, [initialBrand]);

  useEffect(() => {
    vehicleRepository.getAvailableBrands().then(setAvailableBrands);
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    vehicleRepository.getFilteredVehicles(filters, sort).then((data) => {
      if (isMounted) {
        setVehicles(data);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [filters, sort]);

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      brand: 'All',
      minPrice: undefined,
      maxPrice: undefined,
      minYear: undefined,
      maxYear: undefined,
      transmission: 'All',
      fuelType: 'All',
      bodyType: 'All',
      status: 'All',
    });
    setSort('newest');
  };

  const activeFiltersCount = [
    filters.brand !== 'All' ? 1 : 0,
    filters.minPrice !== undefined || filters.maxPrice !== undefined ? 1 : 0,
    filters.minYear !== undefined || filters.maxYear !== undefined ? 1 : 0,
    filters.transmission !== 'All' ? 1 : 0,
    filters.fuelType !== 'All' ? 1 : 0,
    filters.bodyType !== 'All' ? 1 : 0,
    filters.status !== 'All' ? 1 : 0,
    filters.searchQuery ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#9F7E3B]">
              Leghari Motors Showroom
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-950 mt-1">
              Explore Vehicle Inventory
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-xl font-medium">
              Verified luxury sedans, rugged 4WD SUVs, and city cars available in Dera Ghazi Khan with real photographs.
            </p>
          </div>

          {/* Quick Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              placeholder="Search make, model, city..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#C6A15B] shadow-xs"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters({ ...filters, searchQuery: '' })}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Layout Grid: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex items-center justify-between gap-4">
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-sm font-bold text-slate-900 shadow-xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#9F7E3B]" />
              <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
            </button>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="px-3 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none shadow-xs"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="mileage-asc">Lowest Mileage</option>
              <option value="year-desc">Latest Model Year</option>
            </select>
          </div>

          {/* Desktop Filter Sidebar */}
          <aside
            className={`lg:col-span-3 space-y-6 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm ${
              mobileFiltersOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#9F7E3B]" />
                <h3 className="font-extrabold text-slate-900 text-sm">Refine Search</h3>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#9F7E3B] transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Brand Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Brand / Make
              </label>
              <select
                value={filters.brand}
                onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#FAFAFB] border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#C6A15B]"
              >
                <option value="All">All Brands</option>
                {availableBrands.map((b) => (
                  <option key={b.name} value={b.name}>
                    {b.name} ({b.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Budget (PKR)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min Rs."
                  value={filters.minPrice || ''}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      minPrice: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="w-full px-2.5 py-2 rounded-xl bg-[#FAFAFB] border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#C6A15B]"
                />
                <input
                  type="number"
                  placeholder="Max Rs."
                  value={filters.maxPrice || ''}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      maxPrice: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="w-full px-2.5 py-2 rounded-xl bg-[#FAFAFB] border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#C6A15B]"
                />
              </div>
            </div>

            {/* Body Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Body Style
              </label>
              <select
                value={filters.bodyType}
                onChange={(e) => setFilters({ ...filters, bodyType: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#FAFAFB] border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#C6A15B]"
              >
                <option value="All">All Body Types</option>
                <option value="SUV">SUV / 4WD</option>
                <option value="Sedan">Sedan</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Crossover">Crossover</option>
                <option value="Pickup">Pickup</option>
              </select>
            </div>

            {/* Transmission */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Transmission
              </label>
              <select
                value={filters.transmission}
                onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#FAFAFB] border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#C6A15B]"
              >
                <option value="All">All Transmissions</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
                <option value="CVT">CVT</option>
                <option value="AGS">AGS</option>
              </select>
            </div>

            {/* Fuel Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Fuel Type
              </label>
              <select
                value={filters.fuelType}
                onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#FAFAFB] border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#C6A15B]"
              >
                <option value="All">All Fuels</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            {/* Availability Status */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#FAFAFB] border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#C6A15B]"
              >
                <option value="All">All Statuses</option>
                <option value="Available">Available Now</option>
                <option value="Reserved">Reserved</option>
                <option value="Sold">Sold Archive</option>
              </select>
            </div>
          </aside>

          {/* Main Vehicles Grid */}
          <main className="lg:col-span-9 space-y-6">
            {/* Desktop Sort Header */}
            <div className="hidden lg:flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <span className="text-xs font-semibold text-slate-600">
                Showing <strong className="text-slate-900 tabular-nums">{vehicles.length}</strong>{' '}
                {vehicles.length === 1 ? 'vehicle' : 'vehicles'}
              </span>

              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#9F7E3B]" />
                <span className="text-xs font-bold text-slate-600">Sort by:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="px-3 py-1.5 rounded-xl bg-[#FAFAFB] border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#C6A15B]"
                >
                  <option value="newest">Newest Listings</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="mileage-asc">Lowest Mileage</option>
                  <option value="year-desc">Model Year</option>
                </select>
              </div>
            </div>

            {/* Results Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-96 rounded-3xl bg-white border border-slate-200 animate-pulse"
                  />
                ))}
              </div>
            ) : vehicles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {vehicles.map((car) => (
                  <VehicleCard
                    key={car.id}
                    vehicle={car}
                    onSelect={onSelectVehicle}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
                <Car className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-lg font-extrabold text-slate-900">No Matching Vehicles Found</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
                  No vehicles currently match your active search or filter criteria. Try expanding your budget range or resetting filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C6A15B] text-black text-xs font-extrabold uppercase tracking-wider hover:bg-[#D4B26F] transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
