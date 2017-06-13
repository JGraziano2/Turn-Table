(function() {
    'use strict';

    angular
        .module('app')
        .controller('ModalCtrl', ModalCtrl);

    ModalCtrl.$inject = ['$scope', '$state', 'close', 'AuthService'];

    function ModalCtrl($scope, $state, close, AuthService) {
        $scope.login = login;
        $scope.register = register;

        function login() {
            AuthService.login($scope.email, $scope.password).then(function(data) {
                $state.go('playlist', {id: data.uid});
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
            }).catch(function(error) {
                console.log(error);
                $scope.message = error.message;
            });
        }

        function register() {
            AuthService.register($scope.email, $scope.password).then(function(data) {
                AuthService.login($scope.email, $scope.password).then(function(data) {
                    $state.go('playlist', {id: data.uid});
                    $('body').removeClass('modal-open');
                    $('.modal-backdrop').remove();
                })
            }).catch(function(error) {
                console.log(error);
                $scope.message = error.message;
            });
        }
    }

})();