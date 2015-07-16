;(function(angular, moment) {
  'use strict';

  var app = angular.module('copcastAdminApp');
  var hours = [];

  for(var hour = 0; hour < 24; hour++) {
    hours.push(hour);
  }

  app.directive('timeline', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/history/timeline/timeline.html',

      controller: function($scope) {
        this.selectLocation = function selectLocation(location) {
          $scope.selectedLocation = location;
        };
      },

      scope: {
        locations: '=ngModel',
        onSelectLocation: '&'
      },

      link: function(scope, element, attrs, controllers) {
        var onSelectLocation = scope.onSelectLocation(); //unwrap

        scope.$watch('locations', function() {
          scope.selectedPosition = -10;
          scope.locationsByDay = new LocationsByDay(scope.locations);
          console.log('locationsByDay', scope.locationsByDay);
        }, true);

        scope.$watch('selectedLocation', function() {
          var selectedLocation = scope.selectedLocation;
          var location = selectedLocation && selectedLocation.unwrap();
          onSelectLocation(location);
        }, true);
      }
    };
  });

  /*
   * Map
   */
  function Map() {
    this.map = {};
  }
  Map.prototype = {
    put: function put(key, value) {
      this.map[key] = value;
    },

    get: function get(key) {
      return this.map[key];
    },

    containsKey: function containsKey(key) {
      return this.get(key);
    },

    getMap: function getMap() {
      return this.map;
    }
  };

  /*
   * LocationsByDay
   */
  function LocationsByDay(locations) {
    this.locationsByDay = new Map();
    this.groupLocationsByDay(locations);
  }
  LocationsByDay.prototype = {
    groupLocationsByDay: function groupLocationsByDay(locations) {
      var previousLocationsByHour;
      angular.forEach(locations, function(location) {
        previousLocationsByHour = this.addLocation(location, previousLocationsByHour);
      }, this);
    },

    addLocation: function addLocation(location, previousLocationsByHour) {
      var loc = new Location(location);
      var key = loc.getDate('YYYY-MM-DD');
      var locationsByHour = this.locationsByDay.get(key);
      if(!locationsByHour) {
        locationsByHour = new LocationsByHour(loc.getDate(), previousLocationsByHour);
        this.locationsByDay.put(key, locationsByHour);
      }
      locationsByHour.addLocation(loc);
      return locationsByHour;
    },

    getMap: function getMap() {
      return this.locationsByDay.getMap();
    }
  };

  /*
   * LocationsByHour
   */
  function LocationsByHour(date, previousLocationsByHour) {
    this.previousLocationsByHour = previousLocationsByHour;
    this.date = date;
    this.locationsByHour = new Map();
    this._verifyGap();
  }
  LocationsByHour.prototype = {
    _verifyGap: function _verifyGap() {
      this.hasGap = false;
      if(this.previousLocationsByHour) {
        var previousDate = this.previousLocationsByHour.getDate();
        var nextDate = previousDate.clone().add(1, 'days');
        this.hasGap = !previousDate.isSame(this.date, 'day') &&
                      !nextDate.isSame(this.date, 'day');
      }
    },

    addLocation: function addLocation(location) {
      var key = location.getDate('HH');
      var locations = this.locationsByHour.get(key) || [];
      if(locations.length === 0) {
        this.locationsByHour.put(key, locations);
      }
      locations.push(location);
    },

    getMap: function getMap() {
      return this.locationsByHour.getMap();
    },

    getDate: function getDate(pattern) {
      return pattern ? this.date.format(pattern) : this.date;
    },

    getPreviousDate: function getPreviousDate(pattern) {
      if(this.previousLocationsByHour) {
        return this.previousLocationsByHour.getDate(pattern);
      }
    },

    hasGap: function hasGap() {
      return this.hasGap;
    }
  };

  /*
   * Location Wrapper
   */
  function Location(location) {
    this.location = angular.copy(location);
    this.date = moment(location.date).clone();
  }
  Location.prototype = {
    getDate: function getDate(pattern) {
      return pattern ? this.date.format(pattern) : this.date;
    },
    unwrap: function unwrap() {
      return this.location;
    }
  };
})(window.angular, window.moment);
