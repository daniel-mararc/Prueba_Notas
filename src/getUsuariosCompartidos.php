<?php
session_start();

$mysqli = new mysqli("localhost", "root", "root", "notas");

$datos = json_decode(file_get_contents("php://input"), true);

$id_nota = $datos["id_nota"];
$id_usu = $_SESSION["id_usu"];

$usuariosCompartidos = array();

if ($mysqli->connect_errno) {
    echo json_encode($usuariosCompartidos);
    exit();
}

$consulta = "
SELECT u.id, u.email
FROM usuarios u
INNER JOIN notas_compartidas nc
ON u.id = nc.id_comp
WHERE nc.id_nota = '$id_nota'
AND nc.id_usu = '$id_usu'
";

$resultado = $mysqli->query($consulta);

if ($resultado) {
    while ($fila = $resultado->fetch_assoc()) {
        $usuariosCompartidos[] = [
            "id" => $fila["id"],
            "email" => $fila["email"]
        ];
    }
}

echo json_encode($usuariosCompartidos);
?>