/**
 * Created by alex on 4/13/15.
 */
/* google */
'use strict';

/**
 * @ngdoc service
 * @name copcastAdminApp.user
 * @description
 * # Template for user CRUD
 * Factory in the copcastAdminApp.
 */
angular.module('copcastAdminApp')
  .factory('userService',function($compile, $templateCache) {
    var service = {};

    service.delete = function ( userId, userName ) {
      if (infoWindow){
        infoWindow.close();
      }
      infoWindow = new google.maps.InfoWindow({
        content: $compile($templateCache.get("balloon.html"))(scope)[0]
      });
      infoWindow.open(scope.myMap,scope.currentUser.marker);

    };


    return service;
  });
