<?php
// Declarar que este archivo responde estrictamente un JSON
header('Content-Type: application/json');

session_start();

// Control de sesión obligatorio para evitar Error 500 si el usuario no está logueado
if (!isset($_SESSION['id_usu']) || empty($_SESSION['id_usu'])) {
    http_response_code(401); // Estado HTTP: No autorizado
    echo json_encode(["error" => "Sesión no iniciada o expirada"]);
    exit;
}

$id_usu = $_SESSION['id_usu'];

// Conexión con la base de datos
$mysqli = new mysqli("localhost", "root", "root", "notas");

$arrNotas = array();

if ($mysqli->connect_errno) {
    http_response_code(500);
    echo json_encode(["error" => "Fallo al conectar a MySQL: " . $mysqli->connect_error]);
    exit;
}

// Consulta optimizada (evitamos duplicar el $mysqli->query)
$consulta = "SELECT id, titulo, descripcion, favorita FROM notas WHERE id_usu = $id_usu";
$resultado = $mysqli->query($consulta);

if ($resultado) {
    while ($fila = $resultado->fetch_assoc()) {
        // Guardamos los datos de cada nota
        array_push($arrNotas, [
            $fila['id'],
            $fila['titulo'],
            $fila['descripcion'],
            $fila['favorita']
        ]);
    }
    $resultado->free(); // Liberamos la memoria del resultado
}

// Imprimir el JSON final limpio
echo json_encode($arrNotas);

$mysqli->close();
?>