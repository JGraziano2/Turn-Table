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
            var ref = firebase.database().ref().child($stateParams.id);            
            //get playlist array from database
            $scope.playlists = $firebaseArray(ref.child('playlists'));
            $scope.playlists.$loaded().then(function(data){
                if($scope.playlists.length==0){
                    addPlaylist();
                }
            }).catch(function(error){
                console.log(error);
            });
            console.log("current playlist ID = " + curPlaylistId);
            
            
            //get song array from database and load into $scope
            var ref = firebase.database().ref().child($stateParams.id);  
            $scope.userSongs = $firebaseArray(ref.child('songs'));
            $scope.userSongs.$loaded().then(function(data){
                if($scope.userSongs.length<1){
                    addSong();
                }
                //FIXME: $scope.userSongs is returning undefined!!!
                console.log("$scope.userSongs: " + $scope.userSongs);
                for(var i in $scope.userSongs){
                    console.log($scope.userSongs[i].playlistId);
                    if($scope.userSongs[i].playlistId === curPlaylistId){
                        $scope.songs.push($scope.userSongs[i]);    
                    }             
                }      
            }).catch(function(error){
                console.log(error);
            });            
                             
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
            activate();
        }   
        
        function editSongs(){
            $scope.isEditingSongs = true;
        }
        
        function addSong(){            
            $scope.songs.push({name: "New Song", url: "", playlistId: curPlaylistId});
        }
        
        function removeSong(song){
            $scope.songs.$remove(song);
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
    }
    
})();