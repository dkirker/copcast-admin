;(function(angular) {
  'use strict';

  var app = angular.module('copcastAdminApp');

  app.directive('timelineSegment', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/history/timeline/timeline.segment.html',
      scope: {
        locationsByDate: '='
      },
      link: function(scope, element, attrs, controllers) {
        scope.$watch('locationsByDate', function() {
          console.log('timelineSegment:locationsByDate', scope.locationsByDate);
        }, true);
      }
    };
  });
})(window.angular);
