'use strict';

var data = require('./user.mock.js');

describe('Service: UserService', function () {
  var ServerUrl;
  var httpBackend;
  var streamService;

  beforeEach(angular.mock.module('copcastAdminApp'));

  beforeEach(angular.mock.inject(function (_streamService_, $httpBackend, _ServerUrl_) {
    streamService = _streamService_;
    httpBackend = $httpBackend;
    ServerUrl = _ServerUrl_;
  }));

  describe('start streaming by user', function () {
    // given
    beforeEach(function () {
      httpBackend
        .whenPOST(ServerUrl + '/streams/1/start')
        .respond({});
    });

    it('should return success', function () {
      var expectedUsers = angular.copy(data.activeUsers);
      var userId = expectedUsers[0].id;

      expectedUsers[0].profilePicture = ServerUrl + '/pictures/' + userId + '/medium/show';

      streamService
        .startStreaming(userId)
        .then(function(streamingData) {
          expect(streamingData).toEqual({});
        });

      httpBackend.flush();
    });
  });
});
