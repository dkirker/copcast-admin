/*jslint browser: true*/

'use strict';
(function() {
  /*
   * Google Maps util functions
   */
  function GoogleMaps() {}

  GoogleMaps.createMarker = function createMarker(user, location) {
    var latLngPoints = GoogleMaps.transformLocationsToLatLngPoints([ location ]);
    return new window.google.maps.Marker({
      userId: user.id,
      position: latLngPoints[0],
      icon: {
        url: '/assets/images/pins/user_online.svg',
        // url: user.profilePicture,
        //url: 'assets/images/head_icon_black.png',
        scaledSize: new window.google.maps.Size(24, 43)
      }
    });
  };

  GoogleMaps.createAccuracyCircle = function createMarker(user, location) {
    var latLngPoints = GoogleMaps.transformLocationsToLatLngPoints([ location ]);
    var circleOptions = {
      strokeColor: '#4068ff',
      strokeOpacity: 0.5,
      strokeWeight: 1,
      fillColor: '#66bfe0',
      fillOpacity: 0.35,
      // map: scope.myMap,
      center: latLngPoints[0],
      radius: location.accuracy
    };
    return new window.google.maps.Circle(circleOptions);
  };

  GoogleMaps.transformLocationsToLatLngPoints = function transformLocationsToLatLngPoints(locations) {
    var latLngPoints = [];
    for(var i = 0, length = locations.length; i < length; i++) {
      var location = locations[i];
      if(GoogleMaps.isValidlocation(location)) {
        latLngPoints.push(new window.google.maps.LatLng(location.lat, location.lng));
      }
    }
    return latLngPoints;
  };

  GoogleMaps.isValidlocation = function isValidlocation(location) {
    return location &&
           location.lat &&
           location.lng;
  };

  var utils = window.utils || {};
  utils.GoogleMaps = GoogleMaps;

  window.utils = utils;
})();
