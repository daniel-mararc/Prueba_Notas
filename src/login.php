<?php
session_start();

require_once 'db_config.php';

$datos = json_decode(file_get_contents("php://input"), true);

$email = $datos['email'];
$password = $datos['password'];

{

    $consulta = "select * from usuarios where email = '$email'
    ";

    $resultado = $mysqli->query($consulta);

    if ($resultado && $resultado->num_rows > 0) {
        $fila = $resultado->fetch_assoc();
        if (password_verify($password, $fila['contraseña'])) {
            $_SESSION['id_usu'] = $fila['id'];
            echo json_encode(["ok" => true]);
        } else {
            echo json_encode(["ok" => false]);
        }

    } else {
        echo json_encode(["ok" => false]);
    }
}
?>