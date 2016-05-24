/*jslint browser: true*/

'use strict';

var app = angular.module('copcastAdminApp');

var MAX_PERIOD_OF_DAYS = 30;

app.directive('dateFilter', function($window, $rootScope, $cookies) {
  var toDate;
  return {
    restrict: 'E',
    templateUrl: 'app/history/date_filter/date.filter.html',
    scope: {
      maxPeriodOfDays: '=?',
      initialPeriod: '=?',
      onChangePeriod: '&?'
    },

    link: function(scope/*, el, attrs, controllers*/) {
      // var $fromDate = el.find('.from.date');
      // var $toDate = el.find('.to.date');
      var onChangePeriod = scope.onChangePeriod(); // Unwrap

      // Default state
      if(!scope.initialPeriod) {
        scope.initialPeriod = {
          fromDate: new Date(),
          toDate: new Date(),
          period: false
        };
      }

      if(!scope.hideHistoryAlert) {
        if ($rootScope.globals && $rootScope.globals.currentUser) {
          scope.hideHistoryAlert = $rootScope.globals.currentUser.hideHistoryAlert;
        } else {
          scope.hideHistoryAlert = false;
        }
      }

      // Aux functions
      function hasPeriodChanged(newPeriod) {
        return !angular.equals(newPeriod, scope.lastPeriod);
      }

      function calculateMaxDateFrom(date) {
        return $window.moment(date).add(scope.maxPeriodDays, 'd').toDate();
      }

      // function updateMaxDate() {
      //   scope.toDate.maxDate = calculateMaxDateFrom(scope.dates.fromDate);
      //   $toDate.attr('min', $window.moment(scope.dates.fromDate).format('YYYY-MM-DD'));
      //   $toDate.attr('max', scope.toDate.maxDate.format('YYYY-MM-DD'));
      // }

      function calculateToDate() {
        var minDate = scope.fromDate.value;
        var maxDate = calculateMaxDateFrom(minDate);
        var date = $window.moment(scope.toDate.value);
        var newDate = {};

        // $window.console.warn('START calculateToDate()');
        // $window.console.info('minDate: ', minDate);
        // $window.console.info('maxDate: ', maxDate);
        // $window.console.info('date: ', date);
        // $window.console.warn('END calculateToDate()');
        // $window.console.log('');

        if($window.moment(maxDate).isAfter(new Date(), 'day')) {
          newDate.maxValue = new Date();
        } else {
          newDate.maxValue = maxDate;
        }

        if(date.isAfter(maxDate, 'day')) {
          newDate.value = maxDate;
          newDate.alert = true;
        // } else if (date.isBefore(minDate, 'day')) {
        //   newDate.value = minDate;
        } else {
          newDate.value = date;
        }

        return newDate;
      }

      function updateDates() {
        var toDate = calculateToDate();

        if($window.moment(toDate.value).isSame(scope.toDate.value, 'day')) {
          var newPeriod = {
            fromDate: scope.fromDate.value,
            toDate: scope.toDate.value,
            period: scope.period
          };

          if(hasPeriodChanged(newPeriod)) {
            scope.lastPeriod = newPeriod;
            onChangePeriod(newPeriod);
            scope.toDate.maxValue = toDate.maxValue;
          }
        } else {
          scope.toDate.value = toDate.value;
          scope.toDate.maxValue = toDate.maxValue;
        }

        if(toDate.alert && !scope.hideHistoryAlert) {
          angular.element('.calendarAlert').fadeIn();
        }
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

      scope.$watch('hideHistoryAlert', function() {
        if ($rootScope.globals && $rootScope.globals.currentUser) {
          $rootScope.globals.currentUser.hideHistoryAlert = scope.period;
          var cookies = $cookies.getObject('globals');
          cookies.currentUser.hideHistoryAlert = scope.period;
          $cookies.putObject('globals', cookies);
        }
      }, true);


      // Scope initialization

      var historyAlert = angular.element('.calendarAlert');
      angular.element(document).on('click', function(e){
        if(!historyAlert.is(e.target) && historyAlert.has(e.target).length === 0){
          historyAlert.fadeOut();
        }
      });

      historyAlert.hide();

      scope.period = scope.initialPeriod.period;

      scope.toDate = {
        value: scope.initialPeriod.toDate || new Date(),
        maxValue: new Date(),
        visible: false,
        show: function(){
          scope.toDate.visible = true;

          //angular.element('.date.filter ul').attr('style','display: block; top: 41px; left: auto;right: 0px;');
          $window.setTimeout(function(){
            angular
              .element('.date.filter ul')
              .attr('style','display: block; top: 41px; left: auto;right: 0px;');
          }, 200);
        },
        hide: function(){
          scope.toDate.visible = false;
        }
      };

      scope.fromDate = {
        value: scope.initialPeriod.fromDate || new Date(),
        maxValue: new Date(),
        visible: false,
        show: function(){
          scope.fromDate.visible = true;
        },
        hide: function(){
          scope.fromDate.visible = false;
        }
      };

      scope.maxPeriodDays = scope.maxPeriodOfDays || MAX_PERIOD_OF_DAYS;
    }
  };
});
