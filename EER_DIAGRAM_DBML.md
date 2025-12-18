# South Sudan Immigration Portal - EER Diagram (DBML)

## Option 3: DBML (Database Markup Language) - Best for Database Design

### How to Use:
1. **dbdiagram.io** (Recommended): https://dbdiagram.io/
2. **Quick Database Diagrams**: https://www.quickdatabasediagrams.com/

### Copy the code below:

```dbml
// South Sudan Immigration Portal Database Schema
// Use at: https://dbdiagram.io/

Project SouthSudanImmigration {
  database_type: 'PostgreSQL'
  Note: 'South Sudan Immigration E-Services Portal Database'
}

// ============================================
// AUTHENTICATION & USER MANAGEMENT
// ============================================

Table users {
  id integer [pk, increment]
  username varchar(150) [unique, not null]
  email varchar(254) [unique, not null]
  password varchar(128) [not null]
  first_name varchar(150)
  last_name varchar(150)
  is_staff boolean [default: false]
  is_active boolean [default: true]
  date_joined timestamp [default: `now()`]
  
  Note: 'Django built-in User model'
}

Table user_profiles {
  id integer [pk, increment]
  user_id integer [ref: - users.id, not null]
  phone_number varchar(20) [not null]
  role varchar(20) [not null, note: 'applicant|officer|supervisor|admin']
  is_active boolean [default: true]
  created_at timestamp [default: `now()`]
  
  indexes {
    user_id
  }
  
  Note: 'Extended user profile with role-based access'
}

// ============================================
// IMMIGRATION APPLICATIONS
// ============================================

Table applications {
  id integer [pk, increment]
  user_id integer [ref: > users.id, not null]
  reviewed_by_id integer [ref: > users.id]
  payment_verified_by_id integer [ref: > users.id]
  
  // Basic Information
  application_type varchar(30) [not null, note: 'passport-first|passport-replacement|nationalid-first|nationalid-replacement']
  status varchar(20) [default: 'pending', note: 'pending|in-progress|approved|rejected|collected']
  confirmation_number varchar(50) [unique, not null, note: 'Format: SS-IMM-XXXXXXX-XXX']
  
  // Personal Details
  applicant_type varchar(10) [note: 'above18|below18']
  national_id_number varchar(50)
  first_name varchar(100) [not null]
  last_name varchar(100) [not null]
  middle_name varchar(100)
  date_of_birth date [not null]
  gender varchar(10) [not null, note: 'male|female']
  nationality varchar(100) [not null]
  father_name varchar(200) [not null]
  mother_name varchar(200) [not null]
  marital_status varchar(20) [not null, note: 'single|married|divorced|widowed']
  profession varchar(100)
  employer varchar(200)
  height integer
  other_nationality varchar(100)
  other_passport_number varchar(50)
  
  // Contact Details
  phone_number varchar(20) [not null]
  email varchar(254) [not null]
  country varchar(100) [not null]
  state varchar(100) [not null]
  city varchar(100) [not null]
  place_of_residence varchar(200) [not null]
  
  // Birth Location
  birth_country varchar(100)
  birth_state varchar(100)
  birth_city varchar(100)
  
  // Passport Specific
  passport_type varchar(10) [note: '2-year|5-year|10-year']
  travel_purpose varchar(200)
  destination_country varchar(100)
  destination_city varchar(100)
  
  // Replacement Specific
  replacement_reason varchar(20) [note: 'lost|stolen|damaged|expired|correction']
  
  // Document Attachments (file paths)
  photo varchar(100)
  id_copy varchar(100)
  signature varchar(100)
  birth_certificate varchar(100)
  old_document varchar(100)
  police_report varchar(100)
  civil_registry_number varchar(100)
  
  // Payment Information
  payment_status varchar(20) [default: 'pending', note: 'pending|completed|failed']
  payment_method varchar(20) [note: 'momo|credit_card|bank']
  payment_amount decimal(10,2)
  payment_reference varchar(100)
  payment_proof varchar(100)
  payment_proof_hash varchar(64) [note: 'SHA-256 hash for duplicate detection']
  payment_date timestamp
  payment_verified_at timestamp
  payment_rejection_reason text
  
  // Admin Actions
  reviewed_at timestamp
  rejection_reason text
  approved_pdf varchar(100)
  
  // Timestamps
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
  
  indexes {
    confirmation_number
    status
    application_type
    user_id
    payment_proof_hash
    (created_at, status) [name: 'idx_created_status']
  }
  
  Note: 'Main immigration application entity'
}

// ============================================
// CONTENT MANAGEMENT
// ============================================

Table news_articles {
  id integer [pk, increment]
  author_id integer [ref: > users.id]
  
  title varchar(200) [not null]
  title_ar varchar(200) [note: 'Arabic translation']
  content text [not null]
  content_ar text [note: 'Arabic translation']
  excerpt varchar(300) [not null, note: 'Short summary']
  excerpt_ar varchar(300) [note: 'Arabic translation']
  image varchar(100)
  author_name varchar(200) [note: 'Manual entry (e.g., Juba News Monitor)']
  
  published boolean [default: true]
  featured boolean [default: false, note: 'Show on homepage']
  
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
  
  indexes {
    (published, featured)
    created_at
  }
  
  Note: 'News articles for homepage'
}

Table blog_posts {
  id integer [pk, increment]
  author_id integer [ref: > users.id]
  
  title varchar(200) [not null]
  title_ar varchar(200) [note: 'Arabic translation']
  content text [not null]
  content_ar text [note: 'Arabic translation']
  excerpt varchar(300) [not null, note: 'Short summary']
  excerpt_ar varchar(300) [note: 'Arabic translation']
  image varchar(100)
  author_name varchar(200) [note: 'Manual entry']
  category varchar(100) [note: 'e.g., Tips, Updates, Guides']
  
  published boolean [default: true]
  featured boolean [default: false, note: 'Show on homepage']
  
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
  
  indexes {
    (published, featured)
    category
    created_at
  }
  
  Note: 'Blog posts for immigration guides and tips'
}

// ============================================
// ENUMS (for reference)
// ============================================

Enum application_type_enum {
  "passport-first"
  "passport-replacement"
  "nationalid-first"
  "nationalid-replacement"
}

Enum status_enum {
  "pending"
  "in-progress"
  "approved"
  "rejected"
  "collected"
}

Enum role_enum {
  "applicant"
  "officer"
  "supervisor"
  "admin"
}

Enum payment_status_enum {
  "pending"
  "completed"
  "failed"
}

Enum gender_enum {
  "male"
  "female"
}

Enum marital_status_enum {
  "single"
  "married"
  "divorced"
  "widowed"
}
```

