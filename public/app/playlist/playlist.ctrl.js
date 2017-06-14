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

        $scope.moveSongUp = moveSongUp;
        $scope.moveSongDown = moveSongDown;
        $scope.movePlaylistUp = movePlaylistUp;
        $scope.movePlaylistDown = movePlaylistDown;


        $scope.isEditingPlaylists = false;
        $scope.isEditingSongs = false;

        $scope.curPlaylistId = 0;
        var playlistLength;

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
            console.log(playlist)
            console.log(playlistLength);
        }   

        function editSongs(){
            $scope.isEditingSongs = true;
        }

        function addSong(){
            var playlist;
            $scope.playlists.$loaded().then( function(data){
//                for(var i=0; i<$scope.playlists.length; i++){
//                    if($scope.playlists[i].$id===$scope.curPlaylistId){
//                        playlist=$scope.playlists[i];
//                        $scope.playlists[i].length+=1;
//                        savePlaylists();
//                    }  
//                }
//                $scope.userSongs.$add({name: "New Song", url: "", playlistId: $scope.curPlaylistId, index:playlist.length});
            });
            for(var i=0; i<$scope.playlists.length; i++){
                    if($scope.playlists[i].$id===$scope.curPlaylistId){
                        playlist=$scope.playlists[i];
                        $scope.playlists[i].length+=1;
                        savePlaylists();
                    }  
                }
            $scope.userSongs.$add({name: "New Song", url: "", playlistId: $scope.curPlaylistId, index:playlist.length});
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

        }

        function moveSongDown(song){
            console.log("movingSong DOWN!");
            var curIndex = 0;
            for(var i=0; i<$scope.userSongs.length; i++){
                if($scope.userSongs[i].$id==song.$id){
                    curIndex = $scope.userSongs[i].index+1;     
                    $scope.userSongs[i].index = -1;
                    console.log("$scope.userSongs[i] = "+$scope.userSongs[i]);
                }
            }
            console.log("curIndex = "+curIndex);
            if(curIndex<playlistLength){                
                for(var i=0; i<$scope.userSongs.length; i++){
                    if($scope.userSongs[i].index==curIndex && $scope.userSongs[i].playlistId==$scope.curPlaylistId){
                        $scope.userSongs[i].index--;
                    }
                }
                for(var i=0; i<$scope.userSongs.length; i++){
                    if($scope.userSongs[i].index==-1 && $scope.userSongs[i].playlistId==$scope.curPlaylistId){
                        $scope.userSongs[i].index=curIndex;
                    }
                }
                for(var i=0; i<$scope.userSongs.length; i++){
                $scope.userSongs.$save($scope.userSongs[i]);   
                }                
            }else{
                console.log("Out of bounds movement attempt!!!!")
            } 

        }

        function movePlaylistUp(playlist){

        }

        function movePlaylistDown(playlist){

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