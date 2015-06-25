;(function(angular) {
  'use strict';

  var app = angular.module('copcastAdminApp');

  app.directive('timelineSegments', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/history/timeline/timeline.segments.html',
      link: function(scope, element, attrs, controllers) {
        scope.$watch('locationsByHour', function() {
          console.log('element', element.find('.activities .line'));
        });

        scope.moveSelectedLine = function moveSelectedLine($event) {
          scope.selectedPosition = $event.target.getBoundingClientRect().left - 1;
        }

        scope.selectMinute = function selectMinute(hourLocations, minute) {
          if(minute.locations && minute.locations.length > 0) {
            var date = hourLocations.date.clone();
            date.set({"minutes": 0, "seconds": 0, "milliseconds": 0});
            scope.selectedEvent = {
              date: date,
              locations: minute.locations
            };
          }
          console.log('Minute selected', hourLocations, minute, scope.selectedLocations);
        };

      }
    };
  });
})(window.angular);
