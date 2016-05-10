'use strict';

/**
 * @ngdoc directive
 * @name copcastAdminApp.directive:formAutoFillFix
 * @description
 * # formAutoFillFix
 */
angular.module('copcastAdminApp')
  .directive('formAutoFillFix', function () {
    return function(scope, elem, attrs) {
      // Fixes Chrome bug: https://groups.google.com/forum/#!topic/angular/6NlucSskQjY
      elem.prop('method', 'POST');

      // Fix autofill issues where Angular doesn't know about autofilled inputs
      if(attrs.ngSubmit) {
        elem.unbind('submit').submit(function(e) {
          e.preventDefault();
          elem.find('input, textarea, select').trigger('input').trigger('change').trigger('keydown');
          scope.$apply(attrs.ngSubmit);
        });
      }
    };
  });
