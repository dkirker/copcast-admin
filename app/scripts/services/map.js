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
         .factory('mapService',function($compile, $templateCache) {
           var service = {}, infoWindow =null;

           service.showBalloon = function (scope) {
              if (infoWindow){
                infoWindow.close();
              }
             infoWindow = new google.maps.InfoWindow({
                 content: $compile($templateCache.get("balloon.html"))(scope)[0]
             });
             infoWindow.open(scope.myMap,scope.currentUser.marker);

            };

           service.getRedMarker = function(user){
             return "https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld="+user[0]+"|db0909|000000"
           };


           service.getGreenMarker = function(user){
             return "https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld="+user[0]+"|009c00|000000"
           };


           service.getGreyMarker = function(user){
             return "https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld="+user[0]+"|9a9a9a|000000"
           };

           return service;
  });
