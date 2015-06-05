;(function(angular) {
  'use strict';

  var app = angular.module('copcastAdminApp');

  app.directive('player', function() {
    return {
      restrict: 'E',
      templateUrl: 'app/history/player/player.html',
      scope: {
        user: '='
      },
      link: function(scope, el, attrs, controllers) {
      }
    };
  });
})(window.angular);
