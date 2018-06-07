angular.module('app-module', ['bootstrap-modal','ui.bootstrap','block-ui','bootstrap-growl','bootstrap-modal','form-validator','window-open-post','module-access']).factory('app', function($http,$timeout,$compile,bui,growl,bootstrapModal,validate,printPost,access) {

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

			scope.employee = {};
			scope.employee.employee_id = 0;			
			
			scope.employees = [];
			
		};

		self.list = function(scope) {
			
			bui.show();
			
			if (scope.$id > 2) scope = scope.$parent;			
			
			scope.views.list = true;			
			
			scope.employee = {};
			scope.employee.employee_id = 0;						
			
			scope.currentPage = scope.views.currentPage;
			scope.pageSize = 10;
			scope.maxSize = 5;
			
			$http({
			  method: 'POST',
			  url: 'handlers/employees/employees.php'
			}).then(function success(response) {
				
				scope.employees = angular.copy(response.data);
				scope.filterData = scope.employees;
				scope.currentPage = scope.views.currentPage;
				
				bui.hide();
				
			}, function error(response) {
				
				bui.hide();

			});			
			
			$('#content').load('lists/employees.html',function() {
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
		
		self.employee = function(scope,row) {			
			
			if (!access.has(scope,scope.profile.groups,scope.module.id,scope.module.privileges.add)) return;
			
			bui.show();
			
			scope.views.list = false;
			
			mode(scope,row);
			
			$('#content').load('forms/employee.html',function() {
				$timeout(function() {
					
					$compile($('#content')[0])(scope);
					
					if (row != null) {
						
						$http({
						  method: 'POST',
						  url: 'handlers/employees/view.php',
						  data: {where: {employee_id: row.employee_id}, model: model(scope,'employee',["employee_id"])}
						}).then(function success(response) {
							
							scope.employee = angular.copy(response.data);
							if (scope.employee.employee_dob) scope.employee.employee_dob = new Date(scope.employee.employee_dob);
							bui.hide();							
							
						}, function error(response) {
							
							bui.hide();				
							
						});
						
					} else {
						
						scope.employee = {};
						scope.employee.employee_id = 0;
						
					};
					
					bui.hide();
					
				}, 500);
			});						
			
		};
		
		self.cancel = function(scope) {			
			
			
			scope.employee = {};
			scope.employee.employee_id = 0;			
			
			self.list(scope);
			
		};
		
		self.save = function(scope) {

			if (validate.form(scope,'employee')) {
				growl.show('danger',{from: 'top', amount: 55},'Some fields are required');				
				return;
			};

			$http({
			  method: 'POST',
			  url: 'handlers/employees/save.php',
			  data: scope.employee
			}).then(function success(response) {
				
				bui.hide();
				if (scope.employee.employee_id == 0) growl.show('success',{from: 'top', amount: 55},'New employee successfully added');				
				else growl.show('success',{from: 'top', amount: 55},'Employee info successfully updated');				
				self.list(scope);								
				
			}, function error(response) {
				
				bui.hide();				
				
			});				
			
		};
		
		self.delete = function(scope,row) {
			
			if (!access.has(scope,scope.profile.groups,scope.module.id,scope.module.privileges.delete)) return;
			
			var onOk = function() {
				
				$http({
					method: 'POST',
					url: 'handlers/employees/delete.php',
					data: {employee_id: row.employee_id}
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