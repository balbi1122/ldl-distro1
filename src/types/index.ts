export type MembershipTier = "free" | "monthly" | "annual" | "lifetime";
export type ContentType = "poem" | "story" | "video";
export type CategoryType = "album" | "tour" | "special";
export type PostStatus = "pending" | "approved" | "rejected";

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  membership_tier: MembershipTier;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_end_date: string | null;
  is_admin: boolean;
  post_count: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  type: CategoryType;
  color: string;
  year_info: string | null;
  post_count: number;
  created_at: string;
}

export interface Post {
  id: string;
  author_id: string;
  category_id: string;
  title: string;
  content_type: ContentType;
  content: string | null;
  video_url: string | null;
  excerpt: string | null;
  is_approved: boolean;
  is_featured: boolean;
  view_count: number;
  like_count: number;
  created_at: string;
  updated_at: string;
  // Joined
  author?: Profile;
  category?: Category;
  user_has_liked?: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year" | "lifetime";
  features: string[];
  stripePriceId: string;
  popular?: boolean;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Swiftie",
    price: 0,
    interval: "month",
    features: [
      "Browse all fan content",
      "Post 1 piece of content",
      "Like and comment on posts",
      "Follow your favourite creators",
    ],
    stripePriceId: "",
  },
  {
    id: "monthly",
    name: "Gold Star",
    price: 6,
    interval: "month",
    features: [
      "Everything in Swiftie",
      "Unlimited content posts",
      "Early access to featured content",
      "Gold Star badge on profile",
      "Priority moderation",
    ],
    stripePriceId: import.meta.env.VITE_STRIPE_MONTHLY_PRICE_ID || "",
    popular: true,
  },
  {
    id: "annual",
    name: "All Too Well",
    price: 49,
    interval: "year",
    features: [
      "Everything in Gold Star",
      "Save vs monthly (32% off)",
      "Exclusive All Too Well badge",
      "Access to secret content drops",
      "Annual subscriber newsletter",
    ],
    stripePriceId: import.meta.env.VITE_STRIPE_ANNUAL_PRICE_ID || "",
  },
  {
    id: "lifetime",
    name: "Long Live",
    price: 149,
    interval: "lifetime",
    features: [
      "Everything, forever",
      "One-time payment, lifetime access",
      "Exclusive Long Live badge",
      "Founding member recognition",
      "Access to all future features",
    ],
    stripePriceId: import.meta.env.VITE_STRIPE_LIFETIME_PRICE_ID || "",
  },
];
