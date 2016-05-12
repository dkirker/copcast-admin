'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:UsersCreationCtrl
 * @description
 * # UsersCreationCtrl
 * Controller of the copcastAdminApp
 */
angular.module('copcastAdminApp')
  .controller('UsersCreationCtrl', function ($scope, $routeParams, $http, $location, ServerUrl, userService){
    userService.getAdminRoles().then(function(roles){
      $scope.roles = roles;
    });

    // callback for ng-click 'createNewUser':
    $scope.createNewUser = function () {
      $http.post(ServerUrl + '/users',
        $scope.user).success(function() {
          $location.path('/user-list');
        }).error(function(data) {
          if (data && data.errors){
            $scope.serverMessage = data.errors[0].message;
          } else {
            $scope.serverMessage = data;
          }
        });
    };

    $scope.canCreateAdmin = function(){
      return $scope.roles && $scope.roles.length > 0;
    };
    //get a list of groups
    $http.get(ServerUrl + '/groups').success(function(data){
      $scope.groups = data;
    });

    $scope.back = function () {
      $location.path('/user-list');
    };
  });
