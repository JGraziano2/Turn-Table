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
        $scope.userSongs;
        $scope.editSongs = editSongs;
        $scope.addSong = addSong;        
        $scope.saveSonglist = saveSonglist;
        $scope.removeSong = removeSong;        

        $scope.isEditingPlaylists = false;
        $scope.isEditingSongs = false;

        $scope.curPlaylistId = 0;

        activate();       

        function activate(){
            var ref = firebase.database().ref().child($stateParams.id).child('playlists');            
            $scope.playlists = $firebaseArray(ref);

            $scope.playlists.$loaded().then(function(data) {
                $scope.curPlaylistId = $scope.playlists[0].$id;
            });

            var ref = firebase.database().ref().child($stateParams.id).child('songs');  
            $scope.userSongs = $firebaseArray(ref);   
            console.log('songs', $scope.userSongs);
        }

        function editPlaylists(){
            $scope.isEditingPlaylists = true;
        }

        function addPlaylist(){
            $scope.playlists.$add({name: 'New Playlist'});
            $scope.curPlaylistId = $scope.playlists[0].$id;
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
            $scope.curPlaylistId = playlist.$id;
        }   

        function editSongs(){
            $scope.isEditingSongs = true;
        }

        function addSong(){  
            var newSong = {name: "New Song", url: "", playlistId: $scope.curPlaylistId};
            $scope.userSongs.$add(newSong);
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

        function logout(){
            firebase.auth().signOut().then(function() {
                $window.location.href = '/';
            }, function(error) {
                console.log(error);
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