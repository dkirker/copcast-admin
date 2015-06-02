;(function(angular) {
  'use strict';

  var app = angular.module('copcastAdminApp');

  app.directive('timelineSegment', function() {
    return {
      restrict: 'E',
      templateUrl: 'app/timeline/timeline-segment.html'
    };
  });
})(window.angular);
