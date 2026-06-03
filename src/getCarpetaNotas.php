<?php
// Indicamos al navegador que la respuesta es estrictamente un JSON limpio
header('Content-Type: application/json');

session_start();

// Control de sesión obligatorio por seguridad
if (!isset($_SESSION['id_usu']) || empty($_SESSION['id_usu'])) {
    http_response_code(401); 
    echo json_encode(["error" => "Sesión no iniciada o expirada."]);
    exit;
}

$id_usu = (int)$_SESSION['id_usu']; 

// Conexión con la base de datos
$mysqli = new mysqli("localhost", "root", "root", "notas");

$arrNotasCarpeta = array();

if ($mysqli->connect_errno) {
    http_response_code(500);
    echo json_encode(["error" => "Fallo al conectar a MySQL: " . $mysqli->connect_error]);
    exit;
}

// Leer y validar de forma segura el JSON entrante
$datos = json_decode(file_get_contents("php://input"), true);
$id_carpeta = $datos['id'] ?? '';

if (empty($id_carpeta)) {
    http_response_code(400);
    echo json_encode(["error" => "ID de carpeta no proporcionado."]);
    exit;
}

// Buscamos las notas cuyo ID esté dentro de la relación de la carpeta seleccionada
$consulta = "
    SELECT id, titulo, descripcion, favorita 
    FROM notas 
    WHERE id_usu = ? 
      AND id IN (SELECT id_nota FROM notas_carpetas WHERE id_carpeta = ?)
";

$stmt = $mysqli->prepare($consulta);

if ($stmt) {
    // Usamos "is" por seguridad (id_usu entero, id_carpeta texto/entero)
    $stmt->bind_param("is", $id_usu, $id_carpeta);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado) {
        while ($fila = $resultado->fetch_assoc()) {
            // Mantenemos exactamente la misma estructura de array indexado que espera el JS
            $arrNotasCarpeta[] = [
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
    // Agregamos el error real de MySQL para saber si falla el nombre de alguna tabla/columna
    echo json_encode(["error" => "Error en la consulta: " . $mysqli->error]);
    exit;
}

// Devolver el JSON final estructurado
echo json_encode($arrNotasCarpeta);

$mysqli->close();
?>