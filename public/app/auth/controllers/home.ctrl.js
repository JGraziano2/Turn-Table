(function() {
	'use strict';

	angular
		.module('app')
		.controller('HomeCtrl', HomeCtrl);

	HomeCtrl.$inject = ['$scope', '$state','AuthService', 'ModalService'];

	function HomeCtrl($scope, $state, AuthService, ModalService) {
		$scope.login = login;
		$scope.register = register;
        $scope.showLogin = showLogin;
        $scope.showRegister = showRegister;
        
		function login() {
			AuthService.login($scope.email, $scope.password).then(function(data) {
				$state.go('playlist', {id: data.uid});
			}).catch(function(error) {
				console.log(error);
			});
		}

		function register() {
			AuthService.register($scope.email, $scope.password).then(function(data) {
				AuthService.login($scope.email, $scope.password).then(function(data) {
					$state.go('playlist', {id: data.uid});
				})
			}).catch(function(error) {
				console.log(error);
			});
		}

		function showLogin() {
            console.log("clicked login");
			ModalService.showModal({
				templateUrl: 'app/auth/templates/loginModal.tpl.hmtl'
				// controller: 'ModalCtrl'
			}).then(function(modal){
				modal.element.modal();
				modal.close.then(function(result){
					console.log('closed: ' + result);
				});
			});
		}

		function showRegister() {
			console.log("clicked register");
			ModalService.showModal({
				templateUrl: 'app/auth/templates/registerModal.tpl.hmtl'
				// controller: 'ModalCtrl'
			}).then(function(modal){
				modal.element.modal();
				modal.close.then(function(result){
					console.log('closed: ' + result);
				});
			});
		}
	}
})();