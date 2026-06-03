<?php
session_start();

// Control estricto de sesión para evitar el Error 500 si no está logueado
if (!isset($_SESSION['id_usu']) || empty($_SESSION['id_usu'])) {
    // Si no hay sesión, redirige al login o detiene la ejecución de forma limpia
    header("Location: ./index.html");
    exit;
}

$id_usu = $_SESSION['id_usu'];

// Conexión con la base de datos
$mysqli = new mysqli("localhost", "root", "root", "notas");

$arrNotas = array();
$arrTema = array();
$arrCarpetas = array();
$nombreUsuario = "";

if ($mysqli->connect_errno) {
    die("Fallo al conectar a MySQL: " . $mysqli->connect_error);
} else {
    
    // --- CONSULTA 1: Notas ---
    $consultaNotas = "SELECT id, titulo, descripcion, favorita FROM notas WHERE id_usu = $id_usu";
    $resultadoNotas = $mysqli->query($consultaNotas);
    
    if ($resultadoNotas) {
        while ($fila = $resultadoNotas->fetch_assoc()) {
            array_push($arrNotas, [$fila['id'], $fila['titulo'], $fila['descripcion'], $fila['favorita']]);
        }
        $resultadoNotas->free(); 
    }

    // --- CONSULTA 2: Tema ---
    $consultaTema = "SELECT tema FROM usuarios WHERE id = $id_usu";
    $resultadoTema = $mysqli->query($consultaTema);
    
    if ($resultadoTema) {
        while ($fila = $resultadoTema->fetch_assoc()) {
            array_push($arrTema, $fila['tema']);
        }
        $resultadoTema->free();
    }

    // --- CONSULTA 3: Carpetas ---
    $consultaCarpetas = "SELECT id, nombre FROM carpetas WHERE id_usu = $id_usu";
    $resultadoCarpetas = $mysqli->query($consultaCarpetas);
    
    if ($resultadoCarpetas) {
        while ($fila = $resultadoCarpetas->fetch_assoc()) {
            array_push($arrCarpetas, [$fila['id'], $fila['nombre']]);
        }
        $resultadoCarpetas->free();
    }

    // --- CONSULTA 4: Datos del Usuario ---
    $consultaUsuario = "SELECT email FROM usuarios WHERE id = $id_usu";
    $resultadoUsuario = $mysqli->query($consultaUsuario);
    if ($resultadoUsuario) {
        if ($fila = $resultadoUsuario->fetch_assoc()) {
            $nombreUsuario = $fila['email'];
        }
        $resultadoUsuario->free();
    }
}
$mysqli->close();

// Cortamos el correo a partir del '@' de forma segura
$usuarioCortado = "Usuario";
if (!empty($nombreUsuario)) {
    $partes = explode('@', trim($nombreUsuario));
    $usuarioCortado = $partes[0];
}
?>

<script>
  // Inyección segura usando la sintaxis estándar de PHP
  const phpNotas = <?php echo json_encode($arrNotas, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT); ?>;
  const phpTema = <?php echo json_encode($arrTema, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT); ?>;
  const phpCarpetas = <?php echo json_encode($arrCarpetas, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT); ?>;
</script> 

<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Notas</title>
    <link rel="stylesheet" href="./styles/style_notas.css"/>
  </head> 
  <body>
    <div class="menuLateral">
      <div class="perfilUsuario">
        <span>👤 Hola, <strong><?php echo htmlspecialchars($usuarioCortado); ?></strong></span>
      </div>
      <hr>

      <h2>📂 Mis Notas</h2>

      <a href="#" id="inicio">🏠 Inicio</a>
      <a href="#" id="favoritas">✨ Favoritas</a>
      <a href="#" id="configuracion">⚙️ Configuracion</a>
      <a href="#" id="compartidos">👤 Compartidas</a>
      <a href="#" id="cerrarSesion">🚪 Cerrar Sesion</a>

      <div class="contenedorCarpetas"></div>

      <button id="crearCarpeta">+ Nueva Carpeta</button>
    </div>
    
    <h2 class="titulo"></h2>
    <span class="boton">+</span>
    <div class="contenedorNotas"></div>
  </body>
  <script src="scripts_notas.js"></script>
</html>