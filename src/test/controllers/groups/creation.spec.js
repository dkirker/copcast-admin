'use strict';

describe('Controller: GroupsCreationCtrl', function () {

  // load the controller's module
  beforeEach(angular.mock.module('copcastAdminApp'));

  var GroupsCreationCtrl,
    scope, location, serverUrl, http;

  // Initialize the controller and a mock scope
  beforeEach(angular.mock.inject(function ($controller, $rootScope, _$location_, _$http_) {
    scope = $rootScope.$new();
    http = _$http_;
    location = _$location_;
    serverUrl = "http://test";
    GroupsCreationCtrl = $controller('GroupsCreationCtrl', {
      $scope: scope,
      $location: location,
      $http: http,
      ServerUrl: serverUrl
    });
  }));

  it('creates new group', function () {
    spyOn(http, "post").and.returnValue({success: function(data){return {error: function(data){}}}} );

    scope.createGroup();

    expect(http.post).toHaveBeenCalled();

  });
});
