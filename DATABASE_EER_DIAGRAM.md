# South Sudan Immigration Portal - EER Diagram

## Enhanced Entity-Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOUTH SUDAN IMMIGRATION PORTAL                            │
│                         Database Schema (EER)                                │
└─────────────────────────────────────────────────────────────────────────────┘


┌──────────────────────────┐
│         User             │  (Django Built-in)
├──────────────────────────┤
│ PK  id                   │
│     username             │
│     email                │
│     password             │
│     first_name           │
│     last_name            │
│     is_staff             │
│     is_active            │
│     date_joined          │
└──────────────────────────┘
         │ 1
         │
         │ has
         │
         ▼ 1
┌──────────────────────────┐
│      UserProfile         │
├──────────────────────────┤
│ PK  id                   │
│ FK  user_id              │◄──── One-to-One with User
│     phone_number         │
│     role                 │      Choices: applicant, officer,
│     is_active            │               supervisor, admin
│     created_at           │
└──────────────────────────┘
         │ 1
         │
         │ submits
         │
         ▼ *
┌──────────────────────────────────────────────────────────────────────┐
│                          Application                                  │
├──────────────────────────────────────────────────────────────────────┤
│ PK  id                                                                │
│ FK  user_id                    ◄──── Many-to-One with User           │
│ FK  reviewed_by_id             ◄──── Many-to-One with User (Officer) │
│ FK  payment_verified_by_id     ◄──── Many-to-One with User (Officer) │
│                                                                       │
│ ┌─── Basic Information ───────────────────────────────────────────┐ │
│ │  application_type            (passport-first, passport-replacement│ │
│ │                               nationalid-first, nationalid-repl.) │ │
│ │  status                      (pending, in-progress, approved,    │ │
│ │                               rejected, collected)                │ │
│ │  confirmation_number         UNIQUE (SS-IMM-XXXXXXX-XXX)         │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│ ┌─── Personal Details ────────────────────────────────────────────┐ │
│ │  applicant_type              (above18, below18)                  │ │
│ │  national_id_number                                              │ │
│ │  first_name                                                      │ │
│ │  last_name                                                       │ │
│ │  middle_name                                                     │ │
│ │  date_of_birth                                                   │ │
│ │  gender                      (male, female)                      │ │
│ │  nationality                                                     │ │
│ │  father_name                                                     │ │
│ │  mother_name                                                     │ │
│ │  marital_status              (single, married, divorced, widowed)│ │
│ │  profession                                                      │ │
│ │  employer                                                        │ │
│ │  height                                                          │ │
│ │  other_nationality                                               │ │
│ │  other_passport_number                                           │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│ ┌─── Contact Details ─────────────────────────────────────────────┐ │
│ │  phone_number                                                    │ │
│ │  email                                                           │ │
│ │  country                                                         │ │
│ │  state                                                           │ │
│ │  city                                                            │ │
│ │  place_of_residence                                              │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│ ┌─── Birth Location ──────────────────────────────────────────────┐ │
│ │  birth_country                                                   │ │
│ │  birth_state                                                     │ │
│ │  birth_city                                                      │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│ ┌─── Passport Specific ───────────────────────────────────────────┐ │
│ │  passport_type               (2-year, 5-year, 10-year)           │ │
│ │  travel_purpose                                                  │ │
│ │  destination_country                                             │ │
│ │  destination_city                                                │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│ ┌─── Replacement Specific ────────────────────────────────────────┐ │
│ │  replacement_reason          (lost, stolen, damaged, expired,    │ │
│ │                               correction)                         │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│ ┌─── Document Attachments ────────────────────────────────────────┐ │
│ │  photo                       ImageField                          │ │
│ │  id_copy                     FileField                           │ │
│ │  signature                   ImageField                          │ │
│ │  birth_certificate           FileField                           │ │
│ │  old_document                FileField                           │ │
│ │  police_report               FileField                           │ │
│ │  civil_registry_number                                           │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│ ┌─── Payment Information ─────────────────────────────────────────┐ │
│ │  payment_status              (pending, completed, failed)        │ │
│ │  payment_method              (momo, credit_card, bank)           │ │
│ │  payment_amount              Decimal(10,2)                       │ │
│ │  payment_reference                                               │ │
│ │  payment_proof               ImageField                          │ │
│ │  payment_proof_hash          SHA-256 (Duplicate Detection)       │ │
│ │  payment_date                                                    │ │
│ │  payment_verified_at                                             │ │
│ │  payment_rejection_reason                                        │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│ ┌─── Admin Actions ───────────────────────────────────────────────┐ │
│ │  reviewed_at                                                     │ │
│ │  rejection_reason                                                │ │
│ │  approved_pdf                FileField                           │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│ ┌─── Timestamps ──────────────────────────────────────────────────┐ │
│ │  created_at                  auto_now_add                        │ │
│ │  updated_at                  auto_now                            │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│ Indexes: confirmation_number, status, application_type, user_id      │
└──────────────────────────────────────────────────────────────────────┘


