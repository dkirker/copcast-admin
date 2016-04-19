/**
 * Created by Bruno Siqueira
 */
;(function(angular, moment) {
  'use strict';

  var app = angular.module('copcastAdminApp');

  app.factory('exportService', function($q, $http, ServerUrl) {
    var service = {};

    service.listExports = function(params){
      var defer = $q.defer();
      $http
        .get(ServerUrl + '/exports', {
          params: params
        }).success(function(data) {
          defer.resolve(data);
        })
        .error(function(data, status) {
          defer.reject(data, status);
        });
      return defer.promise;
    };

    service.getExport = function(id){
      var defer = $q.defer();
      $http
        .get(ServerUrl + '/exports/'+id)
        .success(function(data) {
          defer.resolve(data);
        })
        .error(function(data, status) {
          defer.reject(data, status);
        });
      return defer.promise;
    };

    service.create = function(exportObj){
      var defer = $q.defer();
      $http
        .post(ServerUrl + '/exports', {initialDate: exportObj.initialDate,
          finalDate: exportObj.initialDate, recorderId: exportObj.recorderId })
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
