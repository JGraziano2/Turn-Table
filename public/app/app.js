(function() {
	'use strict';

	var config = {
		apiKey: "AIzaSyC-259KUREALrIoVsjiUGVL4N0liVFcl3c",
	    authDomain: "turntable-60564.firebaseapp.com",
	    databaseURL: "https://turntable-60564.firebaseio.com",
	    projectId: "turntable-60564",
	    storageBucket: "turntable-60564.appspot.com",
	    messagingSenderId: "212071875365"
		};
	firebase.initializeApp(config);

	angular
		.module('app', ['ui.router', 'firebase']);
})();