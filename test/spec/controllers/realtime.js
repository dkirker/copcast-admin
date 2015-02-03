/**
 * Created by bruno on 2/3/15.
 */
'use strict';

describe('Controller: RealtimeCtrl', function () {

  // load the controller's module
  beforeEach(module('copcastAdminApp'));

  var RealtimeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RealtimeCtrl = $controller('RealtimeCtrl', {
      $scope: scope
    });
  }));

  it('should present a map', function () {
    expect(scope.map).not.toBeUndefined();
  });
});
