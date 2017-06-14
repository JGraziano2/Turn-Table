(function (){
    'use strict'
    
    angular
        .module('app')
        .controller('PlaylistCtrl', PlaylistCtrl);
    
    PlaylistCtrl.$inject = ['$scope', '$firebaseArray', '$stateParams', '$firebaseObject', '$window', 'ModalService', 'PlaylistService'];

    function PlaylistCtrl($scope, $firebaseArray, $stateParams, $firebaseObject, $window, ModalService, PlaylistService){        

        $scope.playlists;        
        $scope.editPlaylists = editPlaylists;
        $scope.addPlaylist = addPlaylist;
        $scope.savePlaylists = savePlaylists;
        $scope.removePlaylist = removePlaylist;
        $scope.selectPlaylist = selectPlaylist;
        $scope.logout = logout;
        $scope.showSongModal = showSongModal;
        
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
            
            var ref = firebase.database().ref().child($stateParams.id).child('songs');  
            $scope.userSongs = $firebaseArray(ref);   
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
            var newSong = {name: "New Song", url: "", playlistId: curPlaylistId};
            $scope.userSongs.$add(newSong);
            $scope.userSongs.$loaded().then(function(data){
                console.log("Loading songs...")
                loadSongs();
            });            
        }
        
        function removeSong(song){
            $scope.userSongs.$remove(song.$id);
        }        
            
        function saveSonglist(){            
            $scope.isEditingSongs = false;
            loadSongs();
        }
        
        function loadSongs(){
            for(var i=0; i<$scope.userSongs.length; i++){
                if($scope.userSongs[i].playlistId === curPlaylistId){
                    $scope.songs.push($scope.userSongs[i]);    
                }             
            } 
        }

        function logout(){
            firebase.auth().signOut().then(function() {
                $window.location.href = '/';
            }, function(error) {
              // An error happened.
            });
        }

        function showSongModal(url) {
            console.log('url: ' + url);
            PlaylistService.setID(url);
            ModalService.showModal({
                templateUrl: 'app/playlist/songModal.tpl.html',
                controller: 'SongCtrl'
            }).then(function(modal){
                modal.element.modal();
                modal.close.then(function(result){
                    console.log('closed: ' + result);
                });
            });
        }
    }  
})();