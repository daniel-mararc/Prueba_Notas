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

$id     = $datos['id'] ?? '';
$titulo = $datos['titulo'] ?? '';
$desc   = $datos['desc'] ?? '';
$fav    = !empty($datos['fav']) ? 1 : 0; // Casteo seguro a 1 o 0

if (empty($id) || empty($titulo)) {
    http_response_code(400); // Bad Request
    echo json_encode(["ok" => false, "msg" => "El ID y el título de la nota son obligatorios."]);
    exit;
}

// PASO 1: Verificar si el usuario es dueño de la nota o si se la han compartido
$sql_check = "SELECT n.id 
              FROM notas n 
              LEFT JOIN notas_compartidas nc ON n.id = nc.id_nota 
              WHERE n.id = ? AND (n.id_usu = ? OR nc.id_comp = ?)";

$stmt_check = $mysqli->prepare($sql_check);

if (!$stmt_check) {
    echo json_encode(["ok" => false, "msg" => "Error al preparar la verificación."]);
    exit;
}

$stmt_check->bind_param("sii", $id, $id_usu, $id_usu);
$stmt_check->execute();
$resultado_check = $stmt_check->get_result();

// Si no devuelve filas, significa que la nota no existe
if ($resultado_check->num_rows === 0) {
    echo json_encode(["ok" => false, "msg" => "No tienes permisos para editar esta nota o no existe."]);
    $stmt_check->close();
    exit;
}
$stmt_check->close();


// PASO 2: Si el control de seguridad pasó, hacemos el UPDATE de forma directa y limpia
$sql_update = "UPDATE notas SET titulo = ?, descripcion = ?, favorita = ? WHERE id = ?";
$stmt_update = $mysqli->prepare($sql_update);

if ($stmt_update) {
    // "ssis" significa: string (titulo), string (desc), integer (fav), string (id)
    $stmt_update->bind_param("ssis", $titulo, $desc, $fav, $id);
    
    if ($stmt_update->execute()) {
        // En un UPDATE, affected_rows puede ser 0 si mandas los mismos datos que ya tenía.
        // Mientras se ejecute con éxito, la operación es correcta.
        echo json_encode(["ok" => true, "msg" => "Nota actualizada correctamente."]);
    } else {
        echo json_encode(["ok" => false, "msg" => "Error al actualizar la nota: " . $stmt_update->error]);
    }
    $stmt_update->close();
} else {
    echo json_encode(["ok" => false, "msg" => "Error en la estructura de la base de datos al actualizar."]);
}

$mysqli->close();
?>