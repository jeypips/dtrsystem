<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

$con = new pdo_db("user_accounts");

$user_accounts = $con->allObj(["*","DATE_FORMAT(date_added, '%M %d, %Y') date_added","CONCAT(firstname,' ',lastname) fullname",array("groups"=>array("groups"=>["group_id","description"]))]);

echo json_encode($user_accounts);

?>