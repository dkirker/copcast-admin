'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:LogoutCtrl
 * @description
 * # LogoutCtrl
 * Controller of the copcastAdminApp
 */
angular.module('copcastAdminApp')

  .controller('LogoutCtrl', function ($location, $window, loginService) {
    loginService.logout();
    $location.path('/');
  });
