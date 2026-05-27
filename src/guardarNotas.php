<?php
session_start();

$id_usu = (int)$_SESSION['id_usu'];

require_once 'db_config.php';

$datos = json_decode(file_get_contents("php://input"), true);
$id = $datos['id'];
$titulo = $datos['titulo'];
$desc = $datos['desc'];
$fav = $datos['fav'] ? 1 : 0;

{
    $commit = "insert into notas (id, id_usu, titulo, descripcion, favorita) values ('$id', $id_usu, '$titulo', '$desc', $fav);";
    $mysqli->query($commit);
}
?>