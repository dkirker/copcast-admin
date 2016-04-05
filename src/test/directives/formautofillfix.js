'use strict';

describe('Directive: formAutoFillFix', function () {

  // load the directive's module
  beforeEach(angular.mock.module('copcastAdminApp'));

  var element,
    scope;

  beforeEach(angular.mock.inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  //it('should make hidden element visible', inject(function ($compile) {
  //  element = angular.element('<form-auto-fill-fix></form-auto-fill-fix>');
  //  element = $compile(element)(scope);
  //  expect(element.text()).toBe('this is the formAutoFillFix directive');
  //}));
});
