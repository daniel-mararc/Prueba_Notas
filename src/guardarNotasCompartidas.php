<?php
session_start();

$mysqli = new mysqli("localhost", "root", "root", "notas");

$datos = json_decode(file_get_contents("php://input"), true);

$id_nota = $datos["id_nota"];
$usuarios = $datos["usuarios"];
$id_usu = $_SESSION["id_usu"];

if ($mysqli->connect_errno) {
    echo "Error de conexión";
    exit();
}

// Borrar las notas compartidas desmarcadas
$delete = "
DELETE FROM notas_compartidas
WHERE id_nota = '$id_nota'
AND id_usu = '$id_usu'
";

$mysqli->query($delete);

// Guardar nuevas notas compartidas
foreach ($usuarios as $id_comp) {

    $insert = "
    INSERT INTO notas_compartidas
    (id_usu, id_nota, id_comp)
    VALUES
    ('$id_usu', '$id_nota', '$id_comp')
    ";

    $mysqli->query($insert);
}

echo json_encode([
    "ok" => true
]);
?>