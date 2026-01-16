<?php

$mysqli = new mysqli("localhost", "root", "root", "notas");

$datos = json_decode(file_get_contents("php://input"), true);
$titulo = $datos['titulo'];
$desc = $datos['desc'];



if ($mysqli->connect_errno) {
    echo "Fallo al conectar a MySQL";
} else {
    $commit = "insert into nota (titulo,descripcion) values ('$titulo', '$desc');";
    $mysqli->query($commit);
}



?>