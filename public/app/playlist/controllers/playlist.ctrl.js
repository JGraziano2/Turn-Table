(function (){
    'use strict'

    angular
        .module('app')
        .controller('PlaylistCtrl', PlaylistCtrl);
    
    PlaylistCtrl.$inject = ['$scope','$sce'];

    function PlaylistCtrl($scope, $sce){
        $scope.video;

        $scope.displayVideo = displayVideo;

        /////////////////////

        function displayVideo(song) {
            $scope.currentSong = song;
            $scope.video = $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + song.url.slice(32) + "?ecver=1");
        }
    }  
})();