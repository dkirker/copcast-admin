'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:LogReportListCtrl
 * @description
 * # LogReportListCtrl
 * Controller of the copcastAdminApp
 */
angular.module('copcastAdminApp')
  .controller('LogReportListCtrl', function ($scope, $http, $location, ServerUrl, historyService, gettextCatalog) {

    $scope.sortKey = "date";
    $scope.reverse = 1;
    $scope.perPage = 30;
    $scope.totalHistories = 0;
    $scope.pagination = 1;

    $scope.pageChanged = function(newPage) {
      $scope.pagination = newPage;
      if ($scope.filter.fromDate && $scope.filter.toDate){
        $scope.searchByDate();
      } else {
        loadHistory();
      }
    };


    //filter to catch data range behavior
    $scope.filter = {
      fromDate: null,
      toDate: null,
      fromDateVisible: false,
      toDateVisible: false,
      fromDateShow: function(){
        $scope.filter.fromDateVisible = true;
      },
      toDateShow: function(){
        $scope.filter.toDateVisible = true;
      }

    };
    $scope.hasData = function hasData(){
      return $scope.logreport && $scope.logreport["activeOfficers"] !== undefined;
    };

    //sort list
    $scope.sort = function(keyname){
      $scope.sortKey = keyname;
      $scope.reverse = !$scope.reverse;

    };

    //sort range date
    $scope.searchByDate = function updateFilter(){
      var fromDate = moment($scope.filter.fromDate);
      var toDate = moment($scope.filter.toDate);
      if (fromDate.isValid() && toDate.isValid()) {
        $scope.errorMessage = null;
        historyService.listHistoriesByPeriod(fromDate, toDate, $scope.pagination, $scope.perPage).
          then(function(data){
            $scope.logreports = data.rows;
            $scope.totalHistories = data.count;
          }, function(error){
            console.error(error);
          });
      } else {
        $scope.errorMessage = gettextCatalog.getString('Invalid date range.')
      }
    };

    // callback for ng-click 'viewLogReport':
    $scope.viewLog = function (historyId) {
      $location.path('/log-report-view/' + historyId);
    };

    function loadHistory(){
      historyService.listHistories($scope.pagination, $scope.perPage).
      then(function(data){
        $scope.logreports = data.rows;
        $scope.totalHistories = data.count;
      }, function(error){
        console.error(error);
          });
      }

    loadHistory();
  });
