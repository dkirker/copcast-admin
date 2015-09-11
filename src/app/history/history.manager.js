'use strict';
;(function(angular, moment, EventSignal, utils) {
  var app = angular.module('copcastAdminApp');

  app.service('HistoryManager', function($q, $timeout, userService, groupService) {
    var self = this;
    this.store = {};

    // Objects
    var groups = new Groups($q, userService, groupService);
    var groupsLocationsAndVideos = new GroupsLocationsAndVideos($q, $timeout, userService, groupService);
    var googleMapsHelper = new GoogleMapsHelper($timeout);

    // Manager API
    this.loadUsersAndGroups = groups.load.bind(groups);

    this.setCurrentGroup = groupsLocationsAndVideos.setCurrentGroup.bind(groupsLocationsAndVideos);
    this.setCurrentUser = groupsLocationsAndVideos.setCurrentUser.bind(groupsLocationsAndVideos);
    this.setPeriod = groupsLocationsAndVideos.setPeriod.bind(groupsLocationsAndVideos);
    this.setSelectedDate = function setSelectedDate(selectedDate) {
      console.log('selectedDate', selectedDate);
      groupsLocationsAndVideos.setCurrentDate(selectedDate);
    };

    this.previousVideo = function previousVideo() {
      var userData = self.store.userData;
      if(userData && userData.previousVideo) {
        self.setSelectedDate(userData.previousVideo.from);
      }
    };
    this.nextVideo = function nextVideo() {
      var userData = self.store.userData;
      if(userData && userData.nextVideo) {
        self.setSelectedDate(userData.nextVideo.from);
      }
    }

    // User and Groups Events
    groups.groupsChanged.addListener(function(groups, indexedUsers) {
      console.log('groups', groups, indexedUsers);
      self.store.groups = groups;
      groupsLocationsAndVideos.setUsers(indexedUsers);
    });

    // Group Locations and Videos Events
    groupsLocationsAndVideos.currentGroupChanged.addListener(function(group) {
      console.log('currentGroup', group);
      self.store.currentGroup = group;
    });

    groupsLocationsAndVideos.currentUserChanged.addListener(function(user) {
      console.log('currentUser', user);
      self.store.currentUser = user;
    });

    groupsLocationsAndVideos.groupDataChanged.addListener(function(groupData) {
      self.store.groupData = groupData;
      console.log('groupData', groupData);
    });

    groupsLocationsAndVideos.userDataChanged.addListener(function(userData) {
      self.store.userData = userData;
      googleMapsHelper.updateUserLocations(userData);
      console.log('userData', userData);
    });

    groupsLocationsAndVideos.currentGroupLocationsChanged.addListener(function(groupData) {
      googleMapsHelper.updateCurrentGroupLocationsMarkers(groupData);
      console.log('currentGroupLocations updated', groupData);
    });

    groupsLocationsAndVideos.currentVideoChanged.addListener(function(currentVideo, previousVideo, nextVideo) {
      console.log('currentVideoChanged', currentVideo, previousVideo, nextVideo);
    });

    /* Google Maps Data */
    googleMapsHelper.userLocationsChanged.addListener(function(userMapLocations) {
      if(!self.store.map) {
        self.store.map = {};
      }
      self.store.map.locations = userMapLocations;
      console.log('map locations updated', self.store.map);
    });

    googleMapsHelper.groupLocationsMarkersChanged.addListener(function(groupLocationsMarkers) {
      if(!self.store.map) {
        self.store.map = {};
      }
      self.store.map.markers = groupLocationsMarkers;
      console.log('map markers updated', self.store.map);
    });


  });

  function error(error) {
    console.log('error', error);
  }

  /****************************************************************
   * Google Maps Helper
   ****************************************************************/
  function GoogleMapsHelper($timeout) {
    this.$timeout = $timeout;
    // Events
    this.userLocationsChanged = new EventSignal();
    this.groupLocationsMarkersChanged = new EventSignal();
  }
  GoogleMapsHelper.prototype = {
    updateUserLocations: function updateUserLocations(userData) {
      var self = this;
      this.$timeout(function() {
        var locations = userData.locations || [];
        self.userMapLocations = utils.GoogleMaps.transformLocationsToLatLngPoints(locations);
        self.userLocationsChange.emit(this.userMapLocations);
      }, 600);
    },

    updateCurrentGroupLocationsMarkers: function updateCurrentGroupLocationsMarkers(groupData) {
      var self = this;
      if(!groupData) {
        return;
      }
      this.$timeout(function() {
        var userKeys = getObjectKeys(groupData);
        var markers = [];
        for(var i = 0, len = userKeys.length; i < len; i++) {
          var userId = userKeys[i];
          var userData = groupData[userId];
          if(userData.currentLocation) {
            var marker = utils.GoogleMaps.createMarker(userData.user, userData.currentLocation.location);
            markers.push(marker);
          }
        }
        self.groupLocationsMarkers = markers;
        self.groupLocationsMarkersChanged.emit(this.groupLocationsMarkers);
      }, 600);
    }
  };

  /****************************************************************
   * GroupLocations
   ****************************************************************/
  function GroupsLocationsAndVideos($q, $timeout, userService, groupService) {
    this.$q = $q;
    this.$timeout = $timeout;
    this.DEFAULT_ACCURACY = 20;
    this._userService = userService;
    this._groupService = groupService;

    // Events
    this.groupDataChanged = new EventSignal();
    this.userDataChanged = new EventSignal();
    this.currentGroupChanged = new EventSignal();
    this.currentUserChanged = new EventSignal();
    this.periodChanged = new EventSignal();
    this.currentGroupLocationsChanged = new EventSignal();
    this.currentVideoChanged = new EventSignal();
  }
  GroupsLocationsAndVideos.prototype = {
    setUsers: function setUsers(users) {
      this._users = users;
      this.reset();
      this.MAX_MINUTES_TO_CLOSEST_LOCATION = 6;
    },

    setCurrentGroup: function setCurrentGroup(currentGroup) {
      this.currentGroup = currentGroup;
      this.currentGroupChanged.emit(this.currentGroup);
      this._update();
    },

    setCurrentUser: function setCurrentUser(currentUser) {
      this.currentUser = currentUser;
      this.currentUserChanged.emit(this.currentUser);
      this._updateUserData();
    },

    setPeriod: function setPeriod(period) {
      this.period = period;
      this.periodChanged.emit(this.period);
      this._update();
    },

    setCurrentDate: function setCurrentDate(date) {
      this.currentDate = typeof date === 'string'
        ? moment(date)
        : date;
      this._calculateClosestGroupLocations();
      this._updateCurrentDateVideo();
    },

    reset: function reset() {
      this.locationsByUser = {};
      this.videos = [];
      this.groupData = {};
      this.groupDataChanged.emit(this.groupData);
    },

    /* Private */
    _updateCurrentDateVideo: function _updateCurrentDateVideo() {
      var videos = this.userData.videos || [];
      var currentVideo;
      var nextVideo;
      var cDate = this.currentDate;
      for(var i = 0, len = videos.length; i < len; i++) {
        var video = videos[i];
        var fromDate = moment(video.from);
        var toDate = moment(video.to);
        if(cDate.isSame(fromDate, 'minute')  || cDate.isSame(toDate, 'minute') ||
          (cDate.isBetween(fromDate, toDate, 'minute'))) {
          currentVideo = video;
          if(i < len - 1) {
            nextVideo = videos[i + 1];
          }
          break;
        }
      }
      var userData = this.userData;
      userData.previousVideo = userData.currentVideo;
      userData.currentVideo = currentVideo;
      userData.nextVideo = nextVideo;
      this.currentVideoChanged.emit(userData.currentVideo, userData.previousVideo, userData.nextVideo);
    },

    _calculateClosestGroupLocations: function _calculateClosestGroupLocations() {
      var currentGroupLocations = new utils.Map();
      var date = this.currentDate.format('YYYY-MM-DD');
      var hour = this.currentDate.format('HH');
      var userIds = getObjectKeys(this.locationsByUser);

      for(var i = 0, len = userIds.length; i < len; i++) {
        var userId = userIds[i];
        var locationsByDay = this.groupData[userId].locationsByDay;
        var locationsByHour = locationsByDay.get(date);
        if(locationsByHour) {
          var location = this._getClosestLocation(locationsByHour.get(hour) || []);
          this.groupData[userId].currentLocation = location;
        }
      }
      this.currentGroupLocationsChanged.emit(this.groupData);
    },

    _getClosestLocation: function _getClosestLocation(locations) {
      var last;
      var selectedMinute = parseInt(this.currentDate.format('mm'));
      for(var i = 0, len = locations.length; i < len; i++) {
        var location = locations[i];
        var locationMinute = parseInt(location.getDate().format('mm'));
        if(locationMinute > selectedMinute || i + 1 === len) {
          if(last && selectedMinute - this.MAX_MINUTES_TO_CLOSEST_LOCATION <= last.minute) {
            return last.location;
          }
          if(selectedMinute + this.MAX_MINUTES_TO_CLOSEST_LOCATION >= locationMinute) {
            return location;
          }
          break;
        }
        last = {
          location: location,
          minute: locationMinute
        };
      }
    },

    _update: function _update() {
      if(!this.currentGroup || !this.period) {
        this.reset();
      } else {
        this._loadGroupLocationsAndVideos();
      }
    },

    _updateUserData: function _userData() {
      var userId = this.currentUser && this.currentUser.id;
      this.userData = userId ? this.groupData[userId] : {};
      this.userDataChanged.emit(this.userData);
    },

    _updateGroupUsers: function _updateGroupUsers() {
      var users = [];
      if(this.currentGroup.isGroup) {
        var userIds = getObjectKeys(this.locationsByUser);
        for(var i = 0, len = userIds.length; i < len; i++) {
          var id = userIds[i];
          var user = this._users[id];
          if(user) {
            users.push(user);
          }
        }
      } else {
        users.push(this.currentGroup);
      }
      this.currentGroup.users = users;
      console.log('currentGroup.users updated', this.currentGroup);
    },

    _updateCurrentUser: function _updateCurrentUser() {
      var userId = this.currentUser && this.currentUser.id;
      var userData = userId && this.groupData[userId];
      if(userData) {
        this._updateUserData();
      } else {
        this.setCurrentUser(undefined);
      }
    },

    _indexLocations: function _indexLocations() {
      var userIds = getObjectKeys(this.locationsByUser);
      for(var i = 0, len = userIds.length; i < len; i++) {
        var userId = userIds[i];
        var locations = this.locationsByUser[userId];
        this.groupData[userId] = {
          user: this._users[userId],
          locations: locations,
          locationsByDay: new LocationsByDay(locations)
        };
      }
    },

    _indexVideos: function _indexVideos() {
      for(var i = 0, len = this.videos.length; i < len; i++) {
        var video = this.videos[i];
        var userData = this.groupData[video.userId];
        if(userData) {
          var userVideos = userData.videos || [];
          userVideos.push(video);
          this.groupData[video.userId].videos = userVideos;
        }
      }
    },

    _getGroupLocationsAndVideos: function _getGroupLocationsAndVideos() {
      var toDate = this.period.period ? this.period.toDate : null;
      var groupId = this.currentGroup.id;
      return [
        this._groupService.getGroupLocations(groupId, this.period.fromDate, toDate, this.DEFAULT_ACCURACY),
        this._groupService.getGroupVideos(groupId, this.period.fromDate, toDate)
      ];
    },

    _getUserLocationsAndVideos: function _getUserLocationsAndVideos() {
      var toDate = this.period.period ? this.period.toDate : null;
      var userId = this.currentGroup.id;
      return [
        this._userService.getUserLocations(userId, this.period.fromDate, toDate, this.DEFAULT_ACCURACY),
        this._userService.getUserVideos(userId, this.period.fromDate, toDate)
      ];
    },

    _loadGroupLocationsAndVideos: function _loadGroupLocationsAndVideos() {
      var promisses = this.currentGroup.isGroup
        ? this._getGroupLocationsAndVideos()
        : this._getUserLocationsAndVideos();

      var self = this;
      this.$q.all(promisses)
        .then(function(data) {
          self._setLocationsByUser(data[0]);
          self.videos = data[1];
          self.groupData = {};
          self._updateGroupUsers();
          self._indexLocations();
          self._indexVideos();
          self.groupDataChanged.emit(this.groupData);
          self._updateCurrentUser();
        }, error);
    },

    _setLocationsByUser: function _setLocationsByUser(locations) {
      if(this.currentGroup.isGroup) {
        this.locationsByUser = locations || {};
      } else {
        var userId = this.currentGroup.id;
        this.locationsByUser = {};
        this.locationsByUser[userId] = locations || {};
      }
    }
  };

  /****************************************************************
   * Groups
   ****************************************************************/
  function Groups($q, userService, groupService) {
    this.$q = $q;
    this._userService = userService;
    this._groupService = groupService;
    this._indexedUsers = [];

    // Event
    this.groupsChanged = new EventSignal();
  }
  Groups.prototype = {
    load: function load() {
      var promises = [
        this._userService.listUsers(),
        this._groupService.listGroups()
      ];

      var self = this;
      this.$q.all(promises).then(function updateUsersAndGroups(groups) {
        var users = groups[0];
        var groups = groups[1];
        self._update(users, groups);
      }, error);
    },

    getUserById: function getUserById(id) {
      return this._indexedUsers[id];
    },

    /* Private */
    _indexUsers: function _indexUsers(users) {
      for(var i = 0, len = users.length; i < len; i++) {
        var user = users[i];
        this._indexedUsers[user.id] = user;
      }
    },

    _createUserGroup: function _createUserGroup(user) {
      return {
        id: user.id,
        profilePicture: user.profilePicture,
        name: user.name,
        isUser: true,
        users: [ user ]
      };
    },

    _update: function update(users, groups) {
      this._indexUsers(users);
      this.list = groups.concat(users);
      this.groupsChanged.emit(this.list, this._indexedUsers);
    }
  };

  /****************************************************************
   * LocationsByDay
   ****************************************************************/
  function LocationsByDay(locations) {
    this.data = new utils.Map();
    this.groupLocationsByDay(locations);
  }
  LocationsByDay.prototype = {
    groupLocationsByDay: function groupLocationsByDay(locations) {
      var previousLocationsByHour;
      for(var i = 0, len = locations.length; i < len; i++) {
        var location = locations[i];
        previousLocationsByHour = this.addLocation(location, previousLocationsByHour);
      };
    },

    addLocation: function addLocation(location, previousLocationsByHour) {
      var loc = new Location(location);
      var key = loc.getDate('YYYY-MM-DD');
      var locationsByHour = this.data.get(key);
      if(!locationsByHour) {
        locationsByHour = new LocationsByHour(loc.getDate(), previousLocationsByHour);
        this.data.put(key, locationsByHour);
      }
      locationsByHour.addLocation(loc);
      return locationsByHour;
    },

    getMap: function getMap() {
      return this.data;
    },

    get: function get(key) {
      return this.data.get(key);
    },

    getFirstLocation: function getFirstLocation() {
      var dayLocations = this.data.first();
      return dayLocations && dayLocations.locationsByHour.first()[0];
    }
  };

  /****************************************************************
   * LocationsByHour
   ****************************************************************/
  function LocationsByHour(date, previousLocationsByHour) {
    this.previousLocationsByHour = previousLocationsByHour;
    this.date = date;
    this.data = new utils.ListMap();
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
      this.data.put(key, location);
    },

    getMap: function getMap() {
      return this.data;
    },

    get: function get(hour) {
      return this.data.get(hour);
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

  /****************************************************************
   * Location Wrapper
   ****************************************************************/
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


  /****************************************************************
   * Aux functions
   ****************************************************************/
  function getObjectKeys(object) {
    return object ? Object.keys(object) : [];
  }


})(window.angular, window.moment, window.EventSignal, window.utils);
