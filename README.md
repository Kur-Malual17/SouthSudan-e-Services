# South Sudan Immigration Portal

A comprehensive web-based immigration services platform for South Sudan, enabling citizens to apply for e-Passports and National IDs online with integrated payment processing and administrative management.

## 🌐 Live Application

**Public IP/URL to the live server:** https://south-sudan-e-services.vercel.app/

**Frontend (React):** https://south-sudan-e-services.vercel.app/

**Backend API (Django):** https://southsudan-e-services.onrender.com

**GitHub Repository:** https://github.com/Kur-Malual17/SouthSudan-e-Services

## Project Overview

This full-stack web application modernizes South Sudan's immigration services by providing:
- Online application submission for e-Passports and National IDs
- Secure payment processing with receipt verification
- Real-time application tracking
- Multi-language support (English & Arabic)
- Administrative dashboard for application management
- Content management system for news and updates

## Key Features

### For Citizens
- **User Registration & Authentication** - Secure account creation with email verification
- **Online Applications** - Submit e-Passport and National ID applications
- **Payment Integration** - Multiple payment methods (Mobile Money, Bank Transfer)
- **Application Tracking** - Real-time status updates and notifications
- **Document Upload** - Secure upload of required documents
- **Multi-language Support** - English and Arabic interface

### For Administrators
- **Application Management** - Review, approve, or reject applications
- **Payment Verification** - Verify payment receipts and process payments
- **User Management** - Manage user accounts and roles
- **Content Management** - Publish news articles and blog posts
- **Dashboard Analytics** - View application statistics and reports
- **PDF Generation** - Automatic approval letter generation

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for responsive design
- **React Router** for navigation
- **Axios** for API communication
- **React Hook Form** for form management
- **React Hot Toast** for notifications

### Backend
- **PHP** for Validation and CRUD
- **Django 4.2** with Django REST Framework
- **PostgreSQL** database
- **Cloudinary** for media storage
- **ReportLab** for PDF generation
- **Django CORS Headers** for cross-origin requests

### Validation Layer
- **PHP 8.x** for server-side validation
- **JavaScript/TypeScript** for client-side validation
- **Regular Expressions** for pattern matching
- **Django Validators** for backend validation

## PHP Validation Implementation

The system implements comprehensive PHP validation with regular expressions:

### Validation Rules
```php
// Email validation
preg_match('/@.+\..+$/', $email)

// Password validation (min 6 chars, uppercase, lowercase, digit, special char)
preg_match('/[A-Z]/', $password)
preg_match('/[a-z]/', $password)
preg_match('/[0-9]/', $password)
preg_match('/[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]/', $password)

// Name validation (letters only, must start with capital)
preg_match('/^[A-Za-z\s\-\']+$/', $name)
preg_match('/^[A-Z]/', $name)

// Phone validation (10-15 digits with optional country code)
preg_match('/^\+?[0-9]{10,15}$/', $phone)
```

### PHP Files
- `php-validation/validate.php` - Validation API with regex patterns
- `php-validation/crud.php` - CRUD operations (Create, Read, Update, Delete)
- `php-validation/test.html` - Interactive testing interface

### Testing
PHP validation is tested using the interactive test interface (`test.html`) which demonstrates:
- Single field validation
- Full form validation
- CRUD operations
- Real-time validation feedback

**Note:** PHPUnit testing framework is not used; validation is demonstrated through the interactive test interface which provides comprehensive testing of all validation rules and CRUD operations.

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- PostgreSQL (v12 or higher)
- XAMPP (for PHP validation)

### Local Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/Kur-Malual17/SouthSudan-e-Services.git
cd SouthSudan-e-Services
```

2. **Frontend Setup**
```bash
npm install
npm run dev
```

3. **Backend Setup**
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py create_default_admin
python manage.py runserver
```

4. **PHP Validation Setup**
```bash
# Copy PHP files to XAMPP
copy php-validation C:\xampp\htdocs\php-validation\
# Start Apache in XAMPP Control Panel
# Access test interface: http://localhost/php-validation/test.html
```

5. **Environment Variables**
Create `.env` files in both frontend and backend directories with required configurations.

##  Deployment

### Frontend (Vercel)
- Automatic deployment from GitHub main branch
- Environment variables configured in Vercel dashboard
- Build command: `npm run build`
- Output directory: `dist`

### Backend (Render)
- Automatic deployment from GitHub main branch
- PostgreSQL database hosted on Render
- Environment variables configured in Render dashboard
- Build command: `pip install -r requirements.txt`
- Start command: `gunicorn immigration_portal.wsgi:application`


The application uses PostgreSQL with the following main models:
- **User** - Authentication and user management
- **UserProfile** - Extended user information and roles
- **Application** - Immigration application data
- **NewsArticle** - News content management
- **BlogPost** - Blog content management

See `database_schema.sql` for complete schema definition.


## Documentation

- `CONTRIBUTING.md` - Contribution guidelines
- `LICENSE` - MIT License
- `database_schema.sql` - Database schema export
- `PROJECT_DOCUMENTATION.pdf` - Complete project documentation

## Security Features

- Password hashing with Django's built-in authentication
- CSRF protection on all forms
- SQL injection prevention through ORM
- XSS protection through React's built-in escaping
- Secure file upload validation
- Payment receipt duplicate detection

## 🌍 Multi-language Support

The application supports:
- English (default)
- Arabic (العربية)

Language switching is available in the navigation menu.

## Contact

For questions or support, please contact:
- GitHub: https://github.com/Kur-Malual17
- Email: kur.malual@ashesi.edu.gh

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---
