'use strict';

describe('Controller: GroupsDetailCtrl', function () {

  // load the controller's module
  beforeEach(angular.mock.module('copcastAdminApp'));

  var GroupsDetailCtrl,
    scope, location, serverUrl, http;

  // Initialize the controller and a mock scope
  beforeEach(angular.mock.inject(function ($controller, $rootScope, _$location_, _$http_) {
    scope = $rootScope.$new();
    http = _$http_
    location = _$location_;
    serverUrl = "http://test";
    spyOn(http, "get").and.returnValue({success: function(data){return {error: function(data){}}}} );

    GroupsDetailCtrl = $controller('GroupsDetailsCtrl', {
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


  it('updates group', function () {
    scope.group = {id: 20};
    spyOn(http, "post").and.returnValue({success: function(data){return {error: function(data){}}}} );

    scope.updateGroup();

    expect(http.post).toHaveBeenCalled();
  });

  it('cancels editing', function(){
    spyOn(location, "path");

    scope.cancel();

    expect(location.path).toHaveBeenCalledWith("/group-list");
  });


});
