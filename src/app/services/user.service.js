/**
 * Created by alex on 4/13/15.
 * Updated by Leonardo Nicolas
 */
/* google */
;(function(angular, infoWindow, google, moment) {
  'use strict';

  /**
   * @ngdoc service
   * @name copcastAdminApp.user
   * @description
   * # Template for user CRUD
   * Factory in the copcastAdminApp.
   */
  var app = angular.module('copcastAdminApp');

  app.factory('userService', function($compile, $templateCache, $q, $http, ServerUrl, $rootScope) {
    var service = {};

    service.delete = function deleteUser( userId, userName ) {
      if (infoWindow) {
        infoWindow.close();
      }
      infoWindow = new google.maps.InfoWindow({
        content: $compile($templateCache.get('balloon.html'))(scope)[0]
      });
      infoWindow.open(scope.myMap,scope.currentUser.marker);
    };

    service.listUsers = function listUsers() {
      var defer = $q.defer();
      $http
        .get(ServerUrl + '/users')
        .success(function(data) {
          angular.forEach(data, function(user) {
            user.profilePicture = generateProfilePictureAddress(ServerUrl, user);
          });
          defer.resolve(data);
        })
        .error(function(data, status) {
          defer.reject(data, status);
        });
      return defer.promise;
    };

    service.getUser = function getUser(userId) {
      var defer = $q.defer();
      $http
        .get(ServerUrl + '/users/' + userId)
        .success(function(data) {
          data.user.isSelf = data.isSelf;
          data.user.profilePicture = generateProfilePictureAddress(ServerUrl, data.user);
          defer.resolve(data.user);
        })
        .error(function(data, status) {
          defer.reject(data, status);
        });
      return defer.promise;
    }

    service.getUserLocations = function getUserLocations(userId, fromDate, toDate, accuracy) {
      var defer = $q.defer();

      fromDate = moment(fromDate).format('YYYY-MM-DD');
      toDate = toDate ? '/' + moment(toDate).format('YYYY-MM-DD') : '';
      accuracy = accuracy ? '/' + accuracy : '';

      var endPoint = ServerUrl + '/users/' + userId + '/locations/' + fromDate + toDate + accuracy;
      $http
        .get(endPoint)
        .success(function(data) {
          console.log('service.getUserLocations', data);
          defer.resolve(data);
        })
        .error(function(data, status) {
          defer.reject(data, status);
        });
      return defer.promise;
    };


    service.getUserIncidents = function getUserIncidents(userId, fromDate, toDate) {
      var defer = $q.defer();

      fromDate = moment(fromDate).format('YYYY-MM-DD');
      toDate = toDate ? '/' + moment(toDate).format('YYYY-MM-DD') : '';


      var endPoint = ServerUrl + '/users/' + userId + '/incidents/' + fromDate + toDate;
      $http
        .get(endPoint)
        .success(function(data) {
          console.log('service.getUserIncidents', data);
          defer.resolve(data);
        })
        .error(function(data, status) {
          defer.reject(data, status);
        });
      return defer.promise;
    };

    service.getUserVideos = function getUserVideos(userId, fromDate, toDate) {
      var defer = $q.defer();

      fromDate = moment(fromDate).format('YYYY-MM-DD');
      toDate = toDate ? '/' + moment(toDate).format('YYYY-MM-DD') : '';

      $http
        .get(ServerUrl + '/users/' + userId + '/videos/from/' + fromDate + toDate )
        .success(function(data) {
          angular.forEach(data, function(video) {
            video.src=ServerUrl + '/users/' + userId + '/videos/' + video.id + '.mp4';
            video.userId = userId;
          });
          defer.resolve(data);
        })
        .error(function(data, status) {
          defer.resolve([]);
        });
      return defer.promise;
    };

    service.getMyData = function getMyData(){
      var defer = $q.defer();
      $http.get(ServerUrl + '/users/me').success(function(data) {
        defer.resolve(data);
      })
      .error(function(data, status) {
        defer.reject(data, status);
      });
      return defer.promise;
    };

    service.getOnlineUsers = function getOnlineUsers(){
      var defer = $q.defer();
      $http.get(ServerUrl + '/users/online')
        .success(function(data) {
          defer.resolve(data);
        })
        .error(function(data, status) {
          defer.reject(data, status);
        });
      return defer.promise;
    };

    service.getAdminRoles = function getAdminRoles(){
      var defer = $q.defer();
      $http.get(ServerUrl + '/users/adminRoles')
        .success(function(data) {
          defer.resolve(data);
        })
        .error(function(data, status) {
          defer.reject(data, status);
        });
      return defer.promise;
    };

    service.getRoles = function getRoles(){
      var defer = $q.defer();
      $http.get(ServerUrl + '/users/roles')
        .success(function(data) {
          defer.resolve(data);
        })
        .error(function(data, status) {
          defer.reject(data, status);
        });
      return defer.promise;
    };

    service.deleteUser = function deleteUser(user){
      var defer = $q.defer();
      $http.delete(ServerUrl + '/users/' + user.id)
        .success(function(data) {
          defer.resolve(data);
        })
        .error(function(data, status) {
          defer.reject(data, status);
        });
      return defer.promise;
    };

    service.confirmResetToken = function(token){
      var defer = $q.defer();
      $http.get(ServerUrl + '/users/confirmResetToken/' + token)
        .success(function(data) {
          defer.resolve(data);
        })
        .error(function(data, status) {
          defer.reject(data, status);
        });
      return defer.promise;
    };

    service.changePasswordWithToken = function(password, token){
      var defer = $q.defer();
      $http.post(ServerUrl + '/users/changePasswordToken/' + token, {password: password})
        .success(function(data) {
          defer.resolve(data);
        })
        .error(function(data, status) {
          defer.reject(data, status);
        });
      return defer.promise;
    };

    service.getStreamingUsers = function getStreamingUsers(){
      var defer = $q.defer();
      $http.get(ServerUrl + '/users/streaming')
        .success(function(data) {
          defer.resolve(data);
        })
        .error(function(data, status) {
          defer.reject(data, status);
        });
      return defer.promise;
    };

    service.getCurrentRole = function(){
      if ($rootScope.globals) {
        return $rootScope.globals["currentUser"]["role"];
      } else {
        return null;
      }
    }

    service.isAdminOne = function(){
      return 'admin_1' === service.getCurrentRole();
    };

    service.isAdminTwo = function(){
      return 'admin_2' === service.getCurrentRole();
    };

    service.isAdminThree = function(){
      return 'admin_3' === service.getCurrentRole();
    };

    return service;
  });

  function generateProfilePictureAddress(serverUrl, user) {
    return user.profilePicture
      ? serverUrl + '/pictures/' + user.id + '/small/show'
      : '/assets/images/anonuser.png';
  }
})(window.angular, window.infoWindow, window.google, window.moment);
