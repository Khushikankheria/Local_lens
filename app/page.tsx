import { HomePage } from "./ui/HomePage";
import { createSupabaseServer } from "../lib/supabase/server";
import type { BusinessCategory, BusinessLocation } from "../lib/types";

const SEED_BUSINESSES = [
  {
    name: "Karim's Jama Masjid",
    category: "Restaurants" as BusinessCategory,
    location: "Old Delhi" as BusinessLocation,
    short_description: "Famous Delhi delicacies and traditional cuisine",
    address_line: "Jama Masjid, Old Delhi",
  },
  {
    name: "Indian Coffee House",
    category: "Cafes" as BusinessCategory,
    location: "Connaught Place" as BusinessLocation,
    short_description: "Historic coffee house with Indian charm",
    address_line: "Connaught Place, New Delhi",
  },
  {
    name: "Looks Salon",
    category: "Salons & Spas" as BusinessCategory,
    location: "Rajouri Garden" as BusinessLocation,
    short_description: "Premium salon and spa services",
    address_line: "Rajouri Garden, West Delhi",
  },
  {
    name: "Reliance Smart",
    category: "Grocery Stores" as BusinessCategory,
    location: "Dwarka" as BusinessLocation,
    short_description: "Quality grocery and household items",
    address_line: "Dwarka, South West Delhi",
  },
  {
    name: "QuickFix Electronics",
    category: "Repair Services" as BusinessCategory,
    location: "Lajpat Nagar" as BusinessLocation,
    short_description: "Fast and reliable electronics repair",
    address_line: "Lajpat Nagar, South Delhi",
  },
  {
    name: "Cult Fit Gym",
    category: "Gyms & Fitness" as BusinessCategory,
    location: "Saket" as BusinessLocation,
    short_description: "Modern fitness center with expert trainers",
    address_line: "Saket, South Delhi",
  },
  {
    name: "Apollo Clinic",
    category: "Clinics & Pharmacies" as BusinessCategory,
    location: "Karol Bagh" as BusinessLocation,
    short_description: "Trusted healthcare and medical services",
    address_line: "Karol Bagh, Delhi",
  },
  {
    name: "Gupta General Store",
    category: "Local Shops" as BusinessCategory,
    location: "Janakpuri" as BusinessLocation,
    short_description: "Your neighborhood shopping destination",
    address_line: "Janakpuri, West Delhi",
  },
];

export default async function Home() {
  const supabase = await createSupabaseServer();

  // Check if businesses table is empty
  const { data: existingData, error: fetchError } = await supabase
    .from("businesses")
    .select("id")
    .limit(1);

  // If no businesses exist, seed the data
  if (!fetchError && (!existingData || existingData.length === 0)) {
    const { error: insertError, data: insertedData } = await supabase
      .from("businesses")
      .insert(
        SEED_BUSINESSES.map((b) => ({
          name: b.name,
          category: b.category,
          location: b.location,
          short_description: b.short_description,
          address_line: b.address_line,
        }))
      );

    if (insertError) {
      console.error("Failed to seed businesses:", insertError.message, insertError.code);
    } else {
      console.log("Successfully seeded businesses");
    }
  }

  // Fetch all businesses from the database
  const { data, error } = await supabase
    .from("businesses_public")
    .select(
      "id,name,category,location,short_description,address_line,average_rating,rating_count,avg_quality,avg_service,avg_value"
    )
    .order("name", { ascending: true });

  if (error) {
    console.error("Failed to fetch businesses:", error.message);
  }

  const businesses =
    error || !data
      ? []
      : data.map((b) => ({
          id: b.id as string,
          name: b.name as string,
          category: b.category as BusinessCategory,
          location: b.location as BusinessLocation,
          shortDescription: b.short_description as string,
          addressLine: b.address_line as string,
          averageRating: Number(b.average_rating ?? 0),
          ratingCount: Number(b.rating_count ?? 0),
          averageBreakdown: {
            quality: Number(b.avg_quality ?? 0),
            service: Number(b.avg_service ?? 0),
            value: Number(b.avg_value ?? 0),
          },
        }));

  return <HomePage businesses={businesses} />;
}
