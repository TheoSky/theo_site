// Blog related types

export type BlogStatus = 'published' | 'draft';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  summary: string;
  slug: string;
  publishDate: string; // ISO date string
  status: BlogStatus;
  coverImage?: string; // URL to the cover image
  updatedAt?: string; // ISO date string
  authorId?: string; // Reference to the author (if implementing multi-author)
  tags?: string[]; // Optional tags for categorization
}

export interface BlogPostFormData {
  title: string;
  content: string;
  summary: string;
  slug: string;
  status: BlogStatus;
  coverImage?: File | null; // Optional - Storage functionality disabled
  tags?: string[];
}