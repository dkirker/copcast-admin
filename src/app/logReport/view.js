'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:LogViewCtrl
 * @description
 * # LogViewCtrl
 * Controller of the copcastAdminApp
 */
angular.module('copcastAdminApp')
  .controller('LogReportViewCtrl', function ($scope, $routeParams, $http, $location, ServerUrl){

    // callback for ng-click 'back':
    $scope.back = function () {
      $location.path('/log-report-list');
    };

    //get incidentForm by id
    $http.get(ServerUrl + '/logreports/'+ $routeParams.id).success(function(data) {
      $scope.logreport = data;

    }).error(function(data) {
      console.log("Error: " + data);
    });

  });
