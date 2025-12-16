# Language Support & Password Reset Implementation Guide

## Overview
This guide covers two major features added to the South Sudan Immigration Portal:
1. **Arabic Language Support** - Full bilingual support (English/Arabic)
2. **Password Reset Functionality** - Forgot password feature with email verification

---

## 1. Language Support (English/Arabic)

### Features Implemented

#### Language Switcher
- **Location**: Navigation bar (top right on desktop, in mobile menu)
- **Icon**: Globe/language icon
- **Toggle**: Click to switch between English (EN) and Arabic (AR)
- **Persistence**: Language preference is saved in browser localStorage

#### RTL (Right-to-Left) Support
- Arabic text automatically displays right-to-left
- Layout adjusts for RTL reading direction
- Icons and spacing flip appropriately

#### Translated Components
All major pages and components have been translated:
- Navigation menu
- Login/Register pages
- Dashboard
- Help & Support
- Contact Us
- Footer
- All buttons and labels

### How to Use

#### For Users
1. Look for the language switcher in the navigation bar
2. Click the button showing "العربية" (to switch to Arabic) or "English" (to switch to English)
3. The entire website will instantly translate
4. Your language preference is remembered for future visits

#### For Developers

**Adding New Translations:**

1. Open `client/src/i18n/translations.ts`
2. Add your new key to both `en` and `ar` objects:

```typescript
export const translations = {
  en: {
    // ... existing translations
    myNewKey: 'My English Text',
  },
  ar: {
    // ... existing translations
    myNewKey: 'النص العربي الخاص بي',
  }
};
```

3. Use the translation in your component:

```typescript
import { useTranslation } from '../hooks/useTranslation';

function MyComponent() {
  const { t, language } = useTranslation();
  
  return (
    <div className={language === 'ar' ? 'rtl' : 'ltr'}>
      <h1>{t('myNewKey')}</h1>
    </div>
  );
}
```

### Files Created/Modified

**New Files:**
- `client/src/i18n/translations.ts` - Translation dictionary
- `client/src/store/languageStore.ts` - Language state management
- `client/src/hooks/useTranslation.ts` - Translation hook

**Modified Files:**
- `client/src/components/Layout.tsx` - Added language switcher
- `client/src/pages/Login.tsx` - Added translations
- `client/src/pages/Dashboard.tsx` - Added translations
- `client/src/pages/Help.tsx` - Added translations
- `client/src/pages/Contact.tsx` - Added translations

---

## 2. Password Reset Functionality

### Features Implemented

#### Forgot Password Flow
1. User clicks "Forgot Password?" on login page
2. Enters their email address
3. Receives password reset email with secure link
4. Clicks link to set new password
5. Redirected to login with new password

#### Security Features
- Token-based authentication (expires in 24 hours)
- Secure password hashing
- Email verification required
- No user enumeration (same response whether email exists or not)

### User Journey

#### Step 1: Request Password Reset
- Navigate to `/forgot-password`
- Enter registered email address
- Click "Send Reset Link"
- Check email inbox (and spam folder)

#### Step 2: Reset Password
- Click the link in the email
- Redirected to `/reset-password?token=...`
- Enter new password (minimum 6 characters)
- Confirm new password
- Click "Reset Password"

#### Step 3: Login
- Automatically redirected to login page
- Use new password to login

### API Endpoints

#### Request Password Reset
```
POST /api/auth/password-reset/
Body: { "email": "user@example.com" }
Response: { "success": true, "message": "Password reset instructions sent" }
```

#### Confirm Password Reset
```
POST /api/auth/password-reset-confirm/
Body: { 
  "token": "uid-token-string",
  "password": "newpassword123"
}
Response: { "success": true, "message": "Password reset successfully" }
```

### Files Created/Modified

**New Files:**
- `client/src/pages/ForgotPassword.tsx` - Forgot password page
- `client/src/pages/ResetPassword.tsx` - Reset password page

**Modified Files:**
- `client/src/pages/Login.tsx` - Added "Forgot Password?" link
- `client/src/App.tsx` - Added new routes
- `backend/applications/views.py` - Added password reset views
- `backend/applications/urls.py` - Added password reset URLs

### Email Configuration

The password reset feature requires email configuration. Update your `backend/.env`:

```env
# Email Settings
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Frontend URL (for reset links)
FRONTEND_URL=http://localhost:3000
```

**For Gmail:**
1. Enable 2-Factor Authentication
2. Generate an App Password
3. Use the App Password in EMAIL_HOST_PASSWORD

---

## Testing

### Test Language Switching
1. Open the website
2. Click the language switcher (العربية/English)
3. Verify all text translates
4. Check RTL layout for Arabic
5. Refresh page - language should persist

### Test Password Reset
1. Go to login page
2. Click "Forgot Password?"
3. Enter a registered email
4. Check email inbox
5. Click the reset link
6. Set a new password
7. Login with new password

---

## Troubleshooting

### Language Issues
- **Translations not showing**: Check that the key exists in `translations.ts`
- **RTL not working**: Ensure `className={language === 'ar' ? 'rtl' : 'ltr'}` is applied
- **Language not persisting**: Check browser localStorage

### Password Reset Issues
- **Email not received**: 
  - Check spam folder
  - Verify EMAIL_HOST_USER and EMAIL_HOST_PASSWORD in .env
  - Check Django logs for email errors
- **Invalid token**: 
  - Link may have expired (24 hours)
  - Request a new reset link
- **Reset link not working**:
  - Verify FRONTEND_URL in backend .env matches your frontend URL

---

## Future Enhancements

### Language Support
- Add more languages (French, Swahili, etc.)
- Translate application forms
- Translate email notifications
- Add language selector on home page

### Password Reset
- Add SMS-based password reset
- Implement password strength meter
- Add password history (prevent reuse)
- Add account recovery questions

---

## Support

For issues or questions:
- Email: info@immigration.gov.ss
- Phone: +211 924828569
- Office: Immigration Head Office, Juba, South Sudan

---

## Credits

Developed for the Republic of South Sudan - Directorate of Immigration
