;(function() {
  'use strict';

  var app = angular.module('copcastAdminApp');

  app.controller('HistoryCtrl', function ($scope) {
  });

  app.directive('map', function() {
    return {
      restrict: 'EA',
      link: function(scope, element, attrs) {
        var mapOptions = {
          zoom: 8,
          center: new google.maps.LatLng(-34.397, 150.644)
        };
        var map = new google.maps.Map(element[0], mapOptions);
      }
    };
  });
})();
