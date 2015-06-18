;(function(angular) {
  'use strict';

  var app = angular.module('copcastAdminApp');

  app.directive('timelineSegments', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/history/timeline/timeline.segments.html',
      link: function(scope, element, attrs, controllers) {
        scope.$watch('locationsByHour', function() {
          console.log('element', element.find('.activities .line'));
        });
      }
    };
  });
})(window.angular);
