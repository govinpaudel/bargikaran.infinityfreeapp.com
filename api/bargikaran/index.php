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
        case "":
            apiHelp();
            break;
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
        case "getdatabydate":
            getDataByDateHandler($pathParts[1] ?? null);
            break;
        default:
            notFound();
    }
} elseif ($method === "POST") {
    switch ($pathParts[0] ?? "") {
        case "login":
            loginHandler();
            break;
        case "saverecords":
            saveRecordsHandler();
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

function getAllOfficesHandler() {
    $pdo = getRemotePDO();
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
    $pdo = getRemotePDO();
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
    $pdo = getRemotePDO();
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
    $pdo = getRemotePDO();
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
    $pdo = getRemotePDO();
    if (!$pdo) return dbUnavailable("Remote");
    if (!$office_id || !$napa_id || !$gabisa_id || !$ward_no || !$kitta_no) return invalidInput("All required parameters");

    try {
        $stmt = $pdo->prepare("SELECT * FROM bargikaran WHERE office_id = ? AND napa_id=? AND gabisa_id=? AND ward_no=? AND kitta_no=? ORDER BY created_at, updated_at DESC");
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

function getDataByDateHandler($date) {
    // $pdo = getRemotePDO();
    $pdoLocal = getLocalPDO();
    if (!$pdo) return dbUnavailable("Remote");
    if (!$date) return invalidInput("date");

    try {
        $stmt = $pdo->prepare("
            SELECT * FROM bargikaran
            WHERE DATE(created_at) >= ? OR DATE(updated_at) >= ?
            ORDER BY created_at DESC
        ");
        $stmt->execute([$date, $date]);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(["status"=>true,"message"=>"रेकर्ड सफलतापूर्वक प्राप्त भयो ।","data"=>$results]);
    } catch (PDOException $e) {
        respondDbError($e);
    }
}

function saveRecordsHandler() {
    $pdo = getRemotePDO();
    if (!$pdo) return dbUnavailable("Remote");
    $inputJSON = file_get_contents('php://input');
    $records = json_decode($inputJSON, true);

    if (!is_array($records)) {
        http_response_code(400);
        echo json_encode(["status"=>false,"message"=>"Invalid input data"]);
        exit();
    }

    $successCount = 0;
    $failedCount = 0;

    foreach ($records as $record) {
        try {
            if (!empty($record['id'])) {
                $stmt = $pdo->prepare("SELECT COUNT(*) as cnt FROM bargikaran WHERE id=?");
                $stmt->execute([$record['id']]);
                $exists = $stmt->fetch(PDO::FETCH_ASSOC)['cnt'] > 0;

                if ($exists) {
                    $updateStmt = $pdo->prepare("
    UPDATE bargikaran SET
        bargikaran = :bargikaran,
        remarks = :remarks,
        updated_at = :updated_at,
        updated_by_user_id = :updated_by_user_id
    WHERE id = :id
");

$updateStmt->execute([
    ':bargikaran' => $record['bargikaran'],
    ':remarks' => $record['remarks'],
    ':updated_at' => $record['updated_at'], // e.g., date('Y-m-d H:i:s')
    ':updated_by_user_id' => $record['updated_by_user_id'],
    ':id' => $record['id']
]);
                } else {
                    $insertStmt = $pdo->prepare("
                        INSERT INTO bargikaran (
                            id, office_id, office_name, napa_id, napa_name, gabisa_id, gabisa_name,
                            ward_no, sheet_no, kitta_no, area, bargikaran, remarks, sno,
                            created_at, created_by_user_id, updated_at, updated_by_user_id
                        ) VALUES (
                            :id, :office_id, :office_name, :napa_id, :napa_name, :gabisa_id, :gabisa_name,
                            :ward_no, :sheet_no, :kitta_no, :area, :bargikaran, :remarks, :sno,
                            :created_at, :created_by_user_id, :updated_at, :updated_by_user_id
                        )
                    ");
                    $insertStmt->execute($record);
                }
            } else {
                $insertStmt = $pdo->prepare("
                    INSERT INTO bargikaran (
                        office_id, office_name, napa_id, napa_name, gabisa_id, gabisa_name,
                        ward_no, sheet_no, kitta_no, area, bargikaran, remarks, sno,
                        created_at, created_by_user_id, updated_at, updated_by_user_id
                    ) VALUES (
                        :office_id, :office_name, :napa_id, :napa_name, :gabisa_id, :gabisa_name,
                        :ward_no, :sheet_no, :kitta_no, :area, :bargikaran, :remarks, :sno,
                        :created_at, :created_by_user_id, :updated_at, :updated_by_user_id
                    )
                ");
                $insertStmt->execute($record);
            }

            $successCount++;
        } catch (Exception $e) {
            $failedCount++;
            $failedRecords[] = [
                "record" => $record,
                "reason" => $e->getMessage()
            ];
        }
    }

    echo json_encode([
        "status" => true,
        "message" => "वर्गिकरण सफलतापुर्वक अपडेट भयो ।",
        "success_count" => $successCount,
        "failed_count" => $failedCount,
        "failed_records" => $failedRecords
    ]);
}

// -----------------------------
// Helper Responses
// -----------------------------
function apiHelp() {
    http_response_code(200);
    echo json_encode([
        "status" => true,
        "message" => "Available API endpoints",
        "routes" => [
            "/api/bargikaran/getalloffices" => "सबै कार्यालयको सूची",
            "/api/bargikaran/getnapasbyofficeid/{office_id}" => "पालिकाहरुको सुची कार्यालय अनुसार",
            "/api/bargikaran/getgabisasbynapaid/{office_id}/{napa_id}" => "गाविसहरुको सुची पालिका अनुसार",
            "/api/bargikaran/getwardsbygabisaid/{office_id}/{napa_id}/{gabisa_id}" => "वडाहरुको सुची गा.वि.स अनुसार",
            "/api/bargikaran/getdetailsbykittano/{office_id}/{napa_id}/{gabisa_id}/{ward_no}/{kitta_no}" => "कित्ता विवरण"
        ]
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

function notFound() { http_response_code(404); echo json_encode(["status"=>false,"message"=>"Not Found"]); exit(); }
function methodNotAllowed() { http_response_code(405); echo json_encode(["status"=>false,"message"=>"Method Not Allowed"]); exit(); }
function respondDbError($e) { http_response_code(500); echo json_encode(["status"=>false,"message"=>"Database Error","error"=>$e->getMessage()]); exit(); }
function dbUnavailable($type) { http_response_code(500); echo json_encode(["status"=>false,"message"=>"$type database not available"]); exit(); }
function invalidInput($field) { http_response_code(400); echo json_encode(["status"=>false,"message"=>"Invalid input: $field"]); exit(); }
?>
