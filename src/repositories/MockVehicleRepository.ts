import { Vehicle, InventoryFilterState, SortOption } from '../types';
import { VehicleRepository } from './interfaces';
import { SEED_VEHICLES } from '../data/seedVehicles';

const STORAGE_KEY = 'leghari_motors_vehicles_v1';

export class MockVehicleRepository implements VehicleRepository {
  private loadData(): Vehicle[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    // Initialize with seed data
    this.saveData(SEED_VEHICLES);
    return SEED_VEHICLES;
  }

  private saveData(vehicles: Vehicle[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
    } catch {
      // ignore
    }
  }

  async getAllVehicles(): Promise<Vehicle[]> {
    return this.loadData();
  }

  async getFilteredVehicles(filters: InventoryFilterState, sort: SortOption): Promise<Vehicle[]> {
    const all = this.loadData();
    let result = all.filter((vehicle) => {
      // Query search
      if (filters.searchQuery?.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        const matches =
          vehicle.make.toLowerCase().includes(q) ||
          vehicle.model.toLowerCase().includes(q) ||
          vehicle.variant.toLowerCase().includes(q) ||
          vehicle.year.toString().includes(q) ||
          vehicle.registrationCity.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Brand filter
      if (filters.brand && filters.brand !== 'All') {
        if (vehicle.make.toLowerCase() !== filters.brand.toLowerCase()) return false;
      }

      // Price filter
      if (filters.minPrice !== undefined && vehicle.pricePKR < filters.minPrice) return false;
      if (filters.maxPrice !== undefined && vehicle.pricePKR > filters.maxPrice) return false;

      // Year filter
      if (filters.minYear !== undefined && vehicle.year < filters.minYear) return false;
      if (filters.maxYear !== undefined && vehicle.year > filters.maxYear) return false;

      // Transmission filter
      if (filters.transmission && filters.transmission !== 'All') {
        if (vehicle.transmission.toLowerCase() !== filters.transmission.toLowerCase()) return false;
      }

      // Fuel filter
      if (filters.fuelType && filters.fuelType !== 'All') {
        if (vehicle.fuelType.toLowerCase() !== filters.fuelType.toLowerCase()) return false;
      }

      // Body filter
      if (filters.bodyType && filters.bodyType !== 'All') {
        if (vehicle.bodyType.toLowerCase() !== filters.bodyType.toLowerCase()) return false;
      }

      // Status filter
      if (filters.status && filters.status !== 'All') {
        if (vehicle.status.toLowerCase() !== filters.status.toLowerCase()) return false;
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      switch (sort) {
        case 'price-asc':
          return a.pricePKR - b.pricePKR;
        case 'price-desc':
          return b.pricePKR - a.pricePKR;
        case 'mileage-asc':
          return a.mileageKm - b.mileageKm;
        case 'year-desc':
          return b.year - a.year;
        case 'newest':
        default:
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      }
    });

    return result;
  }

  async getVehicleById(id: string): Promise<Vehicle | null> {
    const all = this.loadData();
    const item = all.find((v) => v.id === id);
    return item || null;
  }

  async getFeaturedVehicles(): Promise<Vehicle[]> {
    const all = this.loadData();
    // Return available featured vehicles first, or first 3 available
    const featured = all.filter((v) => v.isFeatured && v.status === 'Available');
    if (featured.length > 0) return featured;
    return all.filter((v) => v.status === 'Available').slice(0, 3);
  }

  async getSimilarVehicles(vehicleId: string, limit: number = 3): Promise<Vehicle[]> {
    const all = this.loadData();
    const target = all.find((v) => v.id === vehicleId);
    if (!target) return [];

    // Filter real available vehicles excluding current vehicle
    const candidates = all.filter(
      (v) => v.id !== vehicleId && v.status === 'Available'
    );

    // Score by make match, then body type match
    const scored = candidates.map((v) => {
      let score = 0;
      if (v.make === target.make) score += 3;
      if (v.bodyType === target.bodyType) score += 2;
      return { vehicle: v, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map((s) => s.vehicle);
  }

  async getAvailableBrands(): Promise<{ name: string; count: number }[]> {
    const all = this.loadData();
    const map = new Map<string, number>();

    all.forEach((v) => {
      const current = map.get(v.make) || 0;
      map.set(v.make, current + 1);
    });

    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }

  async createVehicle(vehicleData: Omit<Vehicle, 'id' | 'dateAdded' | 'lastUpdated'>): Promise<Vehicle> {
    const all = this.loadData();
    const now = new Date().toISOString();
    const newId = `LM-${vehicleData.year}-${String(all.length + 1).padStart(2, '0')}-${Date.now().toString().slice(-4)}`;

    const newVehicle: Vehicle = {
      ...vehicleData,
      id: newId,
      dateAdded: now,
      lastUpdated: now,
    };

    all.unshift(newVehicle);
    this.saveData(all);
    return newVehicle;
  }

  async updateVehicle(id: string, updates: Partial<Vehicle>): Promise<Vehicle> {
    const all = this.loadData();
    const index = all.findIndex((v) => v.id === id);
    if (index === -1) {
      throw new Error(`Vehicle with ID ${id} not found.`);
    }

    const updatedVehicle: Vehicle = {
      ...all[index],
      ...updates,
      id: all[index].id, // protect immutable ID
      lastUpdated: new Date().toISOString(),
    };

    all[index] = updatedVehicle;
    this.saveData(all);
    return updatedVehicle;
  }

  async deleteVehicle(id: string): Promise<boolean> {
    const all = this.loadData();
    const filtered = all.filter((v) => v.id !== id);
    if (filtered.length === all.length) return false;
    this.saveData(filtered);
    return true;
  }

  async resetToDefaultSeed(): Promise<void> {
    this.saveData(SEED_VEHICLES);
  }
}

export const vehicleRepository = new MockVehicleRepository();
