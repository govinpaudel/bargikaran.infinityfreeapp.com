<?php
$pdo = null;
function getPDO() {
  global $pdo;
    if ($pdo) return $pdo; // return existing connection   

// $host     = "sql200.infinityfree.com";
// $user     = "if0_39882810";
// $password = "3ikCP6NTYHz";
// $dbname   = "if0_39882810_kitta";

$host = "localhost";
$user = "root";
$password = "";
$dbname = "bargikaran";

    try {
        $pdo = new PDO(
            "mysql:host=$host;dbname=$dbname;charset=utf8",
            $user,
            $password,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"
            ]
        );
    } catch (PDOException $e) {
        error_log("Remote DB connection failed: " . $e->getMessage());
        $pdo = null;
    }

    return $pdo;
}


?>
