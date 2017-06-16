(function (){
    'use strict'

    angular
        .module('app')
        .controller('PlaylistsCtrl', PlaylistsCtrl);
    
    PlaylistsCtrl.$inject = ['$scope','$stateParams','$firebaseArray'];

    function PlaylistsCtrl($scope, $stateParams, $firebaseArray){  
        $scope.currentPlaylist;      
        $scope.isEditingPlaylists = false;

        $scope.addPlaylist = addPlaylist;     
        $scope.editPlaylists = editPlaylists;
        $scope.removePlaylist = removePlaylist;
        $scope.savePlaylists = savePlaylists;
        $scope.selectPlaylist = selectPlaylist;

        activate();

        ////////////////////////

        function activate() {
            var playlistsRef = firebase.database().ref().child($stateParams.id).child('playlists'); 
            $scope.playlists = $firebaseArray(playlistsRef);

            $scope.playlists.$loaded().then((data) => {
                $scope.playlists = data;
                $scope.selectPlaylist($scope.playlists[0]);                
            });
        }

        function addPlaylist(){
            $scope.playlists.$add({name: 'New Playlist', length: 0})
            .then((data) => {
                $scope.currentPlaylist = data[0];
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
    }  
})();