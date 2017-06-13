(function(){
    'use strict';
    
    angular
        .module('app')
        .config(config);
    
    config.$inject = ['$stateProvider'];
    
    function config($stateProvider) {
        $stateProvider
            .state('playlist', {
                url: '/playlist/{id}',
                templateUrl: 'app/playlist/playlist.tpl.html',
                controller: 'PlaylistCtrl'
        });            
    }    
})();