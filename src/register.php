<?php
require_once 'db_config.php';

$datos = json_decode(file_get_contents("php://input"), true);
$email = $datos['email'];
$password = password_hash($datos["password"], PASSWORD_DEFAULT);

{
    $consulta = "select * from usuarios where email = '$email'";
    $resultado = $mysqli->query($consulta);

    if ($resultado->num_rows > 0) {
        echo json_encode(["ok" => false, "msg" => "El correo ya está registrado."]);
    } else {
        $insert = "insert into usuarios (email, contraseña, tema) values ('$email', '$password', 'bright')";
        $mysqli->query($insert);
        echo $mysqli->error;
        echo json_encode(["ok" => true]);
    }
}
?>