'use strict';
;(function(angular, moment) {

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

      controller: function($scope) {
        var onSelectDate = $scope.onSelectDate(); // Unwrap
        this.setSelectedDate = onSelectDate;
      },

      scope: {
        userData: '=',
        showVideo: '=',
        onSelectDate: '&'
      }
    };
  });

})(window.angular, window.moment);
