<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

$con = new pdo_db("employees");

$employee = $con->get($_POST['where'],$_POST['model']);

$deparment = $con->getData("SELECT dept_id, dept_name FROM departments WHERE dept_id = ".$employee[0]['employee_dept']);
$employee[0]['employee_dept'] = $deparment[0];	

echo json_encode($employee[0]);

?>