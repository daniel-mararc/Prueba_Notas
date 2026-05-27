<?php
session_start();

$id_usu = $_SESSION['id_usu'];

require_once 'db_config.php';

$datos = json_decode(file_get_contents("php://input"), true);
$tema = $datos['tema'];

{
    $commit = "update usuarios set tema = '$tema' where id = $id_usu;";
    $mysqli->query($commit);
}
?>