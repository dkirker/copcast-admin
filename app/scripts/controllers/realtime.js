/* global google */
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

    $scope.mapOptions = {
      center: new google.maps.LatLng(35.784, -78.670, true),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
  });
