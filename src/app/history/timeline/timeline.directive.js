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
        locations: '=',
        selectedLocations: '='
      },

      link: function(scope, element, attrs, controllers) {
        scope.$watch('locations', function() {
          scope.selectedPosition = -10;
          groupLocationsByHour();
        }, true);

        scope.moveSelectedLine = function moveSelectedLine($event) {
          scope.selectedPosition = $event.target.getBoundingClientRect().left - 1;
        }

        scope.selectMinute = function selectMinute(minute) {
          if(minute.locations && minute.locations.length > 0) {
            scope.selectedLocations = [ minute.locations[0] ];
          }
          console.log('Minute selected', minute, scope.selectedLocations);
        };

        function groupLocationsByHour() {
          var locationsByHour = {};
          var lastLabel;
          var lastLocation;

          angular.forEach(scope.locations, function(location) {
            var hourLocation = getHourLocation(locationsByHour, location, lastLabel);
            lastLabel = hourLocation.label;
            lastLocation = location;
            hourLocation.addLocation(angular.copy(location));
          });
          scope.locationsByHour = locationsByHour;
          console.log('locationsByHour', locationsByHour);
        }

        function getHourLocation(locationsByHour, location, lastLabel) {
          var date = moment(location.date);
          var key = date.format('YYYY-MM-DDTHH');
          var label = date.format('MM/DD');
          if(!locationsByHour[key]) {
            locationsByHour[key] = {
              label: (label === lastLabel ? undefined : label),
              date: date,
              locationsByMinute: {},
              addLocation: addLocation
            };
          }
          return locationsByHour[key];
        }

        function addLocation(location) {
          location.date = moment(location.date);
          // Start location
          if(!this.startLocation || location.date.isBefore(this.startLocation.date)) {
            this.startLocation = location;
            this.startLocationPosition = calculatePositionInPixels(location);
          }
          // End location
          if(!this.endLocation || location.date.isAfter(this.endLocation.date)) {
            this.endLocation = location;
            this.endLocationPosition = calculatePositionInPixels(location);
          }
          // Group by minute
          groupLocationsByMinute.bind(this)(location);
        }

        function groupLocationsByMinute(location) {
          var minute = location.date.minute();
          addOffset.bind(this)(minute);

          var minuteLocation = getMinuteLocation.bind(this)(minute);
          minuteLocation.locations.push(location);
        }

        function getMinuteLocation(minute) {
          var key = (minute < 10 ? '0' : '') + minute;
          if(!this.locationsByMinute[key]) {
            this.locationsByMinute[key] = {
              minute: minute,
              locations: []
            };
          }
          return this.locationsByMinute[key];
        }

        function addOffset(minute) {
          var lbym = this.locationsByMinute;
          var lastMinuteAdded = lbym[Object.keys(lbym).pop()];
          var nextMinute = (lastMinuteAdded ? lastMinuteAdded.minute : minute) + 1;
          for(var offsetMinute = nextMinute; offsetMinute < minute; offsetMinute++) {
            getMinuteLocation.bind(this)(offsetMinute);
          }
        }

        function calculatePositionInPixels(location) {
          return location.date.minute() * 3;
        }
      }
    };
  });
})(window.angular, window.moment);
