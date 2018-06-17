angular.module('app-module', ['ui.bootstrap','bootstrap-modal','block-ui','bootstrap-growl','form-validator']).factory('app', function($http,$timeout,$compile,bootstrapModal,bui,growl,validate) {

	function app() {
	
		var self = this;
	
		self.data = function(scope) {

			scope.formHolder = {};
			
			scope.views = {};
			scope.views.currentPage = 1;
			
			scope.btns = {
				ok: { btn: false, label: 'Save'},
				cancel: { btn: false, label: 'Cancel'},
			};
			
		};
		
		var alerts = {
			group: {
				save: 'New group successfully added',
				update: 'Group info successfully updated',
				delete: 'Group info successfully deleted'
			},
			user_account: {
				save: 'New account successfully added',
				update: 'Account info successfully updated',
				delete: 'Account info successfully deleted'
			},
			department: {
				save: 'New department successfully added',
				update: 'Deparment info successfully updated',
				delete: 'Department info successfully deleted'
			},
		};
		
		var confirmations = {
			group: {
				delete: 'Are you sure you want to delete this group info?'
			},
			user_account: {
				delete: 'Are you sure you want to delete this user account?'
			},
			department: {
				delete: 'Are you sure you want to delete this department info?'
			},
		};
		
		function mode(scope,row) {
			
			if (row == null) {
				scope.btns.ok.label = 'Save';
				scope.btns.ok.btn = false;
				scope.btns.cancel.label = 'Cancel';
				scope.btns.cancel.btn = false;
			} else {
				scope.btns.ok.label = 'Update';
				scope.btns.cancel.label = 'Close';
				scope.btns.ok.btn = true;
			}
			
		};

		function model(scope,form,model) {
			
			angular.forEach(scope.formHolder[form].$$controls,function (elem,i) {
				
				model.push(elem.$$attr.name);
				
			});
			
			return model;
			
		};		
		
		self.list = function(scope) {
			
			bui.show();
			
			if (scope.$id > 2) scope = scope.$parent;			
			
			scope.views.list = true;				
			
			scope.currentPage = scope.views.currentPage;
			scope.pageSize = 10;
			scope.maxSize = 5;
			
			$http({
			  method: 'POST',
			  url: 'handlers/'+scope.list+'/'+scope.list+'.php'
			}).then(function success(response) {
				
				scope[scope.list] = angular.copy(response.data);
				scope.filterData = scope[scope.list];
				scope.currentPage = scope.views.currentPage;
				
				bui.hide();
				
			}, function error(response) {
				
				bui.hide();

			});			
			
			$('#content').load('lists/'+scope.list+'.html',function() {
				$timeout(function() { $compile($('#content')[0])(scope); }, 500);
			});			
			
		};
		
		self.form = function(scope,row) {			
						
			bui.show();
			
			scope.views.list = false;
			
			mode(scope,row);
			
			$('#content').load('forms/'+scope.form.name+'.html',function() {
				$timeout(function() {
					
					$compile($('#content')[0])(scope);

					if (row != null) {
						
						$http({
						  method: 'POST',
						  url: 'handlers/'+scope.list+'/view.php',
						  data: {where: {[scope.form.id]: row[scope.form.id]}, model: model(scope,scope.form.name,[scope.form.id])}
						}).then(function success(response) {
							
							scope[scope.form.name] = angular.copy(response.data);
							bui.hide();							
							
						}, function error(response) {
							
							bui.hide();				
							
						});

					} else {
						
						scope[scope.form.name]= {};
						scope[scope.form.name][scope.form.id] = 0;
						
					};
					
					bui.hide();
					
				}, 500);
			});
			
			if (scope.form.name == 'group') {
				
				privileges(scope);				
				
			};
			
			if (scope.form.name == 'user_account') {
				
				groups(scope);				
				
			};
			
		};

		self.cancel = function(scope) {			
			
			
			scope[scope.form.name]= {};
			scope[scope.form.name][scope.form.id] = 0;			
			
			self.list(scope);
			
		};
		
		self.edit = function(scope) {
			
			scope.btns.ok.btn = !scope.btns.ok.btn;
			
		};
		
		self.save = function(scope) {

			if (validate.form(scope,scope.form.name)) {
				growl.show('danger',{from: 'top', amount: 55},'Some fields are required');				
				return;
			};

			$http({
			  method: 'POST',
			  url: 'handlers/'+scope.list+'/save.php',
			  data: scope[scope.form.name]
			}).then(function success(response) {
				
				bui.hide();
				if (scope[scope.form.name][scope.form.id] == 0) growl.show('success',{from: 'top', amount: 55},alerts[scope.form.name].save);				
				else growl.show('success',{from: 'top', amount: 55},alerts[scope.form.name].update);				
				self.list(scope);								
				
			}, function error(response) {
				
				bui.hide();				
				
			});				
			
		};
		
		self.delete = function(scope,row) {		
			
			var onOk = function() {
				
				$http({
					method: 'POST',
					url: 'handlers/'+scope.list+'/delete.php',
					data: {[scope.form.id]: row[scope.form.id]}
				}).then(function mySuccess(response) {
					
					growl.show('danger',{from: 'top', amount: 55},alerts[scope.form.name].delete);
					self.list(scope);

				}, function myError(response) {

				});

			};

			bootstrapModal.confirm(scope,'Confirmation',confirmations[scope.form.name].delete,onOk,function() {});			
			
		};		
		
		/*
		** module specific functions
		*/
		
		function groups(scope) {
			
			$http({
				method: 'POST',
				url: 'api/suggestions/groups.php'
			}).then(function mySucces(response) {
				
				scope.groups = response.data;
				
			},function myError(response) {
				
			});	
			
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
	
	};
	
	return new app();
	
});