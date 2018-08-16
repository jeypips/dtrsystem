<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

$con = new pdo_db("user_accounts");

$_POST['model']['groups'] = array("groups"=>array("groups"=>["group_id","description"]));
$user_account = $con->getObj($_POST['where'],$_POST['model']);
	
echo json_encode($user_account[0]);

?>