<?php
require_once 'db_config.php';

$datos = json_decode(file_get_contents("php://input"), true);

$id_nota = $datos["id_nota"];
$carpetas = $datos["carpetas"];

// Obtengo las carpetas actuales en BD
$actuales = [];

$result = $mysqli->query("SELECT id_carpeta FROM notas_carpetas WHERE id_nota = '$id_nota'");

while ($row = $result->fetch_assoc()) {
    $actuales[] = $row["id_carpeta"];
}

// Inserto las notas en las carpetas nuevas
foreach ($carpetas as $carpeta) {
    if (!in_array($carpeta, $actuales)) {
        $mysqli->query("
            INSERT INTO notas_carpetas (id_nota, id_carpeta)
            VALUES ('$id_nota', '$carpeta')
        ");
    }
}

// Borrar las notas de las carpetas desmarcadas
foreach ($actuales as $carpeta) {
    if (!in_array($carpeta, $carpetas)) {
        $mysqli->query("
            DELETE FROM notas_carpetas
            WHERE id_nota = '$id_nota' AND id_carpeta = '$carpeta'
        ");
    }
}

echo json_encode(["ok" => true]);
?>