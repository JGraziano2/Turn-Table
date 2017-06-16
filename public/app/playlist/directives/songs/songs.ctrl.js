(function (){
    'use strict'

    angular
        .module('app')
        .controller('SongsCtrl', SongsCtrl);
    
    SongsCtrl.$inject = ['$scope','$stateParams','$firebaseArray'];

    function SongsCtrl($scope, $stateParams, $firebaseArray){ 
        $scope.currentSong;   
        $scope.isEditingSongs = false;

        $scope.addSong = addSong;
        $scope.editSongs = editSongs;
        $scope.isFoundSong = isFoundSong; 
        $scope.moveSongUp = moveSongUp;
        $scope.moveSongDown = moveSongDown; 
        $scope.removeSong = removeSong; 
        $scope.saveSongs = saveSongs;
        $scope.selectSong = selectSong;

        activate();

        ////////////////////

        function activate() {            
            var songsRef = firebase.database().ref().child($stateParams.id).child('songs'); 
            $scope.songs = $firebaseArray(songsRef);

            $scope.songs.$loaded().then((data) => {
                $scope.songs = data;

                for(var i = 0; i < $scope.songs.length; i++){
                    if($scope.isFoundSong($scope.songs[i], 0))
                        $scope.displayVideo($scope.songs[i]);                    
                }
            });
        }

        function addSong(){
            $scope.songs.$add({
                name: "New Song", 
                url: "", 
                playlistId: $scope.currentPlaylist.$id, 
                index: $scope.currentPlaylist.length
            });
            $scope.currentPlaylist.length++; 
            $scope.playlists.$save($scope.currentPlaylist);          
        } 

        function editSongs(){
            $scope.isEditingSongs = true;
        }

        function isFoundSong(song, songIndex) {
            return song.playlistId == $scope.currentPlaylist.$id && song.index == songIndex;
        }

        function moveSongUp(song) {
            if (song.index <= 0) return;
            var previousSong = findSong(song.index-1);
            swapSongs(song, previousSong, -1)    
        }

        function moveSongDown(song){
            if(song.index >= $scope.currentPlaylist.length) return;
            var nextSong = findSong(song.index+1);
            swapSongs(song, nextSong, 1)
        }

        function removeSong(song){
            $scope.currentPlaylist.length--;
            $scope.songs.$remove(song); 
        }        

        function saveSongs(){
            $scope.songs.forEach((song) => {
                $scope.songs.$save(song);
            });
            $scope.isEditingSongs = false;
        }

        function selectSong(song) {
            console.log(song);
            $scope.currentSong = song;
            $scope.displayVideo(song);
        }

        /*-- HELPER METHODS --*/

        function findSong(songIndex) {
            for(var i=0; i<$scope.songs.length; i++){          
                if(isFoundSong($scope.songs[i], songIndex)) {
                    return $scope.songs[i];
                }
            }
        }

        function swapSongs(song, swap, indexChange) {
            swap.index = song.index;
            song.index += indexChange;
            $scope.songs.$save(song);
            $scope.songs.$save(swap);
        }
    }  
})();