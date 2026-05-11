<?php
session_start();

$id_usu = $_SESSION['id_usu'];

$mysqli = new mysqli("localhost", "root", "root", "notas");

$arrFavoritas = array();

if ($mysqli->connect_errno) {
    echo "Fallo al conectar a MySQL";
} else {
  $consulta = "select * from notas where id_usu = $id_usu and favorita = 1";
  if ($mysqli -> query($consulta) != null) {
    $resultado = $mysqli -> query($consulta);
    while ($fila = $resultado -> fetch_array()) {
      array_push($arrFavoritas, [$fila['id'],$fila['titulo'],$fila['descripcion'], $fila['favorita']]);
    }
  }

  echo json_encode($arrFavoritas);
}
?>