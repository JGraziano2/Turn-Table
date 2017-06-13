(function (){
    'use strict'
    
    angular
        .module('app')
        .controller('PlaylistCtrl', PlaylistCtrl);
    
    PlaylistCtrl.$inject = ['$scope', '$firebaseArray', '$stateParams'];
    
    function PlaylistCtrl($scope, $firebaseArray, $stateParams){
        $scope.playlistList;
        $scope.mockUser;
        $scope.songlist;
        
        $scope.editPlaylistList = editPlaylistList;
        $scope.addPlaylist = addPlaylist;
        $scope.editSongs = editSongs;
        $scope.addSong = addSong;
        $scope.savePlaylistList = savePlaylistList;
        $scope.saveSonglist = saveSonglist;
        
        $scope.isEditingPlaylistList = false;
        $scope.isEditingSongs = false;
        
        activate();
        
        function activate(){
            //get playlist and song array from database
            //songlist and playlist
            var ref = firebase.database().ref();
            //$scope.playlist = $firebaseArray(ref.child($stateParams.id).child('playlistList'));
            $scope.mockUser = $firebaseObject(ref);
            $scope.playlistList = $firebaseArray(mockUser.child('playlistList'));

            //TODO: needs to get all songs with the playlistId
            //$scope.playlist = $firebaseArray(ref.child($stateParams.id).child('playlistList'));
//            $scope.songs = $firebaseArray(ref.child('songs'));
//            var playlistId = playlist.id;
//            for(i in songs){
//                if(songs[i].playlistIds.includes(playistId)) songs.push();
//            }
            
        }
        
        function editPlaylistList(){
            $scope.isEditingPlaylistList = true;
        }
        
        function addPlaylist(){
            $scope.playlistList.$add({id: '', name: ''});
        }
        
        function editSongs(){
            $scope.isEditingSongs = true;
        }
        
        function addSong(){            
            
        }
            
        function savePlaylistList(){
//            for(var i=0; i<$scope.playlistList.length; i++){
//             $scope.playlistList.$save($scope.playlistList[i]);   
//            }
            $scope.isEditingPlaylistList = false;
        }
            
        function saveSonglist(){
            $scope.isEditingSongs = false;
        }
        
        
    }
    
})();