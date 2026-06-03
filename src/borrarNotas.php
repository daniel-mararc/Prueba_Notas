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

if (empty($id)) {
    http_response_code(400); // Bad Request
    echo json_encode(["ok" => false, "msg" => "El ID de la nota es obligatorio."]);
    exit;
}

// Consulta preparada para evitar inyecciones SQL y asegurar la eliminación
$stmt = $mysqli->prepare("DELETE FROM notas WHERE id = ? AND id_usu = ?");

if ($stmt) {
    // "si" significa: string (id), integer (id_usu)
    $stmt->bind_param("si", $id, $id_usu);
    
    if ($stmt->execute()) {
        // Verificamos si realmente se eliminó alguna fila (por si el ID no existía o no pertenecía al usuario)
        if ($mysqli->affected_rows > 0) {
            echo json_encode(["ok" => true, "msg" => "Nota eliminada correctamente."]);
        } else {
            echo json_encode(["ok" => false, "msg" => "No se encontró la nota o no tienes permiso para eliminarla."]);
        }
    } else {
        echo json_encode(["ok" => false, "msg" => "Error al eliminar la nota: " . $stmt->error]);
    }
    $stmt->close();
} else {
    echo json_encode(["ok" => false, "msg" => "Error en la estructura de la base de datos."]);
}

$mysqli->close();
?>