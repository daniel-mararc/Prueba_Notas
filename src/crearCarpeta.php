<?php
// Indicamos al navegador que la respuesta es estrictamente un JSON limpio
header('Content-Type: application/json');

session_start();

// Control de seguridad: Verificar que el usuario tenga sesión activa
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
$nombre = $datos['nombre'] ?? '';

if (empty($id) || empty($nombre)) {
    echo json_encode(["ok" => false, "msg" => "El ID y el nombre de la carpeta son obligatorios."]);
    exit;
}

// Consulta preparada para evitar errores por comillas o inyecciones SQL
$stmt = $mysqli->prepare("INSERT INTO carpetas (id, id_usu, nombre) VALUES (?, ?, ?)");

if ($stmt) {
    // "sis" significa: string (id), integer (id_usu), string (nombre)
    // Nota: Si tu 'id' de carpeta fuera autoincremental en la BD, se quitaría el primer "?"
    $stmt->bind_param("sis", $id, $id_usu, $nombre);
    
    if ($stmt->execute()) {
        echo json_encode(["ok" => true, "msg" => "Carpeta creada correctamente."]);
    } else {
        // Si hay un error (por ejemplo, ID duplicado), lo enviamos estructurado dentro del JSON
        echo json_encode(["ok" => false, "msg" => "Error al guardar la carpeta: " . $stmt->error]);
    }
    $stmt->close();
} else {
    echo json_encode(["ok" => false, "msg" => "Error en la estructura de la base de datos."]);
}

$mysqli->close();
?>