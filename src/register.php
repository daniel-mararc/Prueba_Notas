<?php
// Indicamos que la respuesta es un JSON
header('Content-Type: application/json');

// Conexión con la base de datos
$mysqli = new mysqli("localhost", "root", "root", "notas");

if ($mysqli->connect_errno) {
    echo json_encode(["ok" => false, "msg" => "Error de conexión local"]);
    exit;
}

// Leer los datos del JSON de entrada
$datos = json_decode(file_get_contents("php://input"), true);
$email = $datos['email'] ?? '';
$password_plana = $datos['password'] ?? ''; // Corregido el acceso a la clave del array

if (empty($email) || empty($password_plana)) {
    echo json_encode(["ok" => false, "msg" => "Campos obligatorios vacíos."]);
    exit;
}

// Validar si el correo ya existe
$stmt_check = $mysqli->prepare("SELECT id FROM usuarios WHERE email = ?");
$stmt_check->bind_param("s", $email);
$stmt_check->execute();
$resultado = $stmt_check->get_result();

if ($resultado->num_rows > 0) {
    echo json_encode(["ok" => false, "msg" => "El correo ya está registrado."]);
    $stmt_check->close();
} else {
    $stmt_check->close();

    // Encriptamos la contraseña de manera segura
    $password_encriptada = password_hash($password_plana, PASSWORD_DEFAULT);
    $tema_defecto = 'bright';

    // Insertar el nuevo usuario
    $stmt_insert = $mysqli->prepare("INSERT INTO usuarios (email, contrasena, tema) VALUES (?, ?, ?)");
    
    if ($stmt_insert) {
        $stmt_insert->bind_param("sss", $email, $password_encriptada, $tema_defecto);
        
        if ($stmt_insert->execute()) {
            echo json_encode(["ok" => true, "msg" => "Usuario registrado con éxito."]);
        } else {
            // Enviamos el error dentro del JSON
            echo json_encode(["ok" => false, "msg" => "Error al insertar: " . $stmt_insert->error]);
        }
        $stmt_insert->close();
    } else {
        echo json_encode(["ok" => false, "msg" => "Error en la preparación del SQL: " . $mysqli->error]);
    }
}

$mysqli->close();
?>