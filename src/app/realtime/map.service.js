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
             infoWindow = new InfoBubble({minWidth: 250, minHeight: 260,
               arrowSize: 20, borderRadius: 0, disableAnimation: true, shadowStyle: 0,
               closeSrc: 'https://maps.gstatic.com/intl/en_us/mapfiles/close.gif'});
             infoWindow.setContent($compile($templateCache.get('balloon.html'))(scope)[0]);
             infoWindow.open(scope.myMap,scope.currentUser.marker);

            };

           service.closeBalloon = function () {
             if (infoWindow){
               infoWindow.close();
             }
           };
           service.getRedMarker = function(user){
             return 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld='+user[0]+'|db0909|000000';
           };


           service.getGreenMarker = function(user){
             return 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld='+user[0]+'|009c00|000000';
           };


           service.getGreyMarker = function(user){
             return 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld='+user[0]+'|9a9a9a|000000';
           };

           service.applyCircle = function(scope, user){
             if (user.accuracy > 25) {
               if (user.cityCircle){
                 user.cityCircle.setRadius(user.accuracy);
                 user.cityCircle.setCenter(user.marker.getPosition());
               } else {
                 var circleOptions = {
                   strokeColor: '#4068ff',
                   strokeOpacity: 0.5,
                   strokeWeight: 1,
                   fillColor: '#66bfe0',
                   fillOpacity: 0.35,
                   map: scope.myMap,
                   center: user.marker.getPosition(),
                   radius: user.accuracy
                 };
                 // Add the circle for this city to the map.
                 user.cityCircle = new google.maps.Circle(circleOptions);
               }
             } else if (user.cityCircle){
               user.cityCircle.setMap(null);
               user.cityCircle = null;
             }
           };

           service.createMarker = function(scope, pos, user){
             var marker = new google.maps.Marker({
               map: scope.myMap,
               position: pos,
               icon: service.getRedMarker(user.name)
             });

             google.maps.event.addListener(marker, 'click', function() {
               scope.showUser(user.id);
               scope.$digest();
             });

             return marker;
           };

           service.fitBounds = function(scope, activeUsers){
             var bounds = new google.maps.LatLngBounds();
             for (var key in activeUsers){
               bounds.extend(activeUsers[key].marker.getPosition());
             }
             scope.myMap.fitBounds(bounds);
           };

           return service;
  });
