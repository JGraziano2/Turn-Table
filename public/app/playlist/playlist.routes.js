(function(){
    'use strict'
    
    angular
        .module('app')
        .config(config);
    
    config.$inject = ['$stateProvider'];
    
    function config($stateProvider) {
        $stateProvider
            .state('playlist', {
                url: '/playlist',
<<<<<<< HEAD
                template: '<playlist></playlist>'
=======
                templateUrl: 'app/playlist/playlist.tpl.html',
                controller: 'PlaylistCtrl'
>>>>>>> aa77030cdefbd6d26504385fdba5184b641ef55c
        });            
    }    
})();