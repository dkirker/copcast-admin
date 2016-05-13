'use strict';

var data = require('./user.mock.js');

describe('Service: UserService', function () {
  var ServerUrl;
  var httpBackend;
  var rootScope;
  var userService;

  beforeEach(angular.mock.module('copcastAdminApp'));

  beforeEach(angular.mock.inject(function (_userService_, $httpBackend, _ServerUrl_, $rootScope) {
    userService = _userService_;
    httpBackend = $httpBackend;
    ServerUrl = _ServerUrl_;
    rootScope = $rootScope;
    rootScope.globals = {currentUser: { username: 'admin', role: 'admin_3 '}};
  }));

  describe('when get the active users from backend', function () {
    // given
    beforeEach(function () {
      httpBackend
        .whenGET(ServerUrl + '/users')
        .respond(angular.copy(data.activeUsers));
    });

    it('should return the list of active users', function () {
      var expectedUsers = angular.copy(data.activeUsers);
      expectedUsers[0].profilePicture = ServerUrl + '/pictures/' + expectedUsers[0].id + '/small/show';
      expectedUsers[1].profilePicture = ServerUrl + '/pictures/' + expectedUsers[1].id + '/small/show';

      userService
        .listUsers()
        .then(function(users) {
          expect(users).toEqual(expectedUsers);
        });

      httpBackend.flush();
    });
  });


  describe('when get an user from backend', function () {
    // given
    beforeEach(function () {
      httpBackend
        .whenGET(ServerUrl + '/users/1')
        .respond(angular.copy(data.users[0]));
      httpBackend
        .whenGET(ServerUrl + '/users/2')
        .respond(angular.copy(data.users[1]));
    });

    it('should return the user info', function () {
      var expectedUser1 = angular.copy(data.users[0]);
      expectedUser1.profilePicture = ServerUrl + '/pictures/' + expectedUser1.id + '/small/show';
      userService
        .getUser(1)
        .then(function(user) {
          expect(user).toEqual(expectedUser1);
        });


      var expectedUser2 = angular.copy(data.users[1]);
      expectedUser2.profilePicture = '/assets/images/anonuser.png';
      userService
        .getUser(2)
        .then(function(user) {
          expect(user).toEqual(expectedUser2);
        });


    });
  });

  describe('when get the user location from backend', function () {
    // given
    beforeEach(function () {
      /*
      httpBackend
        .whenGET(ServerUrl + '/users/1/videos/from/2015-05-25')
        .respond(angular.copy(user1Videos));
      */
    });

    it('should return the user geo location', function () {
      /*
      userService
        .getUserVideos('1', moment('2015-05-15'))
        .then(function(data) {
          console.log('>>>>>>>>>>>>', data);
        });

      httpBackend.flush();*/
    });
  });

  describe('when get the user videos from backend', function () {
    // given
    beforeEach(function () {
      httpBackend
        .whenGET(ServerUrl + '/users/1/videos/from/2015-05-25')
        .respond(angular.copy(data.user1Videos));

      httpBackend
        .whenGET(ServerUrl + '/users/2/videos/from/2015-05-24')
        .respond(angular.copy(data.user2Videos));
    });

    it('should return the user videos', function () {
      var expectedUser1Videos = angular.copy(data.user1Videos);
      expectedUser1Videos[0].src = ServerUrl + '/users/1/videos/v3933.mp4';
      expectedUser1Videos[1].src = ServerUrl + '/users/1/videos/v5394.mp4';

      var expectedUser2Videos = angular.copy(data.user2Videos);
      expectedUser2Videos[0].src = ServerUrl + '/users/2/videos/v6545.mp4';
      expectedUser2Videos[1].src = ServerUrl + '/users/2/videos/v0367.mp4';

      userService
        .getUserVideos('1', moment('2015-05-25'))
        .then(function(videos) {
          expect(videos).toEqual(expectedUser1Videos);
        });

      userService
        .getUserVideos('2', moment('2015-05-24'))
        .then(function(videos) {
          expect(videos).toEqual(expectedUser2Videos);
        });

      httpBackend.flush();
    });
  });
});
