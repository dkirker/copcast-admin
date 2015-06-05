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
      transclude: true,
      templateUrl: 'app/history/timeline/timeline.html',
      scope: {
        locations: '='
      },
      link: function(scope, element, attrs, controllers) {
        scope.$watch('locations', function() {
          groupLocationsByHour();
        }, true);

        function groupLocationsByHour() {
          var locationsByHour = {};
          var lastLabel;
          angular.forEach(scope.locations, function(location, index) {
            var userLocation = angular.copy(location);
            var date = moment(location.date);
            var key = date.format('YYYY-MM-DDTHH');
            var label = date.format('MM/DD');
            if(!locationsByHour[key]) {
              locationsByHour[key] = {
                label: (label === lastLabel ? '&nbsp;' : label),
                date: date,
                locations: []
              };
            }
            lastLabel = label;
            userLocation.date = date;
            locationsByHour[key].locations.push(userLocation);
          });
          scope.locationsByHour = locationsByHour;
          console.log('locationsByHour', locationsByHour);
        }
      }
    };
  });
})(window.angular, window.moment);
