<?php

$mysqli = new mysqli("localhost", "root", "root", "notas");

if ($mysqli->connect_errno) {
    echo "Fallo al conectar a MySQL";
} else {
  $consulta = "select * from nota";
  if ($mysqli -> query($consulta) != null) {
    $resultado = $mysqli -> query($consulta);
    $fila = $resultado -> fetch_array();
    }
}

$raw = file_get_contents("php://input");
$datos = json_decode($raw);

var_dump($datos);



?>

<script>
  const php = <?= json_encode($fila)?>;
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
    <div class="notas">
    </div>
  </body>
  <script src="scripts.js"></script>
</html>
