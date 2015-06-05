;(function(angular) {
  'use strict';

  var app = angular.module('copcastAdminApp');

  app.directive('dateFilter', function() {
    var toDate;
    return {
      restrict: 'E',
      templateUrl: 'app/history/data_filter/data.filter.html',
      scope: {
        isPeriod: '=?',
        fromDate: '=',
        toDate: '='
      },
      link: function(scope, el, attrs, controllers) {
        var toDateEl = el.find('.to.date');

        scope.$watch('period', function() {
          if(scope.period && toDate) {
            toDateEl.val(toDate);
          } else {
            toDate = toDateEl.val();
            toDateEl.val(null);
          }
        }, true)
      }
    };
  });
})(window.angular);
