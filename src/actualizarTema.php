<?php
session_start();

$id_usu = $_SESSION['id_usu'];

$mysqli = new mysqli("localhost", "root", "root", "notas");

$datos = json_decode(file_get_contents("php://input"), true);
$tema = $datos['tema'];

if ($mysqli->connect_errno) {
    echo "Fallo al conectar a MySQL";
} else {
    $commit = "update usuarios set tema = '$tema' where id = $id_usu;";
    $mysqli->query($commit);
}
?>