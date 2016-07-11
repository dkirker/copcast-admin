'use strict';

var app = angular.module('copcastAdminApp');

/*
 * Screen position functions
 */
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


app.directive('timelineSegment', function($timeout, $window, timelineService) {
  return {
    restrict: 'E',
    replace: true,
    require: '^timelineSegments',
    templateUrl: 'app/history/timeline/segment.html',
    scope: {
      hour: '=',
      last: '=',
      day: '=',
      activities: '=',
      incidentsByDay: '='
    },
    link: function(scope, element, attrs, timelineSegmentsCtrl) {
      var PIXELS_PER_MINUTE = 3;

      var $segment = element;
      var $dateSegments = $segment.closest('.date.segments');
      // var $activities = $segment.find('.activities');

      var segmentKey;

      /*
       * Internal functions
       */
      function calculatePosition(date) {
        if(date) {
          var minute = date.format('m');
          return $dateSegments.position().left +
            $segment.position().left +
            minute * PIXELS_PER_MINUTE + 1;
        }
      }

      function setPositionFromCurrentDate(date) {
        var position = calculatePosition(date);
        timelineSegmentsCtrl.setPosition(position);
      }

      function createKey(date) {
        return date && date.format('YYYY-MM-DD HH');
      }

      function hasActivities() {
        return scope.activities && scope.activities.size() > 0;
      }

      function getFirstActivity() {
        if(hasActivities()) {
          return scope.activities.first();
        }
      }

      /*
       * Watchers
       */
      scope.$watch('activities', function() {
        var firstActivity = getFirstActivity();
        segmentKey = createKey(firstActivity[0].getDate());
      }, true);

      timelineService.currentLocationChanged.addListener(function (location) {
        try {
          var locationKey = createKey(location.date);
          if (locationKey === segmentKey) {
            $window.console.log('Current Location Changed in Segment', location, locationKey);
            setPositionFromCurrentDate(location.date);
          }
        } catch(ex) {
          $window.console.log('Video with empty location.');
          timelineSegmentsCtrl.resetSelectedPosition();
        }
      });

      /*
       * Scope functions
       */
      function getLocationPosition(location) {
          if(location) {
            return location.getDate('m') * PIXELS_PER_MINUTE;
          }
      }
      scope.getLocationPosition = getLocationPosition;

      function getIncidentsInThisHour(){
        try {
          return scope.incidentsByDay.getMap().get(scope.day).getMap().get(scope.hour);
        } catch (err) {
          return [];
        }
      }
      scope.getIncidentsInThisHour = getIncidentsInThisHour;

      function hourToTimeLabel(hourNum) {
        var hourString = hourNum < 10 ? '0' + hourNum : hourNum.toString();
        return hourString + 'h';
      }
      scope.timeLabel = function timeLabel() {
        return hourToTimeLabel(parseInt(scope.hour, 10));
      };
      scope.nextTimeLabel = function nextTimeLabel() {
        return hourToTimeLabel(parseInt(scope.hour, 10) + 1);
      };

      scope.selectPosition = function selectPosition(event, firstSectionLocation) {
        var startPosition = getLocationPosition(firstSectionLocation);
        var pos = getClickPosition(event);
        var selectedMinute = ((pos.x + startPosition) / PIXELS_PER_MINUTE) || 0;

        $window.console.log('selectedMinute', selectedMinute);

        var currentDate = $window.moment(segmentKey + ':' + selectedMinute, 'YYYY-MM-DD HH:mm');
        setPositionFromCurrentDate(currentDate);
        timelineSegmentsCtrl.setSelectedDate(currentDate);
      };
    }
  };
});
