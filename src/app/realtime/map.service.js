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
  .factory('mapService',function($window, $compile,gettextCatalog, $templateCache) {
    var service = {}, infoWindow =null;

    service.showBalloon = function (scope) {
      if (infoWindow){
        infoWindow.close();
      }

      scope.balloonErrorMessage = '';
      infoWindow = new $window.InfoBubble({
        minWidth: 250,
        minHeight: 262,
        arrowSize: 20,
        borderRadius: 3,
        disableAnimation: true,
        shadowStyle: 0,
        closeSrc: 'https://maps.gstatic.com/intl/en_us/mapfiles/close.gif'
      });

      infoWindow.setContent($compile($templateCache.get('balloon.html'))(scope)[0]);
      infoWindow.open(scope.myMap,scope.currentUser.marker);

      $window.setTimeout(function(){
        $window.console.log(angular.element('[data-toggle="tooltip"]'));
        angular.element('[data-toggle="tooltip"]').tooltip();
      }, 100);
    };

    service.showErrorInBallon = function(scope) {
      if (infoWindow){
        scope.balloonErrorMessage = gettextCatalog.getString('Not able to start streaming now. Try again later.');
      }
    };

    service.closeBalloon = function () {
      if (infoWindow){
        infoWindow.close();
      }
    };

    service.getGreyMarker = function(user){
      // return 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld='+user[0]+'|9a9a9a|000000';
      return '/assets/images/pins/user.png';
    };

    service.getBlueMarker = function(user){
      // return 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld='+user[0]+'|db0909|000000';
      return '/assets/images/pins/user_online.png';
    };

    service.getRedMarker = function(user){
      return '/assets/images/pins/user_incident.png';
    };

    service.getYellowMarker = function(user){
      return '/assets/images/pins/user_live_requesting.png';
    };

    service.getGreenMarker = function(user){
      // return 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld='+user[0]+'|009c00|000000';
      return '/assets/images/pins/user_live_streaming.png';
    };


    service.applyCircle = function(scope, user){
      if (user.accuracy > 20) {
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
          user.cityCircle = new $window.google.maps.Circle(circleOptions);
        }
      } else if (user.cityCircle){
        user.cityCircle.setMap(null);
        user.cityCircle = null;
      }
    };

    service.createMarker = function(scope, pos, user){
      var marker = new $window.google.maps.Marker({
        map: scope.myMap,
        position: pos,
        icon: service.getBlueMarker(user.name)
      });

      $window.google.maps.event.addListener(marker, 'click', function() {
        scope.showUser(user.id);
        scope.$digest();
      });

      return marker;
    };

    service.fitBounds = function(scope, activeUsers){
      var bounds = new $window.google.maps.LatLngBounds();

      for (var key in activeUsers){
        if (activeUsers[key].state === 1) {
          bounds.extend(activeUsers[key].marker.getPosition());

          if (activeUsers[key].cityCircle) {
            var circleBounds = activeUsers[key].cityCircle.getBounds();
            bounds.extend(circleBounds.getNorthEast());
            bounds.extend(circleBounds.getSouthWest());
          }
        }
      }

      scope.myMap.fitBounds(bounds);
    };

    return service;
  });
