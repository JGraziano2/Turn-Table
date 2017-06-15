(function (){
    'use strict'

    angular
        .module('app')
        .controller('PlaylistCtrl', PlaylistCtrl);
    
    PlaylistCtrl.$inject = ['$window','$scope', '$stateParams', '$firebaseObject', '$firebaseArray', '$sce', 'ModalService', 'PlaylistService', 'AuthService'];

    function PlaylistCtrl($window, $scope, $stateParams, $firebaseObject, $firebaseArray, $sce, ModalService, PlaylistService, AuthService){        
        $scope.logout = logout;
        $scope.isEditingPlaylists = false;
        $scope.isEditingSongs = false;

        /*-- PLAYLISTS --*/
        $scope.playlists; 
        $scope.currentPlaylist;  
        $scope.addPlaylist = addPlaylist;     
        $scope.editPlaylists = editPlaylists;
        $scope.removePlaylist = removePlaylist;
        $scope.savePlaylists = savePlaylists;
        $scope.selectPlaylist = selectPlaylist;

        /*-- SONGS --*/
        $scope.songs;
        $scope.currentSong;
        $scope.addSong = addSong;
        $scope.editSongs = editSongs; 
        $scope.moveSongUp = moveSongUp;
        $scope.moveSongDown = moveSongDown; 
        $scope.removeSong = removeSong; 
        $scope.saveSongs = saveSongs;

        /*-- VIDEOS --*/ 
        $scope.video;
        $scope.displayVid = displayVid;  
        $scope.playNext = playNext;
        $scope.playPrev = playPrev;


        activate();

        function activate(){
            var ref = firebase.database().ref().child($stateParams.id).child('playlists');            
            $scope.playlists = $firebaseArray(ref);
            selectPlaylist($scope.playlists[0]);

            var ref = firebase.database().ref().child($stateParams.id).child('songs');  
            $scope.songs = $firebaseArray(ref);
            for(var i = 0; i < $scope.songs.length; i++){
                if(isFoundSong($scope.songs[i], 1))
                    displayVid($scope.songs[i]);                    
            }
        }

        /*-- PLAYLIST METHODS --*/

        function addPlaylist(){
            $scope.playlists.$add({name: 'New Playlist', length: 0})
            .then((data) => {
                $scope.currentPlaylist.$id = data[0].$id;
            });
        }

        function editPlaylists(){
            $scope.isEditingPlaylists = true;
        }

        function removePlaylist(playlist){
            for(var i=0; i<$scope.songs.length; i++){
                if($scope.songs[i].playlistId == playlist.$id) 
                    $scope.songs.$remove($scope.songs[i]);
            }
            $scope.playlists.$remove(playlist);
        }

        function savePlaylists(){
            $scope.playlists.forEach((playlist) => {                
                $scope.playlists.$save(playlist); 
            });
            $scope.isEditingPlaylists = false;
        }

        function selectPlaylist(playlist){
            $scope.currentPlaylist = playlist;
        }

        /*-- SONG METHODS --*/

        function addSong(){
            $scope.currentPlaylist.length++; 
            $scope.songs.$add({
                name: "New Song", 
                url: "", 
                playlistId: $scope.currentPlaylist.$id, 
                index: $scope.currentPlaylist.length
            });           
        }  

        function editSongs(){
            $scope.isEditingSongs = true;
        }

        function moveSongUp(song) {
            if (song.index == 1) return;
            var previousSong = findSong(song.index-1);
            swapSongs(song, previousSong);            
        }

        function moveSongDown(song){
            if(song.index >= $scope.currentPlaylist.length) return;
            var nextSong = findSong(song.index+1);
            swapSongs(song, nextSong);
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

        /*-- VIDEO METHODS --*/

        function displayVid(song) {
            $scope.currentSong = song;
            $scope.video = $sce.trustAsResourceUrl(song.url);
        }
        
        function playNext(){
            if($scope.currentSong.index >= $scope.currentPlaylist.length) return;
            for(var i = 0; i < $scope.songs.length; i++){
                if(isFoundSong($scope.songs[i], $scope.currentSong.index+1)) {
                    displayVid($scope.currentSong);
                    break;
                }
            } 
        }
        
        function playPrev(){
            if($scope.currentSong.index <= 1) return;
            for(var i = 0; i < $scope.songs.length; i++){
                if(isFoundSong($scope.songs[i], $scope.currentSong.index-1)) {
                    displayVid($scope.currentSong);
                    break;
                }
            } 
        }

        function logout(){
            AuthService.logout().then(() => {
                $window.location.href = '/';
            }, (error) => {
                console.log(error);
            });
        }

        /*-- HELPER METHODS --*/

        function isFoundSong(song, songIndex) {
            return song.playlistId == $scope.currentPlaylist.$id && song.index == songIndex;
        }

        function findSong(songIndex) {
            var song = {};
            for(var i=0; i<$scope.songs.length; i++){          
                if($scope.songs[i].index == songIndex) {
                    song.id = $scope.songs[i].$id;
                    song.index = $scope.songs[i].index;
                    return song;
                }
            }
            return song;
        }

        function swapSongs(song, swap) {
            for(var i=0; i<$scope.songs.length; i++){
                if($scope.songs[i].$id == song.$id) 
                    $scope.songs[i].index = swap.index;
                if($scope.songs[i].$id == swap.$id) 
                    $scope.songs[i].index = song.index;
            }
        }
        
        function getRandomSequence(n){
            var retArr = [];
            for(var i=1; i<=n; i++){
                retArr.push(i);
            }
            for(var i=0; i<n*2; i++){
                var swapIndex = parseInt(Math.random()*n);
                if(swapIndex<retArr.length&&swapIndex>=0){
                    //console.log(swapIndex)
                    var swapVal = retArr[swapIndex];
                    retArr[swapIndex] = retArr[swapIndex+1];
                    retArr[swapIndex+1] = swapVal; 
                }                
            }
            return retArr;
        }
        //console.log("getRandomSequence="+getRandomSequence(5));
    }  
})();