<?php
session_start();

$mysqli = new mysqli("localhost", "root", "root", "notas");

$datos = json_decode(file_get_contents("php://input"), true);
$email = $datos['email'];
$password = $datos['password'];

if ($mysqli->connect_errno) {
    echo json_encode(["ok" => false]);
} else {
    $consulta = "select * from usuarios where email = '$email' and contraseña = '$password'";
    $resultado = $mysqli->query($consulta);

    if ($resultado->num_rows > 0) {
        $fila = $resultado->fetch_array();
        $_SESSION['id_usu'] = $fila['id'];
        echo json_encode(["ok" => true]);
    } else {
        echo json_encode(["ok" => false]);
    }
}
?>