(function() {
	'use strict';

	angular
		.module('app')
		.service('PlaylistService', PlaylistService)

	function PlaylistService(){

		var service = {
			getID: getID,
			setID: setID,
		};

		var songID = "";

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