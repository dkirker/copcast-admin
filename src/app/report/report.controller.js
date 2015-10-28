/**
 * Created by brunosiqueira on 27/10/15.
 */
(function(angular, moment) {
  'use strict';

  angular.module('copcastAdminApp').controller('ReportCtrl', ReportCtrl);

  function ReportCtrl($scope) {
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
    $scope.reportData = {
      activeOfficers: 0,
      missions: 1,
      recordedHours: '15:24',
      streamedHours: '3:54',
      incidents: 6,
      adminAccess: 5,
      incidentReport: [1,4,2,6,0],
      users: [
        {userName: 'Bruno Siqueira',
        activities: [
          {
            date: '2015-10-07',
            recordingTime: '08:25',
            streamingTime: '00:25',
            total: '18:00',
            pausedTime: '00:10',
            numberMissionStopped: 4
          }
        ]}
      ]
    };

    $scope.hasData = hasData;


    function hasData(){
      return true;
    }

  }
})(window.angular, window.moment);
