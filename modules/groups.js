angular.module('app-module', ['bootstrap-modal','ui.bootstrap','block-ui','bootstrap-growl','bootstrap-modal','form-validator','window-open-post']).factory('app', function($http,$timeout,$compile,bui,growl,bootstrapModal,validate,printPost) {

	function app() {

		var self = this;				

		self.data = function(scope) {

			scope.formHolder = {};
			
			scope.views = {};
			scope.views.currentPage = 1;

			scope.views.list = true;
			
			scope.btns = {
				ok: {disabled: false, label: 'Save'},
				cancel: {disabled: false, label: 'Cancel'}
			};

			scope.group = {};
			scope.group.group_id = 0;			
			
			scope.groups = [];
			
		};
		
		function privileges(scope) {
			
			$http({
			  method: 'POST',
			  url: 'handlers/privileges.php',
			  data: {id: scope.group.group_id}
			}).then(function mySuccess(response) {
				
				scope.privileges = angular.copy(response.data);
				
			}, function myError(response) {
				
				//
				
			});				
			
		};	

		self.list = function(scope) {
			
			bui.show();
			
			if (scope.$id > 2) scope = scope.$parent;			
			
			scope.views.list = true;			
			
			scope.group = {};
			scope.group.group_id = 0;						
			
			scope.currentPage = scope.views.currentPage;
			scope.pageSize = 10;
			scope.maxSize = 5;
			
			$http({
			  method: 'POST',
			  url: 'handlers/groups/groups.php'
			}).then(function success(response) {
				
				scope.groups = angular.copy(response.data);
				scope.filterData = scope.groups;
				scope.currentPage = scope.views.currentPage;
				
				bui.hide();
				
			}, function error(response) {
				
				bui.hide();

			});			
			
			$('#content').load('lists/groups.html',function() {
				$timeout(function() { $compile($('#content')[0])(scope); }, 500);
			});			
			
		};
		
		function mode(scope,row) {
			
			if (row != null) {

				scope.btns = {
					ok: {disabled: false, label: 'Update'},
					cancel: {disabled: false, label: 'Close'}
				};				
			
			
			} else {
				
				scope.btns = {
					ok: {disabled: false, label: 'Save'},
					cancel: {disabled: false, label: 'Cancel'}
				};				
				
			};
			
		};
		
		self.group = function(scope,row) {			
			
			bui.show();
			
			scope.views.list = false;
			
			privileges(scope);
			
			mode(scope,row);
			
			$('#content').load('forms/group.html',function() {
				$timeout(function() {
					
					$compile($('#content')[0])(scope);
					
					if (row != null) {
						
						$http({
						  method: 'POST',
						  url: 'handlers/groups/view.php',
						  data: {where: {group_id: row.group_id}, model: model(scope,'group',["group_id"])}
						}).then(function success(response) {
							
							scope.group = angular.copy(response.data);
							privileges(scope);
							bui.hide();							
							
						}, function error(response) {
							
							bui.hide();				
							
						});
						
					} else {
						
						scope.group = {};
						scope.group.group_id = 0;
						
					};
					
					bui.hide();
					
				}, 500);
			});						
			
		};
		
		self.cancel = function(scope) {			
			
			
			scope.group = {};
			scope.group.group_id = 0;			
			
			self.list(scope);
			
		};
		
		self.save = function(scope) {

			if (validate.form(scope,'group')) {
				growl.show('danger',{from: 'top', amount: 55},'Some fields are required');				
				return;
			};

			$http({
			  method: 'POST',
			  url: 'handlers/groups/save.php',
			  data: {group: scope.group, privileges: scope.privileges}
			}).then(function success(response) {
				
				bui.hide();
				if (scope.group.group_id == 0) growl.show('success',{from: 'top', amount: 55},'New group successfully added');				
				else growl.show('success',{from: 'top', amount: 55},'Group info successfully updated');				
				self.list(scope);								
				
			}, function error(response) {
				
				bui.hide();				
				
			});				
			
		};
		
		self.delete = function(scope,row) {
			
			var onOk = function() {
				
				$http({
					method: 'POST',
					url: 'handlers/groups/delete.php',
					data: {group_id: row.group_id}
				}).then(function mySuccess(response) {

					self.list(scope);

				}, function myError(response) {

				});

			};

			bootstrapModal.confirm(scope,'Confirmation','Are you sure you want to delete this profile?',onOk,function() {});			
			
		};

		function model(scope,form,model) {
			
			angular.forEach(scope.formHolder[form].$$controls,function (elem,i) {
				
				model.push(elem.$$attr.name);
				
			});
			
			return model;
			
		};
		
	};
	
	return new app();
	
});