export interface BlogPost {
  id: string;
  title: string;
  topic: string;
  content: string;
  platform: "hubspot" | "medium";
  status: "published" | "scheduled" | "draft" | "failed";
  images?: string[];
  tags?: string[];
  publishTime?: string;
  publishedAt?: string;
  url?: string;
  createdAt: string;
}

