(function (){
    'use strict'

    angular
        .module('app')
        .controller('PlaylistCtrl', PlaylistCtrl);
    
    PlaylistCtrl.$inject = ['$scope', '$firebaseArray', '$stateParams', '$firebaseObject', '$window', 'ModalService', 'PlaylistService', '$sce'];

    function PlaylistCtrl($scope, $firebaseArray, $stateParams, $firebaseObject, $window, ModalService, PlaylistService, $sce){        

        $scope.playlists;        
        $scope.editPlaylists = editPlaylists;
        $scope.addPlaylist = addPlaylist;
        $scope.savePlaylists = savePlaylists;
        $scope.removePlaylist = removePlaylist;
        $scope.selectPlaylist = selectPlaylist;

        $scope.logout = logout;
        
        $scope.displayVid = displayVid;
        $scope.userSongs;
        $scope.editSongs = editSongs;
        $scope.addSong = addSong;        
        $scope.saveSonglist = saveSonglist;

        $scope.moveSongUp = moveSongUp;
        $scope.moveSongDown = moveSongDown;
        
        $scope.removeSong = removeSong; 
        $scope.video;
        $scope.currSong;
        $scope.playNext = playNext;
        $scope.playPrev = playPrev;

        $scope.isEditingPlaylists = false;
        $scope.isEditingSongs = false;

        $scope.curPlaylistId = 0;
        var playlistLength;
        $scope.currID;

        activate();

        function activate(){
            var ref = firebase.database().ref().child($stateParams.id).child('playlists');            
            $scope.playlists = $firebaseArray(ref);

            $scope.playlists.$loaded().then(function(data) {
                if($scope.playlists.length==0) addPlaylist();
                $scope.curPlaylistId = $scope.playlists[0].$id;
                playlistLength = $scope.playlists[0].length;
            });

            var ref = firebase.database().ref().child($stateParams.id).child('songs');  
            $scope.userSongs = $firebaseArray(ref); 
            $scope.userSongs.$loaded().then(function(data) {
                for(var i = 0; i < $scope.userSongs.length; i++){
                    if($scope.userSongs[i].playlistId == $scope.curPlaylistId && $scope.userSongs[i].index == 1)
                        displayVid($scope.userSongs[i]);
                }
                // $scope.video = $sce.trustAsResourceUrl($scope.userSongs[0].url);
                // $scope.currSong = $scope.userSongs[0].url; 
                // $scope.currID = $scope.userSongs[0].$id;
            });
        }

        function editPlaylists(){
            $scope.isEditingPlaylists = true;
        }

        function addPlaylist(){
            $scope.playlists.$loaded().then(function(data){
                $scope.playlists.$add({name: 'New Playlist', length: 0});
                $scope.curPlaylistId = $scope.playlists[0].$id;
            });    
            activate();
        }

        function removePlaylist(playlist){
            for(var i=0; i<$scope.userSongs.length; i++){
                if($scope.userSongs[i].playlistId==playlist.$id) $scope.userSongs.$remove($scope.userSongs[i]);
            }
            $scope.playlists.$remove(playlist);
        }

        function savePlaylists(){
            for(var i=0; i<$scope.playlists.length; i++){
                $scope.playlists.$save($scope.playlists[i]);   
            }
            $scope.isEditingPlaylists = false;
        }

        function selectPlaylist(playlist){
            $scope.curPlaylistId = playlist.$id;  
            playlistLength = playlist.length;
        }   

        function editSongs(){
            $scope.isEditingSongs = true;
        }

        function addSong(){
            var playlist;
            $scope.playlists.$loaded().then( function(data){
                for(var i=0; i<$scope.playlists.length; i++){
                    if($scope.playlists[i].$id===$scope.curPlaylistId){
                        playlist=$scope.playlists[i];
                        $scope.playlists[i].length+=1;
                        playlistLength = $scope.playlists[i].length;
                        savePlaylists();
                    }  
                }
                $scope.userSongs.$add({name: "New Song", url: "", playlistId: $scope.curPlaylistId, index:playlist.length});
            });
        }

        function removeSong(song){
            $scope.userSongs.$remove(song);
        }        

        function saveSonglist(){
            for(var i=0; i<$scope.userSongs.length; i++){
                $scope.userSongs.$save($scope.userSongs[i]);   
            }
            $scope.isEditingSongs = false;
        }

        function moveSongUp(song){
            var curSongId = song.$id, curSongIndex = song.index;
            var prevSongId, prevSongIndex;            
            if(curSongIndex!=1){ 
                for(var i=0; i<$scope.userSongs.length; i++){
                    if($scope.userSongs[i].index==curSongIndex-1){
                        prevSongId = $scope.userSongs[i].$id;
                        prevSongIndex = $scope.userSongs[i].index;
                    }
                }
                for(var i=0; i<$scope.userSongs.length; i++){
                    if($scope.userSongs[i].$id==curSongId) $scope.userSongs[i].index = prevSongIndex;
                    if($scope.userSongs[i].$id==prevSongId) $scope.userSongs[i].index = curSongIndex;
                }                              
            }else{
                console.log("Out of bounds movement attempt!!!!")
            }
        }

        function moveSongDown(song){
            var curSongId = song.$id, curSongIndex = song.index;
            var nextSongId, nextSongIndex;            
            if(curSongIndex!=playlistLength){ 
                for(var i=0; i<$scope.userSongs.length; i++){
                    if($scope.userSongs[i].index==curSongIndex+1){
                        nextSongId = $scope.userSongs[i].$id;
                        nextSongIndex = $scope.userSongs[i].index;
                    }
                }
                for(var i=0; i<$scope.userSongs.length; i++){
                    if($scope.userSongs[i].$id==curSongId) $scope.userSongs[i].index = nextSongIndex;
                    if($scope.userSongs[i].$id==nextSongId) $scope.userSongs[i].index = curSongIndex;
                }                              
            }else{
                console.log("Out of bounds movement attempt!!!!")
            }
        }

        function logout(){
            firebase.auth().signOut().then(function() {
                $window.location.href = '/';
            }, function(error) {
                console.log(error);
            });
        }

        function displayVid(song) {
            $scope.currID = song.$id;
            PlaylistService.setID(song.url);
            $scope.video = $sce.trustAsResourceUrl(PlaylistService.getID());
            $scope.currSong = song.url;
        }
        
        function playNext(){
            var currPlaylistID, currSongIndex;
            for(var i = 0; i<$scope.userSongs.length; i++){
                if($scope.userSongs[i].$id == $scope.currID){
                    currPlaylistID = $scope.userSongs[i].playlistId;
                    currSongIndex = $scope.userSongs[i].index;
                }
            }

            if(currSongIndex != playlistLength){
                for(var i = 0; i < $scope.userSongs.length; i++){
                    if($scope.userSongs[i].index == currSongIndex+1 && $scope.userSongs[i].playlistId == currPlaylistID){
                        displayVid($scope.userSongs[i]);
                        break;
                    }
                }                
            }
        }
        
        function playPrev(){
            var currPlaylistID, currSongIndex;
            for(var i = 0; i<$scope.userSongs.length; i++){
                if($scope.userSongs[i].$id == $scope.currID){
                    currPlaylistID = $scope.userSongs[i].playlistId;
                    currSongIndex = $scope.userSongs[i].index;
                }
            }

            if(currSongIndex != 1){
                for(var i = 0; i < $scope.userSongs.length; i++){
                    if($scope.userSongs[i].index == currSongIndex-1 && $scope.userSongs[i].playlistId == currPlaylistID){
                        console.log('we here');
                        displayVid($scope.userSongs[i]);
                        break;
                    }
                }                
            }
        }
    }  
})();