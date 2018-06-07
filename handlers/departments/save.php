<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

$con = new pdo_db("departments");

$data = $_POST;

if ($data['dept_id']) {
	
	$department = $con->updateData($data,'dept_id');
	
} else {
	
	unset($data['dept_id']);	
	$department = $con->insertData($data);
	
};

?>