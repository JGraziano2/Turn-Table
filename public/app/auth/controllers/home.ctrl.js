(function() {
	'use strict';

	angular
		.module('app', ['angularModalService'])
		.controller('HomeCtrl', HomeCtrl);

	HomeCtrl.$inject = ['$scope', '$state','AuthService', 'angularModalService'];

	function HomeCtrl($scope, $state, AuthService) {
		$scope.login = login;
		$scope.register = register;
        $scope.loginModal = loginModal;
        $scope.registerModal = registerModal;
        
        $scope.loginModalShow = false;
        $scope.registerModalShow = false;
        
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
<<<<<<< HEAD
			
			

			
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
=======
            console.log("clicked login");
            
            $scope.registerModalShow = false;
            $scope.loginModalShow = true;            
>>>>>>> f4a68bdc532d3bb89699459fd6bf859a1f5582e8
		}

		function registerModal() {
            $scope.loginModalShow = false;
            $scope.registerModalShow = true;
            
            /*
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
			}*/
		}
	}
})();