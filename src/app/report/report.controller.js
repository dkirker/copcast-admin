/**
 * Created by brunosiqueira on 27/10/15.
 */
(function(angular, moment) {
  'use strict';

  angular.module('copcastAdminApp').controller('ReportCtrl', ReportCtrl);

  function ReportCtrl($scope) {
    $scope.filter = {fromDate: null, toDate: null}
    $scope.reportData = {
      activeOfficers: null,
      missions: null,
      recordingLength: null,
      recordedHours: null,
      streamedHours: null,
      incidents: null,
      adminAccess: null,
      incidentReport: []
    };

  }
})(window.angular, window.moment);
