;(function(angular, $) {
  'use strict';

  var app = angular.module('copcastAdminApp');

  app.directive('timelineSegment', function($timeout) {
    return {
      restrict: 'E',
      replace: true,
      require: '^timelineSegments',
      templateUrl: 'app/history/timeline/segment.html',
      scope: {
        timeLabel: '=',
        last: '=',
        activities: '='
      },
      link: function(scope, element, attrs, timelineSegmentsCtrl) {
        var PIXELS_PER_MINUTE = 3;

        var $segment = element;
        var $dateSegments = $segment.closest('.date.segments');
        var $activities = $segment.find('.activities');

        var segmentKey;

        /*
         * Watchers
         */
        scope.$watch('activities', function() {
          var firstActivity = getFirstActivity();
          segmentKey = createSegmentKey(firstActivity[0].getDate());
        }, true);

        /*
         * Scope functions
         */
        scope.getLocationPosition = getLocationPosition;
        function getLocationPosition(location) {
            if(location) {
              return location.getDate('m') * PIXELS_PER_MINUTE;
            }
        };

        scope.nextTimeLabel = function nextTimeLabel() {
          return parseInt(scope.timeLabel) + 1;
        };

        scope.selectPosition = function selectPosition(event, firstSectionLocation) {
          var startPosition = getLocationPosition(firstSectionLocation);
          var pos = getClickPosition(event);
          var selectedMinute = ((pos.x + startPosition) / PIXELS_PER_MINUTE) | 0;

          console.log('selectedMinute', selectedMinute);

          var selectedDate = moment(segmentKey + ':' + selectedMinute, "YYYY-MM-DD HH:mm");
          var position = calculatePosition(selectedDate);
          timelineSegmentsCtrl.setPosition(position);
          timelineSegmentsCtrl.setSelectedDate(selectedDate);
        };

        /*
         * Internal functions
         */
        function createSegmentKey(date) {
          return date && date.format('YYYY-MM-DD HH');
        }

        function calculatePosition(date) {
          if(date) {
            var minute = date.format('m');
            return $dateSegments.position().left +
                   $segment.position().left +
                   minute * PIXELS_PER_MINUTE + 1;
          }
        }

        function hasActivities() {
          return scope.activities && scope.activities.size() > 0;
        }

        function getFirstActivity() {
          if(hasActivities()) {
            return scope.activities.first();
          }
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
