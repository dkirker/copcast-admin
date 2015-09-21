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

app.controller('IndexCtrl', function ($scope, $window) {

  $scope.isMobile =('ontouchstart' in $window)

  //$window.alert($scope.isMobile)

}); //end-IndexCtrl


