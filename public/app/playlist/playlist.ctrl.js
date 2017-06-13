(function (){
    'use strict'
    
    angular
        .module('app')
        .controller('PlaylistCtrl', PlaylistCtrl);
    
    PlaylistCtrl.$inject = ['$scope', '$firebaseArray', '$stateParams', '$firebaseObject'];
    
    function PlaylistCtrl($scope, $firebaseArray, $stateParams, $firebaseObject){
        $scope.playlistList;
        $scope.songlist;
        
        $scope.editPlaylistList = editPlaylistList;
        $scope.addPlaylist = addPlaylist;
        $scope.editSongs = editSongs;
        //$scope.addSong = addSong;
        $scope.savePlaylistList = savePlaylistList;
        $scope.saveSonglist = saveSonglist;
        $scope.removeSong = removeSong;
        $scope.removePlaylist = removePlaylist;
        $scope.selectPlaylist = selectPlaylist;
        
        $scope.isEditingPlaylistList = false;
        $scope.isEditingSongs = false;
        
        activate();
        
        function activate(){
            //get playlist and song array from database
            //songlist and playlist
            var ref = firebase.database().ref();
            //$scope.playlist = $firebaseArray(ref.child($stateParams.id).child('playlistList'));
            $scope.playlistList = $firebaseArray(ref.child('stateParamsid').child('playlistList'));

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
        
        function removePlaylist(playlist){
            $scope.playlistList.$remove(playlist);
        }
        
        function editSongs(){
            $scope.isEditingSongs = true;
        }
        
//        function addSong(){            
//            $scope.songlist.add$({name: "", url: "", playlistLists.$ref().key()});
//        }
        
        function removeSong(song){
            $scope.songlist.$remove(song);
        }
            
        function savePlaylistList(){
            for(var i=0; i<$scope.playlistList.length; i++){
             $scope.playlistList.$save($scope.playlistList[i]);   
            }
            $scope.isEditingPlaylistList = false;
        }
            
        function saveSonglist(){
            $scope.isEditingSongs = false;
        }
        
        function selectPlaylist(playlist){
            console.log(playlist.$id);
            
        }
        
        
    }
    
})();