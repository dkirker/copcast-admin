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

    var RiodeJaneiro = new google.maps.LatLng(-22.94, -43.22, true);
    $scope.mapOptions = {
      center: RiodeJaneiro,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    };


  });
