'use strict';

/**
 * @ngdoc directive
 * @name copcastAdminApp.directive:maxLength
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
            placement: function(element, counter, objPosition){
              var input = angular.element(element[0]);
              var alert = angular.element(counter[0]);

              alert.css({
                top: objPosition.top + input.outerHeight(true) + 5,
                left: objPosition.left + input.outerWidth(true) - alert.outerWidth(true)
              });
            },
            warningClass: "label",
            limitReachedClass: "label"
          });
        });
      }
    };
  }]);
