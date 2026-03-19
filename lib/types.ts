export type BusinessCategory =
  | "Restaurants"
  | "Cafes"
  | "Salons & Spas"
  | "Grocery Stores"
  | "Repair Services"
  | "Gyms & Fitness"
  | "Clinics & Pharmacies"
  | "Local Shops";

export type BusinessLocation =
  | "Old Delhi"
  | "Connaught Place"
  | "Rajouri Garden"
  | "Dwarka"
  | "Lajpat Nagar"
  | "Saket"
  | "Karol Bagh"
  | "Janakpuri";

export type RatingBreakdown = {
  quality: number; // 0..5
  service: number; // 0..5
  value: number; // 0..5
};

export type Review = {
  id: string;
  businessId: string;
  authorName: string;
  createdAtISO: string;
  ratings: RatingBreakdown;
  overall: number; // 0..5
  title: string;
  body: string;
  photoUrl?: string;
  status?: "pending" | "approved" | "rejected";
};

export type Business = {
  id: string;
  name: string;
  category: BusinessCategory;
  location: BusinessLocation;
  shortDescription: string;
  addressLine: string;
  averageRating: number; // 0..5
  ratingCount: number;
  averageBreakdown: RatingBreakdown; // 0..5
};

