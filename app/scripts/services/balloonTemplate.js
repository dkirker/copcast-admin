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
           return {
             init: function (scope) {

               var infowindow = new google.maps.InfoWindow({
                 content: $compile($templateCache.get("balloon.html"))(scope)[0]
               });
               infowindow.open(scope.myMap,scope.currentUser.marker);

               //scope.$apply(function () {
               //  var element = document.getElementById("balloonContent");
               //  $compile(element)(scope);
               //});


             }//init
           };
  });
