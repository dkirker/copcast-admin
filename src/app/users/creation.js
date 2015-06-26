'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:UsersCreationCtrl
 * @description
 * # UsersCreationCtrl
 * Controller of the copcastAdminApp
 */
angular.module('copcastAdminApp')
  .controller('UsersCreationCtrl', function ($scope, $routeParams, $http, $location, ServerUrl){

    // callback for ng-click 'createNewUser':
    $scope.createNewUser = function () {
      $http.post(ServerUrl + '/users',
        $scope.user).success(function(data) {
          $location.path('/user-list');
        }).error(function(data) {
          $scope.serverMessage = data;
        });
    };

    //get a list of groups
    $http.get(ServerUrl + '/groups').success(function(data){
      $scope.groups = data;
    });

  });
