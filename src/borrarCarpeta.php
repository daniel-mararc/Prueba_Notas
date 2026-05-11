<?php
session_start();

$id_usu = $_SESSION['id_usu'];

$mysqli = new mysqli("localhost", "root", "root", "notas");

$datos = json_decode(file_get_contents("php://input"), true);
$id = $datos['id'];

if ($mysqli->connect_errno) {
    echo "Fallo al conectar a MySQL";
} else {
    $commit = "delete from carpetas where id = '$id' and id_usu = $id_usu;";
    $mysqli->query($commit);
}
?>