/* google */
/**
 * Created by bruno on 2/3/15.
 */
'use strict';

describe('Controller: RealtimeCtrl', function () {

  // load the controller's module
  beforeEach(angular.mock.module('copcastAdminApp'));

  var RealtimeCtrl,
    scope,
    mapService;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();

    mapService = {
      getGreyMarker: function (name) {
        return "anyURL";
      },
      getRedMarker: function (name) {
        return "anyURL";
      },
      applyCircle: function (scope, user) {
      },

      createMarker: function (scope, pos, user) {
        return new google.maps.Marker({position: new google.maps.LatLng(22, 22)})
      },

      fitBounds: function (scope, activeUsers) {
      }
    };

    RealtimeCtrl = $controller('RealtimeCtrl', {
      $scope: scope,
      mapService: mapService
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
        lat: 23, lng: 23, groupId: 1, accuracy: 10
      }
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

    it('load new user', function () {
      //expect(loginService.logout).toHaveBeenCalled();
      spyOn(marker, "getPosition").andCallFake(function () {
        return {
          lat: function () {
            return 22;
          }, lng: function () {
            return 22;
          }
        };
      });
      user.accuracy = 50

      scope.loadUser({
        id: 1, name: "Test Name 2",
        lat: 23, lng: 23, groupId: 1, accuracy: 10
      });

      expect(scope.activeUsers.length).toBe(2);
      expect(mapService.createMarker).toHaveBeenCalled();
      expect(mapService.fitBounds).toHaveBeenCalled();
    });
  });
});
