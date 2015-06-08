'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:UsersDestroyCtrl
 * @description
 * # UsersDestroyCtrl
 * Controller of the copcastAdminApp
 */
angular.module('copcastAdminApp')
  .controller('UsersDestroyCtrl', function ($scope, $routeParams, $http, $location, ServerUrl){

    $scope.hasProfilePicture = false;
    $scope.userPicture = '';

    // callback for ng-click 'updateUser':
    $scope.deleteUser = function () {

      if (confirm('Are you sure to delete ' + $scope.user.username) === true) {
        // confirmation to delete

        $http.delete(ServerUrl + '/user_destroy/' + $scope.user.id, $scope.user).success(function (data) {
          $location.path('/user-list');
        }).error(function (data) {
          $scope.serverMessage = data;
        });

      }
    };

    // callback for ng-click 'cancel':
    $scope.cancel = function () {
      $location.path('/user-list');
    };

    //get user by id
    $http.get(ServerUrl + '/users/'+ $routeParams.id).success(function(data) {
      $scope.user = data;
      $http.get(ServerUrl + '/users/me').success(function(data) {
        if(data.length === 0){
          return;
        }
        if($scope.user.profilePicture){
          $scope.hasProfilePicture = true;
          $scope.pictureUrl = ServerUrl + '/pictures/'+$scope.user.id+'/original/show';
        }
      });
    }).error(function(data) {
    });

    //list of groups
    $http.get(ServerUrl + '/groups').success(function(data){
      $scope.groups = data;
    });


  });
