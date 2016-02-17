'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:UsersDestroyCtrl
 * @description
 * # UsersDestroyCtrl
 * Controller of the copcastAdminApp
 */
angular.module('copcastAdminApp')
  .controller('UsersDestroyCtrl', function ($scope, $routeParams, $http, $location, ServerUrl, userService, groupService){

    $scope.hasProfilePicture = false;
    $scope.userPicture = '';

    // callback for ng-click 'updateUser':
    $scope.deleteUser = function () {

      if (confirm('Are you sure to delete ' + $scope.user.username) === true) {
        // confirmation to delete

        userService.deleteUser($scope.user).then(function (data) {
          $location.path('/user-list');
        }, function (data) {
          $scope.serverMessage = data;
        });

      }
    };

    // callback for ng-click 'cancel':
    $scope.cancel = function () {
      $location.path('/user-list');
    };

    //get user by id
    userService.getUser($routeParams.id).then(function(data) {
      $scope.user = data;

      if($scope.user.profilePicture){
        $scope.hasProfilePicture = true;
        $scope.pictureUrl = ServerUrl + '/pictures/'+$scope.user.id+'/medium/show';
      }
    });

    //list of groups
    groupService.listGroups().then(function(data){
      $scope.groups = data;
    });


  });
