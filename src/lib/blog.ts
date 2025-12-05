import { supabase } from "./supabase";

// Blog post types for Supabase
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string; // Plain text or HTML
  body: string; // Plain text or HTML
  excerpt?: string;
  published_at: string;
  author_name?: string;
  author_email?: string;
  image_url?: string;
  category?: string;
  created_at: string;
  updated_at: string;
}

// Create a new blog post
export async function createBlogPost(post: {
  title: string;
  slug: string;
  description: string;
  body: string;
  excerpt?: string;
  author_name?: string;
  author_email?: string;
  image_url?: string;
  category?: string;
}) {
  const { data, error } = await supabase
    .from("blog_posts")
    .insert([
      {
        ...post,
        published_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating blog post:", error);
    throw error;
  }

  return data;
}

// Get all blog posts
export async function getBlogPosts() {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching blog posts:", error);
    throw error;
  }

  return data as BlogPost[];
}

// Get a single blog post by slug
export async function getBlogPostBySlug(slug: string) {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching blog post:", error);
    throw error;
  }

  return data as BlogPost;
}

// Get a single blog post by ID
export async function getBlogPostById(id: string) {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching blog post:", error);
    throw error;
  }

  return data as BlogPost;
}

// Update a blog post
export async function updateBlogPost(
  id: string,
  updates: Partial<Omit<BlogPost, "id" | "created_at">>
) {
  const { data, error } = await supabase
    .from("blog_posts")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating blog post:", error);
    throw error;
  }

  return data;
}

// Delete a blog post
export async function deleteBlogPost(id: string) {
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);

  if (error) {
    console.error("Error deleting blog post:", error);
    throw error;
  }

  return true;
}

// Helper function to generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

