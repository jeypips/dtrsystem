var app = angular.module('maintenance',['account-module','app-module']);

app.controller('maintenanceCtrl',function($scope,$timeout,app) {

	$scope.app = app;
	
	$timeout(function() {
	
		app.data($scope);
		app.list($scope);
		
	}, 500);
	
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
