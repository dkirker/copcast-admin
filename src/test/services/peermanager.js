'use strict';

describe('Service: peerManager', function () {

  // load the service's module
  beforeEach(angular.mock.module('copcastAdminApp'));

  // instantiate service
  var peerManager;
  beforeEach(inject(function (_peerManager_) {
    peerManager = _peerManager_;
  }));

  it('should do something', function () {
    expect(!!peerManager).toBe(true);
  });

});
