<?php
// Indicamos que la respuesta siempre será un JSON limpio
header('Content-Type: application/json');

session_start();

// Control de sesión por seguridad
if (!isset($_SESSION['id_usu'])) {
    http_response_code(401);
    echo json_encode(["ok" => false, "msg" => "Sesión no iniciada."]);
    exit;
}

$id_usu = (int)$_SESSION['id_usu'];

// Conexión con la base de datos
$mysqli = new mysqli("localhost", "root", "root", "notas");

if ($mysqli->connect_errno) {
    http_response_code(500);
    echo json_encode(["ok" => false, "msg" => "Fallo al conectar a MySQL: " . $mysqli->connect_error]);
    exit;
}

// Leer datos del JSON de entrada de forma segura
$datos = json_decode(file_get_contents("php://input"), true);
$id = $datos['id'] ?? '';
$titulo = $datos['titulo'] ?? '';
$desc = $datos['desc'] ?? '';
$fav = (isset($datos['fav']) && $datos['fav']) ? 1 : 0;

if (empty($id) || empty($titulo)) {
    echo json_encode(["ok" => false, "msg" => "El ID y el título son obligatorios."]);
    exit;
}

// Usamos una consulta preparada para evitar errores por comillas o caracteres especiales
$stmt = $mysqli->prepare("INSERT INTO notas (id, id_usu, titulo, descripcion, favorita) VALUES (?, ?, ?, ?, ?)");

if ($stmt) {
    // "sissi" significa: string (id), integer (id_usu), string (titulo), string (desc), integer (fav)
    $stmt->bind_param("sissi", $id, $id_usu, $titulo, $desc, $fav);
    
    if ($stmt->execute()) {
        echo json_encode(["ok" => true, "msg" => "Nota creada correctamente."]);
    } else {
        echo json_encode(["ok" => false, "msg" => "Error al guardar la nota: " . $stmt->error]);
    }
    $stmt->close();
} else {
    echo json_encode(["ok" => false, "msg" => "Error en la estructura de la base de datos."]);
}

$mysqli->close();
?>