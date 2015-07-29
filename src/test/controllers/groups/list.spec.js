'use strict';

describe('Controller: GroupsCtrl', function () {

  // load the controller's module
  beforeEach(angular.mock.module('copcastAdminApp'));

  var GroupListCtrl,
    scope, location, serverUrl;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$location_) {
    scope = $rootScope.$new();
    location = _$location_;
    serverUrl = "http://test";
    GroupListCtrl = $controller('GroupsListCtrl', {
      $scope: scope,
      $location: location,
      ServerUrl: serverUrl
    });
  }));

  it('has default values', function(){
    expect(scope.groups).not.toBe([]);
    expect(scope.isAdminGroup).not.toBe(true);
  });

  it('show edit view', function () {
    spyOn(location, "path");

    scope.editGroup(20);

    expect(location.path).toHaveBeenCalledWith('/group-detail/20')
  });

  it('show delete view', function () {
    spyOn(location, "path");

    scope.deleteGroup(20, "Test Group");

    expect(location.path).toHaveBeenCalledWith('/group-destroy/20')
  });

  it('show create view', function () {
    spyOn(location, "path");

    scope.createNewGroup();

    expect(location.path).toHaveBeenCalledWith('/group-creation')
  });

});
