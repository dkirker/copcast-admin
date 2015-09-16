'use strict';

/**
 * @ngdoc directive
 * @name copcastAdminApp.directive:header
 * @description
 * # appHeader
 */
angular.module('copcastAdminApp')
  .directive('appHeader', function () {
    return {
      templateUrl: 'app/views/appheader.html',
      restrict: 'E'

    };
  });
