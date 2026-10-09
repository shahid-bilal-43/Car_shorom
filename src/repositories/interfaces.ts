import { Vehicle, BusinessSettings, AdminUser, InventoryFilterState, SortOption } from '../types';

export interface VehicleRepository {
  getAllVehicles(): Promise<Vehicle[]>;
  getFilteredVehicles(filters: InventoryFilterState, sort: SortOption): Promise<Vehicle[]>;
  getVehicleById(id: string): Promise<Vehicle | null>;
  getFeaturedVehicles(): Promise<Vehicle[]>;
  getSimilarVehicles(vehicleId: string, limit?: number): Promise<Vehicle[]>;
  getAvailableBrands(): Promise<{ name: string; count: number }[]>;
  createVehicle(vehicle: Omit<Vehicle, 'id' | 'dateAdded' | 'lastUpdated'>): Promise<Vehicle>;
  updateVehicle(id: string, updates: Partial<Vehicle>): Promise<Vehicle>;
  deleteVehicle(id: string): Promise<boolean>;
  resetToDefaultSeed(): Promise<void>;
}

export interface BusinessSettingsRepository {
  getSettings(): Promise<BusinessSettings>;
  updateSettings(settings: Partial<BusinessSettings>): Promise<BusinessSettings>;
}

export interface AuthenticationService {
  getCurrentUser(): Promise<AdminUser | null>;
  login(username: string): Promise<{ success: boolean; user?: AdminUser; error?: string }>;
  logout(): Promise<void>;
  isAuthenticated(): Promise<boolean>;
}

export interface MediaStorageService {
  uploadImage(file: File): Promise<string>;
  validateImageUrl(url: string): Promise<boolean>;
}
