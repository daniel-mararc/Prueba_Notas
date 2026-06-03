<?php
// Indicamos al navegador que la respuesta es estrictamente un JSON limpio
header('Content-Type: application/json');

session_start();

// Control de sesión obligatorio para evitar consultas rotas o errores de tipo
if (!isset($_SESSION['id_usu']) || empty($_SESSION['id_usu'])) {
    http_response_code(401); // Estado HTTP: No autorizado
    echo json_encode(["error" => "Sesión no iniciada o expirada."]);
    exit;
}

$id_usu = (int)$_SESSION['id_usu']; // Forzamos a entero por seguridad

// Conexión con la base de datos
$mysqli = new mysqli("localhost", "root", "root", "notas");

$usuariosCompartidos = array();

if ($mysqli->connect_errno) {
    http_response_code(500);
    echo json_encode(["error" => "Fallo de conexión: " . $mysqli->connect_error]);
    exit;
}

// Leer y validar el JSON que llega desde el frontend
$datos = json_decode(file_get_contents("php://input"), true);
$id_nota = $datos["id_nota"] ?? '';

if (empty($id_nota)) {
    http_response_code(400); // Bad Request
    echo json_encode(["error" => "ID de nota no proporcionado."]);
    exit;
}

// Consulta con Prepared Statement
$sql = "
    SELECT u.id, u.email
    FROM usuarios u
    INNER JOIN notas_compartidas nc ON u.id = nc.id_comp
    WHERE nc.id_nota = ? AND nc.id_usu = ?
";

$stmt = $mysqli->prepare($sql);

if ($stmt) {
    $stmt->bind_param("si", $id_nota, $id_usu);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado) {
        while ($fila = $resultado->fetch_assoc()) {
            $usuariosCompartidos[] = [
                "id" => $fila["id"],
                "email" => $fila["email"]
            ];
        }
        $resultado->free(); 
    }
    $stmt->close();
} else {
    http_response_code(500);
    echo json_encode(["error" => "Error en la estructura de la base de datos: " . $mysqli->error]);
    exit;
}

// Devolver el JSON final estructurado (estará vacío [] si nadie comparte la nota)
echo json_encode($usuariosCompartidos);

$mysqli->close();
?>