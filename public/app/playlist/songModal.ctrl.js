(function() {
	'use strict';

	angular
		.module('app')
		.controller('SongCtrl', SongCtrl);

	SongCtrl.$inject = ['$scope'];

	function SongCtrl($scope){

		//any necessary methods for our modal
		$scope.getSongID = getSongID;

		activate();

		function activate(){

		}

		function getSongID(vidUrl){
            return vidUrl.slice(32);
        }

        function displayVideo(){
        	return '<iframe width="560" height="315" src="https://www.youtube.com/embed/' + getSongID("https://www.youtube.com/watch?v=qFLhGq0060w") + 'frameborder="0" allowfullscreen></iframe>';
        }
	}

})();