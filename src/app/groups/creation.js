'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:GroupsCreationCtrl
 * @description
 * # GroupsCreationCtrl
 * Controller of the copcastAdminApp
 */
angular.module('copcastAdminApp')
  .controller('GroupsCreationCtrl', function($scope, $http, $location, ServerUrl){
    $scope.createGroup = function () {
      $http.post(ServerUrl + '/groups', $scope.group)
      .success(function(data) {
        $location.path('/group-list');
      }).error(function(data) {
        if (data && data.errors){
          $scope.serverMessage = data.errors[0].message;
        } else {
          $scope.serverMessage = data;
        }
      });
    };

    $scope.back = function () {
      $location.path('/group-list');
    };
  });
