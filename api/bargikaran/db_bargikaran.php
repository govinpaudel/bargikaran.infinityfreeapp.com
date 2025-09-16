<?php
$pdo = null;
$pdoLocal = null;

/**
 * Get a connection to the remote database.
 * @return PDO|null
 */
function getRemotePDO() {
    global $pdo;
    if ($pdo) return $pdo; // return existing connection

    // $host = "sql104.infinityfree.com";
    // $user = "if0_39673703";
    // $password = "aAUd2BqwtIYK6O";
    // $dbname = "if0_39673703_bargikaran";

    $host = "10.7.33.8";
    $user = "govinda";
    $password = "Syangja@123$";
    $dbname = "moms";

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

/**
 * Get a connection to the local database.
 * @return PDO|null
 */
function getLocalPDO() {
    global $pdoLocal;
    if ($pdoLocal) return $pdoLocal; // return existing connection

    // $host = "10.7.33.8";
    // $user = "govinda";
    // $password = "Syangja@123$";
    // $dbname = "moms";

    // $host = "sql104.infinityfree.com";
    // $user = "if0_39673703";
    // $password = "aAUd2BqwtIYK6O";
    // $dbname = "if0_39673703_bargikaran";

    $host = "localhost";
    $user = "root";
    $password = "";
    $dbname = "lrims";


    try {
        $pdoLocal = new PDO(
            "mysql:host=$host;dbname=$dbname;charset=utf8",
            $user,
            $password,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"
            ]
        );
    } catch (PDOException $e) {
        error_log("Local DB connection failed: " . $e->getMessage());
        $pdoLocal = null;
    }

    return $pdoLocal;
}
?>
