(function (){
    'use strict'
    
    angular
        .module('app')
        .controller('PlaylistCtrl', PlaylistCtrl);
    
    PlaylistCtrl.$inject = ['$scope', '$firebaseArray', '$stateParams', '$firebaseObject'];
    
    function PlaylistCtrl($scope, $firebaseArray, $stateParams, $firebaseObject){
        
        var allSongs;
        $scope.songs = [];
        
        $scope.playlistList;        
        $scope.editPlaylistList = editPlaylistList;
        $scope.addPlaylist = addPlaylist;
        $scope.savePlaylistList = savePlaylistList;
        $scope.removePlaylist = removePlaylist;
        $scope.selectPlaylist = selectPlaylist;
        
        $scope.editSongs = editSongs;
        $scope.addSong = addSong;        
        $scope.saveSonglist = saveSonglist;
        $scope.removeSong = removeSong;        
        
        $scope.isEditingPlaylistList = false;
        $scope.isEditingSongs = false;
        
        var curPlaylistId = 0;
        
        activate();
        initPlaylistList();        
        
        function activate(){
            //get playlist and song array from database
            var ref = firebase.database().ref();
            //$scope.playlist = $firebaseArray(ref.child($stateParams.id).child('playlistList'));
            $scope.playlistList = $firebaseArray(ref.child('stateParamsId').child('playlistList'));
            $scope.playlistList.$loaded().then(function(data){
                if($scope.playlistList.length==0){
                    addPlaylist();
                }
                curPlaylistId = $scope.playlistList[0].$id;
            }).catch(function(error){
                console.log(error);
            });
            console.log(curPlaylistId);
            
            console.log("Loading songs....");
            allSongs = $firebaseArray(ref.child('stateParamsId').child('songs'));
            allSongs.$loaded().then(function(data){
                console.log("Songs Loaded!")
                if(allSongs.length<1) addSong();
            }).catch(function(error){
                console.log(error);
            });
            console.log(allSongs);
            loadSongs();                    
        }
        
        function editPlaylistList(){
            $scope.isEditingPlaylistList = true;
        }
        
        function addPlaylist(){
            $scope.playlistList.$add({name: ''});
        }
        
        function removePlaylist(playlist){
            $scope.playlistList.$remove(playlist);
        }
        
        function savePlaylistList(){
            for(var i=0; i<$scope.playlistList.length; i++){
             $scope.playlistList.$save($scope.playlistList[i]);   
            }
            $scope.isEditingPlaylistList = false;
        }
        
        function selectPlaylist(playlist){
            curPlaylistId = playlist.$id      
            activate();
        }   
        
        function editSongs(){
            $scope.isEditingSongs = true;
        }
        
        function addSong(){            
            $scope.songs.push({name: "", url: "", playlistId: curPlaylistId});
            console.log($scope.songs);
        }
        
        function removeSong(song){
            $scope.songlist.$remove(song);
        }        
            
        function saveSonglist(){
            $scope.isEditingSongs = false;
            for( var i in $scope.songs){
                allSongs.$add($scope.songs[i]);
            }
        }        
        
        function loadSongs(){
            for(var i in allSongs){
                if(allSongs[i].playlistId == curPlaylistId) $scope.songs.push(allSongs[i]);                 
            }    
        }
    }
    
    function initPlaylistList(){
        //who knows what this is
        $('.nav-tabs-dropdown').each(function(i, elm) {
            $(elm).text($(elm).next('ul').find('li.active a').text());
        });

        $('.nav-tabs-dropdown').on('click', function(e) {
            e.preventDefault();
            $(e.target).toggleClass('open').next('ul').slideToggle();
        });

        $('#nav-tabs-wrapper a[data-toggle="tab"]').on('click', function(e) {
            e.preventDefault();
            $(e.target).closest('ul').hide().prev('a').removeClass('open').text($(this).text());
        });
    }
    
})();