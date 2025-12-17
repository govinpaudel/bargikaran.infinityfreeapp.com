<?php
if (!headers_sent()) {
    header("Content-Type: application/json; charset=UTF-8");
    // header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
}

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "db_bargikaran.php";

// -----------------------------
// Parse the request
// -----------------------------
$basePath = "/api/bargikaran"; 
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = preg_replace("#^$basePath#", "", $path);
$path = rtrim($path, "/");
$path = ltrim(strtolower($path), "/");  
$pathParts = $path === "" ? [] : explode("/", $path);
$method = $_SERVER['REQUEST_METHOD'];

// -----------------------------
// Routing
// -----------------------------
if ($method === "GET") {
    switch ($pathParts[0] ?? "") {                
        case "getalloffices":
            getAllOfficesHandler();
            break;
        case "getnapasbyofficeid":
            getNapasByOfficeIdHandler($pathParts[1] ?? null);
            break;
        case "getgabisasbynapaid":
            getGabisasByNapaIdHandler($pathParts[1] ?? null, $pathParts[2] ?? null);
            break;
        case "getwardsbygabisaid":
            getWardsByGabisaIdHandler($pathParts[1] ?? null, $pathParts[2] ?? null, $pathParts[3] ?? null);
            break;
        case "getdetailsbykittano":
            getDetailsByKittaNoHandler(
                $pathParts[1] ?? null,
                $pathParts[2] ?? null,
                $pathParts[3] ?? null,
                $pathParts[4] ?? null,
                $pathParts[5] ?? null
            );
            break;
        case "listusers":
            listUsersHandler();
            break;

        default:
            notFound();
    }
} elseif ($method === "POST") {
    switch ($pathParts[0] ?? "") {
        case "signup":
            signupHandler();
            break;
        case "login":
            loginHandler();
            break;
        case "saverecords":
            saveRecordsHandler();
            break;
        case "downloadrecords":
            downloadRecordsHandler();
            break;
        case "updateuser":
            updateUserHandler();
            break;
        default:
            methodNotAllowed();
    }
} else {
    methodNotAllowed();
}

