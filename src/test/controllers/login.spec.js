'use strict';

describe('Controller: LoginCtrl', function () {

  // load the controller's module
  beforeEach(module('copcastAdminApp'));

  var LoginCtrl,
    scope,
    modalInstance;


  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$modal_) {
    scope = $rootScope.$new();
    modalInstance = _$modal_.open({
      templateUrl: 'views/login.html'
    });
    LoginCtrl = $controller('LoginCtrl', {
      $scope: scope,
      $modalInstance: modalInstance
    });
  }));

  it('initialize with user variables', function () {
    expect(scope.user).not.toBeUndefined();
    expect(scope.email).not.toBeUndefined();
    expect(scope.selected).toBe('login');

  });
});
