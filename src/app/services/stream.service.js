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
    .factory('streamService', function ($q, $http, ServerUrl, peerManager) {
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

      service.startPeer = function(user, startListener, diconnectListener){
        peerManager.start();
        peerManager.peerInit(user.id, startListener, diconnectListener);
      };

      service.stopPeer = function(){
        peerManager.clearPeers();
      };

      service.isPeerActive = function(){
        return peerManager.hasPeers();
      };


      return service;
    });
})(window.angular);

