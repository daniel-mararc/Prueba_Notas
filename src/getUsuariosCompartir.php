<?php
session_start();

$id_usu = $_SESSION['id_usu'];

require_once 'db_config.php';

$usuarios = [];

$consulta = "
SELECT id, email
FROM usuarios
WHERE id != '$id_usu'
";

$resultado = $mysqli->query($consulta);

if ($resultado) {
    while ($fila = $resultado->fetch_array()) {
        array_push($usuarios, [$fila['id'], $fila['email']]);
    }
}

echo json_encode($usuarios);
?>