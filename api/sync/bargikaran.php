<?php
header("Content-Type: application/json; charset=UTF-8");

// Database connection
$host = "localhost";
$user = "root";
$password = "";
$dbname = "bargikaran";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    echo json_encode(['status' => false, 'message' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

// Read JSON POST
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

if (!isset($input['data'])) {
    echo json_encode(['status' => false, 'message' => 'No data received']);
    exit;
}

$data = $input['data'];
$users = $data['users'] ?? [];
$details = $data['details'] ?? [];

try {
    // ----------------------------
    // Sync Users
    // ----------------------------
    if (count($users) > 0) {
        $userStmt = $pdo->prepare("
            INSERT INTO brg_users 
            (id, mobileno, nepali_name, email, password, role, login_cnt, device_token, created_at, updated_by_user_id, updated_at, expire_at)
            VALUES
            (:id, :mobileno, :nepali_name, :email, :password, :role, :login_cnt, :device_token, :created_at, :updated_by_user_id, :updated_at, :expire_at)
            ON DUPLICATE KEY UPDATE
                mobileno = VALUES(mobileno),
                nepali_name = VALUES(nepali_name),
                email = VALUES(email),
                password = VALUES(password),
                role = VALUES(role),
                login_cnt = VALUES(login_cnt),
                device_token = VALUES(device_token),
                updated_by_user_id = VALUES(updated_by_user_id),
                updated_at = VALUES(updated_at),
                expire_at = VALUES(expire_at)
        ");

        foreach ($users as $u) {
            $userStmt->execute([
                ':id' => $u['id'] ?? null,
                ':mobileno' => $u['mobileno'] ?? '',
                ':nepali_name' => $u['nepali_name'] ?? '',
                ':email' => $u['email'] ?? '',
                ':password' => $u['password'] ?? '',
                ':role' => $u['role'] ?? 2,
                ':login_cnt' => $u['login_cnt'] ?? 0,
                ':device_token' => $u['device_token'] ?? '',
                ':created_at' => $u['created_at'] ?? null,
                ':updated_by_user_id' => $u['updated_by_user_id'] ?? null,
                ':updated_at' => $u['updated_at'] ?? null,
                ':expire_at' => $u['expire_at'] ?? null
            ]);
        }
    }

    // ----------------------------
    // Sync Details
    // ----------------------------
    if (count($details) > 0) {
        $detailsStmt = $pdo->prepare("
            INSERT INTO brg_details 
            (id, office_id, office_name, napa_id, napa_name, gabisa_id, gabisa_name, ward_no, sheet_no, kitta_no, area, bargikaran, remarks, sno, created_at, created_by_user_id, updated_at, updated_by_user_id)
            VALUES
            (:id, :office_id, :office_name, :napa_id, :napa_name, :gabisa_id, :gabisa_name, :ward_no, :sheet_no, :kitta_no, :area, :bargikaran, :remarks, :sno, :created_at, :created_by_user_id, :updated_at, :updated_by_user_id)
            ON DUPLICATE KEY UPDATE
                office_id = VALUES(office_id),
                office_name = VALUES(office_name),
                napa_id = VALUES(napa_id),
                napa_name = VALUES(napa_name),
                gabisa_id = VALUES(gabisa_id),
                gabisa_name = VALUES(gabisa_name),
                ward_no = VALUES(ward_no),
                sheet_no = VALUES(sheet_no),
                kitta_no = VALUES(kitta_no),
                area = VALUES(area),
                bargikaran = VALUES(bargikaran),
                remarks = VALUES(remarks),
                sno = VALUES(sno),
                updated_at = VALUES(updated_at),
                updated_by_user_id = VALUES(updated_by_user_id)
        ");

        foreach ($details as $d) {
            $detailsStmt->execute([
                ':id' => $d['id'] ?? null,
                ':office_id' => $d['office_id'] ?? null,
                ':office_name' => $d['office_name'] ?? '',
                ':napa_id' => $d['napa_id'] ?? null,
                ':napa_name' => $d['napa_name'] ?? '',
                ':gabisa_id' => $d['gabisa_id'] ?? null,
                ':gabisa_name' => $d['gabisa_name'] ?? '',
                ':ward_no' => $d['ward_no'] ?? null,
                ':sheet_no' => $d['sheet_no'] ?? '',
                ':kitta_no' => $d['kitta_no'] ?? null,
                ':area' => $d['area'] ?? '',
                ':bargikaran' => $d['bargikaran'] ?? '',
                ':remarks' => $d['remarks'] ?? '',
                ':sno' => $d['sno'] ?? null,
                ':created_at' => $d['created_at'] ?? null,
                ':created_by_user_id' => $d['created_by_user_id'] ?? 1,
                ':updated_at' => $d['updated_at'] ?? null,
                ':updated_by_user_id' => $d['updated_by_user_id'] ?? 1
            ]);
        }
    }

    echo json_encode(['status' => true, 'message' => 'Sync completed successfully']);
} catch (PDOException $e) {
    echo json_encode(['status' => false, 'message' => $e->getMessage()]);
}
