<?php

$mysqli = new mysqli("localhost", "root", "root", "notas");

$datos = json_decode(file_get_contents("php://input"), true);
$titulo = $datos['id'];

$arrFila = array();

if ($mysqli->connect_errno) {
    echo "Fallo al conectar a MySQL";
} else {
    $commit = "select * from nota where id = $id;";
    $mysqli->query($commit);
    while ($fila = $resultado -> fetch_array()) {
        array_push($arrFila, [$fila['id'],$fila['titulo'],$fila['descripcion']]);
    }
}

?>