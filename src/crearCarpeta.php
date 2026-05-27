<?php
session_start();

$id_usu = (int)$_SESSION['id_usu'];

require_once 'db_config.php';

$datos = json_decode(file_get_contents("php://input"), true);
$id = $datos['id'];
$nombre = $datos['nombre'];

{
    $commit = "insert into carpetas (id ,id_usu, nombre) values ('$id', $id_usu, '$nombre');";
    $mysqli->query($commit);
    echo json_encode($mysqli->error);
}
?>