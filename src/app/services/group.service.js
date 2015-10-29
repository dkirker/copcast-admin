/**
 * Created by Leonardo Nicolas
 */
;(function(angular, moment) {
  'use strict';

  var app = angular.module('copcastAdminApp');

  app.factory('groupService', function($q, $http, ServerUrl) {
    var service = {};

    service.listGroups = function listGroups() {
      var defer = $q.defer();
      $http
        .get(ServerUrl + '/groups')
        .success(function(data) {
          angular.forEach(data, function(group) {
            group.profilePicture = generateProfilePictureAddress();
            group.isGroup = true;
          });
          defer.resolve(data);
        })
        .error(function(data, status) {
          defer.reject(data, status);
        });
      return defer.promise;
    };

    service.getGroup = function getGroup(groupId) {
      var defer = $q.defer();
      $http
        .get(ServerUrl + '/groups/' + groupId)
        .success(function(group) {
          defer.resolve(group);
        })
        .error(function(data, status) {
          defer.reject(data, status);
        });
      return defer.promise;
    }

    service.getGroupLocations = function getGroupLocations(groupId, fromDate, toDate, accuracy) {
      var defer = $q.defer();

      fromDate = moment(fromDate).format('YYYY-MM-DD');
      toDate = toDate ? '/' + moment(toDate).format('YYYY-MM-DD') : '';
      accuracy = accuracy ? '/' + accuracy : '';

      var endPoint = ServerUrl + '/groups/' + groupId + '/locations/' + fromDate + toDate + accuracy;
      $http
        .get(endPoint)
        .success(function(data) {
          defer.resolve(data);
        })
        .error(function(data, status) {
          defer.reject(data, status);
        });
      return defer.promise;
    };

    service.getGroupIncidents = function getGroupIncidents(groupId, fromDate, toDate) {
      var defer = $q.defer();

      fromDate = moment(fromDate).format('YYYY-MM-DD');
      toDate = toDate ? '/' + moment(toDate).format('YYYY-MM-DD') : '';

      var endPoint = ServerUrl + '/groups/' + groupId + '/incidents/' + fromDate + toDate;
      $http
        .get(endPoint)
        .success(function(data) {
          defer.resolve(data);
        })
        .error(function(data, status) {
          defer.reject(data, status);
        });
      return defer.promise;
    };

    service.getGroupVideos = function getGroupVideos(groupId, fromDate, toDate) {
      var defer = $q.defer();

      fromDate = moment(fromDate).format('YYYY-MM-DD');
      toDate = toDate ? '/' + moment(toDate).format('YYYY-MM-DD') : '';

      $http
        .get(ServerUrl + '/groups/' + groupId + '/videos/from/' + fromDate + toDate )
        .success(function(data) {
          angular.forEach(data, function(video) {
            video.src=ServerUrl + '/users/' + video.userId + '/videos/' + video.id + '.mp4';
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

  function generateProfilePictureAddress() {
    return '/assets/images/anongroup.png';
  }

})(window.angular, window.moment);
