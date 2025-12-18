# South Sudan Immigration Portal

A comprehensive web-based immigration services platform for South Sudan, enabling citizens to apply for e-Passports and National IDs online.

## Features

- User registration and authentication
- Online application submission (e-Passport & National ID)
- Payment processing integration
- Application tracking and status updates
- Admin dashboard for application management
- Multi-language support (English & Arabic)
- News and blog content management

## Technology Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Axios for API communication

### Backend
- Django REST Framework
- PostgreSQL database
- PHP validation layer
- Cloudinary for media storage

### Validation
- Client-side validation (JavaScript/TypeScript)
- Server-side validation (PHP with regex patterns)
- Django backend validation

## PHP Validation

The system uses PHP for server-side validation with regular expressions:

- Email validation: `/@.+\..+$/`
- Password validation: `/[A-Z]/`, `/[a-z]/`, `/[0-9]/`, `/[!@#$%^&*()]/`
- Name validation: `/^[A-Za-z\s\-\']+$/`
- Phone validation: `/^\+?[0-9]{10,15}$/`

PHP files located in `php-validation/`:
- `validate.php` - Validation API
- `crud.php` - CRUD operations
- `test.html` - Testing interface

## Setup

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- PostgreSQL
- XAMPP (for PHP)

### Installation

1. Clone the repository
2. Install frontend dependencies: `npm install`
3. Install backend dependencies: `pip install -r backend/requirements.txt`
4. Copy PHP files to XAMPP: `C:\xampp\htdocs\php-validation\`
5. Configure environment variables
6. Run migrations: `python manage.py migrate`
7. Start development servers

### Running the Application

Frontend: `npm run dev`
Backend: `python manage.py runserver`
PHP: Start Apache in XAMPP

## Deployment

- Frontend: Vercel
- Backend: Render
- Database: PostgreSQL on Render

## License

MIT License
