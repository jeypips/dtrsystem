<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

$con = new pdo_db();

$user_accounts = $con->getData("SELECT *, DATE_FORMAT(date_added, '%M %d, %Y') date_added, CONCAT(firstname,' ',lastname) fullname, (SELECT groups.description FROM groups WHERE groups.group_id = user_accounts.groups) group_description FROM user_accounts");

echo json_encode($user_accounts);

?>