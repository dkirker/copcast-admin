;(function(angular) {
  'use strict';

  var app = angular.module('copcastAdminApp');

  app.directive('map', function() {
    return {
      restrict: 'EA',
      scope: {
        position: '='
      },
      link: function(scope, element, attrs) {
        var mapOptions = {
          zoom: 3,
          center: new google.maps.LatLng(0, 0)
        };
        var map = new google.maps.Map(element[0], mapOptions);
        scope.$watch('position', function() {
          if(scope.position) {
            if(scope.position.lat && scope.position.lng) {
              map.setZoom(15);
              map.panTo(angular.copy(scope.position));
            }
          }
        }, true);
      }
    };
  });
})(window.angular);
