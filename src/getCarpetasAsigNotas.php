<?php
// Indicamos al navegador que la respuesta es estrictamente un JSON limpio
header('Content-Type: application/json');

session_start();

// Control de seguridad: Verificar que el usuario esté logueado
if (!isset($_SESSION['id_usu']) || empty($_SESSION['id_usu'])) {
    http_response_code(401); // Estado HTTP: No autorizado
    echo json_encode(["error" => "Sesión no iniciada o expirada."]);
    exit;
}

// Conexión con la base de datos
$mysqli = new mysqli("localhost", "root", "root", "notas");

$arrCarpetaNotas = array();

if ($mysqli->connect_errno) {
    http_response_code(500);
    echo json_encode(["error" => "Fallo al conectar a MySQL: " . $mysqli->connect_error]);
    exit;
}

// Leer y validar de forma segura el JSON entrante
$datos = json_decode(file_get_contents("php://input"), true);
$id_nota = $datos['id_nota'] ?? '';

if (empty($id_nota)) {
    http_response_code(400); // Bad Request
    echo json_encode(["error" => "ID de nota no proporcionado."]);
    exit;
}

// Consulta con Prepared Statement
$consulta = "SELECT id_carpeta FROM notas_carpetas WHERE id_nota = ?";
$stmt = $mysqli->prepare($consulta);

if ($stmt) {
    $stmt->bind_param("s", $id_nota);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado) {
        while ($fila = $resultado->fetch_assoc()) {
            $arrCarpetaNotas[] = $fila['id_carpeta'];
        }
        $resultado->free(); 
    }
    $stmt->close();
} else {
    http_response_code(500);
    echo json_encode(["error" => "Error en la estructura de la base de datos: " . $mysqli->error]);
    exit;
}

// Devolver el array indexado puro hacia JavaScript
echo json_encode($arrCarpetaNotas);

$mysqli->close();
?>