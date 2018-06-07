<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

$con = new pdo_db("user_accounts");

$data = $_POST;

$data['groups'] = $data['groups']['group_id'];

if ($data['id']) {
	
	$user_account = $con->updateData($data,'id');
	
} else {
	
	unset($data['id']);	
	$user_account = $con->insertData($data);
	
};

?>