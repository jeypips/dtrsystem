<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

$con = new pdo_db();

$departments = $con->getData("SELECT *, DATE_FORMAT(dept_date_added, '%M %d, %Y') dept_date_added FROM departments");

echo json_encode($departments);

?>