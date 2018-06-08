angular.module('app-module', ['bootstrap-modal','ui.bootstrap','block-ui','bootstrap-growl','bootstrap-modal','form-validator','window-open-post']).factory('app', function($http,$timeout,$compile,bui,growl,bootstrapModal,validate,printPost) {

	function app() {

		var self = this;				

		self.data = function(scope) {

			scope.formHolder = {};
			
			scope.views = {};
			scope.views.currentPage = 1;

			scope.views.list = true;
			
			scope.btns = {
				ok: { btn: false, label: 'Save'},
				cancel: { btn: false, label: 'Cancel'},
			};

			scope.user_account = {};
			scope.user_account.id = 0;			
			
			scope.user_accounts = [];
			
		};
		
		function groups(scope) {
			
			$http({
				method: 'POST',
				url: 'api/suggestions/groups.php'
			}).then(function mySucces(response) {
				
				scope.groups = response.data;
				
			},function myError(response) {
				
			});	
			
		};

		self.list = function(scope) {
			
			bui.show();
			
			if (scope.$id > 2) scope = scope.$parent;			
			
			scope.views.list = true;			
			
			scope.user_account = {};
			scope.user_account.id = 0;						
			
			scope.currentPage = scope.views.currentPage;
			scope.pageSize = 10;
			scope.maxSize = 5;
			
			$http({
			  method: 'POST',
			  url: 'handlers/accounts/accounts.php'
			}).then(function success(response) {
				
				scope.user_accounts = angular.copy(response.data);
				scope.filterData = scope.user_accounts;
				scope.currentPage = scope.views.currentPage;
				
				bui.hide();
				
			}, function error(response) {
				
				bui.hide();

			});			
			
			$('#content').load('lists/accounts.html',function() {
				$timeout(function() { $compile($('#content')[0])(scope); }, 500);
			});			
			
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
		
		self.account = function(scope,row) {			
			
			bui.show();
			
			scope.views.list = false;
			
			mode(scope,row);
			
			$('#content').load('forms/account.html',function() {
				$timeout(function() {
					
					$compile($('#content')[0])(scope);
					
					if (row != null) {
						
						$http({
						  method: 'POST',
						  url: 'handlers/accounts/view.php',
						  data: {where: {id: row.id}, model: model(scope,'user_account',["id"])}
						}).then(function success(response) {
							
							scope.user_account = angular.copy(response.data);
							bui.hide();							
							
						}, function error(response) {
							
							bui.hide();				
							
						});
						
					} else {
						
						scope.user_account = {};
						scope.user_account.id = 0;
						
					};
					
					bui.hide();
					
				}, 500);
			});

			groups(scope);
			
		};
		
		self.cancel = function(scope) {			
			
			
			scope.user_account = {};
			scope.user_account.id = 0;			
			
			self.list(scope);
			
		};
		
		self.edit = function(scope) {
			
			scope.btns.ok.btn = !scope.btns.ok.btn;
			
		};
		
		self.save = function(scope) {

			if (validate.form(scope,'user_account')) {
				growl.show('danger',{from: 'top', amount: 55},'Some fields are required');				
				return;
			};

			$http({
			  method: 'POST',
			  url: 'handlers/accounts/save.php',
			  data: scope.user_account
			}).then(function success(response) {
				
				bui.hide();
				if (scope.user_account.id == 0) growl.show('success',{from: 'top', amount: 55},'New account successfully added');				
				else growl.show('success',{from: 'top', amount: 55},'Account info successfully updated');				
				self.list(scope);								
				
			}, function error(response) {
				
				bui.hide();				
				
			});				
			
		};
		
		self.delete = function(scope,row) {
			
			var onOk = function() {
				
				$http({
					method: 'POST',
					url: 'handlers/accounts/delete.php',
					data: {id: row.id}
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