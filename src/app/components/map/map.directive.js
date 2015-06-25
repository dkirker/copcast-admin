;(function(angular) {
  'use strict';

  var app = angular.module('copcastAdminApp');

  app.directive('map', function() {
    return {
      restrict: 'EA',
      scope: {
        location: '=',
        heatmapLocations: '=?',
        markers: '=?'
      },
      link: function(scope, element, attrs) {
        var DEFAULT_USER_ZOOM = 18;
        var marker; // TODO: Add suport to multiple markers
        var heapmapLayer;
        var mapOptions = {
          zoom: 3,
          center: new google.maps.LatLng(0, 0)
        };

        var map = new google.maps.Map(element[0], mapOptions);

        scope.$watch('location', function() {
          if(isValidlocation(scope.location)) {
            setMapLocation(angular.copy(scope.location));
          } else {
            setMapLocation(mapOptions.center, mapOptions.zoom);
          }
        }, true);


        scope.$watchCollection('heatmapLocations', function() {
          var latLngPoints = transformToLatLngPoints(scope.heatmapLocations);
          disableHeatmap();
          if(latLngPoints.length > 0) {
            enableHeatmap(latLngPoints);
            setMapLocation(scope.heatmapLocations[0]);
          }
        });

        scope.$watchCollection('markers', function() {
          marker && marker.setMap(null);
          if(scope.markers && scope.markers.length > 0) {
            var latLngPoints = transformToLatLngPoints([scope.markers[0].location]);
            createMarkers(latLngPoints);
            fitBounds(latLngPoints);
          }
        });

        function fitBounds(latLngPoints) {
          if(!latLngPoints || latLngPoints.length === 0) {
            return;
          }
          var latLngBounds = new google.maps.LatLngBounds();
          angular.forEach(latLngPoints, function(latLngPoint) {
            latLngBounds.extend(latLngPoint);
          });
          map.fitBounds(latLngBounds);
        }

        function createMarkers(latLngPoints) {
          marker = new google.maps.Marker({
            position: latLngPoints[0],
            map: map,
            shape: {coords: [15,15,16], type: "circle"},
            icon: createMarkerImage()
          });
        }

        function createMarkerImage() {
          return {
            url: scope.markers[0].icon,
            scaledSize: new google.maps.Size(32, 32)
          };
        }

        function isValidlocation(location) {
          return location &&
                 location.lat &&
                 location.lng;
        }

        function setMapLocation(location, zoom) {
          map.setZoom(zoom || DEFAULT_USER_ZOOM);
          map.panTo(location);
        }

        function enableHeatmap(latLngPoints) {
          var pointsArray = new google.maps.MVCArray(latLngPoints);
          heapmapLayer = new google.maps.visualization.HeatmapLayer({ data: pointsArray });
          heapmapLayer.setMap(map);
        }

        function disableHeatmap() {
          heapmapLayer && heapmapLayer.setMap(null);
        }

        function transformToLatLngPoints(locations) {
          var latLngPoints = [];
          angular.forEach(locations, function(location, key) {
            if(isValidlocation(location)) {
              this.push(new google.maps.LatLng(location.lat, location.lng));
            }
          }, latLngPoints);
          return latLngPoints;
        }
      }
    };
  });
})(window.angular);
