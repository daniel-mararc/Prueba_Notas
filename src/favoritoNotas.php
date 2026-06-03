<?php
// Indicamos al navegador que la respuesta es estrictamente un JSON limpio
header('Content-Type: application/json');

session_start();

// Control de sesión obligatorio por seguridad
if (!isset($_SESSION['id_usu']) || empty($_SESSION['id_usu'])) {
    http_response_code(401); // Estado HTTP: No autorizado
    echo json_encode(["error" => "Sesión no iniciada o expirada."]);
    exit;
}

$id_usu = (int)$_SESSION['id_usu']; // Forzamos a entero por seguridad

// Conexión con la base de datos
$mysqli = new mysqli("localhost", "root", "root", "notas");

$arrFavoritas = array();

if ($mysqli->connect_errno) {
    http_response_code(500);
    echo json_encode(["error" => "Fallo al conectar a MySQL: " . $mysqli->connect_error]);
    exit;
}

// Consulta con Prepared Statement
// Pasamos tanto el id_usu como el valor de 'favorita' por parámetros para asegurar compatibilidad estricta
$consulta = "SELECT id, titulo, descripcion, favorita FROM notas WHERE id_usu = ? AND favorita = ?";
$stmt = $mysqli->prepare($consulta);

if ($stmt) {
    $es_favorita = 1; // Forzamos el valor 1 de forma limpia
    
    // "ii" significa: integer (id_usu), integer (es_favorita)
    $stmt->bind_param("ii", $id_usu, $es_favorita);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado) {
        while ($fila = $resultado->fetch_assoc()) {
            // Mantenemos exactamente la estructura de array indexado que el frontend lee
            $arrFavoritas[] = [
                $fila['id'],
                $fila['titulo'],
                $fila['descripcion'],
                $fila['favorita']
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

// Devolver el JSON final estructurado
echo json_encode($arrFavoritas);

$mysqli->close();
?>