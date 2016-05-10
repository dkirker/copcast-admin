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
    $scope.page = 1;
    $scope.perPage = 30;
    $scope.totalExports = 0;

    function loadExports(){
      var params = {
        page: $scope.page,
        perPage: $scope.perPage
      };

      exportService.listExports(params).then(function(exports){
        $scope.totalExports = exports.count;
        $scope.exports = exports.rows;
      });
    }

    $scope.pageChanged = function(newPage) {
      $scope.page = newPage;
      loadExports();
    };

    $scope.isAvailable = function(exportVideos){
      return exportVideos.status === 'AVAILABLE';
    };

    loadExports();
  });
