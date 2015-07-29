'use strict';

describe('Controller: UsersDetailsCtrl', function () {

  // load the controller's module
  beforeEach(angular.mock.module('copcastAdminApp'));

  var UsersDetailsCtrl,
    scope, location, serverUrl, http;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $location, $http) {
    scope = $rootScope.$new();
    http = $http;
    location = $location;
    serverUrl = "http://test";
    spyOn(http, "get").and.returnValue({success: function(data){return {error: function(data){}}}} );

    UsersDetailsCtrl = $controller('UsersDetailsCtrl', {
      $scope: scope,
      $location: location,
      $http: http,
      ServerUrl: serverUrl,
      $routeParams: {id: 20}
    });
  }));

  it('has default values', function(){
    expect(scope.hasProfilePicture).toBe(false);
    expect(scope.userPicture).toBe('');
  });

  it('loads users', function () {

    expect(http.get).toHaveBeenCalled();

  });


  it('updates users', function () {
    scope.user = {id: 20};
    spyOn(http, "post").and.returnValue({success: function(data){return {error: function(data){}}}} );

    scope.updateUser();

    expect(http.post).toHaveBeenCalled();
  });

  it('cancels editing', function(){
    spyOn(location, "path");

    scope.cancel();

    expect(location.path).toHaveBeenCalledWith("/user-list");
  });



});


