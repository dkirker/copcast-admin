'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:GroupsDestroyCtrl
 * @description
 * # GroupsDestroyCtrl
 * Controller of the copcastAdminApp
 */
angular.module('copcastAdminApp')
  .controller('GroupsDestroyCtrl', function($scope, $routeParams, $http, $location, ServerUrl, groupService){

    // callback for ng-click 'updateGroup':
    $scope.deleteGroup = function () {

      if (confirm('Are you sure to delete ' + $scope.group.name) === true) {
        // confirmation to delete

        groupService.deleteGroup($scope.group.id).then(function (data) {
          $location.path('/group-list');
        }, function (data) {
          $scope.serverMessage = data;
        });

      }
    };

    // callback for ng-click 'cancel':
    $scope.cancel = function () {
      $location.path('/group-list');
    };

    groupService.getGroup($routeParams.id).then(function(data) {
      $scope.group = data;
    }, function(data) {
      $scope.serverMessage = data;
    });

  });
