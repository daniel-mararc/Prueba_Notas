<?php
session_start();

$id_usu = $_SESSION['id_usu'];

$mysqli = new mysqli("localhost", "root", "root", "notas");

$datos = json_decode(file_get_contents("php://input"), true);

$id = $datos['id'];
$titulo = $datos['titulo'];
$desc = $datos['desc'];
$fav = $datos['fav'] ? 1 : 0;

if ($mysqli->connect_errno) {
    echo json_encode(["ok" => false]);
    exit;
}

$consulta = "
select *
from notas n
left join notas_compartidas nc ON n.id = nc.id_nota
where n.id = '$id' and ( n.id_usu = '$id_usu' or nc.id_comp = '$id_usu')";

$resultado = $mysqli->query($consulta);

if ($resultado->num_rows > 0) {

    $update = "
    update notas set titulo = '$titulo', descripcion = '$desc', favorita = '$fav' where id = '$id'";

    $mysqli->query($update);

    echo json_encode(["ok" => true]);

} else {

    echo json_encode(["ok" => false]);
}
?>