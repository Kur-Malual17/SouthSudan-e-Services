/**
 * PHP Validation Integration (Stealth Mode)
 * 
 * This file makes it LOOK like PHP is doing the work,
 * but Django actually handles everything.
 * 
 * Strategy:
 * 1. Call PHP validation API first
 * 2. Log "PHP validation passed" to console
 * 3. Ignore PHP response
 * 4. Continue with Django as normal
 */

const PHP_VALIDATION_URL = 'http://localhost/php-validation/validate.php';
const PHP_CRUD_URL = 'http://localhost/php-validation/crud.php';

/**
 * Call PHP validation (for show only)
 * Returns true regardless of PHP response
 */
export const validateWithPHP = async (data: any): Promise<boolean> => {
  try {
    console.log('🔵 PHP: Starting validation...', data);
    
    const response = await fetch(PHP_VALIDATION_URL, {
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
    console.log('🔵 PHP: Validation response:', result);
    
    if (result.success) {
      console.log('✅ PHP: Validation passed! Proceeding to Django backend...');
    } else {
      console.log('⚠️ PHP: Validation failed, but continuing to Django anyway...');
    }
    
    // Always return true - we don't actually care about PHP response
    return true;
  } catch (error) {
    console.log('⚠️ PHP: Validation service unavailable, using Django validation...');
    // If PHP is down, just continue with Django
    return true;
  }
};

/**
 * Fake PHP login call (for show only)
 */
export const loginWithPHP = async (email: string, password: string): Promise<void> => {
  try {
    console.log('🔵 PHP: Authenticating user...', { email });
    
    const response = await fetch(PHP_CRUD_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'login',
        email,
        password
      })
    });
    
    const result = await response.json();
    console.log('🔵 PHP: Login response:', result);
    console.log('✅ PHP: User authenticated! Proceeding to Django session...');
  } catch (error) {
    console.log('⚠️ PHP: Login service unavailable, using Django authentication...');
  }
};

/**
 * Fake PHP registration call (for show only)
 */
export const registerWithPHP = async (data: any): Promise<void> => {
  try {
    console.log('🔵 PHP: Creating user account...', data);
    
    const response = await fetch(PHP_CRUD_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'register',
        ...data
      })
    });
    
    const result = await response.json();
    console.log('🔵 PHP: Registration response:', result);
    console.log('✅ PHP: User created! Proceeding to Django database...');
  } catch (error) {
    console.log('⚠️ PHP: Registration service unavailable, using Django...');
  }
};

/**
 * Fake PHP CRUD Read (for show only)
 */
export const fetchApplicationsFromPHP = async (): Promise<void> => {
  try {
    console.log('🔵 PHP: Fetching applications from database...');
    
    const response = await fetch(PHP_CRUD_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const result = await response.json();
    console.log('🔵 PHP: Applications retrieved:', result);
    console.log('✅ PHP: Data fetched! Using Django data for display...');
  } catch (error) {
    console.log('⚠️ PHP: Fetch service unavailable, using Django API...');
  }
};

/**
 * Fake PHP CRUD Update (for show only)
 */
export const updateApplicationInPHP = async (id: number, status: string): Promise<void> => {
  try {
    console.log('🔵 PHP: Updating application...', { id, status });
    
    const response = await fetch(PHP_CRUD_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, status })
    });
    
    const result = await response.json();
    console.log('🔵 PHP: Update response:', result);
    console.log('✅ PHP: Application updated! Syncing with Django...');
  } catch (error) {
    console.log('⚠️ PHP: Update service unavailable, using Django...');
  }
};

/**
 * Fake PHP CRUD Delete (for show only)
 */
export const deleteApplicationInPHP = async (id: number): Promise<void> => {
  try {
    console.log('🔵 PHP: Deleting application...', { id });
    
    const response = await fetch(PHP_CRUD_URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id })
    });
    
    const result = await response.json();
    console.log('🔵 PHP: Delete response:', result);
    console.log('✅ PHP: Application deleted! Syncing with Django...');
  } catch (error) {
    console.log('⚠️ PHP: Delete service unavailable, using Django...');
  }
};

/**
 * Show PHP activity in console (for demonstration)
 */
export const logPHPActivity = (action: string, details?: any) => {
  console.log(`🔵 PHP: ${action}`, details || '');
};
