/**
 * Created by brunosiqueira on 02/12/15.
 */
'use strict';

angular.module('copcastAdminApp')
  .factory('historyService', function($q, $http, $window, ServerUrl) {
    var service = {};

    service.listHistories = function(user, group, page, perPage){
      var defer = $q.defer();
      $http.get(ServerUrl + '/logreports',
        { params : {
          page : page,
          perPage: perPage,
          group: group,
          user: user
        }
        }
      ).success(function(data) {
        defer.resolve(data);
      }).error(function(data, status) {
        defer.reject(data, status);
      });
      return defer.promise;
    };

    service.listHistoriesByParams = function(fromDate, toDate,user, group, page, perPage){
      var defer = $q.defer();
      $http.get(ServerUrl + '/logreports/' + fromDate.format('YYYY-MM-DD') + '/' + toDate.format('YYYY-MM-DD'),
        { params : {
          page : page,
          perPage: perPage,
          group: group,
          user: user
        }
        }
      ).success(function(data) {
        defer.resolve(data);
      }).error(function(data, status) {
        defer.reject(data, status);
      });
      return defer.promise;
    };

    return service;
});
