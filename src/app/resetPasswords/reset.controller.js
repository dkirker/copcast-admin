/**
 * Created by brunosiqueira on 12/02/16.
 */

'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:ResetPasswordCtrl
 * @description
 * # ResetPasswordCtrl
 * Controller of the copcastAdminApp
 */

angular.module('copcastAdminApp').
  controller('ResetPasswordCtrl', function($scope, $routeParams, userService, gettextCatalog, $location) {
    $scope.user = {
      password: null,
      passwordConfirmation: null,
      token: $routeParams.token
    };

    $scope.confirmed = false;
    userService.confirmResetToken($routeParams.token).then(function(){
      $scope.confirmed = true;
      $scope.resetPassword = function(){
        if ((!$scope.user.password || $scope.user.password.length === 0) ||
          (!$scope.user.passwordConfirmation || $scope.user.passwordConfirmation.length === 0)){
          $scope.errorMessage = gettextCatalog.getString('All fields are required.');
          return;
        }

        if ($scope.user.password !== $scope.user.passwordConfirmation){
          $scope.errorMessage = gettextCatalog.getString('The password and its confirmation don\'t match');
          return;
        }

        userService.changePasswordWithToken($scope.user.password, $scope.user.token).then(function(){
          $location.path('/');
        }, function(err){
          $scope.errorMessage =  gettextCatalog.getString(err);
        });
      };
    }, function(err){
      $scope.errorMessage =  gettextCatalog.getString(err);
      $scope.confirmed = false;
    });
  });
