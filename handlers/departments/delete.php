<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

$con = new pdo_db("departments");

$delete = array("dept_id"=>$_POST['dept_id']);

$con->deleteData($delete);

?>