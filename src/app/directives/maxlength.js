'use strict';

/**
 * @ngdoc directive
 * @name copcastAdminApp.directive:iCheck
 * @description
 * # maxLength
 */
angular.module('copcastAdminApp')
  .directive('maxLength', ['$timeout', '$parse', function ($timeout) {
    return {
      link: function ($scope, element, $attrs) {
        return $timeout(function () {
          var $element = angular.element(element);
          var length = ($attrs.maxLength === '' || $attrs.maxLength === null) ? 35 : $attrs.maxLength;

          $element
          .attr('maxlength', length)
          .maxlength({
            // alwaysShow: true,
            threshold: length,
            warningClass: "label label-success",
            limitReachedClass: "label label-danger"
          });
        });
      }
    };
  }]);
