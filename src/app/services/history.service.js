/**
 * Created by brunosiqueira on 02/12/15.
 */
;(function(angular, moment) {
  'use strict';

  angular.module('copcastAdminApp')
    .factory('historyService', function($q, $http, ServerUrl) {
      var service = {};

      service.registerLoggedIn = function(user){

        var defer = $q.defer();
        $http
          .post(ServerUrl + '/histories', {
            previousState: 'NOT_LOGGED',
            nextState: 'LOGGED_ADMIN',
            date: moment().toDate()
          })
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
})(window.angular, window.moment);
