/**
 * Created by bruno on 6/15/15.
 */
/* google */
;(function(angular, infoWindow, google, moment) {
  'use strict';

  /**
   * @ngdoc service
   * @name copcastAdminApp.stream
   * @description
   * Factory in the copcastAdminApp.streamService
   */
  angular.module('copcastAdminApp')
    .factory('streamService', function ($q, $http, ServerUrl) {
      var service = {};

      service.startStreaming = function startStreaming(userId){
        var defer = $q.defer();
        $http.post(ServerUrl + '/streams/' + userId + '/start',{})
          .success(function(data) {
            defer.resolve(data);
          })
          .error(function(data, status) {
            defer.reject(data, status);
          });
        return defer.promise;
      };


      return service;
    });
})(window.angular);

