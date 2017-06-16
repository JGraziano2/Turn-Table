(function() {
	'use strict';

	angular
		.module('app')
		.directive('songs', songs);

	songs.$inject = [];

	function songs() {
		return {
			restrict: 'EA',
			replace: true,
			templateUrl: 'app/playlist/directives/songs/songs.tpl.html',
			controller: 'SongsCtrl'
		};
	}
})();