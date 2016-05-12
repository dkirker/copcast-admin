'use strict';

var app = angular.module('copcastAdminApp');

app.directive('timelineSegments', function TimelineSegments($timeout, $window) {
  return {
    restrict: 'E',
    replace: true,
    require: ['^timeline', 'timelineSegments'],
    templateUrl: 'app/history/timeline/segments.html',

    controller: function($scope) {
      var self = this;

      this.setSelectedDate = function setSelectedDate(selectedDate) {
        $scope.setSelectedDate(selectedDate);
      };

      this.setPosition = function setPosition(position) {
        var adjustedPosition = position - 1;
        if($scope.selectedPosition !== adjustedPosition) {
          $scope.selectedPosition = adjustedPosition;
          $scope.userData.timeline.lastPosition = $scope.selectedPosition;
        }
      };

      this.resetSelectedPosition = function resetSelectedPosition() {
        self.setPosition(-40);
      };
    },

    scope: {
      userData: '=ngModel'
    },

    link: function(scope, element, attrs, ctrls) {
      var timelineCtrl = ctrls[0];
      var localCtrl = ctrls[1];
      var currentGroup;

      function initPosition() {
        var userData = scope.userData;
        if(!userData.timeline) {
          return;
        }
        $timeout(function () {
          var user = userData.user || {};

          localCtrl.resetSelectedPosition();
          currentGroup = user.group;

        }, 200);
      }

      function createDatesSequence() {
        var activitiesByDay = scope.userData.timeline.activitiesByDay;
        var dates = activitiesByDay ? activitiesByDay.keys() : [];
        var datesSequence = new $window.utils.Map();
        var previousDate;
        for(var i = 0, len = dates.length; i < len; i++) {
          var date = dates[i];
          datesSequence.put(date, previousDate);
          previousDate = date;
        }
        scope.userData.timeline.datesSequence = datesSequence;
      }

      function createActivities(locations) {
        var activities = new $window.utils.ListMap();
        if(!locations) {
          return activities;
        }

        function isOpen(count) {
          return count % 2 === 1;
        }

        function hasGap(previousLocation, location) {
          return !previousLocation || location.getDate('m') - previousLocation.getDate('m') > 8;
        }

        var previousLocation;
        var count = 0;

        for(var i = 0, length = locations.length; i < length; i++) {
          var location = locations[i];
          if(hasGap(previousLocation, location)) {
            if(isOpen(count)) {
              activities.put(count++ - 1, previousLocation);
            }

            activities.put(count++, location);
          }
          previousLocation = location;
        }

        if(isOpen(count)) {
          activities.put(count - 1, previousLocation);
        }

        return activities;
      }

      function createActivitiesByHour(locationsByHour) {
        var activitiesByHour = new $window.utils.Map();
        var hours = locationsByHour.keys();

        for(var i = 0, len = hours.length; i < len; i++) {
          var hour = hours[i];
          var locations = locationsByHour.get(hour);
          var activities = createActivities(locations);
          activitiesByHour.put(hour, activities);
        }
        return activitiesByHour;
      }

      function createActivitiesByDay() {
        var locationsByDay = scope.userData.locationsByDay.getMap();
        var dates = locationsByDay.keys();

        if(dates.length > 0) {
          var activitiesByDay = new $window.utils.Map();
          for(var i = 0, len = dates.length; i < len; i++) {
            var date = dates[i];
            var locationsByHour = locationsByDay.get(date);
            var activitiesByHour = createActivitiesByHour(locationsByHour.getMap());
            activitiesByDay.put(date, activitiesByHour);
          }
          scope.userData.timeline.activitiesByDay = activitiesByDay;
          $window.console.log('activitiesByDay', activitiesByDay);
        }
      }

      // function createIncidents(incidents) {
      //   var incidentsMap = new $window.utils.ListMap();
      //   if(!incidents) {
      //     return incidentsMap;
      //   }
      //
      //   for(var i = 0; i < incidents.length; i++) {
      //     incidentsMap.put(count++, location);
      //   }
      //   return incidentsMap;
      // }

      // function createIncidentsByHour(incidentsByHour) {
      //   var activitiesByHour = new $window.utils.Map();
      //   var hours = incidentsByHour.keys();
      //
      //   for(var i = 0, len = hours.length; i < len; i++) {
      //     var hour = hours[i];
      //     var incidents = incidentsByHour.get(hour);
      //     var incidentsMap = createIncidents(incidents);
      //     activitiesByHour.put(hour, incidentsMap);
      //   }
      //   return activitiesByHour;
      // }

      function createIncidentsByDay() {
        try {
          scope.userData.timeline.incidentsByDay = scope.userData.incidentsByDay.getMap();
        } catch (err) {
          $window.console.log('no incidents found.');
        }

        // var dates = incidentsByDay.keys();
        //
        // if(dates.length > 0) {
        //  var incidentsByDay = new $window.utils.Map();
        //  for(var i = 0, len = dates.length; i < len; i++) {
        //    var date = dates[i];
        //    var incidentsByHour = incidentsByDay.get(date);
        //    var activitiesByHour = createIncidentsByHour(incidentsByHour.getMap());
        //    incidentsByDay.put(date, activitiesByHour);
        //  }
        //  scope.userData.timeline.incidentsByDay = incidentsByDay;
        //  $window.console.log('incidentsByDay', incidentsByDay);
        // }
      }

      function loadTimelineData() {
        var userData = scope.userData;
        var hasLocations = userData.locationsByDay;
        var hasActivities = userData.timeline && userData.timeline.activitiesByDay;

        userData.timeline = userData.timeline || {};
        if(!hasActivities && hasLocations) {
          createActivitiesByDay();
          createIncidentsByDay();
          createDatesSequence();
        }
        var timeline = userData.timeline || {};
        scope.activitiesByDay = timeline.activitiesByDay;
        scope.datesSequence = timeline.datesSequence;
      }

      scope.$watch('userData', function() {
        if(scope.userData) {
          $window.console.log('ASIUHASIUAHSIAUSHAISUHAIUHS');
          loadTimelineData();
          initPosition();
        }
      });

      scope.setSelectedDate = timelineCtrl.setSelectedDate;

      scope.getPreviousDateLabel = function getPreviousDateLabel(key) {
        if(scope.userData.timeline.datesSequence) {
          var previousDate = scope.userData.timeline.datesSequence.get(key);
          return previousDate ? $window.moment(previousDate, 'YYYY-MM-DD').format('DD/MM') : undefined;
        }
      };

      scope.getCurrentDateLabel = function getCurrentDateLabel(key) {
        return $window.moment(key, 'YYYY-MM-DD').format('DD/MM');
      };
    }
  };
});
