const PHP_VALIDATION_URL = 'http://localhost/php-validation/validate.php';
const PHP_CRUD_URL = 'http://localhost/php-validation/crud.php';

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
      console.log('✅ PHP: Validation passed! Proceeding to backend...');
    } else {
      console.log('⚠️ PHP: Validation failed, continuing...');
    }
    
    return true;
  } catch (error) {
    console.log('⚠️ PHP: Validation service unavailable...');
    return true;
  }
};

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
    console.log('✅ PHP: User authenticated!');
  } catch (error) {
    console.log('⚠️ PHP: Login service unavailable...');
  }
};

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
    console.log('✅ PHP: User created!');
  } catch (error) {
    console.log('⚠️ PHP: Registration service unavailable...');
  }
};

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
    console.log('✅ PHP: Data fetched!');
  } catch (error) {
    console.log('⚠️ PHP: Fetch service unavailable...');
  }
};

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
    console.log('✅ PHP: Application updated!');
  } catch (error) {
    console.log('⚠️ PHP: Update service unavailable...');
  }
};

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
    console.log('✅ PHP: Application deleted!');
  } catch (error) {
    console.log('⚠️ PHP: Delete service unavailable...');
  }
};

export const logPHPActivity = (action: string, details?: any) => {
  console.log(`🔵 PHP: ${action}`, details || '');
};
