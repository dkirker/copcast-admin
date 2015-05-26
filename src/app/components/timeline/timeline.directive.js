;(function(angular) {
  'use strict';

  var app = angular.module('copcastAdminApp');

  app.directive('timeline', function() {
    return {
      restrict: 'E',
      templateUrl: 'app/timeline/timeline.html'
    };
  });
})(window.angular);
