# Content Management System Guide

## Overview

Your website now has a dynamic content management system that allows you to add and manage:
- **News Articles** - Latest updates and announcements
- **Blog Posts** - Tips, guides, and informative content
- **Gallery Images** - Photos of events, facilities, and staff

All content is managed through the Django Admin panel and automatically appears on the homepage.

## Features

✅ **Bilingual Support** - Add content in both English and Arabic
✅ **Featured Content** - Mark items to show on homepage
✅ **Categories** - Organize blog posts and gallery images
✅ **Image Upload** - Add images to news, blog posts, and gallery
✅ **Publish Control** - Show/hide content without deleting
✅ **Automatic Display** - Content appears on homepage automatically
✅ **Responsive Design** - Looks great on mobile, tablet, and desktop

## How to Add Content

### Step 1: Access Django Admin

1. Go to: `https://southsudan-e-services.onrender.com/admin/`
2. Login with your admin credentials:
   - Username: `admin`
   - Password: `admin123` (change this immediately!)

### Step 2: Add News Article

1. Click **"News Articles"** in the sidebar
2. Click **"Add News Article"** button (top right)
3. Fill in the form:

   **English Content:**
   - **Title**: Main headline (e.g., "New Passport Application Process Launched")
   - **Excerpt**: Short summary (max 300 characters) - shows on homepage
   - **Content**: Full article text
   - **Image**: Upload a photo (optional but recommended)

   **Arabic Translation** (optional but recommended):
   - **Title (Arabic)**: عنوان المقال
   - **Excerpt (Arabic)**: ملخص قصير
   - **Content (Arabic)**: النص الكامل

   **Settings:**
   - **Author**: Automatically set to you
   - **Published**: ✅ Check to make it visible
   - **Featured**: ✅ Check to show on homepage

4. Click **"Save"**

### Step 3: Add Blog Post

1. Click **"Blog Posts"** in the sidebar
2. Click **"Add Blog Post"** button
3. Fill in the form:

   **English Content:**
   - **Title**: Blog post title (e.g., "5 Tips for Faster Passport Processing")
   - **Excerpt**: Short summary (max 300 characters)
   - **Content**: Full blog post text
   - **Image**: Upload a photo (optional)
   - **Category**: e.g., "Tips", "Updates", "Guides", "FAQ"

   **Arabic Translation** (optional):
   - Same as news articles

   **Settings:**
   - **Published**: ✅ Check to make it visible
   - **Featured**: ✅ Check to show on homepage

4. Click **"Save"**

### Step 4: Add Gallery Image

1. Click **"Gallery Images"** in the sidebar
2. Click **"Add Gallery Image"** button
3. Fill in the form:

   **English Content:**
   - **Title**: Image title (e.g., "New Immigration Office Building")
   - **Description**: Brief description (optional)
   - **Image**: Upload the photo (required)
   - **Category**: e.g., "Events", "Facilities", "Staff", "Ceremonies"

   **Arabic Translation** (optional):
   - **Title (Arabic)**: عنوان الصورة
   - **Description (Arabic)**: وصف الصورة

   **Settings:**
   - **Published**: ✅ Check to make it visible
   - **Featured**: ✅ Check to show on homepage

4. Click **"Save"**

## Homepage Display

The content section appears on the homepage **between Services and "Why Use Our Portal?"**

### What Shows on Homepage:
- **Latest 3 News Articles** (marked as featured)
- **Latest 3 Blog Posts** (marked as featured)
- **Latest 6 Gallery Images** (marked as featured)

### Tabs:
Users can switch between News, Blog, and Gallery using tabs at the top of the section.

### Language Support:
- If user selects Arabic (العربية), Arabic translations are shown
- If no Arabic translation exists, English content is displayed

## Best Practices

### Images
- **Recommended Size**: 1200x800 pixels
- **Format**: JPG or PNG
- **File Size**: Keep under 2MB for faster loading
- **Content**: Use high-quality, relevant images

### Writing Content
- **Title**: Keep it short and descriptive (max 100 characters)
- **Excerpt**: Write a compelling summary (max 300 characters)
- **Content**: Use clear, simple language
- **Arabic**: Provide translations for better user experience

### Categories
Use consistent category names:
- **Blog**: Tips, Updates, Guides, FAQ, Announcements
- **Gallery**: Events, Facilities, Staff, Ceremonies, Training

### Featured Content
- Only mark your **best and most recent** content as featured
- Update featured content regularly (weekly or monthly)
- Remove "featured" from old content to keep homepage fresh

## Managing Content

### Edit Content
1. Go to Django Admin
2. Click on News/Blog/Gallery
3. Click on the item you want to edit
4. Make changes
5. Click "Save"

### Hide Content (Without Deleting)
1. Edit the item
2. Uncheck **"Published"**
3. Click "Save"
- Content is hidden but not deleted
- You can re-publish it later

### Delete Content
1. Edit the item
2. Click **"Delete"** button (bottom left)
3. Confirm deletion
- ⚠️ This permanently deletes the content

### Reorder Content
Content is automatically ordered by date (newest first). To change order:
- Edit the item
- The system uses creation date for ordering
- Newer items appear first

## Troubleshooting

### Content Not Showing on Homepage
✅ Check these:
- [ ] Is "Published" checked?
- [ ] Is "Featured" checked?
- [ ] Did you save the changes?
- [ ] Refresh the homepage (Ctrl+F5)

### Images Not Loading
✅ Solutions:
- Use cloud storage (Cloudinary/AWS S3) - see `MEDIA_FILES_STORAGE_ISSUE.md`
- Images on Render free tier are temporary
- Implement permanent storage solution

### Arabic Text Not Showing
✅ Check:
- [ ] Did you fill in the Arabic fields (title_ar, content_ar)?
- [ ] Is the language switcher set to Arabic?
- [ ] If Arabic fields are empty, English content is shown

### Section Not Appearing
If the entire section is hidden:
- At least one item must be published and featured
- If no content exists, the section is automatically hidden

## API Endpoints

For developers, the content is available via REST API:

```
GET /api/news/              - All published news
GET /api/news/?featured=true - Featured news only
GET /api/blog/              - All published blog posts
GET /api/blog/?featured=true - Featured blog posts
GET /api/blog/?category=Tips - Filter by category
GET /api/gallery/           - All published gallery images
GET /api/gallery/?featured=true - Featured images
```

## Security Notes

⚠️ **Important:**
- Only admin users can add/edit content
- Regular users (applicants) can only view published content
- Change default admin password immediately
- Use strong passwords for all admin accounts

## Next Steps

1. **Add Your First Content**:
   - Create 2-3 news articles
   - Write 2-3 blog posts
   - Upload 6-10 gallery images

2. **Set Up Cloud Storage** (Recommended):
   - See `MEDIA_FILES_STORAGE_ISSUE.md`
   - Implement Cloudinary or AWS S3
   - Ensures images persist after deployment

3. **Regular Updates**:
   - Add new content weekly or monthly
   - Keep homepage fresh and engaging
   - Update featured content regularly

4. **Monitor Performance**:
   - Check homepage loading speed
   - Optimize images if needed
   - Remove old, irrelevant content

## Support

Need help? Check these files:
- `MEDIA_FILES_STORAGE_ISSUE.md` - Image storage solutions
- `SETUP_ADMIN_QUICK_GUIDE.md` - Admin user setup
- `API_DOCUMENTATION.md` - API reference

---

**Congratulations!** 🎉 Your website now has a professional content management system. Start adding content to engage your users!
