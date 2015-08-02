;(function(angular) {
  'use strict';

  var app = angular.module('copcastAdminApp');

  app.directive('timelineSegments', function() {
    return {
      restrict: 'E',
      replace: true,
      require: '^timeline',
      templateUrl: 'app/history/timeline/segments.html',

      controller: function($scope) {
        var self = this;

        $scope.$watch('locationsByDay', function() {
          self.resetSelectedPosition();
        });

        this.setPosition = function setPosition(position) {
          $scope.selectedPosition = position - 1;
          console.log('position', position);
        };

        this.setLocation = function setLocation(location) {
          $scope.selectedLocation = location;
        }

        this.resetSelectedPosition = function resetSelectedPosition() {
          self.setPosition(-40);
        }
      },

      scope: {
        locationsByDay: '=ngModel',
        selectedLocation: '='
      },

      link: function(scope, element, attrs, timelineCtrl) {
        scope.$watch('locationsByDay', function() {
          if(!scope.selectedLocation && scope.locationsByDay) {
            scope.selectedLocation = scope.locationsByDay.getFirstLocation();
          }
        }, true);
      }

    };
  });
})(window.angular);
