'use strict';

describe('Controller: UsersDestroyCtrl', function () {

  // load the controller's module
  beforeEach(angular.mock.module('copcastAdminApp'));

  var UsersDestroyCtrl,
    scope, location, serverUrl, http;

  // Initialize the controller and a mock scope
  beforeEach(angular.mock.inject(function ($controller, $rootScope, _$location_, _$http_) {
    scope = $rootScope.$new();
    http = _$http_
    location = _$location_;
    serverUrl = "http://test";
    spyOn(http, "get").and.returnValue({success: function(data){return {error: function(data){}}}} );

    UsersDestroyCtrl = $controller('UsersDestroyCtrl', {
      $scope: scope,
      $location: location,
      $http: http,
      ServerUrl: serverUrl,
      $routeParams: {id: 20}

    });
  }));

  it('loads user', function () {

    expect(http.get).toHaveBeenCalled();

  });

  it('delete user', function () {
    scope.user = {id: 20, username:'myUserTeste'};
    spyOn(http, "delete").and.returnValue({success: function(data){return {error: function(data){}}}} );
    spyOn(window, 'confirm').and.returnValue(true);

    scope.deleteUser();

    expect(http.delete).toHaveBeenCalled();
  });

  it('cancel delete user', function () {
    scope.user = {id: 20};
    spyOn(http, "delete").and.returnValue({success: function(data){return {error: function(data){}}}} );
    spyOn(window, 'confirm').and.returnValue(false);

    scope.deleteUser();

    expect(http.delete).not.toHaveBeenCalled();
  });


  it('cancels editing', function(){
    spyOn(location, "path");

    scope.cancel();

    expect(location.path).toHaveBeenCalledWith("/user-list");
  });

});
