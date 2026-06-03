<?php
// Indicamos al navegador que la respuesta será estrictamente un JSON
header('Content-Type: application/json');

session_start();

// Conexión con la base de datos
$mysqli = new mysqli("localhost", "root", "root", "notas");

if ($mysqli->connect_errno) {
    echo json_encode(["ok" => false, "msg" => "Error de conexión"]);
    exit;
}

// Leer los datos del JSON entrante
$datos = json_decode(file_get_contents("php://input"), true);
$email = $datos['email'] ?? '';
$password = $datos['password'] ?? '';

if (empty($email) || empty($password)) {
    echo json_encode(["ok" => false, "msg" => "Campos vacíos"]);
    exit;
}

// Usamos consultas preparadas para que sea 100% seguro contra Inyección SQL
$stmt = $mysqli->prepare("SELECT id, contrasena FROM usuarios WHERE email = ?");

if ($stmt) {
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows > 0) {
        $fila = $resultado->fetch_assoc();
        
        // Verifica la contraseña encriptada de la base de datos
        if (password_verify($password, $fila['contrasena'])) {
            
            // Guardamos el ID en la sesión
            $_SESSION['id_usu'] = $fila['id'];
            
            echo json_encode(["ok" => true]);
        } else {
            // Contraseña incorrecta
            echo json_encode(["ok" => false, "msg" => "Credenciales incorrectas"]);
        }
    } else {
        // Usuario no encontrado
        echo json_encode(["ok" => false, "msg" => "Credenciales incorrectas"]);
    }
    $stmt->close();
} else {
    echo json_encode(["ok" => false, "msg" => "Error interno del servidor"]);
}

$mysqli->close();
?>