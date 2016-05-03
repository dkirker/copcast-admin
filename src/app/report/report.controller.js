/**
 * Created by brunosiqueira on 27/10/15.
 */
(function(angular, moment) {
  'use strict';

  angular.module('copcastAdminApp').controller('ReportCtrl', ReportCtrl);

  function ReportCtrl($scope, $http, ServerUrl, gettextCatalog) {
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

    $scope.range = function(count){
      var ratings = [];

      for (var i = 0; i < count; i++) {
        ratings.push(i)
      }

      return ratings;
    };

    function updateFilter(){
      var fromDate = moment($scope.filter.fromDate);
      var toDate = moment($scope.filter.toDate);

      if (fromDate.isValid() && toDate.isValid()) {
        if (fromDate <= toDate) {
          $scope.errorMessage = null;
          $http.get(ServerUrl + "/report/use/" + fromDate.format('YYYY-MM-DD') + "/" + toDate.format('YYYY-MM-DD')).success(function (data) {
            $scope.reportData = data;
          });
          // setTimeout(function(){
          //   $('.dataTable').DataTable({
          //     lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
          //     dom: '<"col-sm-6"l><"col-sm-6"f>rt<"col-sm-12"i><"col-sm-8 .col-sm-offset-2"p>'
          //   });
          // }, 5000);
        } else {
          $scope.errorMessage = gettextCatalog.getString('Invalid interval. Please check the date range.')
        }
      } else {
        $scope.errorMessage = gettextCatalog.getString('Invalid date.')
      }
    }

    function hasData(){
      return $scope.reportData && $scope.reportData["activeOfficers"] !== undefined;
    }

  }
})(window.angular, window.moment);
