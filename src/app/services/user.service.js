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
  angular.module('copcastAdminApp')
    .factory('userService', function($compile, $templateCache, $q, $http, ServerUrl) {
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
          .success(function(user) {
            user.profilePicture = generateProfilePictureAddress(ServerUrl, user);
            defer.resolve(user);
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

      service.getUserVideos = function getUserVideos(userId, date) {
        var defer = $q.defer();
        var dateFmt = date.format('YYYY-MM-DD');
        $http
          .get(ServerUrl + '/users/' + userId + '/videos/from/' + dateFmt )
          .success(function(data) {
            angular.forEach(data, function(video) {
              video.src=ServerUrl + '/users/' + userId + '/videos/' + video.id + '.mp4';
            });
            defer.resolve(data);
          })
          .error(function(data, status) {
            defer.reject(data, status);
          });
        return defer.promise;
      };

      return service;
    });

    function generateProfilePictureAddress(serverUrl, user) {
      return user.profilePicture
        ? serverUrl + '/pictures/' + user.id + '/small/show'
        : '/assets/images/anonuser.png';
    }
})(window.angular, window.infoWindow, window.google, window.moment);
