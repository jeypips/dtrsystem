<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../../db.php';

$con = new pdo_db();

$employees = $con->getData("SELECT *,CONCAT(employee_firstname,' ',employee_lastname) fullname, (SELECT dept_name FROM departments WHERE departments.dept_id = employees.employee_dept) dept_name FROM employees");

echo json_encode($employees);

?>