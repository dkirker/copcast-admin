/**
 * Created by brunosiqueira on 21/01/16.
 */
'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:ExportsCreationCtrl
 * @description
 * # ExportsCreationCtrl
 * Controller of the copcastAdminApp
 */
angular.module('copcastAdminApp')
  .controller('ExportsCreationCtrl', function ($scope, userService, exportService, gettextCatalog) {
    $scope.exportObj = {
      recorderId: null,
      initialDate: null,
      initialDateVisible: false,
      initialDateShow: function () {
        $scope.exportObj.initialDateVisible = true
      }
    };
    $scope.resultSuccess = false;
    $scope.users = [];
    userService.listUsers().then(function(users){
      $scope.users = users
    }, function(err){
      $scope.errorMessage = err;
    });


    $scope.createExport = function(){
      if (!$scope.exportObj.recorderId){
        $scope.errorMessage = gettextCatalog.getString('User is required');
        return;
      }
      if (!$scope.exportObj.initialDate){
        $scope.errorMessage = gettextCatalog.getString('Date is required');
        return;
      }
      $scope.exportObj.finalDate = $scope.exportObj.initialDate;
      $scope.errorMessage = null;
      exportService.create($scope.exportObj).then(
        function(result){
          console.log(result)
          if (result.length > 0 ) {
            $scope.resultSuccess = true;
            $scope.resultEmpty = false;
          } else {
            $scope.resultSuccess = false;
            $scope.resultEmpty = true;
          }
        },
        function(err){
          if (err){
            $scope.resultEmpty = false;
            $scope.resultSuccess = false;
            $scope.errorMessage = err;
          }
        })
    }

  });
