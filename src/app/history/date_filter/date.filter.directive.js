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
        period: '=?',
        dates: '='
      },
      link: function(scope, el, attrs, controllers) {
        var $fromDate = el.find('.from.date');
        var $toDate = el.find('.to.date');

        scope.maxPeriodDays = scope.maxPeriodOfDays || MAX_PERIOD_OF_DAYS;

        scope.$watch('period', function() {
          if(scope.period) {
            if(toDate)  {
              scope.toDate = toDate;
            }
          } else {
            toDate = scope.toDate;
            scope.toDate = null;
          }
        }, true);

        scope.$watchCollection('dates', function() {
          updateMaxDate();
          var dates = scope.dates;
          scope.fromDate = dates.fromDate;
          scope.toDate = limitDate(dates.toDate);
        });

        scope.$watch('fromDate', function() {
          updateDates();
        }, true);

        scope.$watch('toDate', function() {
          updateDates();
        }, true);

        function updateDates() {
          var fromDate = scope.fromDate;
          var toDate = limitDate(scope.toDate);
          var newDates = {
            fromDate: fromDate,
            toDate: toDate
          };
          if(hasDatesChanges(newDates)) {
            scope.dates = angular.extend({}, scope.dates, newDates);
          }
        }

        function hasDatesChanges(newDates) {
          var dates = scope.dates;
          return !moment(newDates.fromDate).isSame(dates.fromDate, 'day') ||
                 !moment(newDates.toDate).isSame(dates.toDate, 'day');
        }

        function limitDate(date) {
          var maxDate = calculateMaxDateFrom(scope.fromDate);
          if(moment(date).isAfter(maxDate, 'day')) {
            return maxDate.toDate();
          }
          if(moment(date).isAfter(maxDate, 'day')) {
            return scope.fromDate;
          }
          return date;
        }

        function updateMaxDate() {
          var maxDate = calculateMaxDateFrom(scope.dates.fromDate);
          $toDate.attr('min', moment(scope.dates.fromDate).format('YYYY-MM-DD'));
          $toDate.attr('max', maxDate.format('YYYY-MM-DD'));
        }

        function calculateMaxDateFrom(date) {
          return moment(date).add(scope.maxPeriodDays, 'd');
        }
      }
    };
  });
})(window.angular, window.moment);
