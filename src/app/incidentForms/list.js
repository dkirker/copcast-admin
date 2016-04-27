'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:IncidentsListCtrl
 * @description
 * # IncidentsListCtrl
 * Controller of the copcastAdminApp
 */
angular.module('copcastAdminApp')
  .controller('IncidentsListCtrl', function ($scope, $http, $location, ServerUrl, userService, groupService, gettextCatalog) {

    $scope.sortKey = "date";
    $scope.reverse = 1;
    $scope.perPage = 30;
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

      if ($scope.filter.fromDate == null && $scope.filter.toDate == null) {
        $scope.errorMessage = null;
        loadIncident();
      } else if (fromDate.isValid() && toDate.isValid()) {
        $scope.errorMessage = null;
        loadIncident(fromDate, toDate);
      } else {
        $scope.errorMessage = gettextCatalog.getString('Invalid data range.')
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
      $scope.groups = groups
    }, function(err){
      $scope.errorMessage = err;
    });

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
            perPage: $scope.perPage,
            group: $scope.filter.group,
            user: $scope.filter.user
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
