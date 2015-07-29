'use strict';

describe('Controller: UsersListCtrl', function () {

  // load the controller's module
  beforeEach(angular.mock.module('copcastAdminApp'));

  var UsersListCtrl,
    scope, location, serverUrl;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $location) {
    scope = $rootScope.$new();
    location = $location;
    serverUrl = "http://test";
    UsersListCtrl = $controller('UsersListCtrl', {
      $scope: scope,
      $location: location,
      ServerUrl: serverUrl
    });
  }));

  it('show edit view', function () {
    spyOn(location, "path");

    scope.editUser(20);

    expect(location.path).toHaveBeenCalledWith('/user-detail/20');
  });

  it('show delete view', function () {
    spyOn(location, "path");

    scope.deleteUser(20, "MyUserName");

    expect(location.path).toHaveBeenCalledWith('/user-destroy/20');

  });

  it('show edit view', function () {
    spyOn(location, "path");

    scope.createNewUser();

    expect(location.path).toHaveBeenCalledWith('/user-creation');

  });

});

