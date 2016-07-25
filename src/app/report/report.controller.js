/**
 * Created by brunosiqueira on 27/10/15.
 */

'use strict';

angular.module('copcastAdminApp')
  .controller('ReportCtrl', function($scope, $window, $http, ServerUrl, gettextCatalog,userService, groupService) {
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

    $scope.isLoading = false;
    $scope.hasError = false;
    $scope.hasErrorMessage = '';
    $scope.maxDate = new Date();

    function updateFilter(){
      var fromDate = $window.moment($scope.filter.fromDate);
      var toDate = $window.moment($scope.filter.toDate);

      if (fromDate.isValid() && toDate.isValid()) {
        if (fromDate <= toDate) {
          $scope.errorMessage = null;

          var url = ServerUrl + '/report/use/' + fromDate.format('YYYY-MM-DD') + '/' + toDate.format('YYYY-MM-DD') + '?';

          if ($scope.filter.user) {
            url += '&userId=' + $scope.filter.user;
          }

          if ($scope.filter.group) {
            url += '&groupId=' + $scope.filter.group;
          }

          /* LOADING LOGIC */
          $scope.isLoading = true;
          $scope.hasError = false;
          $scope.hasErrorMessage = '';

          $http.get(url).success(function (data) {
            $scope.isLoading = false;
            $scope.reportData = data;
          }).catch(function (err) {
            $scope.hasError = true;
            $scope.hasErrorMessage = err;
          });
        } else {
          $scope.errorMessage = gettextCatalog.getString('Invalid interval. Please check the date range.');
        }
      } else {
        $scope.errorMessage = gettextCatalog.getString('Invalid date.');
      }
    }

    function hasData(){
      return $scope.reportData && $scope.reportData.activeOfficers !== undefined;
    }

    $scope.hasData = hasData;
    $scope.updateFilter = updateFilter;

    //$scope.reportData = {
    //  activeOfficers: 0,
    //  missions: 1,
    //  recordedHours: '15:24',
    //  streamedHours: '3:54',
    //  incidents: 6,
    //  adminAccess: 5,
    //  incidentReport: [1,4,2,6,0],
    //  users: [
    //    {userName: 'Bruno Siqueira',
    //    activities: [
    //      {
    //        date: '2015-10-07',
    //        recordingTime: '08:25',
    //        streamingTime: '00:25',
    //        total: '18:00',
    //        pausedTime: '00:10',
    //        numberMissionStopped: 4
    //      }
    //    ]}
    //  ]
    //};


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

    $scope.range = function(count){
      var ratings = [];

      for (var i = 0; i < count; i++) {
        ratings.push(i);
      }

      return ratings;
    };
  });
