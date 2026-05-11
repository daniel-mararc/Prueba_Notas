<?php
session_start();

$id_usu = (int)$_SESSION['id_usu'];

$mysqli = new mysqli("localhost", "root", "root", "notas");

$datos = json_decode(file_get_contents("php://input"), true);
$id = $datos['id'];
$nombre = $datos['nombre'];

if ($mysqli->connect_errno) {
    echo json_encode("Fallo al conectar a MySQL");
} else {
    $commit = "insert into carpetas (id ,id_usu, nombre) values ('$id', $id_usu, '$nombre');";
    $mysqli->query($commit);
    echo json_encode($mysqli->error);
}
?>