┌──────────────────────────┐
│      NewsArticle         │
├──────────────────────────┤
│ PK  id                   │
│ FK  author_id            │◄──── Many-to-One with User (optional)
│                          │
│     title                │
│     title_ar             │      Arabic translation
│     content              │
│     content_ar           │      Arabic translation
│     excerpt              │      Short summary (300 chars)
│     excerpt_ar           │      Arabic translation
│     image                │      ImageField (news/)
│     author_name          │      Manual entry (e.g., "Juba News Monitor")
│     published            │      Boolean (default: True)
│     featured             │      Boolean (show on homepage)
│     created_at           │
│     updated_at           │
└──────────────────────────┘


┌──────────────────────────┐
│       BlogPost           │
├──────────────────────────┤
│ PK  id                   │
│ FK  author_id            │◄──── Many-to-One with User (optional)
│                          │
│     title                │
│     title_ar             │      Arabic translation
│     content              │
│     content_ar           │      Arabic translation
│     excerpt              │      Short summary (300 chars)
│     excerpt_ar           │      Arabic translation
│     image                │      ImageField (blog/)
│     author_name          │      Manual entry
│     category             │      e.g., "Tips", "Updates", "Guides"
│     published            │      Boolean (default: True)
│     featured             │      Boolean (show on homepage)
│     created_at           │
│     updated_at           │
└──────────────────────────┘


┌──────────────────────────┐
│     GalleryImage         │  (DEPRECATED - Removed from active use)
├──────────────────────────┤
│ PK  id                   │
│ FK  uploaded_by_id       │◄──── Many-to-One with User (optional)
│                          │
│     title                │
│     title_ar             │
│     description          │
│     description_ar       │
│     image                │      ImageField (gallery/)
│     category             │
│     author_name          │
│     published            │
│     featured             │
│     created_at           │
└──────────────────────────┘


═══════════════════════════════════════════════════════════════════════
                         RELATIONSHIPS SUMMARY
═══════════════════════════════════════════════════════════════════════

1. User ──(1:1)──► UserProfile
   - Each User has exactly one UserProfile
   - UserProfile extends User with role and phone_number

2. User ──(1:*)──► Application
   - One User can submit multiple Applications
   - Each Application belongs to one User (applicant)

3. User ──(1:*)──► Application (as reviewer)
   - One Officer/Admin can review multiple Applications
   - Each Application can be reviewed by one Officer/Admin

4. User ──(1:*)──► Application (as payment verifier)
   - One Officer can verify multiple payment proofs
   - Each Application payment can be verified by one Officer

5. User ──(1:*)──► NewsArticle
   - One User (admin) can create multiple News Articles
   - Each News Article has one author (optional)

6. User ──(1:*)──► BlogPost
   - One User (admin) can create multiple Blog Posts
   - Each Blog Post has one author (optional)

7. User ──(1:*)──► GalleryImage (DEPRECATED)
   - One User can upload multiple Gallery Images
   - Each Gallery Image has one uploader (optional)


═══════════════════════════════════════════════════════════════════════
                         BUSINESS RULES
═══════════════════════════════════════════════════════════════════════

1. UNIQUE CONSTRAINTS:
   - User.username (Django default)
   - User.email (Django default)
   - Application.confirmation_number (format: SS-IMM-XXXXXXX-XXX)
   - Application.payment_proof_hash (prevents duplicate receipts)

