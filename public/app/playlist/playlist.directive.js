(function(){
    'use strict'
    
    angular
        .module('app')
        .directive('playlist', playlist);
    
    playlist.$inject = [];
    
    function playlist(){
        return {
            replace: true,
            restrict: 'EA',
            templateUrl: 'app/playlist/playlist.tpl.html',
            controller: 'PlaylistCtrl'            
        }
    }
})();