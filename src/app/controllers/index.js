'use strict';
/* global google */

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:IndexCtrl
 * @description
 * # IndexCtrl
 * Controller of the copcastAdminApp
 */

var app = angular.module('copcastAdminApp');

app.controller('IndexCtrl', function ($scope, $window, userService ) {

  $scope.isMobile =('ontouchstart' in $window);

  $scope.canAccessReports = function(){
    return userService.isAdminTwo() || userService.isAdminThree();
  };


  //$window.alert($scope.isMobile)

}); //end-IndexCtrl