2. REQUIRED FIELDS:
   - Application: first_name, last_name, date_of_birth, gender, nationality,
                  father_name, mother_name, marital_status, phone_number,
                  email, country, state, city, place_of_residence

3. CONDITIONAL REQUIREMENTS:
   - If application_type = 'passport-*': passport_type, travel_purpose required
   - If application_type = '*-replacement': replacement_reason, old_document required
   - If applicant_type = 'below18': parent/guardian info required

4. STATUS WORKFLOW:
   pending → in-progress → approved/rejected → collected
   
5. PAYMENT WORKFLOW:
   pending → completed/failed
   - Payment must be completed before application approval
   - Duplicate payment receipts are detected via SHA-256 hash

6. ROLE PERMISSIONS:
   - applicant: Submit applications, view own applications
   - officer: Review applications, verify payments
   - supervisor: All officer permissions + statistics
   - admin: All permissions + user management

7. CONTENT PUBLISHING:
   - Only published=True items appear in API
   - featured=True items appear on homepage
   - Supports bilingual content (English + Arabic)


═══════════════════════════════════════════════════════════════════════
                         INDEXES & PERFORMANCE
═══════════════════════════════════════════════════════════════════════

Application Indexes:
- confirmation_number (for quick lookup)
- status (for filtering by status)
- application_type (for filtering by type)
- user_id (for user's applications)
- payment_proof_hash (for duplicate detection)

Ordering:
- Application: -created_at (newest first)
- NewsArticle: -created_at (newest first)
- BlogPost: -created_at (newest first)
- GalleryImage: -created_at (newest first)


═══════════════════════════════════════════════════════════════════════
                         FILE STORAGE STRUCTURE
═══════════════════════════════════════════════════════════════════════

media/
├── documents/
│   ├── photos/          (Application photos)
│   ├── ids/             (ID copies)
│   ├── signatures/      (Signature images)
│   ├── certificates/    (Birth certificates)
│   ├── old/             (Old documents for replacement)
│   └── reports/         (Police reports)
├── payment_proofs/      (Payment receipt images)
├── approved_pdfs/       (Generated approval documents)
├── news/                (News article images)
├── blog/                (Blog post images)
└── gallery/             (Gallery images - DEPRECATED)


═══════════════════════════════════════════════════════════════════════
                         SECURITY FEATURES
═══════════════════════════════════════════════════════════════════════

1. Payment Proof Duplicate Detection:
   - SHA-256 hash calculated for each uploaded receipt
   - Prevents same receipt being used for multiple applications
   - Hash stored in payment_proof_hash field

2. File Upload Validation:
   - Image files: JPEG, PNG (max 5MB)
   - Document files: PDF, JPEG, PNG (max 10MB)
   - Virus scanning recommended (not implemented)

3. Access Control:
   - Role-based permissions (applicant, officer, supervisor, admin)
   - Users can only view their own applications
   - Officers can view all applications
   - Payment verification requires officer role

4. Data Privacy:
   - Personal data encrypted in transit (HTTPS)
   - Sensitive fields should be encrypted at rest (recommended)
   - GDPR/data protection compliance considerations


═══════════════════════════════════════════════════════════════════════
                         FUTURE ENHANCEMENTS
═══════════════════════════════════════════════════════════════════════

Potential additions:
1. ApplicationHistory table (audit trail)
2. Notification table (email/SMS notifications)
3. Document table (separate document management)
4. Fee table (dynamic pricing)
5. Appointment table (booking system)
6. BiometricData table (fingerprints, facial recognition)
7. ApplicationComment table (internal notes)
8. PaymentTransaction table (detailed payment history)


═══════════════════════════════════════════════════════════════════════
```

## Cardinality Notation

- `1` = Exactly one
- `*` = Zero or more (many)
- `1:1` = One-to-One relationship
- `1:*` = One-to-Many relationship
- `*:*` = Many-to-Many relationship (not used in this schema)

## Legend

- `PK` = Primary Key
- `FK` = Foreign Key
- `◄────` = Relationship direction
- `UNIQUE` = Unique constraint
- `INDEX` = Database index for performance

---

**Generated for:** South Sudan Immigration Portal  
**Date:** December 2025  
**Database:** PostgreSQL (Production) / SQLite (Development)  
**ORM:** Django 4.2.7
