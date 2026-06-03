<?php
// Indicamos al navegador que la respuesta es estrictamente un JSON limpio
header('Content-Type: application/json');

session_start();

// Control de sesión obligatorio para evitar lógica rota o errores de tipo
if (!isset($_SESSION['id_usu']) || empty($_SESSION['id_usu'])) {
    http_response_code(401); // No autorizado
    echo json_encode(["error" => "Sesión no iniciada o expirada."]);
    exit;
}

$id_usu = (int)$_SESSION['id_usu']; // Forzamos a entero para mayor seguridad

// Conexión con la base de datos
$mysqli = new mysqli("localhost", "root", "root", "notas");

$usuarios = [];

if ($mysqli->connect_errno) {
    http_response_code(500);
    echo json_encode(["error" => "Fallo de conexión: " . $mysqli->connect_error]);
    exit;
}

// Consulta preparada para evitar conflictos de tipos en el WHERE
$stmt = $mysqli->prepare("SELECT id, email FROM usuarios WHERE id != ?");

if ($stmt) {
    $stmt->bind_param("s", $id_usu);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado) {
        while ($fila = $resultado->fetch_assoc()) {
            // Mantenemos la estructura de array indexado exacta que el frontend necesita
            $usuarios[] = [
                $fila['id'], 
                $fila['email']
            ];
        }
        $resultado->free();
    }
    $stmt->close();
} else {
    http_response_code(500);
    echo json_encode(["error" => "Error en la estructura de la consulta: " . $mysqli->error]);
    exit;
}

// Devolver el array final (estará vacío [] si no hay más usuarios)
echo json_encode($usuarios);

$mysqli->close();
?>