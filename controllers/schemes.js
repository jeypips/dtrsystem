var app = angular.module('schemes',['account-module','app-module']);

app.controller('schemesCtrl',function($scope,app) {

	$scope.app = app;
	
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
