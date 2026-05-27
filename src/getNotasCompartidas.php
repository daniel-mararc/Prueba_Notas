<?php
session_start();

$id_usu = $_SESSION['id_usu'];

require_once 'db_config.php';

$arrNotasCarpeta = array();

{
  $consulta = "
    select 
        n.id,
        n.titulo,
        n.descripcion,
        n.favorita,
        u.email as compartido_por
    from notas_compartidas nc
    inner join notas n ON n.id = nc.id_nota
    inner join usuarios u ON u.id = nc.id_usu
    where nc.id_comp = '$id_usu'
    ";

  if ($mysqli -> query($consulta) != null) {
    $resultado = $mysqli -> query($consulta);
    while ($fila = $resultado -> fetch_array()) {
      array_push($arrNotasCarpeta, [$fila['id'],$fila['titulo'],$fila['descripcion'], $fila['favorita'], $fila['compartido_por']]);
    }
  }
 
  echo json_encode($arrNotasCarpeta);
}
?>