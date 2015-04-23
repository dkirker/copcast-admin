'use strict';

describe('Controller: GroupsDestroyCtrl', function () {

  // load the controller's module
  beforeEach(module('copcastAdminApp'));

  var GroupsDestroyCtrl,
    scope, location, serverUrl, http;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$location_, _$http_) {
    scope = $rootScope.$new();
    http = _$http_
    location = _$location_;
    serverUrl = "http://test";
    spyOn(http, "get").and.returnValue({success: function(data){return {error: function(data){}}}} );

    GroupsDestroyCtrl = $controller('GroupsDestroyCtrl', {
      $scope: scope,
      $location: location,
      $http: http,
      ServerUrl: serverUrl,
      $routeParams: {id: 20}
    });
  }));

  it('loads group', function () {

    expect(http.get).toHaveBeenCalled();

  });


  it('delete group', function () {
    scope.group = {id: 20};
    spyOn(http, "delete").and.returnValue({success: function(data){return {error: function(data){}}}} );
    spyOn(window, 'confirm').and.returnValue(true);

    scope.deleteGroup();

    expect(http.delete).toHaveBeenCalled();
  });


  it('cancel delete group', function () {
    scope.group = {id: 20};
    spyOn(http, "delete").and.returnValue({success: function(data){return {error: function(data){}}}} );
    spyOn(window, 'confirm').and.returnValue(false);

    scope.deleteGroup();

    expect(http.delete).not.toHaveBeenCalled();
  });

  it('cancels editing', function(){
    spyOn(location, "path");

    scope.cancel();

    expect(location.path).toHaveBeenCalledWith("/group-list");
  });
});
