'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:IncidentsViewCtrl
 * @description
 * # IncidentsViewCtrl
 * Controller of the copcastAdminApp
 */
angular.module('copcastAdminApp')
  .controller('IncidentsViewCtrl', function ($scope, $window, $routeParams, $http, $location, ServerUrl){

    // callback for ng-click 'back':
    $scope.back = function () {
      $location.path('/incidentForm-list');
    };

    //get incidentForm by id
    $http.get(ServerUrl + '/incidentForm/'+ $routeParams.id).success(function(data) {
      $scope.incidentForm = data;

    }).error(function(data) {
      $window.console.log('Error: ' + data);
    });

  });
