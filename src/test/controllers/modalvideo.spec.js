'use strict';

describe('Controller: ModalVideoCtrl', function () {

  // load the controller's module
  beforeEach(angular.mock.module('copcastAdminApp'));

  var ModalVideoCtrl,
    scope,
    modalInstance,
    peerManager,
    user;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    scope.activeStreams = {}
    user = {id: 1};
    modalInstance = {close: function(){}};
    peerManager = {start: function(){},
      peerInit: function(id, callback){},
      clearPeers: function(){}}

    spyOn(peerManager, "start");
    spyOn(peerManager, "peerInit");
    spyOn(peerManager, "clearPeers");
    spyOn(modalInstance, "close");


    ModalVideoCtrl = $controller('ModalVideoCtrl', {
      $scope: scope,
      $modalInstance: modalInstance,
      peerManager: peerManager,
      user: user
    });
  }));

  it('should start peer connection', function () {

    expect(scope.user).not.toBeUndefined();
    expect(peerManager.start).toHaveBeenCalled();
    expect(peerManager.peerInit).toHaveBeenCalled();

  });

  it('should close window', function () {
    scope.activeStreams[user.id] = { };

    scope.ok();

    expect(peerManager.clearPeers).toHaveBeenCalled();
    expect(modalInstance.close).toHaveBeenCalled();
  });
});
