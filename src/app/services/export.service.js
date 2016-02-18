/**
 * Created by Bruno Siqueira
 */
;(function(angular, moment) {
  'use strict';

  var app = angular.module('copcastAdminApp');

  app.factory('exportService', function($q, $http, ServerUrl) {
    var service = {};

    service.listExports = function(){
      var defer = $q.defer();
      $http
        .get(ServerUrl + '/export')
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