// -----------------------------
// Handlers
// -----------------------------
function updateUserHandler() {
    header("Content-Type: application/json");    
    $pdo = getPDO();
    if (!$pdo) return dbUnavailable("Remote");

    // Read JSON POST body
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, true);

    if (!$input || !isset($input['id'])) {
        echo json_encode([
            "status" => false,
            "message" => "Invalid or missing ID"
        ]);
        return;
    }

    // Extract fields
    $id             = $input['id'];
    $mobileno       = $input['mobileno'] ?? null;
    $nepali_name    = $input['nepali_name'] ?? null;
    $email          = $input['email'] ?? null;    
    $role           = $input['role'] ?? null;
    $login_cnt      = $input['login_cnt'] ?? null;
    $expire_at      = $input['expire_at'] ?? null;
    $updated_by     = $input['updated_by_user_id'] ?? null; 
    $updated_at     = date("Y-m-d H:i:s");

    try {
        // Build update SQL
        $sql = "UPDATE brg_users SET 
                    mobileno = :mobileno,
                    nepali_name = :nepali_name,
                    email = :email,                   
                    role = :role,
                    expire_at = :expire_at,
                    login_cnt =:login_cnt,
                    updated_by_user_id = :updated_by_user_id,
                    updated_at = :updated_at
                WHERE id = :id";

        $stmt = $pdo->prepare($sql);

        $status = $stmt->execute([
            ":mobileno"       => $mobileno,
            ":nepali_name"    => $nepali_name,
            ":email"          => $email,            
            ":role"           => $role,
            ":expire_at"      => $expire_at,
            ":login_cnt"      => $login_cnt,
            ":updated_by_user_id" => $updated_by,
            ":updated_at"     => $updated_at,
            ":id"             => $id
        ]);

        if ($status) {
            echo json_encode([
                "status" => true,
                "message" => "प्रयोगकर्ता सफलतापुर्वक अपडेट भयो ।"
            ]);
        } else {
            echo json_encode([
                "status" => false,
                "message" => "प्रयोगकर्ता अपडेट गर्न सकिएन"
            ]);
        }

    } catch (Exception $e) {
        echo json_encode([
            "status" => false,
            "error" => $e->getMessage()
        ]);
    }
}
function listUsersHandler(){
    header("Content-Type: application/json");    
    $pdo = getPDO();
    if (!$pdo) return dbUnavailable("Remote");
    $stmtUsers = $pdo->prepare("SELECT * FROM brg_users");
        $stmtUsers->execute();
        $users = $stmtUsers->fetchAll(PDO::FETCH_ASSOC);
        // Return both arrays
        echo json_encode([
            'status' => true,
            'users' => $users            
        ]);

}
function downloadRecordsHandler() {
    header("Content-Type: application/json");

    $pdo = getPDO();
    if (!$pdo) return dbUnavailable("Remote");

    // Read JSON POST
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, true);

    $date   = $input['date']   ?? '';
    $tables = $input['tables'] ?? [];

    if (!$date || empty($tables) || !is_array($tables)) {
        echo json_encode([
            'status'  => false,
            'message' => 'Date and tables are required'
        ]);
        return;
    }

    try {
        $responseData = [];

        foreach ($tables as $table) {

            // 🔐 strict sanitization (letters, numbers, underscore only)
            $table = str_replace(['`', ';', ' ', '-', '.', '/'], '', $table);

            if ($table === '') {
                continue;
            }

            $sql = "
                SELECT *
                FROM `$table`
                WHERE created_at >= :date
                   OR updated_at >= :date
            ";

            $stmt = $pdo->prepare($sql);
            $stmt->execute([':date' => $date]);

            $responseData[$table] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        echo json_encode([
            'status' => true,
            'data'   => $responseData
        ]);

    } catch (PDOException $e) {
        echo json_encode([
            'status'  => false,
            'message' => $e->getMessage()
        ]);
    }
}
function saveRecordsHandler() {
    header("Content-Type: application/json");
    $pdo = getPDO();
    if (!$pdo) return dbUnavailable("Remote");

    // Read JSON POST
    $inputJSON = file_get_contents('php://input');
    $records = json_decode($inputJSON, true);

    if (!$records) {
        echo json_encode(['status' => false, 'message' => 'No record received']);
        exit;
    }

    // Wrap single object in array for uniform processing
    if (!is_array($records) || isset($records['id'])) {
        $records = [$records];
    }

    $now = date('Y-m-d H:i:s');

    try {
        $savedIds = []; // To return inserted/updated IDs

        foreach ($records as $record) {
            $id          = isset($record['id']) ? $record['id'] : null;
            $office_id   = $record['office_id'] ?? '';
            $office_name = $record['office_name'] ?? '';
            $napa_id     = $record['napa_id'] ?? '';
            $napa_name   = $record['napa_name'] ?? '';
            $gabisa_id   = $record['gabisa_id'] ?? '';
            $gabisa_name = $record['gabisa_name'] ?? '';
            $ward_no     = $record['ward_no'] ?? '';
            $sheet_no    = $record['sheet_no'] ?? '';
            $kitta_no    = $record['kitta_no'] ?? '';
            $bargikaran  = $record['bargikaran'] ?? '';
            $remarks     = $record['remarks'] ?? '';
            $user        = $record['user'] ?? 0;

            if ($id) {
                // UPDATE existing record
                $stmt = $pdo->prepare("
                    UPDATE brg_details SET 
                        office_id = :office_id,
                        office_name = :office_name,
                        napa_id = :napa_id,
                        napa_name = :napa_name,
                        gabisa_id = :gabisa_id,
                        gabisa_name = :gabisa_name,
                        ward_no = :ward_no,
                        sheet_no = :sheet_no,
                        kitta_no = :kitta_no,
                        bargikaran = :bargikaran,
                        remarks = :remarks,
                        updated_by_user_id = :updated_by_user_id,
                        updated_at = :updated_at
                    WHERE id = :id
                ");
                $stmt->execute([
                    ':office_id'          => $office_id,
                    ':office_name'        => $office_name,
                    ':napa_id'            => $napa_id,
                    ':napa_name'          => $napa_name,
                    ':gabisa_id'          => $gabisa_id,
                    ':gabisa_name'        => $gabisa_name,
                    ':ward_no'            => $ward_no,
                    ':sheet_no'           => $sheet_no,
                    ':kitta_no'           => $kitta_no,
                    ':bargikaran'         => $bargikaran,
                    ':remarks'            => $remarks,
                    ':updated_by_user_id' => $user,
                    ':updated_at'         => $now,
                    ':id'                 => $id
                ]);
                $savedIds[] = $id;
            } else {
                // INSERT new record
                $stmt = $pdo->prepare("
                    INSERT INTO brg_details 
                        (office_id, office_name, napa_id, napa_name, gabisa_id, gabisa_name, ward_no, sheet_no, kitta_no, bargikaran, remarks, created_by_user_id, updated_by_user_id, created_at, updated_at)
                    VALUES
                        (:office_id, :office_name, :napa_id, :napa_name, :gabisa_id, :gabisa_name, :ward_no, :sheet_no, :kitta_no, :bargikaran, :remarks, :created_by_user_id, :updated_by_user_id, :created_at, :updated_at)
                ");
                $stmt->execute([
                    ':office_id'          => $office_id,
                    ':office_name'        => $office_name,
                    ':napa_id'            => $napa_id,
                    ':napa_name'          => $napa_name,
                    ':gabisa_id'          => $gabisa_id,
                    ':gabisa_name'        => $gabisa_name,
                    ':ward_no'            => $ward_no,
                    ':sheet_no'           => $sheet_no,
                    ':kitta_no'           => $kitta_no,
                    ':bargikaran'         => $bargikaran,
                    ':remarks'            => $remarks,
                    ':created_by_user_id' => $user,
                    ':updated_by_user_id' => $user,
                    ':created_at'         => $now,
                    ':updated_at'         => $now
                ]);
                $savedIds[] = $pdo->lastInsertId();
            }
        }

        echo json_encode([
            'status' => true,
            'message' => count($records) . ' वर्गिकरण सफलतापुर्वक सेभ भयो ।',
            'savedIds' => $savedIds
        ]);

    } catch (PDOException $e) {
        echo json_encode([
            'status' => false,
            'message' => $e->getMessage()
        ]);
    }
}
function signupHandler() {
    header("Content-Type: application/json");
    $pdo = getPDO();
    if (!$pdo) return dbUnavailable("Remote");

    // Read JSON POST
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, true);

    $mobile       = $input['mobile'] ?? '';
    $email        = $input['email'] ?? '';
    $nepali_name  = $input['nepali_name'] ?? '';
    $password     = $input['password'] ?? '';
    $deviceToken  = $input['device_token'] ?? '';

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Check if mobile already exists
    $checkStmt = $pdo->prepare("SELECT id FROM brg_users WHERE mobileno = ?");
    $checkStmt->execute([$mobile]);
    $existing = $checkStmt->fetch(PDO::FETCH_ASSOC);

    if ($existing) {
        echo json_encode([
            "success" => false,
            "message" => "यो नं पहिला नै दर्ता भई सकेको छ"
        ]);
        return;
    }

    // Set expire_at to yesterday
    $expire_at = date('Y-m-d', strtotime('-1 day'));

    // Insert new user
    $insertStmt = $pdo->prepare(
        "INSERT INTO brg_users (mobileno, email, nepali_name, password, device_token, expire_at) 
         VALUES (?, ?, ?, ?, ?, ?)"
    );

    $insertResult = $insertStmt->execute([$mobile, $email, $nepali_name, $hashedPassword, $deviceToken, $expire_at]);

    if ($insertResult) {
        echo json_encode([
            "success" => true,
            "message" => "सफलतापुर्वक दर्ता भयो ।"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Database insert failed"
        ]);
    }
}
function loginHandler() {
    header("Content-Type: application/json");

    $pdo = getPDO();
    if (!$pdo) return dbUnavailable("Remote");

    // Read JSON POST
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, true);

    // Accept 'mobileno' or 'username' as key
    $mobileno    = isset($input['mobileno']) ? $input['mobileno'] : (isset($input['username']) ? $input['username'] : '');
    $password    = isset($input['password']) ? $input['password'] : '';
    $device_token = isset($input['device_token']) ? $input['device_token'] : null;
    $last_login =   isset($input['last_login']) ? $input['last_login'] : null;

    // Validation
    if (!preg_match('/^9\d{9}$/', $mobileno)) {
        echo json_encode(["success" => false, "message" => "Invalid mobile number"]);
        return;
    }
    if (empty($password)) {
        echo json_encode(["success" => false, "message" => "Password is required"]);
        return;
    }

    try {
        // Fetch user by mobileno
        $stmt = $pdo->prepare("SELECT id, nepali_name, mobileno, email, password, role, expire_at, device_token, login_cnt FROM brg_users WHERE mobileno = ?");
        $stmt->execute([$mobileno]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user || !password_verify($password, $user['password'])) {
            echo json_encode(["success" => false, "message" => "प्रयोगकर्ता वा पासवर्ड मिलेन"]);
            return;
        }

        // Check if account is expired (allow login if expire_at is today or future)
        $today = new DateTime('today');
        $expireAt = new DateTime($user['expire_at']);
        if ($expireAt < $today) {
            echo json_encode(["success" => false, "message" => "प्रयोगकर्ताको नविकरण भएको छैन। कृपया 9846805409 मा सम्पर्क राख्नुहोला ।"]);
            return;
        }

        if($user['role'] != 1){
            // Device token check
            if ($user['login_cnt'] == 0) {
                // First login → save device_token and increment login_cnt
                if ($device_token) {
                    $update = $pdo->prepare("UPDATE brg_users SET device_token=?, login_cnt=1 WHERE id=?");
                    $update->execute([$device_token, $user['id']]);
                }
            } else {
                // Subsequent logins → must match device_token
                if (!$device_token || $user['device_token'] !== $device_token) {
                    echo json_encode(["success" => false, "message" => "यो प्रयोगकर्ता पहिले नै अर्को यन्त्रबाट प्रयोग गरिएको छ।"]);
                    return;
                }          
            }
        }

        // Login success
        echo json_encode([
            "success" => true,
            "message" => "सफलतापुर्वक लगईन भयो ।",
            "data" => [
                "id" => $user['id'],
                "nepali_name" => $user['nepali_name'],
                "mobileno" => $user['mobileno'],
                "email" => $user['email'],
                "role" => $user['role'],
                "expire_at" => $user['expire_at'],
                "last_login" => $last_login
            ]
        ]);

    } catch (PDOException $e) {
        respondDbError($e);
    }
}
function getAllOfficesHandler() {
    $pdo = getPDO();
    if (!$pdo) return dbUnavailable("Remote");    
    try {
        $stmt = $pdo->query("SELECT office_id, office_name FROM brg_ofc");
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $cntStmt = $pdo->prepare("SELECT cnt FROM brg_cnt WHERE id = 1");
        $cntStmt->execute();
        $cntResult = $cntStmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            "status" => true,
            "message" => "डाटा प्राप्त भयो",
            "data" => $results,
            "data1" => $cntResult['cnt'] ?? 0
        ], JSON_UNESCAPED_UNICODE);
    } catch (PDOException $e) {
        respondDbError($e);
    }
}
function getNapasByOfficeIdHandler($office_id) {
     $pdo = getPDO();
    if (!$pdo) return dbUnavailable("Remote");
    if (!$office_id) return invalidInput("office_id");

    try {
        $stmt = $pdo->prepare("SELECT napa_id, napa_name FROM brg_ofc_np WHERE office_id = ? ORDER BY napa_name");
        $stmt->execute([$office_id]);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(["status"=>true,"message"=>"डाटा प्राप्त भयो","data"=>$results], JSON_UNESCAPED_UNICODE);
    } catch (PDOException $e) {
        respondDbError($e);
    }
}
function getGabisasByNapaIdHandler($office_id, $napa_id) {
     $pdo = getPDO();
    if (!$pdo) return dbUnavailable("Remote");
    if (!$office_id || !$napa_id) return invalidInput("office_id or napa_id");

    try {
        $stmt = $pdo->prepare("SELECT gabisa_id, gabisa_name FROM brg_ofc_np_gb WHERE office_id = ? AND napa_id=? ORDER BY gabisa_name");
        $stmt->execute([$office_id, $napa_id]);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(["status"=>true,"message"=>"डाटा प्राप्त भयो","data"=>$results], JSON_UNESCAPED_UNICODE);
    } catch (PDOException $e) {
        respondDbError($e);
    }
}
function getWardsByGabisaIdHandler($office_id, $napa_id, $gabisa_id) {
     $pdo = getPDO();
    if (!$pdo) return dbUnavailable("Remote");
    if (!$office_id || !$napa_id || !$gabisa_id) return invalidInput("office_id, napa_id or gabisa_id");

    try {
        $stmt = $pdo->prepare("SELECT DISTINCT ward_no FROM brg_ofc_np_gb_wd WHERE office_id = ? AND napa_id=? AND gabisa_id=?");
        $stmt->execute([$office_id, $napa_id, $gabisa_id]);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(["status"=>true,"message"=>"डाटा प्राप्त भयो","data"=>$results], JSON_UNESCAPED_UNICODE);
    } catch (PDOException $e) {
        respondDbError($e);
    }
}
function getDetailsByKittaNoHandler($office_id, $napa_id, $gabisa_id, $ward_no, $kitta_no) {
    $pdo = getPDO();
    if (!$pdo) return dbUnavailable("Remote");
    if (!$office_id || !$napa_id || !$gabisa_id || !$ward_no || !$kitta_no) return invalidInput("All required parameters");

    try {
        $stmt = $pdo->prepare("SELECT * FROM brg_details WHERE office_id = ? AND napa_id=? AND gabisa_id=? AND ward_no=? AND kitta_no=? ORDER BY updated_at DESC");
        $stmt->execute([$office_id, $napa_id, $gabisa_id, $ward_no, $kitta_no]);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $pdo->query("UPDATE brg_cnt SET cnt = cnt + 1 WHERE id = 1");

        $cntStmt = $pdo->prepare("SELECT cnt FROM brg_cnt WHERE id = 1");
        $cntStmt->execute();
        $cntResult = $cntStmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            "status"=>true,
            "message"=>"डाटा प्राप्त भयो",
            "data"=>$results,
            "data1"=>$cntResult['cnt'] ?? 0
        ], JSON_UNESCAPED_UNICODE);
    } catch (PDOException $e) {
        respondDbError($e);
    }
}



function notFound() { http_response_code(404); echo json_encode(["status"=>false,"message"=>"Not Found"]); exit(); }
function methodNotAllowed() { http_response_code(405); echo json_encode(["status"=>false,"message"=>"Method Not Allowed"]); exit(); }
function respondDbError($e) { http_response_code(500); echo json_encode(["status"=>false,"message"=>"Database Error","error"=>$e->getMessage()]); exit(); }
function dbUnavailable($type) { http_response_code(500); echo json_encode(["status"=>false,"message"=>"$type database not available"]); exit(); }
function invalidInput($field) { http_response_code(400); echo json_encode(["status"=>false,"message"=>"Invalid input: $field"]); exit(); }
?>
