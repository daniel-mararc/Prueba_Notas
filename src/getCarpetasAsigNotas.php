<?php
session_start();

$id_usu = $_SESSION['id_usu'];

require_once 'db_config.php';

$datos = json_decode(file_get_contents("php://input"), true);
$id_nota = $datos['id_nota'];

$arrCarpetaNotas = array();

{
  $consulta = "SELECT id_carpeta FROM notas_carpetas WHERE id_nota = '$id_nota'";

  $resultado = $mysqli->query($consulta);

    while ($fila = $resultado->fetch_assoc()) {
        $arrCarpetaNotas[] = $fila['id_carpeta'];
    }

echo json_encode($arrCarpetaNotas);
}
?>