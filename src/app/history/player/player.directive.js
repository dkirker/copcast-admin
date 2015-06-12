;(function(angular) {
  'use strict';

  var app = angular.module('copcastAdminApp');

  app.directive('player', function() {
    return {
      restrict: 'E',
      templateUrl: 'app/history/player/player.html',
      replace: true,
      scope: {
        user: '='
      },
      link: function(scope, el, attrs, controllers) {
        scope.time = '<strong>00:00</strong>:00';
      }
    };
  });
})(window.angular);
