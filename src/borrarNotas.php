<?php

$mysqli = new mysqli("localhost", "root", "root", "notas");

$datos = json_decode(file_get_contents("php://input"), true);
$id = $datos['id'];

if ($mysqli->connect_errno) {
    echo "Fallo al conectar a MySQL";
} else {
    $commit = "delete from nota where id = $id;";
    $mysqli->query($commit);

}
?>