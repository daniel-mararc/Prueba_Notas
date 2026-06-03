<?php
// Indicamos que la respuesta siempre será un JSON limpio
header('Content-Type: application/json');

session_start();

// Control de sesión obligatorio para evitar colapsos
if (!isset($_SESSION['id_usu']) || empty($_SESSION['id_usu'])) {
    http_response_code(401);
    echo json_encode(["ok" => false, "msg" => "Sesión no iniciada o expirada."]);
    exit;
}

$id_usu = (int)$_SESSION['id_usu']; // Forzamos a entero por seguridad

// Conexión con la base de datos
$mysqli = new mysqli("localhost", "root", "root", "notas");

if ($mysqli->connect_errno) {
    http_response_code(500);
    echo json_encode(["ok" => false, "msg" => "Error de conexión a la base de datos."]);
    exit;
}

// Leer y validar los datos que llegan del frontend
$datos = json_decode(file_get_contents("php://input"), true);
$id_nota = $datos["id_nota"] ?? '';
$usuarios = $datos["usuarios"] ?? []; // Si no llega nada, se inicializa como array vacío

if (empty($id_nota)) {
    http_response_code(400); // Bad Request
    echo json_encode(["ok" => false, "msg" => "ID de nota no proporcionado."]);
    exit;
}

// Borrar de forma segura las relaciones anteriores de esta nota para este usuario
$stmt_delete = $mysqli->prepare("DELETE FROM notas_compartidas WHERE id_nota = ? AND id_usu = ?");
if ($stmt_delete) {
    $stmt_delete->bind_param("si", $id_nota, $id_usu); 
    $stmt_delete->execute();
    $stmt_delete->close();
} else {
    http_response_code(500);
    echo json_encode(["ok" => false, "msg" => "Error al limpiar compartidos anteriores: " . $mysqli->error]);
    exit;
}

// Guardar las nuevas notas compartidas de forma eficiente
if (!empty($usuarios) && is_array($usuarios)) {
    // Preparamos la consulta una sola vez fuera del bucle para optimizar rendimiento
    $stmt_insert = $mysqli->prepare("INSERT INTO notas_compartidas (id_usu, id_nota, id_comp) VALUES (?, ?, ?)");
    
    if ($stmt_insert) {
        foreach ($usuarios as $id_comp) {
            if (!empty($id_comp)) {
                $stmt_insert->bind_param("isi", $id_usu, $id_nota, $id_comp);
                $stmt_insert->execute();
            }
        }
        $stmt_insert->close();
    } else {
        http_response_code(500);
        echo json_encode(["ok" => false, "msg" => "Error al preparar la asignación: " . $mysqli->error]);
        exit;
    }
}

// Devolver si funciona la frontend
echo json_encode([
    "ok" => true,
    "msg" => "Permisos de compartido actualizados correctamente."
]);

$mysqli->close();
?>