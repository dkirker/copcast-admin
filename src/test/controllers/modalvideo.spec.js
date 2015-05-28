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
    user = {id: 1, callId: 2};
    ModalVideoCtrl = $controller('ModalVideoCtrl', {
      $scope: scope,
      user: user
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect($scope.user).not.toBeUndefined();
  });
});
