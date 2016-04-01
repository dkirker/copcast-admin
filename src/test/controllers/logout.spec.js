/**
 * Created by brunosiqueira on 06/04/15.
 */
'use strict';

describe('Controller: LogoutCtrl', function () {

  // load the controller's module
  beforeEach(angular.mock.module('copcastAdminApp'));

  var LogoutCtrl,
    location,
    loginService;


  // Initialize the controller and a mock scope
  beforeEach(angular.mock.inject(function ($controller, _$location_, _loginService_) {
    location = _$location_;
    loginService = jasmine.createSpyObj("loginService", ["logout"]);
    LogoutCtrl = $controller('LogoutCtrl', {
      $location : location,
      loginService : loginService
    });
  }));

  it('initialize with user variables', function () {

    expect(loginService.logout).toHaveBeenCalled();
    expect(location.path()).toBe("/")
  });
});
