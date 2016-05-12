'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:UsersListCtrl
 * @description
 * # UsersListCtrl
 * Controller of the copcastAdminApp
 */
angular.module('copcastAdminApp')
  .controller('UsersListCtrl', function ($scope, $window, $http, $location, ServerUrl, userService) {
    $scope.page = 1;
    $scope.perPage = 30;
    $scope.totalUsers = 0;

    function loadUsers(){
      var params = {
        page : $scope.page,
        perPage : $scope.perPage
      };

      if($scope.filter.text && $scope.filter.text !== '') {
        params.filter = $scope.filter.text;
      }

      userService.paginateUsers(params)
        .then(function(data){
          $scope.users = data.rows;
          $scope.totalUsers = data.count;
        }, function(error){
          $window.console.log(error);
        });
    }

    $scope.pageChanged = function(newPage) {
      $scope.page = newPage;
      if ($scope.filter.text){
        $scope.searchByText();
      } else {
        loadUsers();
      }
    };

    $scope.filter = {
      text: null
    };

    $scope.searchByText = function() {
      loadUsers();
    };

    // callback for ng-click 'editUser':
    $scope.editUser = function (userId) {
      $location.path('/user-detail/' + userId);
    };

    // callback for ng-click 'deleteUser':
    $scope.deleteUser = function (userId/*, userName*/) {
      // confirmation to delete
      $location.path('/user-destroy/' + userId);
    };

    // callback for ng-click 'createUser':
    $scope.createNewUser = function () {
      $location.path('/user-creation');
    };

    loadUsers();
  });
