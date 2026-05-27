<?php
session_start();

$id_usu = $_SESSION['id_usu'];

require_once 'db_config.php';

$arrNotas = array();

{
  $consulta = "select * from notas where id_usu = $id_usu";
  if ($mysqli -> query($consulta) != null) {
    $resultado = $mysqli -> query($consulta);
    while ($fila = $resultado -> fetch_array()) {
      array_push($arrNotas, [$fila['id'],$fila['titulo'],$fila['descripcion'], $fila['favorita']]);
    }
  }

  echo json_encode($arrNotas);
}
?>