<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

$con = new pdo_db("user_accounts");

$user_account = $con->get($_POST['where'],$_POST['model']);

$group = $con->getData("SELECT group_id, description FROM groups WHERE group_id = ".$user_account[0]['groups']);
$user_account[0]['groups'] = $group[0];	

echo json_encode($user_account[0]);

?>