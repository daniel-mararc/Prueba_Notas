<?php
// Indicamos al navegador que la respuesta es estrictamente un JSON limpio
header('Content-Type: application/json');

session_start();

// Control de sesión obligatorio para evitar consultas rotas
if (!isset($_SESSION['id_usu']) || empty($_SESSION['id_usu'])) {
    http_response_code(401); // Estado HTTP: No autorizado
    echo json_encode(["error" => "Sesión no iniciada o expirada."]);
    exit;
}

$id_usu = (int)$_SESSION['id_usu']; // Forzamos a entero por seguridad

// Conexión con la base de datos
$mysqli = new mysqli("localhost", "root", "root", "notas");

$arrNotasCarpeta = array();

if ($mysqli->connect_errno) {
    http_response_code(500);
    echo json_encode(["error" => "Fallo al conectar a MySQL: " . $mysqli->connect_error]);
    exit;
}

// Consulta con Prepared Statement
// Cambiamos el bindeo a string "s" por si el ID de usuario se procesa como texto en este entorno compartido
$consulta = "
    SELECT 
        n.id,
        n.titulo,
        n.descripcion,
        n.favorita,
        u.email AS compartido_por
    FROM notas_compartidas nc
    INNER JOIN notas n ON n.id = nc.id_nota
    INNER JOIN usuarios u ON u.id = nc.id_usu
    WHERE nc.id_comp = ?
";

$stmt = $mysqli->prepare($consulta);

if ($stmt) {
    $stmt->bind_param("s", $id_usu);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado) {
        while ($fila = $resultado->fetch_assoc()) {
            $arrNotasCarpeta[] = [
                $fila['id'],
                $fila['titulo'],
                $fila['descripcion'],
                $fila['favorita'],
                $fila['compartido_por']
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
echo json_encode($arrNotasCarpeta);

$mysqli->close();
?>