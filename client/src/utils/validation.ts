// Validation utility functions for South Sudan Immigration Portal

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate email format
 * Must be a valid email address
 */
export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};

/**
 * Validate password strength
 * Requirements:
 * - Minimum 6 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one digit
 * - At least one special character
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters long' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one digit' };
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one special character (!@#$%^&*...)' };
  }
  
  return { isValid: true };
};

/**
 * Validate name (first name, last name, middle name)
 * Requirements:
 * - No special characters (only letters, spaces, hyphens, apostrophes)
 * - First letter must be capitalized
 * - Minimum 2 characters
 */
export const validateName = (name: string, fieldName: string = 'Name'): ValidationResult => {
  if (!name) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  if (name.length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters long` };
  }
  
  // Allow only letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[A-Za-z\s\-']+$/;
  if (!nameRegex.test(name)) {
    return { isValid: false, error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` };
  }
  
  // Check if first letter is capitalized
  if (!/^[A-Z]/.test(name)) {
    return { isValid: false, error: `${fieldName} must start with a capital letter` };
  }
  
  return { isValid: true };
};

/**
 * Auto-capitalize first letter of name
 */
export const capitalizeName = (name: string): string => {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(word => {
      if (!word) return '';
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
};

/**
 * Validate phone number
 * Basic validation for international format
 */
export const validatePhoneNumber = (phone: string): ValidationResult => {
  if (!phone) {
    return { isValid: false, error: 'Phone number is required' };
  }
  
  // Remove spaces and dashes for validation
  const cleanPhone = phone.replace(/[\s\-]/g, '');
  
  // Must be between 10-15 digits, can start with +
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  if (!phoneRegex.test(cleanPhone)) {
    return { isValid: false, error: 'Please enter a valid phone number (10-15 digits)' };
  }
  
  return { isValid: true };
};

/**
 * Validate username
 * Requirements:
 * - 3-30 characters
 * - Only letters, numbers, underscores, hyphens
 * - Must start with a letter
 */
export const validateUsername = (username: string): ValidationResult => {
  if (!username) {
    return { isValid: false, error: 'Username is required' };
  }
  
  if (username.length < 3 || username.length > 30) {
    return { isValid: false, error: 'Username must be between 3 and 30 characters' };
  }
  
  const usernameRegex = /^[A-Za-z][A-Za-z0-9_-]*$/;
  if (!usernameRegex.test(username)) {
    return { isValid: false, error: 'Username must start with a letter and contain only letters, numbers, underscores, or hyphens' };
  }
  
  return { isValid: true };
};

/**
 * Validate password confirmation
 */
export const validatePasswordConfirmation = (password: string, confirmPassword: string): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, error: 'Please confirm your password' };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }
  
  return { isValid: true };
};

/**
 * Get password strength level
 * Returns: weak, medium, strong
 */
export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  if (!password) return 'weak';
  
  let strength = 0;
  
  // Length
  if (password.length >= 6) strength++;
  if (password.length >= 10) strength++;
  
  // Character types
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;
  
  if (strength <= 2) return 'weak';
  if (strength <= 4) return 'medium';
  return 'strong';
};

/**
 * Validate all registration fields
 */
export const validateRegistrationForm = (data: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  const usernameValidation = validateUsername(data.username);
  if (!usernameValidation.isValid) {
    errors.username = usernameValidation.error!;
  }
  
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error!;
  }
  
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error!;
  }
  
  const confirmPasswordValidation = validatePasswordConfirmation(data.password, data.confirmPassword);
  if (!confirmPasswordValidation.isValid) {
    errors.confirmPassword = confirmPasswordValidation.error!;
  }
  
  const firstNameValidation = validateName(data.firstName, 'First name');
  if (!firstNameValidation.isValid) {
    errors.firstName = firstNameValidation.error!;
  }
  
  const lastNameValidation = validateName(data.lastName, 'Last name');
  if (!lastNameValidation.isValid) {
    errors.lastName = lastNameValidation.error!;
  }
  
  const phoneValidation = validatePhoneNumber(data.phoneNumber);
  if (!phoneValidation.isValid) {
    errors.phoneNumber = phoneValidation.error!;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
