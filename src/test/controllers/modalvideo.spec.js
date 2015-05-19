'use strict';

describe('Controller: ModalVideoCtrl', function () {

  // load the controller's module
  beforeEach(module('copcastAdminApp'));

  var ModalVideoCtrl,
    scope,
    user;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    user = {};
    ModalVideoCtrl = $controller('ModalVideoCtrl', {
      $scope: scope,
      user: user,
      streamUrl: ""
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.jwOptions).not.toBeUndefined();
  });
});
