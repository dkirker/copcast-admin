'use strict';
;(function() {
  /*
   * Google Maps util functions
   */
  function GoogleMaps() {}

  GoogleMaps.createMarker = function createMarker(user, location) {
    var latLngPoints = GoogleMaps.transformLocationsToLatLngPoints([ location ]);
    return new google.maps.Marker({
      userId: user.id,
      position: latLngPoints[0],
      icon: {
        url: user.profilePicture,
        //url: 'assets/images/head_icon_black.png',
        scaledSize: new google.maps.Size(24, 24)
      }
    });
  };

  GoogleMaps.transformLocationsToLatLngPoints = function transformLocationsToLatLngPoints(locations) {
    var latLngPoints = [];
    for(var i = 0, length = locations.length; i < length; i++) {
      var location = locations[i];
      if(GoogleMaps.isValidlocation(location)) {
        latLngPoints.push(new google.maps.LatLng(location.lat, location.lng));
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
