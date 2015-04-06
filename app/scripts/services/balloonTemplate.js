/* google */
'use strict';

/**
 * @ngdoc service
 * @name copcastAdminApp.balloonTemplate
 * @description
 * # balloonTemplate
 * Factory in the copcastAdminApp.
 */
       angular.module('copcastAdminApp')
         .factory('balloonTemplate',function($compile, $templateCache) {
           var balloon = {}, infoWindow =null;

           balloon.init = function (scope) {
              if (infoWindow){
                infoWindow.close();
              }
             infoWindow = new google.maps.InfoWindow({
                 content: $compile($templateCache.get("balloon.html"))(scope)[0]
             });
             infoWindow.open(scope.myMap,scope.currentUser.marker);

            };
           return balloon;
  });
