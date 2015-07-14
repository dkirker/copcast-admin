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
          self.resetSelectedActivity();
        });

        this.selectActivity = function selectActivity(data) {
          $scope.selectedPosition = data.selectedPosition - 1;
          $scope.selectedLocation = data.location;
        };

        this.resetSelectedActivity = function resetSelectedActivity() {
          self.selectActivity({
            selectedPosition: -40,
            location: undefined
          });
        }
      },

      scope: {
        locationsByDay: '=ngModel',
        onSelectLocation: '&'
      },

      link: function(scope, element, attrs, timelineCtrl) {
        scope.$watch('selectedLocation', function() {
          timelineCtrl.selectLocation(scope.selectedLocation);
        });
      }

    };
  });
})(window.angular);
