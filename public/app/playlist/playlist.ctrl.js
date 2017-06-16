(function (){
    'use strict'

    angular
        .module('app')
        .controller('PlaylistCtrl', PlaylistCtrl);
    
    PlaylistCtrl.$inject = ['$window','$scope', '$q', '$stateParams', '$firebaseObject', '$firebaseArray', '$sce', 'ModalService', 'PlaylistService', 'AuthService'];

    function PlaylistCtrl($window, $scope, $q, $stateParams, $firebaseObject, $firebaseArray, $sce, ModalService, PlaylistService, AuthService){        
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
        $scope.toggleShuffle = toggleShuffle;
        var shuffleIsOn = false;


        activate();

        function activate(){
            var playlistsRef = firebase.database().ref().child($stateParams.id).child('playlists');            
            $scope.playlists = $firebaseArray(playlistsRef);

            var songsRef = firebase.database().ref().child($stateParams.id).child('songs');  
            $scope.songs = $firebaseArray(songsRef);

            $q.all([$scope.playlists.$loaded(), $scope.songs.$loaded()])
            .then((data) => {
                $scope.playlists = data[0];  
                $scope.songs = data[1];

                selectPlaylist($scope.playlists[0]);
                for(var i = 0; i < $scope.songs.length; i++){
                    if(isFoundSong($scope.songs[i], 0))
                        displayVid($scope.songs[i]);                    
                }
            }).catch((error) => {
                console.log(error);
            });
        }

        /*-- PLAYLIST METHODS --*/

        function addPlaylist(){
            $scope.playlists.$add({name: 'New Playlist', length: 0})
            .then((data) => {
                $scope.currentPlaylist = data[0];
            }).catch((error) => {
                console.log(error);
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

        function selectPlaylist(playlist, $event){
            $(".btn").removeClass('active');
            $scope.currentPlaylist = playlist;
            $(event.target).addClass('active');
        }

        /*-- SONG METHODS --*/

        function addSong(){
            $scope.songs.$add({
                name: "New Song", 
                url: "", 
                playlistId: $scope.currentPlaylist.$id, 
                index: $scope.currentPlaylist.length,
                randIndex: -1
            });
            $scope.currentPlaylist.length++; 
            $scope.playlists.$save($scope.currentPlaylist);
            loadRandomIndicies();
        } 

        function editSongs(){
            $scope.isEditingSongs = true;
        }

        function moveSongUp(song) {
            console.log(song);
            if (song.index <= 0) return;
            var previousSong = findSong(song.index-1);
            swapSongs(song, previousSong, -1)    
        }

        function moveSongDown(song){
            console.log(song);
            if(song.index >= $scope.currentPlaylist.length) return;
            var nextSong = findSong(song.index+1);
            swapSongs(song, nextSong, 1)
        }

        function removeSong(song){
            $scope.currentPlaylist.length--;
            $scope.playlists.$save($scope.currentPlaylist);
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
            $scope.video = $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + song.url.slice(32) + "?ecver=1");
        }
        
        function playNext(){
            var currentIndex;
            if(shuffleIsOn){
                currentIndex = $scope.currentSong.randIndex;
            }else{
                currentIndex = $scope.currentSong.index;
            }
            if(currentIndex == $scope.currentPlaylist.length-1)  currentIndex = -1;
            console.log("Searching for index:"+currentIndex)
            for(var i = 0; i < $scope.songs.length; i++){
                if(isFoundSong($scope.songs[i], currentIndex+1)) {
                    displayVid($scope.songs[i]);
                    break;
                }
            } 
            
        }
        
        function playPrev(){
            var currentIndex = shuffleIsOn ? 
                currentIndex = $scope.currentSong.randIndex : 
                currentIndex = $scope.currentSong.index;
                
            if(currentIndex == 0) currentIndex = $scope.currentPlaylist.length;
            console.log("Searching for index:"+currentIndex)
            for(var i = 0; i < $scope.songs.length; i++){
                if(isFoundSong($scope.songs[i], currentIndex-1)) {
                    displayVid($scope.songs[i]);
                    break;
                }
            }              
        }
        
        function toggleShuffle(){
            shuffleIsOn = !shuffleIsOn;
            if(shuffleIsOn) $('#shuffleButton').css('color', '#ee4');
            if(!shuffleIsOn) $('#shuffleButton').css('color', 'white');
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
            if(shuffleIsOn) return song.playlistId==$scope.currentPlaylist.$id && song.randIndex == songIndex;
            return song.playlistId == $scope.currentPlaylist.$id && song.index == songIndex;
        }

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
        
        function getRandomSequence(n){
            var retArr = [];
            for(var i=0; i<n; i++){
                retArr.push(i);
            }
            for(var i=0; i<n*2; i++){
                var swapIndex = parseInt(Math.random()*n);
                if(swapIndex<retArr.length-1&&swapIndex>=0){
                    //console.log(swapIndex)
                    var swapVal = retArr[swapIndex];
                    retArr[swapIndex] = retArr[swapIndex+1];
                    retArr[swapIndex+1] = swapVal; 
                }                
            }
            return retArr;
        }
        
        function loadRandomIndicies(){
            var randomSequence = getRandomSequence($scope.currentPlaylist.length);
            for(var i=0; i<$scope.currentPlaylist.length; i++){
                for(var j=0; j<$scope.songs.length; j++){
                    if($scope.songs[j].index==i){
                        $scope.songs[j].randIndex = randomSequence[i];
                    }
                }
            }
        }
    }  
})();