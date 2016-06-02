  'use strict';

  var app = angular.module('copcastAdminApp');

  app.directive('map', function($window) {
    return {
      restrict: 'EA',
      scope: {
        markerLocations: '=?',
        heatmapLocations: '=?'
      },
      link: function(scope, element/*, attrs*/) {
        var DEFAULT_USER_ZOOM = 18;
        var markers = [];
        var heapmapLayer;
        var mapOptions = {
          zoom: 3,
          center: new $window.google.maps.LatLng(0, 0)
        };

        var map = new $window.google.maps.Map(element[0], mapOptions);

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
            var bounds = new $window.google.maps.LatLngBounds();

            for(var i = 0, len = latLngPoints.length; i < len; i++) {
              bounds.extend(latLngPoints[i]);
            }

            map.setZoom(null);
            map.fitBounds(bounds);
          }
        }

        /*
         * Heatmap functions
         */
        function enableHeatmap(latLngPoints) {
          var pointsArray = new $window.google.maps.MVCArray(latLngPoints);
          heapmapLayer = new $window.google.maps.visualization.HeatmapLayer({ data: pointsArray });
          heapmapLayer.setMap(map);
        }

        function disableHeatmap() {
          return heapmapLayer && heapmapLayer.setMap(null);
        }

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
              // var makerClone = angular.copy(marker);
              marker.setMap(map);
              markers.push(marker);
              if (marker.getBounds) {
                // marker is an object like a circle, need to use getBounds
                // to include the whole marker, not just it's center position.
                var bounds = marker.getBounds();
                positions.push(bounds.getNorthEast());
                positions.push(bounds.getSouthWest());
              } else {
                positions.push(marker.position);
              }
            }

            fitBounds(positions);
          } else {
            resetMapPosition();
          }
        });
      }
    };
  });
