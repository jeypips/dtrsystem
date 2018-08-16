<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

$con = new pdo_db("user_accounts");

$data = $_POST;

if ($data['id']) {
	
	$user_account = $con->updateObj($data,'id');
	
} else {
	
	unset($data['id']);	
	$user_account = $con->insertObj($data);
	
};

?>