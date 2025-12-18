# PHP Validation API for South Sudan Immigration Portal

This standalone PHP validation API provides server-side validation for user registration and form inputs.

## Features

✅ **Email Validation** - Proper email format checking
✅ **Password Validation** - Strength requirements (6+ chars, uppercase, lowercase, digit, special char)
✅ **Name Validation** - Only letters, must start with capital, auto-capitalize
✅ **Phone Validation** - 10-15 digits, international format support
✅ **Username Validation** - 3-30 chars, alphanumeric with underscore/hyphen

## Setup

### Option 1: Local Development (XAMPP/WAMP)

1. **Copy the `php-validation` folder to your web server:**
   ```
   C:\xampp\htdocs\php-validation\
   ```

2. **Start Apache in XAMPP**

3. **Test the API:**
   ```
   http://localhost/php-validation/validate.php
   ```

### Option 2: Deploy to Hosting (Production)

1. **Upload to your hosting** (e.g., cPanel, shared hosting)
   ```
   public_html/php-validation/
   ```

2. **Update CORS settings** in `validate.php` if needed:
   ```php
   header('Access-Control-Allow-Origin: https://your-frontend-domain.com');
   ```

3. **Test the API:**
   ```
   https://yourdomain.com/php-validation/validate.php
   ```

## API Usage

### Endpoint
```
POST /php-validation/validate.php
Content-Type: application/json
```

### Request Format

#### Validate Single Field
```json
{
  "type": "email",
  "value": "user@example.com"
}
```

#### Validate All Registration Fields
```json
{
  "type": "registration",
  "email": "john.doe@example.com",
  "password": "MyPass123!",
  "confirmPassword": "MyPass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+211123456789"
}
```

### Response Format

#### Success Response
```json
{
  "success": true,
  "errors": {},
  "data": {
    "passwordStrength": "strong",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### Error Response
```json
{
  "success": false,
  "errors": {
    "password": "Password must contain at least one uppercase letter",
    "firstName": "First name must start with a capital letter"
  },
  "data": {
    "firstName": "John",
    "passwordStrength": "weak"
  }
}
```

## Validation Types

### 1. Email Validation
```json
{
  "type": "email",
  "value": "user@example.com"
}
```

**Rules:**
- Must be valid email format
- Must contain @ and domain

### 2. Password Validation
```json
{
  "type": "password",
  "value": "MyPass123!"
}
```

**Rules:**
- Minimum 6 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one digit (0-9)
- At least one special character (!@#$%^&*...)

**Returns:** Password strength (weak/medium/strong)

### 3. Name Validation
```json
{
  "type": "name",
  "value": "john",
  "fieldName": "First name"
}
```

**Rules:**
- Only letters, spaces, hyphens, apostrophes
- Must start with capital letter
- Minimum 2 characters

**Returns:** Auto-capitalized name

### 4. Phone Validation
```json
{
  "type": "phone",
  "value": "+211123456789"
}
```

**Rules:**
- 10-15 digits
- Can include country code (+)
- Can include spaces and dashes

### 5. Username Validation
```json
{
  "type": "username",
  "value": "johndoe123"
}
```

**Rules:**
- 3-30 characters
- Must start with letter
- Only letters, numbers, underscores, hyphens

## Integration with React Frontend

Update your React app to call PHP validation first:

```typescript
// In your validation utility or API call
const validateWithPHP = async (data: any) => {
  try {
    const response = await fetch('http://localhost/php-validation/validate.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'registration',
        ...data
      })
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('PHP validation error:', error);
    return { success: false, errors: { general: 'Validation service unavailable' } };
  }
};
```

## Testing

### Using cURL
```bash
# Test email validation
curl -X POST http://localhost/php-validation/validate.php \
  -H "Content-Type: application/json" \
  -d '{"type":"email","value":"test@example.com"}'

# Test password validation
curl -X POST http://localhost/php-validation/validate.php \
  -H "Content-Type: application/json" \
  -d '{"type":"password","value":"MyPass123!"}'

# Test full registration
curl -X POST http://localhost/php-validation/validate.php \
  -H "Content-Type: application/json" \
  -d '{"type":"registration","email":"john@example.com","password":"MyPass123!","confirmPassword":"MyPass123!","firstName":"John","lastName":"Doe","phoneNumber":"+211123456789"}'
```

### Using Postman
1. Create new POST request
2. URL: `http://localhost/php-validation/validate.php`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "type": "registration",
  "email": "john@example.com",
  "password": "MyPass123!",
  "confirmPassword": "MyPass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+211123456789"
}
```

## Security Notes

1. **CORS**: Update `Access-Control-Allow-Origin` for production
2. **HTTPS**: Always use HTTPS in production
3. **Rate Limiting**: Consider adding rate limiting for production
4. **Input Sanitization**: All inputs are validated, not sanitized for database (Django handles that)

## Validation Flow

```
User Input → React Form
    ↓
PHP Validation API (validate.php)
    ↓
If Valid → Django Backend (final validation + save)
    ↓
If Invalid → Show errors to user
```

## Requirements

- PHP 7.0 or higher
- Apache/Nginx web server
- JSON extension (usually enabled by default)

## Troubleshooting

### CORS Errors
Update the CORS header in `validate.php`:
```php
header('Access-Control-Allow-Origin: *'); // Development
// or
header('Access-Control-Allow-Origin: https://your-domain.com'); // Production
```

### 404 Not Found
- Check file path is correct
- Ensure Apache is running
- Verify `.htaccess` allows PHP execution

### Empty Response
- Check PHP error logs
- Ensure JSON extension is enabled
- Verify Content-Type header is set

## License

Part of South Sudan Immigration Portal project.
