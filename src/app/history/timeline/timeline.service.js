'use strict';
;(function(EventSignal) {
  var app = angular.module('copcastAdminApp');

  app.service('timelineService', function TimelineService() {
    var self = this;

    // Events
    self.currentLocationChanged = new EventSignal();

    // API
    self.setCurrentLocation = function setCurrentLocation(location) {
      self.currentLocationChanged.emit(location);
    };
  });
})(window.EventSignal);
