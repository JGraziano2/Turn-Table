(function() {
    'use strict';

    angular
        .module('app')
        .config(config);

    config.$inject = ['$stateProvider'];

    function config($stateProvider) {
        $stateProvider
            .state('home', {
            url: '/',
            templateUrl:'app/auth/templates/home.tpl.html',
            controller: 'HomeCtrl'
        });
    }
})();