'use strict';

/**
 * @ngdoc directive
 * @name copcastAdminApp.directive:customTooltip
 * @description
 * # customTooltip
 */
angular.module('copcastAdminApp')
  .directive('customTooltip', ['$timeout', '$parse', function ($timeout) {
    return {
      link: function ($scope, element, $attrs) {
        return $timeout(function () {
          var $element = angular.element(element);
          var attrs = $attrs.customTooltip.split('|');
          var hasPlacement = attrs.length > 1;
          var placement = (hasPlacement) ? attrs[0] : 'bottom';
          var message = (hasPlacement) ? attrs[1] : attrs[0];

          $element.tooltip({
            placement: placement,
            title: message
          });
        });
      }
    };
  }]);
