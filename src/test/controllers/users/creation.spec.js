'use strict';

describe('Controller: UsersCreationCtrl', function () {

  // load the controller's module
  beforeEach(angular.mock.module('copcastAdminApp'));

  var UsersCreationCtrl,
    scope, location, serverUrl, http;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$location_, _$http_) {
    scope = $rootScope.$new();
    http = _$http_
    location = _$location_;
    serverUrl = "http://test";
    UsersCreationCtrl = $controller('UsersCreationCtrl', {
      $scope: scope,
      $location: location,
      $http: http,
      ServerUrl: serverUrl
    });
  }));

  it('creates new user', function () {
    spyOn(http, "post").andCallFake(function(){ return {success: function(data){return {error: function(data){}}}};} );

    scope.createNewUser();

    expect(http.post).toHaveBeenCalled();

  });

});




