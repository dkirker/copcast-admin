'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:UsersListCtrl
 * @description
 * # UsersListCtrl
 * Controller of the copcastAdminApp
 */
angular.module('copcastAdminApp')
  .controller('UsersListCtrl', function ($scope, $http, $location, ServerUrl) {
    // callback for ng-click 'editUser':
    $scope.editUser = function (userId) {
      $location.path('/user-detail/' + userId);
    };

    // callback for ng-click 'deleteUser':
    $scope.deleteUser = function (userId, userName) {

      // confirmation to delete
      $location.path('/user-destroy/' + userId);

    };

    // callback for ng-click 'createUser':
    $scope.createNewUser = function () {
      $location.path('/user-creation');
    };

    $http.get(ServerUrl + '/users',
      { params : {
        page : $scope.page
      }
      }
    ).success(function(data) {
        $scope.users = data;
      }).error(function(data) {
        console.error(data);
      });

  });
