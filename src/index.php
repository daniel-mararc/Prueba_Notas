<?php

$mysqli = new mysqli("localhost", "root", "root", "notas");

$mysqli->autocommit(false);

$arrFila = array();

if ($mysqli->connect_errno) {
    echo "Fallo al conectar a MySQL";
} else {
  $consulta = "select * from nota";
  if ($mysqli -> query($consulta) != null) {
    $resultado = $mysqli -> query($consulta);
    while ($fila = $resultado -> fetch_array()) {
      array_push($arrFila, [$fila['id'],$fila['titulo'],$fila['descripcion']]);
    }
    }
}
?>

<script>
  const php = <?= json_encode($arrFila)?>;
</script>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Notas</title>
    <link rel="stylesheet" href="style.css"/>
  <body>
    <span class="boton">+</span>
    <div class="contenedorNotas">
    </div>
  </body>
  <script src="scripts.js"></script>
</html>
