// Domain types for MotoMarket Pro
// These mirror the Supabase enums so we keep frontend ↔ DB strict.

export type ListingTier = "basic" | "vip" | "super_vip";
export type ListingType = "sale" | "rent" | "service";
export type Currency = "USD" | "GEL" | "EUR";

export type MotoCategory =
  | "sport"
  | "cruiser"
  | "adventure"
  | "naked"
  | "touring"
  | "dirt"
  | "scooter";

export type Transmission = "manual" | "automatic" | "dct";
export type FuelType = "petrol" | "electric" | "hybrid";
export type LicenseCategory = "AM" | "A1" | "A2" | "A";
export type ServiceCategory =
  | "repair"
  | "electrical"
  | "detailing"
  | "tires"
  | "painting"
  | "tuning";

export interface RentalTerms {
  deposit?: number;
  minAge?: number;
  minDays?: number;
  includesInsurance?: boolean;
  includesHelmet?: boolean;
  requirements?: string[];
}

export interface InspectionReport {
  engine?: number;
  chassis?: number;
  electronics?: number;
  tires?: number;
  lastServiceDate?: string;
}

export interface WorkingHours {
  weekdays?: string;
  weekends?: string;
}

export interface Listing {
  id: string;
  owner_id: string;
  listing_type: ListingType;
  tier: ListingTier;
  make: string;
  model: string;
  year: number;
  price: number;
  rental_price_daily: number | null;
  rental_price_weekly: number | null;
  currency: Currency;
  mileage: number;
  engine_size: number | null;
  category: MotoCategory;
  transmission: Transmission;
  fuel_type: FuelType;
  license_category: LicenseCategory;
  location: string;
  condition: string | null;
  description: string | null;
  images: string[];
  vin: string | null;
  can_register: boolean;
  rental_terms: RentalTerms | null;
  inspection: InspectionReport | null;
  views: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServiceListing {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  category: ServiceCategory;
  location: string;
  price_estimate: number | null;
  offered_services: string[];
  provider_name: string;
  provider_phone: string | null;
  images: string[];
  working_hours: WorkingHours | null;
  tier: ListingTier;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  author_id: string | null;
  title: string;
  slug: string;
  category: string | null;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  read_time: string | null;
  published: boolean;
  published_at: string;
  created_at: string;
}

export interface Profile {
  id: string;
  display_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  bio: string | null;
  city: string | null;
  rating: number | null;
  verified: boolean | null;
  balance: number | null;
  created_at: string;
  updated_at: string;
}

export interface SearchFilters {
  make: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  minYear: string;
  maxYear: string;
  transmission: string;
}
