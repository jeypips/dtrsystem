<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

$con = new pdo_db("departments");

$department = $con->get($_POST['where'],$_POST['model']);

echo json_encode($department[0]);

?>