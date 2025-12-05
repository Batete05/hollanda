# Supabase Blog Database Setup

Before using the blog features, you need to create the database table in Supabase.

## Step 1: Create the Blog Posts Table

1. Go to your Supabase project dashboard
2. Click on **"SQL Editor"** in the left sidebar
3. Click **"New query"**
4. Copy and paste this SQL:

```sql
-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  body TEXT NOT NULL,
  excerpt TEXT,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  author_name TEXT,
  author_email TEXT,
  image_url TEXT,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);

-- Create index on published_at for sorting
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published posts
CREATE POLICY "Anyone can read blog posts"
  ON blog_posts
  FOR SELECT
  USING (true);

-- Policy: Only authenticated users can insert
CREATE POLICY "Authenticated users can create blog posts"
  ON blog_posts
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Only authenticated users can update
CREATE POLICY "Authenticated users can update blog posts"
  ON blog_posts
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Policy: Only authenticated users can delete
CREATE POLICY "Authenticated users can delete blog posts"
  ON blog_posts
  FOR DELETE
  USING (auth.role() = 'authenticated');
```

5. Click **"Run"** or press `Ctrl+Enter` (or `Cmd+Enter` on Mac)

## Step 2: Verify the Table

1. Go to **"Table Editor"** in the left sidebar
2. You should see `blog_posts` table
3. Click on it to see the structure

## Step 3: Test Insert (Optional)

You can test by inserting a sample post:

```sql
INSERT INTO blog_posts (title, slug, description, body, excerpt, author_name)
VALUES (
  'Welcome to Our Blog',
  'welcome-to-our-blog',
  'This is our first blog post!',
  'This is the full content of our first blog post. We are excited to share our journey with you.',
  'This is our first blog post!',
  'Admin'
);
```

## That's it! 🎉

Your blog is now ready to use. You can:
- Create posts from the dashboard
- View posts on the blog page
- Edit and delete posts from the dashboard

---

## Troubleshooting

### "relation 'blog_posts' does not exist"
- Make sure you ran the SQL query in Step 1
- Check that you're in the correct database

### "permission denied for table blog_posts"
- Check that RLS policies are set up correctly
- Verify you're logged in when trying to create/edit posts

### Can't see the table
- Refresh the Table Editor
- Make sure you ran the CREATE TABLE query successfully

