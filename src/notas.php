<?php
session_start();

$id_usu = $_SESSION['id_usu'];

$mysqli = new mysqli("localhost", "root", "root", "notas");

$arrNotas = array();
$arrTema = array();
$arrCarpetas = array();

if ($mysqli->connect_errno) {
    echo "Fallo al conectar a MySQL";
} else {
  $consulta = "select * from notas where id_usu = $id_usu";
  if ($mysqli -> query($consulta) != null) {
    $resultado = $mysqli -> query($consulta);
    while ($fila = $resultado -> fetch_array()) {
      array_push($arrNotas, [$fila['id'],$fila['titulo'],$fila['descripcion'], $fila['favorita']]);
    }
  }

  $consulta = "select tema from usuarios where id = $id_usu";
    if ($mysqli -> query($consulta) != null) {
        $resultado = $mysqli -> query($consulta);
        while ($fila = $resultado -> fetch_array()) {
            array_push($arrTema, $fila['tema']);
        }
  }

  $consulta = "select id, nombre from carpetas where id_usu = $id_usu";
    if ($mysqli -> query($consulta) != null) {
        $resultado = $mysqli -> query($consulta);
        while ($fila = $resultado -> fetch_array()) {
            array_push($arrCarpetas, [$fila['id'], $fila['nombre']]);
        }
  }
}
?>

<script>
  const phpNotas = <?= json_encode($arrNotas)?>;
  const phpTema = <?= json_encode($arrTema)?>;
  const phpCarpetas = <?= json_encode($arrCarpetas)?>;
</script> 

<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Notas</title>
    <link rel="stylesheet" href="./styles/style_notas.css"/>
  <body>
    <div class="menuLateral">
      <h2>📂 Mis Notas</h2>

      <a href="#" id="inicio">🏠 Inicio</a>
      <a href="#" id="favoritas">✨ Favoritas</a>
      <a href="#" id="configuracion">⚙️ Configuracion</a>
      <a href="./index.html">🚪 Cerrar Sesion</a>

      <div class="contenedorCarpetas"></div>

      <button id="crearCarpeta">+ Nueva Carpeta</button>
    </div>
    
    <h2 class="titulo"></h2>
    <span class="boton">+</span>
    <div class="contenedorNotas"></div>
  </body>
  <script src="scripts_notas.js"></script>
</html>