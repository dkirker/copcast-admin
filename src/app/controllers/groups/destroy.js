'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:GroupsDestroyCtrl
 * @description
 * # GroupsDestroyCtrl
 * Controller of the copcastAdminApp
 */
angular.module('copcastAdminApp')
  .controller('GroupsDestroyCtrl', function($scope, $routeParams, $http, $location, ServerUrl){

    // callback for ng-click 'updateGroup':
    $scope.deleteGroup = function () {

      if (confirm("Are you sure to delete " + $scope.group.name) == true) {
        // confirmation to delete

        $http.delete(ServerUrl + '/groups/' + $scope.group.id).success(function (data) {
          $location.path('/group-list');
        }).error(function (data) {
          $scope.serverMessage = data;
        });

      }
    };

    // callback for ng-click 'cancel':
    $scope.cancel = function () {
      $location.path('/group-list');
    };

    $http.get(ServerUrl + '/groups/'+ $routeParams.id).success(function(data) {
      $scope.group = data;
    }).error(function(data) {
      $scope.serverMessage = data;
    });

  });
