<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

$con = new pdo_db("groups");

$delete = array("group_id"=>$_POST['group_id']);

$con->deleteData($delete);

?>