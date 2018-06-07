<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

$con = new pdo_db("employees");

$delete = array("employee_id"=>$_POST['employee_id']);

$con->deleteData($delete);

?>