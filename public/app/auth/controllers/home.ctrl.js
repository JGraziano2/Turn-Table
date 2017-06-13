(function() {
	'use strict';

	angular
		.module('app')
		.controller('HomeCtrl', HomeCtrl);

	HomeCtrl.$inject = ['$scope', '$state','AuthService'];

	function HomeCtrl($scope, $state, AuthService) {
		$scope.login = login;
		$scope.register = register;


		function login() {
			AuthService.login($scope.email, $scope.password).then(function(data) {
				$state.go('playlist', {id: data.uid});
			}).catch(function(error) {
				console.log(error);
			})
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

		
	}


})();