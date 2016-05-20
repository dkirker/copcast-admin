/* google */
/**
 * Created by bruno on 2/3/15.
 */
'use strict';

describe('Controller:RealtimeCtrl', function () {

  // load the controller's module
  beforeEach(angular.mock.module('copcastAdminApp'));

  var RealtimeCtrl,
    scope,
    mapService,
    userService;

  // Initialize the controller and a mock scope
  beforeEach(angular.mock.inject(function ($controller, $rootScope, _userService_, $q) {
    scope = $rootScope.$new();
    userService = _userService_;
    mapService = {
      getGreyMarker: function (name) {
        return "anyURL";
      },
      getRedMarker: function (name) {
        return "anyURL";
      },

      createMarker: function (scope, pos, user) {
        return new google.maps.Marker({position: new google.maps.LatLng(22, 22)})
      },

      fitBounds: function (scope, activeUsers) {
      }
    };
    spyOn(userService, 'getOnlineUsers').and.callFake(function(){
      var deferred = $q.defer();
      deferred.resolve([{
        id: 1, name: "Test Name 2",
        location: {lat: 23, lng: 23, groupId: 1, accuracy: 10}
      }]);
      return deferred.promise;
    });
    spyOn(userService, 'getStreamingUsers').and.callFake(function(){
      var deferred = $q.defer();
      deferred.resolve([{
        id: 1, name: "Test Name 2",
        location: {lat: 23, lng: 23, groupId: 1, accuracy: 10}
      }]);
      return deferred.promise;
    });
    RealtimeCtrl = $controller('RealtimeCtrl', {
      $scope: scope,
      mapService: mapService,
      userService: userService
    });
  }));

  it('should present a map', function () {
    expect(scope.mapOptions).not.toBeUndefined();
  });

  describe("Test load user", function () {
    var user = null, marker = null;
    beforeEach(function () {
      user = {
        id: 0, name: "Test Name",
        location: {lat: 23, lng: 23, groupId: 1, accuracy: 10}
      };

      marker = {
        getPosition: function () {
        }, setPosition: function (pos) {
        }
      };
      scope.activeUsers = [];
      scope.activeUsers[user.id] = {
        id: user.id,
        userName: user.name,
        login: "testLogin",
        deploymentGroup: user.groupId,
        marker: marker,
        groupId: user.groupId,
        accuracy: user.accuracy,
        timeoutPromisse: null
      };

      spyOn(mapService, "createMarker");
      spyOn(mapService, "fitBounds");
    });

    it('load current user', function () {

      scope.loadUser(user);

      expect(scope.activeUsers.length).toBe(1);
      expect(mapService.createMarker).not.toHaveBeenCalled();
      expect(mapService.fitBounds).not.toHaveBeenCalled();
    });

  });
  describe("Test refresh user", function(){

    it("get offline users", function(){
      //TODO
    });

    it("get streaming users", function() {
      //TODO
    });

    it("get no users", function(){
      //TODO
    });
  });
});
