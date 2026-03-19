import type { Business, Review } from "./types";
import { businesses as seedBusinesses, reviews as seedReviews } from "./mockData";

export type AdminReviewStatus = "pending" | "approved" | "rejected";

export type AdminReview = Review & {
  status: AdminReviewStatus;
};

export const adminBusinessesSeed: Business[] = seedBusinesses;

export const adminReviewsSeed: AdminReview[] = [
  // pending
  { ...seedReviews[0], status: "pending" },
  { ...seedReviews[4], status: "pending" },
  { ...seedReviews[6], status: "pending" },
  // approved
  { ...seedReviews[1], status: "approved" },
  { ...seedReviews[2], status: "approved" },
  { ...seedReviews[3], status: "approved" },
  // rejected (kept for stats)
  { ...seedReviews[5], status: "rejected" },
];

