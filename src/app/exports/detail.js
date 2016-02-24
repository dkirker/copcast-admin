/**
 * Created by brunosiqueira on 18/02/16.
 */
'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:ExportsDetailCtrl
 * @description
 * # ExportsCreationCtrl
 * Controller of the copcastAdminApp
 */
angular.module('copcastAdminApp')
  .controller('ExportsDetailCtrl', function ($scope, $routeParams, exportService) {
    exportService.getExport($routeParams.id).then(
      function(exportObj){
        $scope.exportObj = exportObj;

        $scope.downloadFile = function(){

        };
      },
      function(err){
        $scope.errorMessage = err;
      })
  });
