<?php
session_start();

$id_usu = $_SESSION['id_usu'];

$mysqli = new mysqli("localhost", "root", "root", "notas");

$datos = json_decode(file_get_contents("php://input"), true);
$id_carpeta = $datos['id'];

$arrNotasCarpeta = array();

if ($mysqli->connect_errno) {
    echo "Fallo al conectar a MySQL";
} else {
  $consulta = "
    select n.id, n.titulo, n.descripcion, n.favorita
    from notas n
    inner join notas_carpetas nc on n.id = nc.id_nota
    where n.id_usu = $id_usu
    and nc.id_carpeta = '$id_carpeta'
    ";

  if ($mysqli -> query($consulta) != null) {
    $resultado = $mysqli -> query($consulta);
    while ($fila = $resultado -> fetch_array()) {
      array_push($arrNotasCarpeta, [$fila['id'],$fila['titulo'],$fila['descripcion'], $fila['favorita']]);
    }
  }
 
  echo json_encode($arrNotasCarpeta);
}
?>