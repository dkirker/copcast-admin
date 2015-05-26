/**
 * Created by alex on 4/13/15.
 * Updated by Leonardo Nicolas
 */
/* google */
;(function(angular, infoWindow, google) {
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
              if (user.profilePicture) {
                  user.profilePicture = ServerUrl + '/pictures/' + user.id + '/original/show';
              }
            });
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
})(window.angular, window.infoWindow, window.google);
