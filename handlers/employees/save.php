<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

$con = new pdo_db("employees");

$data = $_POST;

if ($data['employee_dob'] != null) $data['employee_dob'] = date("Y-m-d",strtotime($data['employee_dob']));

if ($data['employee_id']) {
	
	$employee = $con->updateData($data,'employee_id');
	
} else {
	
	unset($data['employee_id']);	
	$employee = $con->insertData($data);
	
};

?>