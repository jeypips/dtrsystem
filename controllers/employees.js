var app = angular.module('employees',['account-module','app-module']);

app.controller('employeesCtrl',function($scope,app) {

	$scope.app = app;

	app.data($scope);
	app.list($scope);
	
	$scope.module = {
		id: 'employees',
		privileges: {
			show: 1,
			add: 2,
			delete: 3,
		}
	};	
	
});

app.filter('pagination', function() {
	  return function(input, currentPage, pageSize) {
	    if(angular.isArray(input)) {
	      var start = (currentPage-1)*pageSize;
	      var end = currentPage*pageSize;
	      return input.slice(start, end);
	    }
	  };
});
