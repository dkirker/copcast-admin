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
        locations: '=ngModel'
      },
      link: function(scope, element, attrs, timelineSegmentsCtrl) {
        var PIXELS_PER_MINUTE = 3;

        var $container = element.closest('.container').find('.segments');

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

        scope.firstLocationPosition = function firstLocationPosition() {
          return activityPosition(getFirstLocation());
        };

        scope.lastLocationPosition = function lastLocationPosition() {
          return activityPosition(getLastLocation());
        };

        scope.nextTimeLabel = function nextTimeLabel() {
          return parseInt(scope.timeLabel) + 1;
        };

        scope.selectMinuteByPosition = function selectMinuteByPosition(event) {
          var startPosition = scope.firstLocationPosition();
          var pos = getClickPosition(event);
          var selectedMinute = ((pos.x + startPosition) / PIXELS_PER_MINUTE).toFixed(0);
          var absoluteXPosition = pos.parentPosition.x - $container.offset().left + pos.x;

          timelineSegmentsCtrl.selectActivity({
            selectedPosition: absoluteXPosition,
            location: getClosestLocation(selectedMinute)
          });
        };
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
