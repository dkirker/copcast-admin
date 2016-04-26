'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:IncidentsListCtrl
 * @description
 * # IncidentsListCtrl
 * Controller of the copcastAdminApp
 */
angular.module('copcastAdminApp')
  .controller('IncidentsListCtrl', function ($scope, $http, $location, ServerUrl, gettextCatalog) {

    $scope.sortKey = "date";
    $scope.reverse = 1;
    $scope.perPage = 1;
    $scope.totalIncidents = 0;
    $scope.page = 1;

    $scope.pageChanged = function(newPage) {
      $scope.page = newPage;
      if ($scope.filter.fromDate && $scope.filter.toDate){
        $scope.searchByDate();
      } else {
        loadIncident();
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
      return $scope.incidentForms && $scope.incidentForms["activeOfficers"] !== undefined;
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

        loadIncident(fromDate, toDate);
        // $http.get(ServerUrl + "/incidentForms/" + fromDate.format('YYYY-MM-DD') + "/" + toDate.format('YYYY-MM-DD'))
        //   .success(function (data) {
        //     $scope.incidentForms = data;
        //   });
      } else {
        $scope.errorMessage = gettextCatalog.getString('Invalid data range.')
      }
    };

    // callback for ng-click 'viewIncidentForm':
    $scope.viewIncident = function (incidentId) {
      $location.path('/incidentForm-view/' + incidentId);
    };

    function loadIncident(fromDate, toDate){
      fromDate = typeof fromDate !== 'undefined' ? fromDate : null;
      toDate = typeof toDate !== 'undefined' ? toDate : null;

      var stringDate = '';

      if (fromDate && toDate) {
        stringDate = '/' + fromDate.format('YYYY-MM-DD') + '/' + toDate.format('YYYY-MM-DD');
      }

      $http.get(ServerUrl + '/incidentForms' + stringDate,
        {
          params: {
            page: $scope.page,
            perPage: $scope.perPage
          }
        }
      ).success(function(data) {
        $scope.incidentForms = data.rows;
        $scope.totalIncidents = data.count;
      }).error(function(data) {
        console.error(data);
      });
    }

    loadIncident();
  });
