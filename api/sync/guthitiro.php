<?php
header("Content-Type: application/json; charset=UTF-8");

// --------------------
// DB Connection
// --------------------
$host = "localhost";
$user = "root";
$password = "";
$dbname = "guthitiro";

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $user,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]
    );
} catch (PDOException $e) {
    echo json_encode([
        'status' => false,
        'message' => 'DB connection failed: ' . $e->getMessage()
    ]);
    exit;
}

// --------------------
// Read Input
// --------------------
$inputJSON = file_get_contents("php://input");
$input = json_decode($inputJSON, true);

if (!isset($input['data']) || !is_array($input['data'])) {
    echo json_encode([
        'status' => false,
        'message' => 'Invalid data payload'
    ]);
    exit;
}

$data = $input['data'];

try {
    $pdo->beginTransaction();

    foreach ($data as $tableName => $rows) {

        // Skip empty tables
        if (!is_array($rows) || count($rows) === 0) {
            continue;
        }

        // 🔐 sanitize table name
        $tableName = str_replace(['`', ';', ' ', '-', '.', '/'], '', $tableName);

        foreach ($rows as $row) {

            if (!isset($row['id'])) {
                continue; // id is mandatory
            }

            // --------------------
            // Build Dynamic Query
            // --------------------
            $columns = array_keys($row);

            $colList = implode(
                ", ",
                array_map(fn($c) => "`$c`", $columns)
            );

            $placeholders = implode(
                ", ",
                array_map(fn($c) => ":$c", $columns)
            );

            // update all except id
            $updateList = implode(
                ", ",
                array_map(
                    fn($c) => "`$c` = VALUES(`$c`)",
                    array_filter($columns, fn($c) => $c !== 'id')
                )
            );

            $sql = "
                INSERT INTO `$tableName` ($colList)
                VALUES ($placeholders)
                ON DUPLICATE KEY UPDATE $updateList
            ";

            $stmt = $pdo->prepare($sql);

            // Bind values
            foreach ($row as $key => $value) {
                $stmt->bindValue(":$key", $value);
            }

            $stmt->execute();
        }
    }

    $pdo->commit();

    echo json_encode([
        'status' => true,
        'message' => 'Data sync completed successfully'
    ]);

} catch (PDOException $e) {
    $pdo->rollBack();
    echo json_encode([
        'status' => false,
        'message' => $e->getMessage()
    ]);
}
