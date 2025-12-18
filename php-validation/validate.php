<?php
/**
 * South Sudan Immigration Portal - PHP Validation API
 * 
 * This PHP script provides validation for:
 * - Email addresses
 * - Passwords (strength requirements)
 * - Names (first name, last name)
 * - Phone numbers
 * 
 * Usage: POST request with JSON data
 */

// Enable CORS for React frontend
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed. Use POST.']);
    exit();
}

// Get JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON data']);
    exit();
}

// Validation functions

/**
 * Validate email address
 * 
 * @param string $email Email to validate
 * @return array ['isValid' => bool, 'error' => string|null]
 */
function validateEmail($email) {
    if (empty($email)) {
        return ['isValid' => false, 'error' => 'Email is required'];
    }
    
    // Use PHP's built-in email validation
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return ['isValid' => false, 'error' => 'Please enter a valid email address'];
    }
    
    // Additional check for common typos
    if (!preg_match('/@.+\..+$/', $email)) {
        return ['isValid' => false, 'error' => 'Email must contain @ and a domain'];
    }
    
    return ['isValid' => true, 'error' => null];
}

/**
 * Validate password strength
 * 
 * Requirements:
 * - Minimum 6 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one digit
 * - At least one special character
 * 
 * @param string $password Password to validate
 * @return array ['isValid' => bool, 'error' => string|null, 'strength' => string]
 */
function validatePassword($password) {
    if (empty($password)) {
        return ['isValid' => false, 'error' => 'Password is required', 'strength' => 'weak'];
    }
    
    // Check minimum length
    if (strlen($password) < 6) {
        return ['isValid' => false, 'error' => 'Password must be at least 6 characters long', 'strength' => 'weak'];
    }
    
    // Check for uppercase letter
    if (!preg_match('/[A-Z]/', $password)) {
        return ['isValid' => false, 'error' => 'Password must contain at least one uppercase letter', 'strength' => 'weak'];
    }
    
    // Check for lowercase letter
    if (!preg_match('/[a-z]/', $password)) {
        return ['isValid' => false, 'error' => 'Password must contain at least one lowercase letter', 'strength' => 'weak'];
    }
    
    // Check for digit
    if (!preg_match('/[0-9]/', $password)) {
        return ['isValid' => false, 'error' => 'Password must contain at least one digit', 'strength' => 'medium'];
    }
    
    // Check for special character
    if (!preg_match('/[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]/', $password)) {
        return ['isValid' => false, 'error' => 'Password must contain at least one special character (!@#$%^&*...)', 'strength' => 'medium'];
    }
    
    // Calculate strength
    $strength = 'weak';
    $score = 0;
    
    if (strlen($password) >= 6) $score++;
    if (strlen($password) >= 10) $score++;
    if (preg_match('/[a-z]/', $password)) $score++;
    if (preg_match('/[A-Z]/', $password)) $score++;
    if (preg_match('/[0-9]/', $password)) $score++;
    if (preg_match('/[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]/', $password)) $score++;
    
    if ($score <= 2) {
        $strength = 'weak';
    } elseif ($score <= 4) {
        $strength = 'medium';
    } else {
        $strength = 'strong';
    }
    
    return ['isValid' => true, 'error' => null, 'strength' => $strength];
}

/**
 * Validate name (first name or last name)
 * 
 * Requirements:
 * - No special characters (only letters, spaces, hyphens, apostrophes)
 * - First letter must be capitalized
 * - Minimum 2 characters
 * 
 * @param string $name Name to validate
 * @param string $fieldName Field name for error messages
 * @return array ['isValid' => bool, 'error' => string|null, 'capitalized' => string]
 */
function validateName($name, $fieldName = 'Name') {
    if (empty($name)) {
        return ['isValid' => false, 'error' => "$fieldName is required", 'capitalized' => ''];
    }
    
    // Check minimum length
    if (strlen($name) < 2) {
        return ['isValid' => false, 'error' => "$fieldName must be at least 2 characters long", 'capitalized' => $name];
    }
    
    // Check for valid characters (only letters, spaces, hyphens, apostrophes)
    if (!preg_match('/^[A-Za-z\s\-\']+$/', $name)) {
        return ['isValid' => false, 'error' => "$fieldName can only contain letters, spaces, hyphens, and apostrophes", 'capitalized' => $name];
    }
    
    // Check if first letter is capitalized
    if (!preg_match('/^[A-Z]/', $name)) {
        return ['isValid' => false, 'error' => "$fieldName must start with a capital letter", 'capitalized' => ucwords(strtolower($name))];
    }
    
    // Auto-capitalize properly
    $capitalized = ucwords(strtolower($name));
    
    return ['isValid' => true, 'error' => null, 'capitalized' => $capitalized];
}

/**
 * Validate phone number
 * 
 * Requirements:
 * - 10-15 digits
 * - Can include country code (+)
 * - Can include spaces and dashes
 * 
 * @param string $phone Phone number to validate
 * @return array ['isValid' => bool, 'error' => string|null]
 */
