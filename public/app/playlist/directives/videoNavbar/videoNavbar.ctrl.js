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
        $scope.toggleShuffle = toggleShuffle;

        var shuffleIsOn = false;  

        ///////////////////  

        function logout(){
            AuthService.logout().then(() => {
                $window.location.href = '/';
            });
        }

        function playVideo(index) {
            var currentIndex = index;
            
            if(index < 0) currentIndex = $scope.currentPlaylist.length-1;
            if(index > $scope.currentPlaylist.length) currentIndex = 0;
            if(shuffleIsOn) currentIndex = $scope.currentSong.randIndex;

            for(var i = 0; i < $scope.songs.length; i++){
                if($scope.isFoundSong($scope.songs[i], currentIndex)) {
                    $scope.displayVideo($scope.songs[i]);
                }
            } 
        }
        
        function toggleShuffle(){
            shuffleIsOn = !shuffleIsOn;
            if(shuffleIsOn) $('#shuffleButton').css('color', '#ee4');
            if(!shuffleIsOn) $('#shuffleButton').css('color', 'white');
        }
    }  
})();