-- South Sudan Immigration Portal - Database Schema
-- PostgreSQL Database Export

-- ============================================
-- USER AUTHENTICATION & PROFILES
-- ============================================

-- Django Auth User Table (Built-in)
-- Stores user authentication information
CREATE TABLE auth_user (
    id SERIAL PRIMARY KEY,
    password VARCHAR(128) NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE,
    is_superuser BOOLEAN NOT NULL,
    username VARCHAR(150) UNIQUE NOT NULL,
    first_name VARCHAR(150),
    last_name VARCHAR(150),
    email VARCHAR(254),
    is_staff BOOLEAN NOT NULL,
    is_active BOOLEAN NOT NULL,
    date_joined TIMESTAMP WITH TIME ZONE NOT NULL
);

-- User Profile Table
-- Extends auth_user with additional profile information
CREATE TABLE applications_userprofile (
    id SERIAL PRIMARY KEY,
    phone_number VARCHAR(20) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('applicant', 'officer', 'supervisor', 'admin')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER UNIQUE NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE
);

CREATE INDEX idx_userprofile_user ON applications_userprofile(user_id);
CREATE INDEX idx_userprofile_role ON applications_userprofile(role);

-- ============================================
-- IMMIGRATION APPLICATIONS
-- ============================================

-- Main Application Table
-- Stores all immigration application data
CREATE TABLE applications_application (
    id SERIAL PRIMARY KEY,
    
    -- Application Info
    application_type VARCHAR(30) NOT NULL CHECK (application_type IN (
        'passport-first', 'passport-replacement', 
        'nationalid-first', 'nationalid-replacement'
    )),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'in-progress', 'approved', 'rejected', 'collected'
    )),
    confirmation_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- Personal Details
    applicant_type VARCHAR(10) CHECK (applicant_type IN ('above18', 'below18')),
    national_id_number VARCHAR(50),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
    nationality VARCHAR(100) NOT NULL,
    father_name VARCHAR(200) NOT NULL,
    mother_name VARCHAR(200) NOT NULL,
    marital_status VARCHAR(20) NOT NULL CHECK (marital_status IN (
        'single', 'married', 'divorced', 'widowed'
    )),
    profession VARCHAR(100),
    employer VARCHAR(200),
    height INTEGER,
    other_nationality VARCHAR(100),
    other_passport_number VARCHAR(50),
    
    -- Contact Details
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(254) NOT NULL,
    country VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    place_of_residence VARCHAR(200) NOT NULL,
    
    -- Birth Location
    birth_country VARCHAR(100) NOT NULL,
    birth_state VARCHAR(100) NOT NULL,
    birth_city VARCHAR(100) NOT NULL,
    
    -- Passport Specific
    passport_type VARCHAR(10) CHECK (passport_type IN ('2-year', '5-year', '10-year')),
    travel_purpose VARCHAR(200),
    destination_country VARCHAR(100),
    destination_city VARCHAR(100),
    
    -- Replacement Specific
    replacement_reason VARCHAR(20) CHECK (replacement_reason IN (
        'lost', 'stolen', 'damaged', 'expired', 'correction'
    )),
    
    -- Document Attachments (File paths)
    photo VARCHAR(100),
    id_copy VARCHAR(100),
    signature VARCHAR(100),
    birth_certificate VARCHAR(100),
    old_document VARCHAR(100),
    police_report VARCHAR(100),
    civil_registry_number VARCHAR(100),
    
    -- Payment Information
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN (
        'pending', 'completed', 'failed'
    )),
    payment_method VARCHAR(20) CHECK (payment_method IN (
        'momo', 'credit_card', 'bank'
    )),
    payment_amount DECIMAL(10, 2),
    payment_reference VARCHAR(100),
    payment_proof VARCHAR(100),
    payment_proof_hash VARCHAR(64),
    payment_date TIMESTAMP WITH TIME ZONE,
    payment_verified_by_id INTEGER REFERENCES auth_user(id) ON DELETE SET NULL,
    payment_verified_at TIMESTAMP WITH TIME ZONE,
    payment_rejection_reason TEXT,
    
    -- Admin Actions
    reviewed_by_id INTEGER REFERENCES auth_user(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    approved_pdf VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    user_id INTEGER NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_application_confirmation ON applications_application(confirmation_number);
CREATE INDEX idx_application_status ON applications_application(status);
CREATE INDEX idx_application_type ON applications_application(application_type);
CREATE INDEX idx_application_user ON applications_application(user_id);
CREATE INDEX idx_application_payment_hash ON applications_application(payment_proof_hash);
CREATE INDEX idx_application_created ON applications_application(created_at DESC);

-- ============================================
-- CONTENT MANAGEMENT
-- ============================================

-- News Articles Table
CREATE TABLE applications_newsarticle (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    title_ar VARCHAR(200),
    content TEXT NOT NULL,
    content_ar TEXT,
    excerpt VARCHAR(300) NOT NULL,
    excerpt_ar VARCHAR(300),
    image VARCHAR(100),
    author_id INTEGER REFERENCES auth_user(id) ON DELETE SET NULL,
    author_name VARCHAR(200) DEFAULT '',
    published BOOLEAN NOT NULL DEFAULT TRUE,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_news_published ON applications_newsarticle(published);
CREATE INDEX idx_news_featured ON applications_newsarticle(featured);
CREATE INDEX idx_news_created ON applications_newsarticle(created_at DESC);

-- Blog Posts Table
CREATE TABLE applications_blogpost (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    title_ar VARCHAR(200),
    content TEXT NOT NULL,
    content_ar TEXT,
    excerpt VARCHAR(300) NOT NULL,
    excerpt_ar VARCHAR(300),
    image VARCHAR(100),
    author_id INTEGER REFERENCES auth_user(id) ON DELETE SET NULL,
    author_name VARCHAR(200) DEFAULT '',
    category VARCHAR(100),
    published BOOLEAN NOT NULL DEFAULT TRUE,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_blog_published ON applications_blogpost(published);
CREATE INDEX idx_blog_featured ON applications_blogpost(featured);
CREATE INDEX idx_blog_category ON applications_blogpost(category);
CREATE INDEX idx_blog_created ON applications_blogpost(created_at DESC);

-- ============================================
-- SAMPLE DATA (For Testing)
-- ============================================

-- Insert default admin user (password: admin123)
INSERT INTO auth_user (password, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined)
VALUES ('pbkdf2_sha256$600000$...', TRUE, 'admin', 'System', 'Administrator', 'admin@immigration.gov.ss', TRUE, TRUE, CURRENT_TIMESTAMP);

-- Insert admin profile
INSERT INTO applications_userprofile (phone_number, role, is_active, created_at, user_id)
VALUES ('+211123456789', 'admin', TRUE, CURRENT_TIMESTAMP, 1);

-- ============================================
-- VIEWS FOR REPORTING
-- ============================================

-- Application Statistics View
CREATE VIEW application_statistics AS
SELECT 
    application_type,
    status,
    COUNT(*) as count,
    AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/86400) as avg_processing_days
FROM applications_application
GROUP BY application_type, status;

-- Payment Statistics View
CREATE VIEW payment_statistics AS
SELECT 
    payment_status,
    payment_method,
    COUNT(*) as count,
    SUM(payment_amount) as total_amount
FROM applications_application
WHERE payment_amount IS NOT NULL
GROUP BY payment_status, payment_method;

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_application_updated_at BEFORE UPDATE ON applications_application
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON applications_newsarticle
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_updated_at BEFORE UPDATE ON applications_blogpost
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- CONSTRAINTS & BUSINESS RULES
-- ============================================

-- Ensure payment is completed before approval
ALTER TABLE applications_application
ADD CONSTRAINT check_payment_before_approval
CHECK (
    (status != 'approved') OR 
    (status = 'approved' AND payment_status = 'completed')
);

-- Ensure rejection has a reason
ALTER TABLE applications_application
ADD CONSTRAINT check_rejection_reason
CHECK (
    (status != 'rejected') OR 
    (status = 'rejected' AND rejection_reason IS NOT NULL AND rejection_reason != '')
);

-- ============================================
-- NOTES
-- ============================================

-- This schema represents the core database structure for the
-- South Sudan Immigration Portal application.
--
-- Key Features:
-- 1. User authentication and role-based access control
-- 2. Comprehensive application data storage
-- 3. Payment tracking and verification
-- 4. Content management for news and blog posts
-- 5. Audit trail with timestamps and user tracking
-- 6. Performance optimization through indexes
-- 7. Data integrity through constraints and triggers
--
-- Technology: PostgreSQL 12+
-- ORM: Django 4.2
-- Deployment: Render (PostgreSQL)
