(function() {
    'use strict';

    angular
        .module('app')
        .config(config);

    config.$inject = ['$locationProvider', '$httpProvider'];

    function config($locationProvider, $httpProvider) {
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
    }
})();