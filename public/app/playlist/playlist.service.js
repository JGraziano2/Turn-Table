(function() {
	'use strict';

	angular
		.module('app')
		.service('sharedProperties', playlistService)

	function playlistService(){

		var service = {
			getID: getID,
			setID: setID
		}

		return service;

		//////////////////

		function getID(){
			return songID;
		}

		function setID(newID){
			songID = newID;
		}
	}
})();