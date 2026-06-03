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
$tema = $datos['tema'] ?? '';

if (empty($tema)) {
    http_response_code(400); // Bad Request
    echo json_encode(["ok" => false, "msg" => "El campo 'tema' es obligatorio."]);
    exit;
}

// Consulta preparada para evitar inyecciones SQL al actualizar el perfil
$stmt = $mysqli->prepare("UPDATE usuarios SET tema = ? WHERE id = ?");

if ($stmt) {
    // "si" significa: string (tema), integer (id_usu)
    $stmt->bind_param("si", $tema, $id_usu);
    
    if ($stmt->execute()) {
        // En un UPDATE, affected_rows puede ser 0 si el usuario volvió a elegir el mismo tema que ya tenía.
        // Por eso, mientras la consulta se ejecute con éxito, lo damos por correcto.
        echo json_encode(["ok" => true, "msg" => "Tema actualizado correctamente."]);
    } else {
        echo json_encode(["ok" => false, "msg" => "Error al actualizar el tema: " . $stmt->error]);
    }
    $stmt->close();
} else {
    echo json_encode(["ok" => false, "msg" => "Error en la estructura de la base de datos."]);
}

$mysqli->close();
?>