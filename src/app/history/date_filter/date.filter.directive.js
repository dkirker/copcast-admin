;(function(angular, moment) {
  'use strict';

  var app = angular.module('copcastAdminApp');

  var MAX_PERIOD_OF_DAYS = 30;

  app.directive('dateFilter', function() {
    var toDate;
    return {
      restrict: 'E',
      templateUrl: 'app/history/date_filter/date.filter.html',
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
            scope.toDate = toDate;
          } else {
            toDate = scope.toDate;
            scope.toDate = null;
          }
        }, true);

        scope.$watch('fromDate', function() {
          var maxDate = moment(scope.fromDate).add(scope.maxPeriodDays, 'd');
          toDateEl.attr('min', moment(scope.fromDate).format('YYYY-MM-DD'));
          toDateEl.attr('max', maxDate.format('YYYY-MM-DD'));

          if(scope.toDate && moment(scope.toDate).isAfter(maxDate)) {
            scope.toDate = maxDate.toDate();
          }
        }, true);

        scope.$watch('toDate', function() {

        });
      }
    };
  });
})(window.angular, window.moment);
