export interface SolutionCard {
  id: number;
  title: string;
  description: string;
  category?: string;
  createdAt: string;
}

export interface LinkedInPost {
  id: string;
  header?: string;
  body?: string;
  content?: string;
  images?: string[];
  mentions?: string[];
  scheduledTime?: string;
  listingId?: number;
  listingTitle?: string;
  linkedInUrl?: string;
  createdAt: string;
  status: "published" | "scheduled" | "failed";
}

