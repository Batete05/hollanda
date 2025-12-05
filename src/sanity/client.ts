import { createClient } from "@sanity/client";
import imageUrlBuilder from '@sanity/image-url';

const fallbackProjectId = "sth2kycb";
const fallbackDataset = "production";

// Get environment variables with validation
const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || fallbackProjectId;
const dataset = import.meta.env.VITE_SANITY_DATASET || fallbackDataset;
const token = import.meta.env.VITE_SANITY_API_TOKEN; // Optional, only needed for private datasets

// Log which credentials are being used (helpful for debugging builds)
if (import.meta.env.VITE_SANITY_PROJECT_ID && import.meta.env.VITE_SANITY_DATASET) {
  console.log(
    `✅ Sanity configured: Project ${projectId}, Dataset ${dataset}`
  );
} else {
  console.warn(
    "⚠️ Missing Sanity environment variables. Falling back to default Hollanda project credentials."
  );
  console.warn(
    `Using: Project ${projectId}, Dataset ${dataset}`
  );
  console.warn(
    "💡 To use custom values, create a .env file with VITE_SANITY_PROJECT_ID and VITE_SANITY_DATASET before running 'npm run build'"
  );
}

// Create client with CDN disabled for fresh data (or use token for authenticated requests)
// For production, you can enable CDN but add cache-busting query parameters
export const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  // Disable CDN to ensure fresh data on every request
  // If you need CDN performance, use useCdn: true and add timestamp to queries
  useCdn: false, // Changed to false to prevent stale data on Mijndomein
  token, // Optional: only needed for private datasets or draft content
  // Add request tag for cache invalidation if using Vercel
  perspective: 'published', // Only fetch published content
  ignoreBrowserTokenWarning: true,
});

// Helper function to create a client with CDN (for performance when needed)
export const createCdnClient = () => {
  return createClient({
    projectId,
    dataset,
    apiVersion: "2024-01-01",
    useCdn: true,
    perspective: 'published',
  });
};

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
  description?: SanityBlock[]; // Changed to array of blocks (rich text with images)
  body?: SanityBlock[]; // Added body field for rich content
  excerpt?: string;
  content?: SanityBlock[]; // Made optional since we use body
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

// Sanity queries with cache-busting timestamp
// Add timestamp parameter to prevent stale data from CDN
const getCacheBuster = () => {
  // Use current hour as cache buster (changes every hour)
  // For more aggressive cache busting, use: Date.now()
  return Math.floor(Date.now() / (1000 * 60 * 60)); // Changes every hour
};

// Base query without cache buster (for use with useCdn: false)
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

// Query with cache buster (for use with CDN)
export const blogPostsQueryWithCacheBuster = `*[_type == "post" && _updatedAt > "${new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()}"] | order(publishedAt desc) {
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
  description,
  body,
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