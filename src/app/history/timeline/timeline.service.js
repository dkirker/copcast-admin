'use strict';
var app = angular.module('copcastAdminApp');

app.service('timelineService', function TimelineService($window) {
  var self = this;

  // Events
  self.currentLocationChanged = new $window.EventSignal();

  // API
  self.setCurrentLocation = function setCurrentLocation(location) {
    self.currentLocationChanged.emit(location);
  };
});
