/**
 * Created by brunosiqueira on 21/01/16.
 */
'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:ExportsListCtrl
 * @description
 * # ExportsListCtrl
 * Controller of the copcastAdminApp
 */
angular.module('copcastAdminApp')
  .controller('ExportsListCtrl', function ($scope, exportService) {
    $scope.exports = [];

    exportService.listExports().then(function(exports){
      $scope.exports = exports;
    });

    $scope.perPage = 30;
    $scope.totalExports = 0
    $scope.pagination = 1;

    $scope.pageChanged = function(newPage) {
      $scope.pagination = newPage;
    };

    $scope.isAvailable = function(exportVideos){
      return exportVideos.status === 'AVAILABLE';
    };

  });
