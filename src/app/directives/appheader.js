'use strict';

/**
 * @ngdoc directive
 * @name copcastAdminApp.directive:header
 * @description
 * # appHeader
 */
angular.module('copcastAdminApp')
  .directive('appHeader', function (userService) {
    return {
      templateUrl: 'app/views/appheader.html',
      restrict: 'E',
      link: function (scope) {
        scope.canExport = function() {
          return userService.isAdminTwo() || userService.isAdminThree()
        };
      }
    };
  });
