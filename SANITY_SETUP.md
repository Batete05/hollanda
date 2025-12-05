# Sanity CMS Setup & Deployment Guide

This guide explains how to configure Sanity CMS for your Hollanda website and deploy it correctly on both Vercel and Mijndomein.

## Environment Variables

Your Sanity configuration requires the following environment variables:

### Required Variables

- `VITE_SANITY_PROJECT_ID`: Your Sanity project ID (found in `blog/sanity.config.ts` or Sanity Studio)
- `VITE_SANITY_DATASET`: Your dataset name (usually "production" or "development")

### Optional Variables

- `VITE_SANITY_API_TOKEN`: Only needed for private datasets or draft content access

## Finding Your Sanity Credentials

1. **Project ID**: Check `blog/sanity.config.ts` - it should show `projectId: 'sth2kycb'`
2. **Dataset**: Check `blog/sanity.config.ts` - it should show `dataset: 'production'`
3. **API Token**: Only needed if you want to access draft content. Generate in Sanity Studio → API → Tokens

## Configuration for Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:
   - `VITE_SANITY_PROJECT_ID` = `sth2kycb` (or your actual project ID)
   - `VITE_SANITY_DATASET` = `production` (or your actual dataset)
   - `VITE_SANITY_API_TOKEN` = (optional, only if needed)

4. **Important**: After adding variables, redeploy your site:
   - Go to **Deployments** tab
   - Click the three dots on the latest deployment
   - Select **Redeploy**

## Configuration for Mijndomein (Static Build Process)

**IMPORTANT**: You're building with `npm run build` and hosting the `dist` folder. Environment variables **MUST** be set **BEFORE** building, as Vite bakes them into the build.

### Step 1: Create .env File (Local Build)

1. In your project root, create a `.env` file:
   ```bash
   # .env file
   VITE_SANITY_PROJECT_ID=sth2kycb
   VITE_SANITY_DATASET=production
   # VITE_SANITY_API_TOKEN=your-token-here (optional)
   ```

2. **Verify environment variables are loaded**:
   ```bash
   # Check if env vars are set (Windows PowerShell)
   $env:VITE_SANITY_PROJECT_ID
   $env:VITE_SANITY_DATASET
   
   # Or create a test build to verify
   npm run build
   # Then check dist/assets/*.js files - search for "sth2kycb" to confirm it's baked in
   ```

### Step 2: Build Your Site

1. **Delete old dist folder** (if it exists):
   ```bash
   rm -rf dist  # Linux/Mac
   # or
   Remove-Item -Recurse -Force dist  # Windows PowerShell
   ```

2. **Build with environment variables**:
   ```bash
   npm run build
   ```

3. **Verify the build**:
   - Check that `dist` folder is created
   - Open `dist/index.html` in a text editor
   - Search for your project ID to confirm env vars were baked in

### Step 3: Upload to Mijndomein

1. Upload the entire contents of the `dist` folder to your Mijndomein hosting
2. Make sure `index.html` is in the root of your hosting directory

### Step 4: Clear Caches

- Clear browser cache when testing
- Clear Mijndomein CDN cache (if applicable)
- Test in incognito/private browsing mode

## Why This Matters

When you run `npm run build`, Vite:
- Reads environment variables from `.env` file or system environment
- **Bakes them into the JavaScript bundle** at build time
- Creates a static `dist` folder with these values hardcoded

**If you build without environment variables or with wrong values:**
- The build will use fallback values (or fail)
- The `dist` folder will have wrong/old values baked in
- **You must rebuild** to update the values - just uploading new files won't work

## Troubleshooting Stale Data on Mijndomein

If you're seeing old test posts on Mijndomein but not on Vercel:

### 1. Check Environment Variables Before Building
```bash
# Windows PowerShell - Check if env vars are set
$env:VITE_SANITY_PROJECT_ID
$env:VITE_SANITY_DATASET

# Or check .env file
cat .env  # Linux/Mac
Get-Content .env  # Windows PowerShell
```

**Critical**: Environment variables must be set BEFORE running `npm run build`

### 2. Delete Old Build and Rebuild
```bash
# Delete old dist folder
Remove-Item -Recurse -Force dist  # Windows PowerShell
# or
rm -rf dist  # Linux/Mac

# Verify .env file exists and has correct values
# Then rebuild
npm run build
```

**Never reuse an old `dist` folder** - always rebuild from scratch when:
- Environment variables change
- Posts are deleted/added in Sanity
- You want fresh data

### 3. Clear Caches
- Clear browser cache (Ctrl+Shift+Delete)
- Clear Mijndomein CDN cache (if applicable)
- Clear any server-side caches

### 4. Verify Sanity Connection
Check browser console for:
- ✅ `Fetched posts from Sanity: X` (where X > 0)
- ❌ Any error messages about Sanity connection

### 5. Check Network Tab
- Open browser DevTools → Network tab
- Look for requests to `api.sanity.io`
- Verify the request includes your project ID
- Check the response contains current posts (not old test posts)

## Code Changes Made

### 1. Sanity Client (`src/sanity/client.ts`)
- **Disabled CDN** (`useCdn: false`) to prevent stale cached data
- Added fallback to project ID `sth2kycb` if env vars are missing
- Added better error logging

### 2. React Query Configuration (`src/App.tsx`)
- Configured to always fetch fresh data
- Disabled caching (`cacheTime: 0`, `staleTime: 0`)
- Enabled refetch on mount, window focus, and reconnect

### 3. Blog Section (`src/components/BlogSection.tsx`)
- Improved fallback logic - only shows fallback on error, not when no posts exist
- Better error handling and logging
- Always fetches fresh data from Sanity

### 4. Sanity Schema (`blog/schemaTypes/postType.ts`)
- **Description field** is now rich text (Portable Text) with image support
- Supports headings, lists, links, bold, italic, and inline/block images
- **Body field** also supports rich text with images

## Schema Changes - Rich Text Description

The `description` field in your Sanity schema has been upgraded to support:

- **Text formatting**: Bold, italic, code
- **Headings**: H1, H2, H3, H4
- **Lists**: Bullet and numbered lists
- **Links**: Internal and external links
- **Images**: Inline and block images with alt text and captions
- **Quotes**: Blockquote styling

### Using Rich Text in Sanity Studio

1. Open Sanity Studio (`npm run dev` in the `blog` folder)
2. Edit a blog post
3. In the **Description** field, you can now:
   - Format text (bold, italic)
   - Add headings
   - Insert images directly
   - Add links
   - Create lists

### Rendering Rich Text in Your App

The app uses `@portabletext/react` to render rich text. Images are automatically handled with proper sizing and captions.

## Deployment Checklist

Before deploying to Mijndomein:

- [ ] Environment variables are set in Mijndomein control panel
- [ ] Old build artifacts are deleted/cleared
- [ ] Fresh build is created with new environment variables
- [ ] CDN cache is cleared (if applicable)
- [ ] Browser cache is cleared when testing
- [ ] Network tab shows correct Sanity API calls
- [ ] Console shows correct number of posts fetched
- [ ] No old test posts appear in the blog section

## Testing

After deployment, verify:

1. **Blog section shows current posts** (not old test posts)
2. **Deleted posts don't appear**
3. **New posts appear immediately** after publishing in Sanity
4. **Rich text description renders correctly** with formatting and images
5. **No console errors** related to Sanity

## Support

If issues persist:

1. Check Sanity Studio to confirm posts are actually deleted
2. Verify environment variables match between Vercel and Mijndomein
3. Check Mijndomein documentation for their specific caching/CDN setup
4. Contact Mijndomein support if their CDN is serving stale content

