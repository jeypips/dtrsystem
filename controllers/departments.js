var app = angular.module('departments',['account-module','app-module']);

app.controller('departmentsCtrl',function($scope,app) {

	$scope.app = app;

	app.data($scope);
	app.list($scope);
	
	$scope.module = {
		id: 'departments',
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
