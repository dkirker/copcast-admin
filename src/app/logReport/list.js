'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:LogReportListCtrl
 * @description
 * # LogReportListCtrl
 * Controller of the copcastAdminApp
 */
angular.module('copcastAdminApp')
  .controller('LogReportListCtrl', function ($scope, $http, $location, ServerUrl, gettextCatalog) {

    $scope.sortKey = "date";
    $scope.reverse = 1;

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
    }

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
        $http.get(ServerUrl + "/logreports/" + fromDate.format('YYYY-MM-DD') + "/" + toDate.format('YYYY-MM-DD'))
          .success(function (data) {
            $scope.logreport = data;
          });
      } else {
        $scope.errorMessage = gettextCatalog.getString('Invalid data range.')
      }
    }

    // callback for ng-click 'viewLogReport':
    $scope.viewLog = function (historyId) {
      $location.path('/log-report-view/' + historyId);
    };

    console.log(ServerUrl + '/logreports');

    $http.get(ServerUrl + '/logreports',
      { params : {
        page : $scope.page
      }
      }
    ).success(function(data) {
        $scope.logreports = data;
        console.log("logReport==" , data);
      }).error(function(data) {
        console.error(data);
      });

  });
