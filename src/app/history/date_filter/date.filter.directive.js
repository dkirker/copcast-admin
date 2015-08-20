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

        scope.toDate = {
          value: new Date(),
          visible: false,
          show: function(){
            scope.toDate.visible = true;

            //angular.element(".date.filter ul").attr('style','display: block; top: 41px; left: auto;right: 0px;');
            setTimeout(function(){angular.element(".date.filter ul").attr('style','display: block; top: 41px; left: auto;right: 0px;') },200);
          },
          hide: function(){
            scope.toDate.visible = false;
          }
        };

        scope.fromDate = {
          value: new Date(),
          maxDate: '',
          visible: false,
          show: function(){
            scope.fromDate.visible = true;

          },
          hide: function(){
            scope.fromDate.visible = false;
          }
        };

        scope.maxPeriodDays = scope.maxPeriodOfDays || MAX_PERIOD_OF_DAYS;

        scope.$watch('period', function() {
          if(scope.period) {
            if(toDate)  {
              scope.toDate.value = toDate;
            }
          } else {
            toDate = scope.toDate.value;
            //scope.toDate.value = null;
          }
        }, true);

        scope.$watchCollection('dates', function() {
          updateMaxDate();
          var dates = scope.dates;
          scope.fromDate.value = dates.fromDate;
          scope.toDate.value = limitDate(dates.toDate);
          if (moment(scope.fromDate.value).isAfter(scope.toDate.value, 'day')){
            scope.toDate.value = scope.fromDate.value;
          }
        });

        scope.$watch('fromDate.value', function() {
          updateDates();
        }, true);

        scope.$watch('toDate.value', function() {
          updateDates();
        }, true);

        function updateDates() {
          var fromDate = scope.fromDate.value;
          var toDate = limitDate(scope.toDate.value);
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
          var maxDate = calculateMaxDateFrom(scope.fromDate.value);
          if(moment(date).isAfter(maxDate, 'day')) {
            return maxDate.toDate();
          }
          return date;
        }

        function updateMaxDate() {
          scope.toDate.maxDate = calculateMaxDateFrom(scope.dates.fromDate);
          $toDate.attr('min', moment(scope.dates.fromDate).format('YYYY-MM-DD'));
          $toDate.attr('max', scope.toDate.maxDate.format('YYYY-MM-DD'));
        }

        function calculateMaxDateFrom(date) {
          return moment(date).add(scope.maxPeriodDays, 'd');
        }
      }
    };
  });
})(window.angular, window.moment);
