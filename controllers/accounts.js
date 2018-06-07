var app = angular.module('accounts',['account-module','app-module']);

app.controller('accountsCtrl',function($scope,app) {

	$scope.app = app;

	app.data($scope);
	app.list($scope);
	
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
