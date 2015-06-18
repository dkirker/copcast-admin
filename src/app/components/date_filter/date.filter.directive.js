;(function(angular, moment) {
  'use strict';

  var app = angular.module('copcastAdminApp');

  var MAX_PERIOD_OF_DAYS = 30;

  app.directive('dateFilter', function() {
    var toDate;
    return {
      restrict: 'E',
      templateUrl: 'app/components/date_filter/date.filter.html',
      scope: {
        maxPeriodOfDays: '=?',
        isPeriod: '=?',
        fromDate: '=',
        toDate: '='
      },
      link: function(scope, el, attrs, controllers) {
        var toDateEl = el.find('.to.date');

        scope.maxPeriodDays = scope.maxPeriodOfDays || MAX_PERIOD_OF_DAYS;

        scope.$watch('period', function() {
          if(scope.period && toDate) {
            toDateEl.val(toDate);
          } else {
            toDate = toDateEl.val();
            toDateEl.val(null);
          }

          scope.$watch('fromDate', function() {
            var maxDate = moment(scope.fromDate).add(30, 'd');
            toDateEl.attr('min', moment(scope.fromDate).format('YYYY-MM-DD'));
            toDateEl.attr('max', maxDate.format('YYYY-MM-DD'));
          });

          scope.$watch('toDate', function() {

          });
        }, true)
      }
    };
  });
})(window.angular, window.moment);
