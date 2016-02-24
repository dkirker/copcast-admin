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
  .controller('ExportsDetailCtrl', function ($scope, $routeParams, exportService, ServerUrl) {
    exportService.getExport($routeParams.id).then(
      function(exportObj){
        $scope.exportObj = exportObj;

        $scope.downloadUrl = ServerUrl + '/exports/'+exportObj.id+'/download';
      },
      function(err){
        $scope.errorMessage = err;
      })
  });
