export type TransmissionType = 'Automatic' | 'Manual' | 'CVT' | 'e-CVT' | 'AGS';
export type FuelType = 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric' | 'Plug-in Hybrid';
export type BodyType = 'SUV' | 'Sedan' | 'Hatchback' | 'Crossover' | 'Pickup' | 'Coupe' | 'Van';
export type VehicleCondition = 'Brand New' | 'Excellent' | 'Certified Pre-Owned' | 'Good';
export type AvailabilityStatus = 'Available' | 'Reserved' | 'Sold';

export interface VehicleImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  order: number;
  viewLabel: 'Front Three-Quarter' | 'Rear Three-Quarter' | 'Side Profile' | 'Interior & Cockpit' | 'Dashboard & Screen' | 'Rear Seats' | 'Engine Bay' | 'Other';
  isVerified: boolean;
  altText: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  variant: string;
  year: number;
  pricePKR: number;
  mileageKm: number;
  transmission: TransmissionType;
  fuelType: FuelType;
  engineCapacityCc: number;
  exteriorColor: string;
  interiorColor?: string;
  bodyType: BodyType;
  registrationCity: string;
  importStatus: 'Local Assembled' | 'Japanese Import' | 'UK Import' | 'Brand New Import';
  condition: VehicleCondition;
  features: string[];
  description: string;
  images: VehicleImage[];
  status: AvailabilityStatus;
  isFeatured: boolean;
  dateAdded: string;
  lastUpdated: string;
  adminNotes?: string; // Private, never exposed to public visitors
}

export interface BusinessSettings {
  showroomName: string;
  ownerName: string;
  city: string;
  province: string;
  country: string;
  phone: string;
  whatsappNumber: string; // International format e.g. +923001234567
  email: string;
  address: string;
  googleMapsUrl: string;
  businessHours: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
}

export interface AdminUser {
  username: string; // 'shahidlegahrii'
  displayName: string; // 'Shahid Leghari'
  role: 'owner' | 'manager';
  isDemoAuth: boolean;
}

export interface InventoryFilterState {
  searchQuery: string;
  brand: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  transmission?: string;
  fuelType?: string;
  bodyType?: string;
  status?: string;
}

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'mileage-asc' | 'year-desc';
