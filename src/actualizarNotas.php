<?php

$mysqli = new mysqli("localhost", "root", "root", "notas");

$datos = json_decode(file_get_contents("php://input"), true);
$titulo = $datos['titulo'];
$desc = $datos['desc'];
$id = $datos['id'];

if ($mysqli->connect_errno) {
    echo "Fallo al conectar a MySQL";
} else {
    $commit = "update nota set titulo = $titulo, descripcion = $desc where id = $id;";
    $mysqli->query($commit);
}
?>