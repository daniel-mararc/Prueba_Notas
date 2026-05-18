<?php
session_start();

$id_usu = $_SESSION['id_usu'];

$mysqli = new mysqli("localhost", "root", "root", "notas");

$datos = json_decode(file_get_contents("php://input"), true);
$id_nota = $datos['id_nota'];

$arrCarpetaNotas = array();

if ($mysqli->connect_errno) {
    echo "Fallo al conectar a MySQL";
} else {
  $consulta = "SELECT id_carpeta FROM notas_carpetas WHERE id_nota = '$id_nota'";

  $resultado = $mysqli->query($consulta);

    while ($fila = $resultado->fetch_assoc()) {
        $arrCarpetaNotas[] = $fila['id_carpeta'];
    }

echo json_encode($arrCarpetaNotas);
}
?>