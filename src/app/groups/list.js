'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:GroupsListCtrl
 * @description
 * # GroupsListCtrl
 * Controller of the copcastAdminApp
 */
angular.module('copcastAdminApp')
  .controller('GroupsListCtrl', function ($scope, $window, $http, $location, ServerUrl) {
    $scope.page = 1;
    $scope.perPage = 30;
    $scope.totalGroups = 0;

    $scope.groups = [];
    $scope.isAdminGroup = false;

    function loadGroups(){
      var params = {
        page : $scope.page,
        perPage : $scope.perPage
      };

      $http.get(ServerUrl + '/groups-paginated', {
        params: params
      }).success(function(data) {
        $scope.groups = (data.rows) ? data.rows : data;
        $scope.totalGroups = data.count;
      }).error(function(data) {
        $window.console.error(data);
      });
    }

    $scope.pageChanged = function(newPage) {
      $scope.page = newPage;
      loadGroups();
    };

    loadGroups();

    $http.get(ServerUrl + '/groups/isadmin').success(function(data) {
      $scope.isAdminGroup = data;
    }).error(function(data) {
      $window.console.error(data);
    });

    // callback for ng-click 'editGroup':
    $scope.editGroup = function (groupId) {
      $location.path('/group-detail/' + groupId);
    };

    // callback for ng-click 'deleteGroup':
    $scope.deleteGroup = function (groupId) {
      // confirmation to delete
      $location.path('/group-destroy/' + groupId);
    };

    // callback for ng-click 'createGroup':
    $scope.createNewGroup = function () {
      $location.path('/group-creation');
    };
  }).controller('GroupCreationCtrl', function($scope, $http, $location, ServerUrl){
    $scope.createGroup = function () {
      $http.post(ServerUrl + '/groups',
        $scope.group).success(function() {
          $location.path('/group-list');
        }).error(function(data) {
          $scope.serverMessage = data;
        });
    };
  });
