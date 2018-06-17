<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

$con = new pdo_db("employees");

$_POST['model']['employee_dept'] = array("employee_dept"=>array("departments"=>["dept_id","dept_name"]));
$employee = $con->getObj($_POST['where'],$_POST['model']);

echo json_encode($employee[0]);

?>