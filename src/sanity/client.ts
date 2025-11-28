import { createClient } from "@sanity/client";
import imageUrlBuilder from '@sanity/image-url';

const fallbackProjectId = "sth2kycb";
const fallbackDataset = "production";

if (!import.meta.env.VITE_SANITY_PROJECT_ID || !import.meta.env.VITE_SANITY_DATASET) {
  console.warn(
    "Missing Sanity environment variables. Falling back to default Hollanda project credentials."
  );
}

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || fallbackProjectId,
  dataset: import.meta.env.VITE_SANITY_DATASET || fallbackDataset,
  apiVersion: "2024-01-01",
  useCdn: true,
});

// Image URL builder
const builder = imageUrlBuilder(client);
export const urlFor = (source: any) => builder.image(source);

// Sanity types
export interface SanityImage {
  _type?: 'image';
  asset?: {
    _ref: string;
    _type: 'reference';
  };
  [key: string]: unknown;
}

export interface SanitySlug {
  _type?: 'slug';
  current: string;
}

export interface SanityBlock {
  _type?: 'block';
  _key?: string;
  style?: string;
  children?: Array<{
    _type?: 'span';
    _key?: string;
    text?: string;
    marks?: string[];
  }>;
  [key: string]: unknown;
}

// Blog post type
export interface BlogPost {
  _id: string;
  title: string;
  slug: SanitySlug;
  description?: string; // Added description field
  body?: SanityBlock[]; // Added body field for rich content
  excerpt?: string;
  content: SanityBlock[];
  publishedAt: string;
  author?: {
    name: string;
    image?: SanityImage;
  };
  image?: SanityImage; // Changed from mainImage to image
  categories?: Array<{
    title: string;
    slug: SanitySlug;
  }>;
}

// Sanity queries
export const blogPostsQuery = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  description,
  body,
  excerpt,
  publishedAt,
  image,
  author->{
    name,
    image
  },
  categories[]->{
    title,
    slug
  }
}`;

export const blogPostQuery = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  excerpt,
  content,
  publishedAt,
  image,
  author->{
    name,
    image
  },
  categories[]->{
    title,
    slug
  }
}`;