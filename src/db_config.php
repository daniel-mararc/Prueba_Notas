<?php
$db_host = getenv('MYSQLHOST') ?: 'localhost';
$db_port = getenv('MYSQLPORT') ?: '3306';
$db_user = getenv('MYSQLUSER') ?: 'root';
$db_pass = getenv('MYSQLPASSWORD') ?: 'root';
$db_name = getenv('MYSQLDATABASE') ?: 'notas';

$mysqli = new mysqli($db_host, $db_user, $db_pass, $db_name, $db_port);

if ($mysqli->connect_errno) {
    echo json_encode(["ok" => false, "error" => "Database connection failed"]);
    exit;
}
?>
