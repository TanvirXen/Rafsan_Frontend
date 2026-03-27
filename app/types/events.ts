export type EventDoc = {
  _id: string;
  slug: string;                // "what-a-show", "work-show", etc.
  title: string;               // "What A Show"
  type: string;                // "free" | "paid" | ...
  bannerImage?: string;        // preferred banner
  cardImage?: string;          // preferred card
  date?: string[];             // ["2025-11-15T18:00:00Z", "2025-12-15T18:00:00Z"]
  venue?: string;              // "Dhaka National Stadium"
  city?: string;               // "Dhaka"
  country?: string;            // "Bangladesh"
  shortBlurb?: string;         // short text for cards
  longBlurb?: string;          // paragraph for banner/inside page
};
