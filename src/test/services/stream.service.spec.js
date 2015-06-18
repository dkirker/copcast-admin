'use strict';

describe('Service: UserService', function () {
  var ServerUrl;
  var httpBackend;
  var streamService;

  beforeEach(module('copcastAdminApp'));

  beforeEach(inject(function (_steamService_, $httpBackend, _ServerUrl_) {
    streamService = _streamService_;
    httpBackend = $httpBackend;
    ServerUrl = _ServerUrl_;
  }));

  describe('start streaming by user', function () {
    // given
    beforeEach(function () {
      httpBackend
        .whenGET(ServerUrl + '/stream/1/start')
        .respond({});
    });

    it('should return success', function () {
      var expectedUsers = angular.copy(activeUsers);
      expectedUsers[0].profilePicture = ServerUrl + '/pictures/' + expectedUsers[0].id + '/medium/show';

      streamService
        .startStreaming()
        .then(function(data) {
          expect(data).toEqual({});
        });

      httpBackend.flush();
    });
  });
});
