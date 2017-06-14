(function (){
    'use strict'
    
    angular
        .module('app')
        .controller('PlaylistCtrl', PlaylistCtrl);
    
    PlaylistCtrl.$inject = ['$scope', '$firebaseArray', '$stateParams', '$firebaseObject'];
    
    function PlaylistCtrl($scope, $firebaseArray, $stateParams, $firebaseObject){        
        
        $scope.playlists;        
        $scope.editPlaylists = editPlaylists;
        $scope.addPlaylist = addPlaylist;
        $scope.savePlaylists = savePlaylists;
        $scope.removePlaylist = removePlaylist;
        $scope.selectPlaylist = selectPlaylist;
        
        $scope.loadSongs = loadSongs;
        $scope.userSongs;
        $scope.songs = [];
        $scope.editSongs = editSongs;
        $scope.addSong = addSong;        
        $scope.saveSonglist = saveSonglist;
        $scope.removeSong = removeSong;        
        
        $scope.isEditingPlaylists = false;
        $scope.isEditingSongs = false;
        
        var curPlaylistId = 0;
        
        activate();       
        
        function activate(){
            var ref = firebase.database().ref().child($stateParams.id).child('playlists');            
            $scope.playlists = $firebaseArray(ref);
            console.log("current playlist ID = " + curPlaylistId);
            
            var ref = firebase.database().ref().child($stateParams.id).child('songs');  
            $scope.userSongs = $firebaseArray(ref);   
            console.log("$scope.userSongs: " + $scope.userSongs);
            loadSongs();                             
        }
        
        function editPlaylists(){
            $scope.isEditingPlaylists = true;
        }
        
        function addPlaylist(){
            $scope.playlists.$add({name: 'New Playlist'});
            curPlaylistId = $scope.playlists[0].$id;
        }
        
        function removePlaylist(playlist){
            $scope.playlists.$remove(playlist);
        }
        
        function savePlaylists(){
            for(var i=0; i<$scope.playlists.length; i++){
             $scope.playlists.$save($scope.playlists[i]);   
            }
            $scope.isEditingPlaylists = false;
        }
        
        function selectPlaylist(playlist){
            $scope.songs=[];
            curPlaylistId = playlist.$id;    
            loadSongs();
        }   
        
        function editSongs(){
            $scope.isEditingSongs = true;
        }
        
        function addSong(){            
            $scope.userSongs.$add({name: "New Song", url: "", playlistId: curPlaylistId});
            loadSongs();
        }
        
        function removeSong(song){
            $scope.userSongs.$remove(song);
        }        
            
        function saveSonglist(){            
            for( var i in $scope.songs){
                $scope.userSongs.$save($scope.songs[i]).catch(function(error){
                    console.log(error);
                });
            }
            $scope.isEditingSongs = false;
            activate();
        }
        
        function loadSongs(){
            for(var i=0; i<$scope.userSongs.length; i++){
                console.log($scope.userSongs[i].playlistId);
                if($scope.userSongs[i].playlistId === curPlaylistId){
                    $scope.songs.push($scope.userSongs[i]);    
                }             
            } 
        }
    }
    
})();