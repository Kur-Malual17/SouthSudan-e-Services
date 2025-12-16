# 🇸🇸 South Sudan Immigration Online Portal

A comprehensive government digital platform for citizens to apply for passports and national IDs online, modeled after Rwanda's IremboGov system.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-green.svg)](https://www.mongodb.com/)

## Features

### Services Offered
- **e-Passport First-Time Application** - For citizens applying for their first passport
- **e-Passport Replacement** - For replacing lost, stolen, damaged, expired, or incorrect passports
- **National ID First-Time Application** - For citizens applying for a new National ID
- **National ID Replacement** - For replacing lost, stolen, damaged, or incorrect National IDs

### Key Capabilities
- ✅ Online application submission with step-by-step forms
- ✅ Secure document upload (photos, IDs, certificates)
- ✅ Online payment integration
- ✅ Real-time application tracking
- ✅ Admin dashboard for application review
- ✅ Automatic PDF generation upon approval
- ✅ Email notifications with approval documents
- ✅ Multilingual support (English/Arabic ready)
- ✅ Mobile-responsive design

## Tech Stack

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads
- PDFKit for PDF generation
- Nodemailer for email notifications

### Frontend
- React 18 with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Zustand for state management
- React Hook Form for form handling
- Axios for API calls
- Vite for build tooling

## Project Structure

```
south-sudan-immigration-portal/
├── server/                 # Backend API
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Auth, upload middleware
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   ├── utils/         # PDF generator, email service
│   │   └── index.ts       # Server entry point
│   ├── uploads/           # File storage
│   └── package.json
│
├── client/                # Frontend React app
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand stores
│   │   ├── lib/           # API client
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
└── README.md
```

## 🚀 Quick Start

**New to the project?** Start here: [QUICK_START.md](QUICK_START.md) - Get running in 5 minutes!

```bash
# 1. Install dependencies
cd server && npm install
cd ../client && npm install

# 2. Configure server/.env (copy from server/.env.example)

# 3. Start MongoDB
mongod

# 4. Run the application (from root)
npm run dev
```

Access the application:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

**Next Steps:**
- Create admin user: `cd scripts && node create-admin.js`
- See [SETUP.md](SETUP.md) for detailed configuration
- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) if you encounter issues

## User Roles

### Applicant (Default)
- Create account and login
- Submit applications
- Upload documents
- Track application status
- View approved applications

### Officer
- Review applications
- Verify documents
- Update application status

### Supervisor
- All officer permissions
- Approve/reject applications
- Generate reports

### Admin
- Full system access
- User management
- System configuration
- Analytics and reporting

## Application Workflow

1. **User Registration** - Citizen creates account
2. **Service Selection** - Choose passport or National ID service
3. **Form Completion** - Fill multi-step application form
4. **Document Upload** - Upload required documents (photo, ID, certificates)
5. **Payment** - Complete online payment
6. **Submission** - Receive confirmation number
7. **Admin Review** - Officer reviews and verifies application
8. **Approval** - Admin approves application
9. **PDF Generation** - System generates official approval document
10. **Email Notification** - Applicant receives email with PDF attachment
11. **Collection** - Applicant visits Juba office to collect document

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Applications
- `POST /api/applications` - Submit new application
- `GET /api/applications/my-applications` - Get user's applications
- `GET /api/applications/:id` - Get application details

### Admin
- `GET /api/admin/applications` - Get all applications (with filters)
- `GET /api/admin/applications/:id` - Get application details
- `PATCH /api/admin/applications/:id/status` - Update status
- `POST /api/admin/applications/:id/approve` - Approve application
- `POST /api/admin/applications/:id/reject` - Reject application
- `GET /api/admin/statistics` - Get system statistics

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- File type and size validation
- CORS protection
- Input validation and sanitization

## Future Enhancements

- [ ] SMS notifications
- [ ] Payment gateway integration (MTN Mobile Money, Airtel Money)
- [ ] Biometric data collection
- [ ] Arabic language interface
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Document verification with QR codes
- [ ] Integration with Civil Registry

## Support

For technical support or inquiries:
- Email: info@immigration.gov.ss
- Phone: +211 XXX XXX XXX
- Office: Immigration Head Office, Juba

## Documentation

- [Setup Guide](SETUP.md) - Detailed installation and configuration
- [API Documentation](API_DOCUMENTATION.md) - Complete API reference
- [Project Summary](PROJECT_SUMMARY.md) - Comprehensive project overview
- [Contributing Guide](CONTRIBUTING.md) - How to contribute

## Screenshots

### User Interface
- **Homepage**: Clean, accessible interface with service cards
- **Application Forms**: Multi-step forms with validation
- **Dashboard**: Track application status in real-time
- **Admin Panel**: Comprehensive review and approval workflow

## Project Structure

```
south-sudan-immigration-portal/
├── server/                 # Backend Node.js/Express API
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Auth, upload, validation
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API routes
│   │   ├── utils/         # PDF generator, email service
│   │   └── index.ts       # Server entry point
│   └── uploads/           # File storage
│
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── store/         # State management
│   │   ├── lib/           # API client, utilities
│   │   └── App.tsx        # Main app component
│   └── public/            # Static assets
│
├── scripts/               # Utility scripts
│   └── create-admin.js    # Admin user creation
│
└── docs/                  # Documentation
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by Rwanda's IremboGov platform
- Built for the people of South Sudan
- Designed to promote transparency and accessibility in government services

## Contact & Support

- **Email**: info@immigration.gov.ss
- **Phone**: +211 XXX XXX XXX
- **Office**: Immigration Head Office, Juba, South Sudan
- **Hours**: Monday - Friday, 8:00 AM - 4:00 PM

---

**Built with ❤️ for South Sudan**

© 2024 Republic of South Sudan - Directorate of Nationality, Passports and Immigration
