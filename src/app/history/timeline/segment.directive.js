;(function(angular, $) {
  'use strict';

  var app = angular.module('copcastAdminApp');

  app.directive('timelineSegment', function() {
    return {
      restrict: 'E',
      replace: true,
      require: '^timelineSegments',
      templateUrl: 'app/history/timeline/segment.html',
      scope: {
        timeLabel: '=',
        last: '=',
        locations: '=',
        selectedLocation: '='
      },
      link: function(scope, element, attrs, timelineSegmentsCtrl) {
        var PIXELS_PER_MINUTE = 3;

        var $segment = element;
        var $dateSegments = $segment.closest('.date.segments');
        var $activities = $segment.find('.activities');

        /*
         * Watchers
         */
        scope.$watch('selectedLocation', function() {
          var selectedLocation = scope.selectedLocation;
          var locations = scope.locations;

          if(isSelectedLocationFromThisSegment()) {
            console.log('selectedLocation', scope.timeLabel, scope.selectedLocation);
            var position = calculateSelectedLocationPosition()
            timelineSegmentsCtrl.setPosition(position);
          }
        }, true);

        scope.$watch('locations', function() {
          var activities = [];
          var previousLocation;

          if(scope.locations) {
            for(var i = 0, length = scope.locations.length; i < length; i++) {
              var location = scope.locations[i];
              if(!previousLocation || location.getDate('m') - previousLocation.getDate('m') > 6) {
                activities.push([]);
              }
              previousLocation = location;
              activities[activities.length - 1].push(location);
            }
          }
          scope.activities = activities;
          console.log('activities', activities);
        }, true);

        /*
         * Scope functions
         */
        scope.firstLocationPosition = function firstLocationPosition() {
          return activityPosition(getFirstLocation());
        };

        scope.lastLocationPosition = function lastLocationPosition() {
          return activityPosition(getLastLocation());
        };

        scope.nextTimeLabel = function nextTimeLabel() {
          return parseInt(scope.timeLabel) + 1;
        };

        scope.selectLocationByPosition = function selectMinuteByPosition(event) {
          var startPosition = scope.firstLocationPosition();
          var pos = getClickPosition(event);
          var selectedMinute = ((pos.x + startPosition) / PIXELS_PER_MINUTE) | 0;

          console.log('selectedMinute', selectedMinute);
          var selectedLocation = getClosestLocation(selectedMinute);
          timelineSegmentsCtrl.setLocation(selectedLocation);
        };



        /*
         * Internal functions
         */

        function calculateSelectedLocationPosition() {
          var selectedLocation = scope.selectedLocation;
          if(selectedLocation) {
            var minute = selectedLocation.getDate('m');
            return $dateSegments.position().left +
                   $segment.position().left +
                   minute * PIXELS_PER_MINUTE + 1;
          }
        }

        function isSelectedLocationFromThisSegment() {
          var selectedLocation = scope.selectedLocation;
          if(selectedLocation && hasLocations()) {
            return selectedLocation.date.isSame(scope.locations[0].date, 'hour');
          }
        }

        function hasLocations() {
          return scope.locations && scope.locations.length > 0;
        }

        function getFirstLocation() {
          if(hasLocations()) {
            return scope.locations[0];
          }
        }

        function getLastLocation() {
          if(hasLocations()) {
            return scope.locations[scope.locations.length - 1];
          }
        }

        function activityPosition(location) {
          if(location) {
            return location.getDate('m') * PIXELS_PER_MINUTE;
          }
        }

        function getClosestLocation(minute) {
          var locations = scope.locations;
          for(var i = locations.length - 1; i >= 0; i--) {
            var location = locations[i];
            if(location.getDate('m') <= minute) {
              return location;
            }
          }
          return getFirstLocation();
        }
      }
    };
  });

  /*
   * Screen position functions
   */
  function getClickPosition(event) {
      var parentPosition = getParentPosition(event.currentTarget);
      var xPosition = event.clientX - parentPosition.x;
      var yPosition = event.clientY - parentPosition.y;
      return {
        x: xPosition < 0 ? 0 : xPosition,
        y: yPosition,
        parentPosition: parentPosition
      };
  }

  function getParentPosition(element) {
      var xPosition = 0;
      var yPosition = 0;

      while (element) {
          xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
          yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
          element = element.offsetParent;
      }
      return { x: xPosition, y: yPosition };
  }
})(window.angular, window.jQuery);
