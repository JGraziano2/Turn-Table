(function() {
	'use strict';

	angular
		.module('app')
		.factory('AuthService', AuthService);

	AuthService.$inject = ['$firebaseAuth'];

	function AuthService($firebaseAuth){
		var authObj = $firebaseAuth();

		var service = {
			register: register,
			login: login,
			logout: logout,
			isLoggedIn: isLoggedIn
		}

		return service;

		///////////////

		function register(email, password){
			return authObj.$createUserWithEmailAndPassword(email, password);
		}

		function login(email, password){
			return authObj.$signInWithEmailAndPassword(email, password);
		}

		function logout(){
			return authObj.$signOut();
		}

		function isLoggedIn(){
			return authObj.$isSignedIn();
		}
	}

})();