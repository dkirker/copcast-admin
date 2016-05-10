'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:LogReportListCtrl
 * @description
 * # LogReportListCtrl
 * Controller of the copcastAdminApp
 */
angular.module('copcastAdminApp')
  .controller('LogReportListCtrl', function ($scope, $window, $http, $location, ServerUrl, historyService,userService, groupService, gettextCatalog) {

    $scope.sortKey = 'date';
    $scope.reverse = 1;
    $scope.perPage = 30;
    $scope.totalHistories = 0;
    $scope.pagination = 1;

    function loadHistory(){
      historyService.listHistories($scope.filter.user, $scope.filter.group, $scope.pagination, $scope.perPage).
      then(function(data){
        $scope.logreports = data.rows;
        for (var i = 0; i < $scope.logreports.length; i++){
          var logReport = $scope.logreports[i];
          logReport.extraJson = JSON.parse(logReport.extras);
        }
        $scope.totalHistories = data.count;
      }, function(error){
        $window.console.error(error);
      });
    }

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
      return $scope.logreport && $scope.logreport.activeOfficers !== undefined;
    };

    //sort range date
    $scope.searchByDate = function updateFilter(){
      var fromDate = $window.moment($scope.filter.fromDate);
      var toDate = $window.moment($scope.filter.toDate);
      if (fromDate.isValid() && toDate.isValid()) {
        $scope.errorMessage = null;
        historyService.listHistoriesByParams(fromDate, toDate, $scope.filter.user, $scope.filter.group,
          $scope.pagination, $scope.perPage).
        then(function(data){
          $scope.logreports = data.rows;
          $scope.totalHistories = data.count;
        }, function(error){
          $window.console.error(error);
        });
      } else {
        $scope.errorMessage = gettextCatalog.getString('Invalid date range.');
      }
    };

    $scope.users = [];
    userService.listUsers().then(function(users){
      $scope.users = users;
    }, function(err){
      $scope.errorMessage = err;
    });

    $scope.groups = [];
    groupService.listGroups().then(function(groups){
      $scope.groups = groups;
    }, function(err){
      $scope.errorMessage = err;
    });

    loadHistory();
  });
