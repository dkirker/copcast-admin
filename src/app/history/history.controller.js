'use strict';

var app = angular.module('copcastAdminApp');

app.controller('HistoryCtrl', function ($scope, $window, $q, $timeout, HistoryManager, userService) {

  $scope.manager = HistoryManager;

  HistoryManager.loadUsersAndGroups();

  $scope.initialPeriod = {
    fromDate: $window.moment().add(-7, 'days').toDate(),
    toDate: $window.moment().toDate(),
    period: true
  };

  $scope.showVideo = function(){
    return userService.isAdminTwo() || userService.isAdminThree();
  };
});
