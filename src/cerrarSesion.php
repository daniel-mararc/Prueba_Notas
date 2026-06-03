<?php
// Indicamos al navegador que la respuesta es estrictamente un JSON limpio
header('Content-Type: application/json');

session_start();

$_SESSION['id_usu'] = null; // Limpiamos el ID de usuario de la sesión

session_destroy(); // Destruimos la sesión para asegurarnos de que se cierre completamente

echo json_encode(["ok" => true, "msg" => "Sesión cerrada correctamente."]);

?>