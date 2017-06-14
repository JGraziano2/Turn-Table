(function() {
	'use strict';

	angular
		.module('app')
		.controller('SongCtrl', SongCtrl);

	SongCtrl.$inject = ['$scope', 'PlaylistService', '$sce'];

	function SongCtrl($scope, PlaylistService, $sce){
		$scope.video;
		activate();

		function activate(){
			$scope.video = $sce.trustAsResourceUrl(PlaylistService.getID());
			console.log($scope.video);
		}
	}

})();