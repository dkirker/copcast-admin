'use strict';

/**
 * @ngdoc directive
 * @name copcastAdminApp.directive:userName
 * @description
 * # userName
 */
angular.module('copcastAdminApp')
  .directive('userName', function () {
    return {
      templateUrl: 'app/views/userName.html',
      restrict: 'E'

    };
  });
