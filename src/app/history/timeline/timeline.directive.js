;(function(angular, moment) {
  'use strict';

  var app = angular.module('copcastAdminApp');
  var hours = [];

  for(var hour = 0; hour < 24; hour++) {
    hours.push(hour);
  }

  app.directive('timeline', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/history/timeline/timeline.html',

      scope: {
        locations: '='
      },

      link: function(scope, element, attrs, controllers) {
        scope.$watch('locations', function() {
          groupLocationsByHour();
        }, true);

        scope.selectLocation = function selectLocation(location) {
          console.log(location);
        };

        function groupLocationsByHour() {
          var locationsByHour = {};
          var lastLabel;
          var lastLocation;

          angular.forEach(scope.locations, function(location) {
            var date = moment(location.date);
            var key = date.format('YYYY-MM-DDTHH');
            var label = date.format('MM/DD');
            if(!locationsByHour[key]) {
              locationsByHour[key] = {
                label: (label === lastLabel ? undefined : label),
                date: date,
                locations: [],
                addLocation: addLocation
              };
            }
            lastLabel = label;
            lastLocation = location;
            locationsByHour[key].addLocation(location);
          });
          scope.locationsByHour = locationsByHour;
          console.log('locationsByHour', locationsByHour);
        }

        function addLocation(location) {
          var locationCpy = angular.copy(location);
          locationCpy.source = location;
          locationCpy.date = moment(location.date);
          if(!this.startLocation || locationCpy.date.isBefore(this.startLocation.date)) {
            this.startLocation = locationCpy;
            this.startLocationPosition = calculatePositionInPixels(locationCpy);
          }
          if(!this.endLocation || locationCpy.date.isAfter(this.endLocation.date)) {
            this.endLocation = locationCpy;
            this.endLocationPosition = calculatePositionInPixels(locationCpy);
          }
          this.locations.push(locationCpy);
        }

        function calculatePositionInPixels(location) {
          var date = location.date;
          var start = date.clone().startOf('hour');
          var millis = date.clone().diff(start, 'milliseconds');
          return 200 * millis / 3600000;
        }
      }
    };
  });
})(window.angular, window.moment);
