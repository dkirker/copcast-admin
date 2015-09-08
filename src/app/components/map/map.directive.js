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
          if(latLngPoints && latLngPoints.length > 0) {
            enableHeatmap(latLngPoints);
          }
          fitBounds(latLngPoints);
        });

        scope.$watchCollection('markerLocations', function() {
          removeMarkers();
          var markerLocations = scope.markerLocations;
          var positions = [];
          if(markerLocations && markerLocations.length > 0) {
            for(var i = 0, len = markerLocations.length; i < len; i++) {
              var marker = markerLocations[i];
              var makerClone = angular.copy(marker);
              marker.setMap(map);
              markers.push(marker);
              positions.push(marker.position);
            };
            fitBounds(positions);
          } else {
            resetMapPosition();
          }
        });

        /*
         * Marker functions
         */
        function removeMarkers() {
          for(var i = 0, len = markers.length; i < len; i++) {
            markers[i].setMap(null);
          }
          markers = [];
        }

        function fitBounds(latLngPoints) {
          if(!latLngPoints || latLngPoints.length === 0) {
            resetMapPosition();

          } else if(latLngPoints.length === 1) {
            setMapPosition(latLngPoints[0]);

          } else {
            var bounds = new google.maps.LatLngBounds();
            for(var i = 0, len = latLngPoints.length; i < len; i++) {
              bounds.extend(latLngPoints[i]);
            };
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
