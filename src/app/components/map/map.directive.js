;(function(angular) {
  'use strict';

  var app = angular.module('copcastAdminApp');

  app.directive('map', function() {
    return {
      restrict: 'EA',
      scope: {
        markerLocations: '=?',
        heatmapLocations: '=?'
      },
      link: function(scope, element, attrs) {
        var DEFAULT_USER_ZOOM = 18;
        var markers = [];
        var heapmapLayer;
        var mapOptions = {
          zoom: 3,
          center: new google.maps.LatLng(0, 0)
        };

        var map = new google.maps.Map(element[0], mapOptions);

        /*
         * Watchers
         */
        scope.$watchCollection('heatmapLocations', function() {
          var latLngPoints = scope.heatmapLocations;
          disableHeatmap();
          if(latLngPoints.length > 0) {
            enableHeatmap(latLngPoints);
            setMapPosition(latLngPoints[0]);
          }
        });

        scope.$watchCollection('markerLocations', function() {
          removeMarkers();
          var markerLocations = scope.markerLocations;
          if(markerLocations && markerLocations.length > 0) {
            angular.forEach(markerLocations, function(marker) {
              var makerClone = angular.copy(marker);
              marker.setMap(map);
              markers.push(marker);
            });
            fitBounds();
          } else {
            resetMapPosition();
          }
        });

        /*
         * Marker functions
         */
        function removeMarkers() {
          angular.forEach(markers, function(marker) {
            marker.setMap(null);
          });
          markers = [];
        }

        function fitBounds() {
          if(markers.length === 1) {
            setMapPosition(markers[0].position);
          } else {
            var bounds = new google.maps.LatLngBounds();
            angular.forEach(markers, function(marker) {
              bounds.extend(marker.position);
            });
            map.setZoom(null);
            map.fitBounds(bounds);
          }
        }

        /*
         * Position functions
         */
        function setMapPosition(position, zoom) {
          map.setZoom(zoom || DEFAULT_USER_ZOOM);
          map.panTo(position);
        }

        function resetMapPosition() {
          setMapPosition(mapOptions.center, mapOptions.zoom);
        }

        /*
         * Heatmap functions
         */
        function enableHeatmap(latLngPoints) {
          var pointsArray = new google.maps.MVCArray(latLngPoints);
          heapmapLayer = new google.maps.visualization.HeatmapLayer({ data: pointsArray });
          heapmapLayer.setMap(map);
        }

        function disableHeatmap() {
          heapmapLayer && heapmapLayer.setMap(null);
        }
      }
    };
  });
})(window.angular);