---

## How to Generate the Diagram:

### Method 1: dbdiagram.io (BEST - Recommended!)
1. Go to: **https://dbdiagram.io/**
2. Click "Go to App"
3. Delete the example code
4. Paste the code above
5. The diagram appears automatically! ✨
6. Click "Export" → Choose PNG, SVG, or PDF
7. Done! ✅

**Features:**
- ✅ Beautiful, professional diagrams
- ✅ Real-time preview
- ✅ Export to multiple formats
- ✅ Share with team (public/private links)
- ✅ Generate SQL from diagram
- ✅ Free for public diagrams

### Method 2: Quick Database Diagrams
1. Go to: https://www.quickdatabasediagrams.com/
2. Paste the code (may need slight modifications)
3. Export diagram

---

## Advantages of DBML:

1. ✅ **Specifically designed for databases**
2. ✅ **Most readable syntax**
3. ✅ **Beautiful output** (professional quality)
4. ✅ **Can generate SQL** from the diagram
5. ✅ **Best for documentation**
6. ✅ **Team collaboration** features
7. ✅ **Free for public projects**

---

## Example Output Features:

When you paste this in dbdiagram.io, you'll see:
- 📊 All tables with columns
- 🔗 Relationship lines with cardinality
- 📝 Notes and descriptions
- 🎨 Color-coded by category
- 🔍 Zoom and pan
- 📤 Export to PNG, SVG, PDF
- 💾 Generate SQL DDL statements

---

## Tips for dbdiagram.io:

1. **Customize colors**: Click on tables to change colors
2. **Rearrange**: Drag tables to organize layout
3. **Add notes**: Right-click → Add note
4. **Share**: Click "Share" to get a public link
5. **Export SQL**: Click "Export" → "PostgreSQL" to get CREATE TABLE statements

---

## This is the BEST option for:
- ✅ Presentations
- ✅ Documentation
- ✅ Academic submissions
- ✅ Team collaboration
- ✅ Database design reviews
