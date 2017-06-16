(function (){
    'use strict'

    angular
        .module('app')
        .controller('VideoNavbarCtrl', VideoNavbarCtrl);
    
    VideoNavbarCtrl.$inject = ['$window','$scope','AuthService'];

    function VideoNavbarCtrl($window, $scope, AuthService){
        $scope.video;

        $scope.logout = logout;
        $scope.playVideo = playVideo;    

        ///////////////////  

        function logout(){
            AuthService.logout().then(() => {
                $window.location.href = '/';
            });
        }

        function playVideo(index) {
            console.log(index, $scope.currentPlaylist.length);
            if(index < 0 || index > $scope.currentPlaylist.length) return;

            for(var i = 0; i < $scope.songs.length; i++){
                if($scope.isFoundSong($scope.songs[i], index)) {
                    $scope.displayVideo($scope.songs[i]);
                }
            } 
        }
    }  
})();