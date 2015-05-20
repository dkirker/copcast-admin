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
      $http.post(ServerUrl + '/groups',
        $scope.group).success(function(data) {
          $location.path('/group-list');
        }).error(function(data) {
          $scope.serverMessage = data;
        });
    };

  });
