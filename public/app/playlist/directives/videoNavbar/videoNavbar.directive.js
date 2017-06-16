(function() {
	'use strict';

	angular
		.module('app')
		.directive('videoNavbar', videoNavbar);

	videoNavbar.$inject = [];

	function videoNavbar() {
		return {
			restrict: 'EA',
			replace: true,
			templateUrl: 'app/playlist/directives/videoNavbar/videoNavbar.tpl.html',
			controller: 'VideoNavbarCtrl'
		};
	}
})();