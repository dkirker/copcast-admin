'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:RealtimeCtrl
 * @description
 * # RealtimeCtrl
 * Controller of the copcastAdminApp
 */
angular.module('copcastAdminApp')
  .controller('RealtimeCtrl', function ($scope) {

    $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
  });
