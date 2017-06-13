
(function() {
	'use strict';

	angular
		.module('app', ['angularModalService'])
		.controller('ModalCtrl', ModalCtrl);

	ModalCtrl.$inject = ['$scope', 'ModalService'];
	LoginCtrl.$inject = ['$scope', 'ModalService'];

	function ModalCtrl($scope, ModalService) {
		function openLogin(){
			$scope.ModalService.showModel({
				templateUrl: 'loginModal.tpl.html',
				controller: 'LoginCtrl'
			}).then(function(modal) {
				modal.element.modal();
			});
		}

		function close(){
			$scope.close;
		}
	}

	function LoginCtrl() {

	}


})();