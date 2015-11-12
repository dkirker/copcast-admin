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
        $http.get(ServerUrl + "/incidentForms/" + fromDate.format('YYYY-MM-DD') + "/" + toDate.format('YYYY-MM-DD'))
          .success(function (data) {
          $scope.incidentForms = data;
        });
      } else {
        $scope.errorMessage = gettextCatalog.getString('Invalid data range.')
      }
    }

    // callback for ng-click 'viewIncidentForm':
    $scope.viewIncident = function (incidentId) {
      $location.path('/incidentForm-view/' + incidentId);
    };

    $http.get(ServerUrl + '/incidentForms',
      { params : {
        page : $scope.page
      }
      }
    ).success(function(data) {
        $scope.incidentForms = data;
        console.log("IncidentForm==" , data);
      }).error(function(data) {
        console.error(data);
      });

  });
