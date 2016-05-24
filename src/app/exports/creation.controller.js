'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:ExportsCreationCtrl
 * @description
 * # ExportsCreationCtrl
 * Controller of the copcastAdminApp
 */
angular.module('copcastAdminApp')
  .controller('ExportsCreationCtrl', function ($scope, $window, userService, exportService, gettextCatalog) {
    $scope.exportObj = {
      recorderId: null,
      initialDate: null,
      initialDateVisible: false,
      endDate: null,
      endDateVisible: false,
      period: true,
      initialTime: $window.moment().startOf('day').toDate(),
      endTime: $window.moment().endOf('day').seconds(0).millisecond(0).toDate(),
      initialDateShow: function () {
        $scope.exportObj.initialDateVisible = true;
      },
      endDateShow: function () {
        $scope.exportObj.endDateVisible = true;
      }
    };

    $scope.resultSuccess = false;
    $scope.users = [];
    userService.listUsers().then(function (users) {
      $scope.users = users;
    }, function (err) {
      $scope.errorMessage = err;
    });


    $scope.createExport = function () {
      if (!$scope.exportObj.recorderId) {
        $scope.errorMessage = gettextCatalog.getString('User is required');
        return;
      }
      if (!$scope.exportObj.initialDate) {
        $scope.errorMessage = gettextCatalog.getString('Date is required');
        return;
      }

      var exportObj = {
        recorderId: $scope.exportObj.recorderId
      };

      var initialDate;
      var endDate;
      if ($scope.exportObj.period) {
        initialDate = $window.moment($scope.exportObj.initialDate).startOf('day');
        endDate = $window.moment($scope.exportObj.endDate).endOf('day');
      } else {
        var initialTimeAux = $window.moment.utc($scope.exportObj.initialTime);
        initialDate = $window.moment($scope.exportObj.initialDate).hour(initialTimeAux.hour()).minutes(initialTimeAux.minutes());
        var endTimeAux = $window.moment.utc($scope.exportObj.endTime);
        endDate = $window.moment($scope.exportObj.initialDate).hour(endTimeAux.hour()).minutes(endTimeAux.minutes());
      }
      if (!initialDate.isValid()) {
        $scope.errorMessage = gettextCatalog.getString('Date is not valid');
        return;
      }
      if (!endDate.isValid()) {
        $scope.errorMessage = gettextCatalog.getString('End date is not valid');
        return;
      }

      exportObj.initialDate = initialDate.format('YYYY-MM-DD HH:mm');
      exportObj.finalDate = endDate.format('YYYY-MM-DD HH:mm');

      $scope.errorMessage = null;

      exportService.create(exportObj).then(
        function (result) {
          // console.log(result);
          if (result.length > 0) {
            $scope.resultSuccess = true;
            $scope.resultEmpty = false;
          } else {
            $scope.resultSuccess = false;
            $scope.resultEmpty = true;
          }
        },
        function (err) {
          if (err) {
            $scope.resultEmpty = false;
            $scope.resultSuccess = false;
            $scope.errorMessage = err;
          }
        }
      );
      return exportObj;
    };

    $window.$('input.time').mask('99:99');
  });
