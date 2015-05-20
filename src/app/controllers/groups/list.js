'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:GroupsListCtrl
 * @description
 * # GroupsListCtrl
 * Controller of the copcastAdminApp
 */
angular.module('copcastAdminApp')
  .controller('GroupsListCtrl', function ($scope, $http, $location, ServerUrl) {
    $scope.groups = [];
    $scope.isAdminGroup = false;
    $http.get(ServerUrl + '/groups').success(function(data) {
      $scope.groups = data;

    }).error(function(data) {
      console.error(data);
    });

    $http.get(ServerUrl + '/groups/isadmin').success(function(data) {
      $scope.isAdminGroup = data;
    }).error(function(data) {
      console.error(data);
    });

    // callback for ng-click 'editGroup':
    $scope.editGroup = function (groupId) {
      $location.path('/group-detail/' + groupId);
    };

    // callback for ng-click 'deleteGroup':
    $scope.deleteGroup = function (groupId, groupName) {

      // confirmation to delete
      $location.path('/group-destroy/' + groupId);

    };

    // callback for ng-click 'createGroup':
    $scope.createNewGroup = function () {
      $location.path('/group-creation');
    };
  }).controller("GroupCreationCtrl", function($scope, $http, $location, ServerUrl){


    $scope.createGroup = function () {
      $http.post(ServerUrl + '/groups',
        $scope.group).success(function(data) {
          $location.path('/group-list');
        }).error(function(data) {
          $scope.serverMessage = data;
        });
    };


  });
