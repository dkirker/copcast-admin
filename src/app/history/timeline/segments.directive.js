;(function(angular) {
  'use strict';

  var app = angular.module('copcastAdminApp');

  app.directive('timelineSegments', function($timeout) {
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
          $scope.selectedPosition = position - 1;
          $scope.userData.timeline.lastPosition = $scope.selectedPosition;
        };

        this.resetSelectedPosition = function resetSelectedPosition() {
          self.setPosition(-40);
        }
      },

      scope: {
        userData: '=ngModel'
      },

      link: function(scope, element, attrs, ctrls) {
        var timelineCtrl = ctrls[0];
        var localCtrl = ctrls[1];
        var currentGroup;
        var previousDate;

        scope.$watch('userData', function() {
          if(scope.userData) {
            loadTimelineData();
            initPosition();
          }
          previousDate = undefined;
        });

        scope.setSelectedDate = timelineCtrl.setSelectedDate;

        scope.getPreviousDateLabel = function getPreviousDateLabel(key) {
          return previousDate;
        };

        scope.getCurrentDateLabel = function getCurrentDateLabel(key) {
          var currentDate = moment(key, 'YYYY-MM-DD').format('DD/MM');
          previousDate = currentDate;
          return currentDate;
        };

        function initPosition() {
          var userData = scope.userData;
          if(!userData.timeline) {
            return;
          }
          $timeout(function () {
            var user = userData.user || {};
            if(!currentGroup || currentGroup !== user.group) {
              localCtrl.resetSelectedPosition();
              currentGroup = user.group;
            }
          }, 200);
        }

        function loadTimelineData() {
          var userData = scope.userData;
          var hasLocations = userData.locationsByDay;
          var hasActivities = userData.timeline && userData.timeline.activitiesByDay;

          if(!hasActivities && hasLocations) {
            userData.timeline = {};
            createActivitiesByDay();
            createDatesSequence();
          }
          var timeline = userData.timeline || {};
          scope.activitiesByDay = timeline.activitiesByDay;
          scope.datesSequence = timeline.datesSequence;
        }

        function createDatesSequence() {
          var activitiesByDay = scope.userData.timeline.activitiesByDay;
          var dates = activitiesByDay ? activitiesByDay.keys() : [];
          var datesSequence = new utils.Map();
          var previousDate;
          for(var i = 0, len = dates.length; i < len; i++) {
            var date = dates[i];
            datesSequence.put(date, previousDate);
            previousDate = date;
          }
          scope.userData.timeline.datesSequence = datesSequence;
        }

        function createActivitiesByDay() {
          var locationsByDay = scope.userData.locationsByDay.getMap();
          var dates = locationsByDay.keys();

          if(dates.length > 0) {
            var activitiesByDay = new utils.Map();
            for(var i = 0, len = dates.length; i < len; i++) {
              var date = dates[i];
              var locationsByHour = locationsByDay.get(date);
              var activitiesByHour = createActivitiesByHour(locationsByHour.getMap());
              activitiesByDay.put(date, activitiesByHour);
            }
            scope.userData.timeline.activitiesByDay = activitiesByDay;
            console.log('activitiesByDay', activitiesByDay);
          }
        }

        function createActivitiesByHour(locationsByHour) {
          var activitiesByHour = new utils.Map();
          var hours = locationsByHour.keys();

          for(var i = 0, len = hours.length; i < len; i++) {
            var hour = hours[i];
            var locations = locationsByHour.get(hour);
            var activities = createActivities(locations);
            activitiesByHour.put(hour, activities);
          }
          return activitiesByHour;
        }

        function createActivities(locations) {
          var activities = new utils.ListMap();
          if(!locations) {
            return activities;
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

          function isOpen(count) {
            return count % 2 === 1;
          }

          function hasGap(previousLocation, location) {
            return !previousLocation || location.getDate('m') - previousLocation.getDate('m') > 8;
          }
        }

      }
    };
  });
})(window.angular);
