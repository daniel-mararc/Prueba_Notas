<?php
session_start();

$id_usu = $_SESSION['id_usu'];

require_once 'db_config.php';

$datos = json_decode(file_get_contents("php://input"), true);
$id = $datos['id'];

{
    $commit = "delete from notas where id = '$id' and id_usu = $id_usu;";
    $mysqli->query($commit);
}
?>