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
        initialPeriod: '=?',
        onChangePeriod: '&?'
      },

      link: function(scope, el, attrs, controllers) {
        var $fromDate = el.find('.from.date');
        var $toDate = el.find('.to.date');
        var onChangePeriod = scope.onChangePeriod(); // Unwrap

        // Default state
        if(!scope.initialPeriod) {
          scope.initialPeriod = {
            fromDate: new Date(),
            toDate: new Date(),
            period: false
          };
        }

        // Watchers
        scope.$watch('period', function() {
          if(scope.period) {
            if(toDate)  {
              scope.toDate.value = toDate;
            }
          } else {
            toDate = scope.toDate.value;
          }
          updateDates();
        }, true);

        scope.$watch('fromDate.value', function() {
          updateDates();
        }, true);

        scope.$watch('toDate.value', function() {
          updateDates();
        }, true);


        // Scope initialization
        scope.period = scope.initialPeriod.period;

        scope.toDate = {
          value: scope.initialPeriod.toDate || new Date(),
          visible: false,
          show: function(){
            scope.toDate.visible = true;

            //angular.element(".date.filter ul").attr('style','display: block; top: 41px; left: auto;right: 0px;');
            setTimeout(function(){
              angular
                .element(".date.filter ul")
                .attr('style','display: block; top: 41px; left: auto;right: 0px;')
            }, 200);
          },
          hide: function(){
            scope.toDate.visible = false;
          }
        };

        scope.fromDate = {
          value: scope.initialPeriod.fromDate || new Date(),
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


        // Aux functions
        function updateDates() {
          var toDate = calculateToDate();
          if(moment(toDate).isSame(scope.toDate.value, 'day')) {
            var newPeriod = {
              fromDate: scope.fromDate.value,
              toDate: scope.toDate.value,
              period: scope.period
            };
            if(hasPeriodChanged(newPeriod)) {
              scope.lastPeriod = newPeriod;
              onChangePeriod(newPeriod);
            }
          } else {
            scope.toDate.value = toDate;
          }
        }

        function hasPeriodChanged(newPeriod) {
          return !angular.equals(newPeriod, scope.lastPeriod);
        }

        function calculateToDate() {
          var minDate = scope.fromDate.value;
          var maxDate = calculateMaxDateFrom(minDate);
          var date = moment(scope.toDate.value);

          if(date.isAfter(maxDate, 'day')) {
            return maxDate;
          } else
          if (date.isBefore(minDate, 'day')) {
            return minDate;
          }
          return date;
        }

        function updateMaxDate() {
          scope.toDate.maxDate = calculateMaxDateFrom(scope.dates.fromDate);
          $toDate.attr('min', moment(scope.dates.fromDate).format('YYYY-MM-DD'));
          $toDate.attr('max', scope.toDate.maxDate.format('YYYY-MM-DD'));
        }

        function calculateMaxDateFrom(date) {
          return moment(date).add(scope.maxPeriodDays, 'd').toDate();
        }
      }
    };
  });
})(window.angular, window.moment);
