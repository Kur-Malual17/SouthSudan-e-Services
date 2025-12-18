<?php
/**
 * South Sudan Immigration Portal - PHP CRUD Operations
 * 
 * This demonstrates PHP handling CRUD operations:
 * - CREATE: Register new users
 * - READ: Fetch applications
 * - UPDATE: Update application status
 * - DELETE: Remove applications
 * 
 * NOTE: This is a demonstration file. Actual operations are handled by Django.
 */

// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get request method and data
$method = $_SERVER['REQUEST_METHOD'];
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Simulate database operations
switch ($method) {
    case 'POST':
        // CREATE - Register user or submit application
        if (isset($data['action']) && $data['action'] === 'register') {
            echo json_encode([
                'success' => true,
                'message' => 'User registered successfully via PHP',
                'user' => [
                    'id' => rand(1000, 9999),
                    'email' => $data['email'] ?? '',
                    'firstName' => $data['firstName'] ?? '',
                    'lastName' => $data['lastName'] ?? '',
                    'created_at' => date('Y-m-d H:i:s')
                ]
            ]);
        } elseif (isset($data['action']) && $data['action'] === 'login') {
            echo json_encode([
                'success' => true,
                'message' => 'Login successful via PHP',
                'user' => [
                    'id' => rand(1000, 9999),
                    'email' => $data['email'] ?? '',
                    'token' => bin2hex(random_bytes(32))
                ]
            ]);
        } else {
            echo json_encode([
                'success' => true,
                'message' => 'Application submitted via PHP',
                'application' => [
                    'id' => rand(1000, 9999),
                    'confirmation_number' => 'SS-IMM-' . time(),
                    'status' => 'pending',
                    'created_at' => date('Y-m-d H:i:s')
                ]
            ]);
        }
        break;
        
    case 'GET':
        // READ - Fetch applications
        echo json_encode([
            'success' => true,
            'message' => 'Applications fetched from PHP database',
            'applications' => [
                [
                    'id' => 1,
                    'confirmation_number' => 'SS-IMM-001',
                    'applicant_name' => 'John Doe',
                    'application_type' => 'e-Passport First-Time',
                    'status' => 'pending',
                    'created_at' => '2024-01-15 10:30:00'
                ],
                [
                    'id' => 2,
                    'confirmation_number' => 'SS-IMM-002',
                    'applicant_name' => 'Mary Smith',
                    'application_type' => 'National ID First-Time',
                    'status' => 'approved',
                    'created_at' => '2024-01-14 14:20:00'
                ],
                [
                    'id' => 3,
                    'confirmation_number' => 'SS-IMM-003',
                    'applicant_name' => 'Peter Johnson',
                    'application_type' => 'e-Passport Replacement',
                    'status' => 'in-progress',
                    'created_at' => '2024-01-13 09:15:00'
                ]
            ],
            'total' => 3
        ]);
        break;
        
    case 'PUT':
        // UPDATE - Update application status
        echo json_encode([
            'success' => true,
            'message' => 'Application updated via PHP',
            'application' => [
                'id' => $data['id'] ?? rand(1000, 9999),
                'status' => $data['status'] ?? 'updated',
                'updated_at' => date('Y-m-d H:i:s')
            ]
        ]);
        break;
        
    case 'DELETE':
        // DELETE - Remove application
        echo json_encode([
            'success' => true,
            'message' => 'Application deleted via PHP',
            'deleted_id' => $data['id'] ?? rand(1000, 9999)
        ]);
        break;
        
    default:
        http_response_code(405);
        echo json_encode([
            'success' => false,
            'error' => 'Method not allowed'
        ]);
        break;
}
?>
