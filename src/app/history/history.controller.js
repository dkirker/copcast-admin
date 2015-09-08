;(function(angular, moment) {
  'use strict';

  var app = angular.module('copcastAdminApp');


  app.controller('HistoryCtrl', function ($scope, $q, $timeout, HistoryManager, userService, groupService) {

    $scope.manager = HistoryManager;

    HistoryManager.loadUsersAndGroups();

    $scope.initialPeriod = {
      fromDate: moment().add(-7, 'days').toDate(),
      toDate: moment().toDate(),
      period: true
    };
  });

})(window.angular, window.moment);
