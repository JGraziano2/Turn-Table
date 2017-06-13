(function() {
	'use strict';

	angular
		.module('app')
		.controller('HomeCtrl', HomeCtrl);

	HomeCtrl.$inject = ['$scope', '$state', 'ModalService'];

	function HomeCtrl($scope, $state, ModalService) {
        $scope.showLogin = showLogin;
        $scope.showRegister = showRegister;

		function showLogin() {
            console.log("clicked login");
			ModalService.showModal({
				templateUrl: 'app/auth/templates/loginModal.tpl.html',
				controller: 'ModalCtrl'
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
				templateUrl: 'app/auth/templates/registerModal.tpl.html',
				controller: 'ModalCtrl'
			}).then(function(modal){
				modal.element.modal();
				modal.close.then(function(result){
					console.log('closed: ' + result);
				});
			});
		}
	}
})();