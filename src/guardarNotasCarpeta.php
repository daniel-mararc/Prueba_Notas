<?php
// Indicamos que la respuesta siempre será un JSON limpio
header('Content-Type: application/json');

session_start();

// Control de sesión por seguridad (opcional pero muy recomendado en producción)
if (!isset($_SESSION['id_usu'])) {
    http_response_code(401);
    echo json_encode(["ok" => false, "msg" => "Sesión no iniciada."]);
    exit;
}

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
$carpetas = $datos["carpetas"] ?? []; // Si no se seleccionó ninguna carpeta, llega un array vacío

if (empty($id_nota)) {
    http_response_code(400);
    echo json_encode(["ok" => false, "msg" => "ID de nota no proporcionado."]);
    exit;
}

// Borrar TODAS las carpetas actuales de esta nota de golpe
$stmt_delete = $mysqli->prepare("DELETE FROM notas_carpetas WHERE id_nota = ?");
if ($stmt_delete) {
    $stmt_delete->bind_param("s", $id_nota); 
    $stmt_delete->execute();
    $stmt_delete->close();
} else {
    http_response_code(500);
    echo json_encode(["ok" => false, "msg" => "Error al limpiar carpetas anteriores: " . $mysqli->error]);
    exit;
}

// Insertar las nuevas carpetas seleccionadas
if (!empty($carpetas) && is_array($carpetas)) {
    // Preparamos la consulta UNA SOLA VEZ fuera del foreach para optimizar rendimiento
    $stmt_insert = $mysqli->prepare("INSERT INTO notas_carpetas (id_nota, id_carpeta) VALUES (?, ?)");
    
    if ($stmt_insert) {
        foreach ($carpetas as $carpeta) {
            if (!empty($carpeta)) {
                $stmt_insert->bind_param("ss", $id_nota, $carpeta);
                $stmt_insert->execute();
            }
        }
        $stmt_insert->close();
    } else {
        http_response_code(500);
        echo json_encode(["ok" => false, "msg" => "Error al preparar la inserción: " . $mysqli->error]);
        exit;
    }
}

// Devolver si funciona la frontend
echo json_encode(["ok" => true, "msg" => "Carpetas sincronizadas con éxito."]);

$mysqli->close();
?>