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

		function loginModal() {
			var modal = document.getElementById('loginModal');
			var btn = document.getElementById("loginModalButton");
			var span = document.getElementsByClassName("close")[0];
			btn.onclick = function() {
			    modal.style.display = "block";
			}
			span.onclick = function() {
			    modal.style.display = "none";
			}
			window.onclick = function(event) {
			    if (event.target == modal)
			        modal.style.display = "none";
			}
		}

		function registerModal() {
			var modal = document.getElementById('registerModal');
			var btn = document.getElementById("registerModalButton");
			var span = document.getElementsByClassName("close")[0];
			btn.onclick = function() {
			    modal.style.display = "block";
			}
			span.onclick = function() {
			    modal.style.display = "none";
			}
			window.onclick = function(event) {
			    if (event.target == modal)
			        modal.style.display = "none";
			}
		}
	}
})();