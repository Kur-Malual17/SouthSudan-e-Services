# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+211123456789"
}

Response: 201 Created
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "applicant"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "success": true,
  "token": "jwt_token_here",
  "user": { ... }
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "user": { ... }
}
```

### Applications

#### Submit Application
```http
POST /applications
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- applicationType: "passport-first" | "passport-replacement" | "nationalid-first" | "nationalid-replacement"
- firstName: string
- lastName: string
- dateOfBirth: date
- gender: "male" | "female"
- nationality: string
- phoneNumber: string
- email: string
- country: string
- state: string
- city: string
- placeOfResidence: string
- birthCountry: string
- birthState: string
- birthCity: string
- fatherName: string
- motherName: string
- maritalStatus: "single" | "married" | "divorced" | "widowed"
- photo: file (image)
- idCopy: file (image/pdf)
- [additional fields based on application type]

Response: 201 Created
{
  "success": true,
  "message": "Application submitted successfully",
  "confirmationNumber": "SS-IMM-12345678-123",
  "application": { ... }
}
```

#### Get My Applications
```http
GET /applications/my-applications
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "applications": [ ... ]
}
```

#### Get Application by ID
```http
GET /applications/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "application": { ... }
}
```

### Admin Routes

All admin routes require role: "admin", "officer", or "supervisor"

#### Get All Applications
```http
GET /admin/applications?status=pending&applicationType=passport-first&page=1&limit=20
Authorization: Bearer <token>

Query Parameters:
- status (optional): "pending" | "in-progress" | "approved" | "rejected" | "collected"
- applicationType (optional): application type filter
- page (optional): page number (default: 1)
- limit (optional): items per page (default: 20)

Response: 200 OK
{
  "success": true,
  "applications": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

#### Get Application Details (Admin)
```http
GET /admin/applications/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "application": {
    // Full application details including user info
  }
}
```

#### Update Application Status
```http
PATCH /admin/applications/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "in-progress"
}

Response: 200 OK
{
  "success": true,
  "application": { ... }
}
```

#### Approve Application
```http
POST /admin/applications/:id/approve
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "Application approved and email sent",
  "application": { ... }
}

Note: This generates a PDF and sends an email to the applicant
```

#### Reject Application
```http
POST /admin/applications/:id/reject
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Incomplete documents"
}

Response: 200 OK
{
  "success": true,
  "application": { ... }
}
```

#### Get Statistics
```http
GET /admin/statistics
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "statistics": {
    "total": 150,
    "byStatus": {
      "pending": 25,
      "approved": 100,
      "rejected": 15,
      "collected": 10
    },
    "byType": {
      "passportFirst": 50,
      "passportReplacement": 30,
      "nationalIdFirst": 40,
      "nationalIdReplacement": 30
    }
  }
}
```

## Error Responses

All endpoints may return error responses:

```json
{
  "message": "Error description"
}
```

Common HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## File Upload Specifications

### Accepted File Types
- Images: .jpg, .jpeg, .png
- Documents: .pdf

### File Size Limits
- Maximum: 5MB per file

### Required Files by Application Type

**Passport First-Time:**
- photo (required)
- idCopy (required)
- signature (required)

**Passport Replacement:**
- photo (required)
- idCopy (required)
- signature (required)
- oldDocument (optional)
- policeReport (optional, required if lost/stolen)

**National ID First-Time:**
- photo (required)
- birthCertificate (required)

**National ID Replacement:**
- photo (required)
- oldDocument (optional)
- policeReport (optional, required if lost/stolen)

## Rate Limiting

Currently no rate limiting is implemented. In production, consider:
- 100 requests per 15 minutes per IP for general endpoints
- 10 requests per hour for registration
- 5 requests per minute for login attempts

## Webhooks (Future)

Future versions may include webhooks for:
- Application status changes
- Payment confirmations
- Document ready for collection