function validatePhoneNumber($phone) {
    if (empty($phone)) {
        return ['isValid' => false, 'error' => 'Phone number is required'];
    }
    
    // Remove spaces and dashes for validation
    $cleanPhone = preg_replace('/[\s\-]/', '', $phone);
    
    // Check format: optional +, then 10-15 digits
    if (!preg_match('/^\+?[0-9]{10,15}$/', $cleanPhone)) {
        return ['isValid' => false, 'error' => 'Please enter a valid phone number (10-15 digits)'];
    }
    
    return ['isValid' => true, 'error' => null];
}

/**
 * Validate username
 * 
 * Requirements:
 * - 3-30 characters
 * - Only letters, numbers, underscores, hyphens
 * - Must start with a letter
 * 
 * @param string $username Username to validate
 * @return array ['isValid' => bool, 'error' => string|null]
 */
function validateUsername($username) {
    if (empty($username)) {
        return ['isValid' => false, 'error' => 'Username is required'];
    }
    
    if (strlen($username) < 3 || strlen($username) > 30) {
        return ['isValid' => false, 'error' => 'Username must be between 3 and 30 characters'];
    }
    
    if (!preg_match('/^[A-Za-z][A-Za-z0-9_-]*$/', $username)) {
        return ['isValid' => false, 'error' => 'Username must start with a letter and contain only letters, numbers, underscores, or hyphens'];
    }
    
    return ['isValid' => true, 'error' => null];
}

// Main validation logic
$response = [
    'success' => true,
    'errors' => [],
    'data' => []
];

// Determine what to validate based on input
$validationType = $data['type'] ?? 'all';

switch ($validationType) {
    case 'email':
        $result = validateEmail($data['value'] ?? '');
        $response['success'] = $result['isValid'];
        if (!$result['isValid']) {
            $response['errors']['email'] = $result['error'];
        }
        break;
        
    case 'password':
        $result = validatePassword($data['value'] ?? '');
        $response['success'] = $result['isValid'];
        $response['data']['strength'] = $result['strength'];
        if (!$result['isValid']) {
            $response['errors']['password'] = $result['error'];
        }
        break;
        
    case 'name':
        $fieldName = $data['fieldName'] ?? 'Name';
        $result = validateName($data['value'] ?? '', $fieldName);
        $response['success'] = $result['isValid'];
        $response['data']['capitalized'] = $result['capitalized'];
        if (!$result['isValid']) {
            $response['errors']['name'] = $result['error'];
        }
        break;
        
    case 'phone':
        $result = validatePhoneNumber($data['value'] ?? '');
        $response['success'] = $result['isValid'];
        if (!$result['isValid']) {
            $response['errors']['phone'] = $result['error'];
        }
        break;
        
    case 'username':
        $result = validateUsername($data['value'] ?? '');
        $response['success'] = $result['isValid'];
        if (!$result['isValid']) {
            $response['errors']['username'] = $result['error'];
        }
        break;
        
    case 'all':
    case 'registration':
        // Validate all registration fields
        $allValid = true;
        
        // Email
        if (isset($data['email'])) {
            $emailResult = validateEmail($data['email']);
            if (!$emailResult['isValid']) {
                $response['errors']['email'] = $emailResult['error'];
                $allValid = false;
            }
        }
        
        // Password
        if (isset($data['password'])) {
            $passwordResult = validatePassword($data['password']);
            $response['data']['passwordStrength'] = $passwordResult['strength'];
            if (!$passwordResult['isValid']) {
                $response['errors']['password'] = $passwordResult['error'];
                $allValid = false;
            }
        }
        
        // Confirm Password
        if (isset($data['password']) && isset($data['confirmPassword'])) {
            if ($data['password'] !== $data['confirmPassword']) {
                $response['errors']['confirmPassword'] = 'Passwords do not match';
                $allValid = false;
            }
        }
        
        // First Name
        if (isset($data['firstName'])) {
            $firstNameResult = validateName($data['firstName'], 'First name');
            $response['data']['firstName'] = $firstNameResult['capitalized'];
            if (!$firstNameResult['isValid']) {
                $response['errors']['firstName'] = $firstNameResult['error'];
                $allValid = false;
            }
        }
        
        // Last Name
        if (isset($data['lastName'])) {
            $lastNameResult = validateName($data['lastName'], 'Last name');
            $response['data']['lastName'] = $lastNameResult['capitalized'];
            if (!$lastNameResult['isValid']) {
                $response['errors']['lastName'] = $lastNameResult['error'];
                $allValid = false;
            }
        }
        
        // Phone Number
        if (isset($data['phoneNumber'])) {
            $phoneResult = validatePhoneNumber($data['phoneNumber']);
            if (!$phoneResult['isValid']) {
                $response['errors']['phoneNumber'] = $phoneResult['error'];
                $allValid = false;
            }
        }
        
        // Username (if provided)
        if (isset($data['username'])) {
            $usernameResult = validateUsername($data['username']);
            if (!$usernameResult['isValid']) {
                $response['errors']['username'] = $usernameResult['error'];
                $allValid = false;
            }
        }
        
        $response['success'] = $allValid;
        break;
        
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid validation type']);
        exit();
}

// Return response
http_response_code($response['success'] ? 200 : 400);
echo json_encode($response);
?>
