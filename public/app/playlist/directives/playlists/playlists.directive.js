(function() {
	'use strict';

	angular
		.module('app')
		.directive('playlists', playlists);

	playlists.$inject = [];

	function playlists() {
		return {
			restrict: 'EA',
			replace: true,
			templateUrl: 'app/playlist/directives/playlists/playlists.tpl.html',
			controller: 'PlaylistsCtrl'
		};
	}
})();