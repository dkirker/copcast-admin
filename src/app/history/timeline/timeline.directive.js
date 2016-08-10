'use strict';
// ;(function(angular, moment) {

  var app = angular.module('copcastAdminApp');
  var hours = [];

  for(var hour = 0; hour < 24; hour++) {
    hours.push(hour);
  }

  app.directive('timeline', function TimelineDirective() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/history/timeline/timeline.html',

      controller: function($scope, $window) {
        var onSelectDate = $scope.onSelectDate(); // Unwrap
        this.setSelectedDate = onSelectDate;

        setTimeout(function(){
          var window = $($window);
          var copcastPlayer = $('.copcastHistoryVideoPlayer');
          var noLocationAlert = $('.hasNoLocation');

          noLocationAlert.css({width: window.width() - copcastPlayer.width()});
          window.resize(function() {
            noLocationAlert.css({width: window.width() - copcastPlayer.width()});
          });
        }, 100);
      },

      scope: {
        userData: '=',
        showVideo: '=',
        hasLocation: '=',
        currentVideo: '=',
        onSelectDate: '&'
      }
    };
  });
// })(window.angular, window.moment);
