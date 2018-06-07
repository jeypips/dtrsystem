<?php

define('system_privileges', array(
	array(
		"id"=>"dashboard",
		"description"=>"Dashboard",
		"privileges"=>array( # id=1 must be always page access
			array("id"=>1,"description"=>"Show Dashboard","value"=>false),
		),
	),
	array(
		"id"=>"departments",
		"description"=>"Departments",
		"privileges"=>array( # id=1 must be always page access
			array("id"=>1,"description"=>"Show Departments","value"=>false),
			array("id"=>2,"description"=>"Add/Edit Departments","value"=>false),
			array("id"=>3,"description"=>"Delete Departments","value"=>false),
		),
	),
	array(
		"id"=>"employees",
		"description"=>"Employees",
		"privileges"=>array( # id=1 must be always page access
			array("id"=>1,"description"=>"Show Employees","value"=>false),
			array("id"=>2,"description"=>"Add/Edit Employees","value"=>false),
			array("id"=>3,"description"=>"Delete Employees","value"=>false),
		),
	),
	array(
		"id"=>"maintenance",
		"description"=>"Maintenance",
		"privileges"=>array( # id=1 must be always page access
			array("id"=>1,"description"=>"Show Maintenance","value"=>false),
		),
	),
));

?>