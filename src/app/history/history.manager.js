'use strict';

var app = angular.module('copcastAdminApp');

app.service('HistoryManager', function($q, $window, $timeout, userService, groupService, timelineService, notify, gettextCatalog) {
  var self = this;
  this.store = {};
  this.paramUserId = null;

  /****************************************************************
   * Aux functions
   ****************************************************************/
  function getObjectKeys(object) {
    return object ? Object.keys(object) : [];
  }

  function error(error) {
    $window.console.log('error', error);
  }

  /****************************************************************
   * Google Maps Helper
   ****************************************************************/
  function GoogleMapsHelper($timeout) {
    this.$timeout = $timeout;
    // Events
    this.userLocationsChanged = new $window.EventSignal();
    this.groupLocationsMarkersChanged = new $window.EventSignal();
  }

  GoogleMapsHelper.prototype = {
    updateUserLocations: function updateUserLocations(userData) {
      var self = this;
      this.$timeout(function() {
        var locations = (userData && userData.locations) ? userData.locations : [];
        self.userMapLocations = $window.utils.GoogleMaps.transformLocationsToLatLngPoints(locations);
        self.userLocationsChanged.emit(self.userMapLocations);
      }, 600);
    },

    updateCurrentGroupLocationsMarkers: function updateCurrentGroupLocationsMarkers(groupData/*, notify, gettextCatalog*/) {
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
            var marker = $window.utils.GoogleMaps.createMarker(userData.user, userData.currentLocation.location);
            markers.push(marker);
            if (userData.currentLocation.location.accuracy && userData.currentLocation.location.accuracy > 20) {
              var circle = $window.utils.GoogleMaps.createAccuracyCircle(userData.user, userData.currentLocation.location);
              markers.push(circle);
            }
          }
        }

        self.groupLocationsMarkers = markers;
        self.groupLocationsMarkersChanged.emit(self.groupLocationsMarkers);
      }, 600);
    }
  };

  /****************************************************************
   * Location Wrapper
   ****************************************************************/
  function Location(location) {
    this.location = angular.copy(location);
    this.date = $window.moment(location.date).clone();
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
   * LocationsByHour
   ****************************************************************/
  function LocationsByHour(date, previousLocationsByHour) {
    this.previousLocationsByHour = previousLocationsByHour;
    this.date = date;
    this.data = new $window.utils.ListMap();
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
   * LocationsByDay
   ****************************************************************/
  function LocationsByDay(locations) {
    this.data = new $window.utils.Map();
    this.groupLocationsByDay(locations);
  }

  LocationsByDay.prototype = {
    groupLocationsByDay: function groupLocationsByDay(locations) {
      var previousLocationsByHour;
      for(var i = 0, len = locations.length; i < len; i++) {
        var location = locations[i];
        previousLocationsByHour = this.addLocation(location, previousLocationsByHour);
      }
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
   * Incident Wrapper
   ****************************************************************/
  function Incident(incident) {
    this.incident = angular.copy(incident);
    this.date = $window.moment(incident.date).clone();
  }

  Incident.prototype = {
    getDate: function getDate(pattern) {
      return pattern ? this.date.format(pattern) : this.date;
    },
    unwrap: function unwrap() {
      return this.incident;
    }
  };

  /****************************************************************
   * IncidentsByHour
   ****************************************************************/
  function IncidentsByHour(date) {
    this.date = date;
    this.data = new $window.utils.ListMap();
  }

  IncidentsByHour.prototype = {
    addIncident: function addIncident(incident) {
      var key = incident.getDate('HH');
      this.data.put(key, incident);
    },

    getMap: function getMap() {
      return this.data;
    },

    get: function get(hour) {
      return this.data.get(hour);
    },

    getDate: function getDate(pattern) {
      return pattern ? this.date.format(pattern) : this.date;
    }
  };

  /****************************************************************
   * IncidentsByDay
   ****************************************************************/
  function IncidentsByDay(incidents) {
    this.data = new $window.utils.Map();
    this.groupIncidentsByDay(incidents);
  }

  IncidentsByDay.prototype = {
    groupIncidentsByDay: function groupIncidentsByDay(incidents) {
      for(var i = 0, len = incidents.length; i < len; i++) {
        this.addIncident(incidents[i]);
      }
    },
    addIncident: function addIncident(incident) {
      var inc = new Incident(incident);
      var key = inc.getDate('YYYY-MM-DD');
      var incidentsByHour = this.data.get(key);
      if(!incidentsByHour) {
        incidentsByHour = new IncidentsByHour(inc.getDate());
        this.data.put(key, incidentsByHour);
      }
      incidentsByHour.addIncident(inc);
      return incidentsByHour;
    },
    getMap: function getMap() {
      return this.data;
    }
  };

  /****************************************************************
   * GroupLocations
   ****************************************************************/
  function GroupsDataManager($q, $timeout, userService, groupService, notify, gettextCatalog) {
    this.$q = $q;
    this.$timeout = $timeout;
    this._userService = userService;
    this._groupService = groupService;
    this._notify = notify;
    this._gettextCatalog = gettextCatalog;

    // Events
    this.groupDataChanged = new $window.EventSignal();
    this.userDataChanged = new $window.EventSignal();
    this.currentGroupChanged = new $window.EventSignal();
    this.currentUserChanged = new $window.EventSignal();
    this.periodChanged = new $window.EventSignal();
    this.currentGroupLocationsChanged = new $window.EventSignal();
    this.currentUserLocationChanged = new $window.EventSignal();
    this.currentVideoChanged = new $window.EventSignal();
  }

  GroupsDataManager.prototype = {
    setUsers: function setUsers(users) {
      this._users = users;
      this.reset();
      this.MAX_MINUTES_TO_CLOSEST_LOCATION = 10;
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
      $window.console.info('Setting currentDate: ', date);
      this.currentDate = typeof date === 'string' ? $window.moment(date) : date;
      this._calculateClosestGroupLocations();
      this._updateCurrentDateVideo();
    },

    setCurrentVideo: function setCurrentVideo(video) {
      $window.console.info('Video setted currentDate (from): ', video);
      this.currentDate = $window.moment(video.from);
      this._calculateClosestGroupLocations();
      this._setVideoData(video.index);
    },

    reset: function reset() {
      this.locationsByUser = {};
      this.incidentsByUser = {};
      this.videos = [];
      this.groupData = {};
      this.groupDataChanged.emit(this.groupData);
    },

    /* Private */
    _updateCurrentDateVideo: function _updateCurrentDateVideo() {
      var videos = this.userData.videos || [];
      var videoIndex;
      var cDate = this.currentDate;
      for(var i = 0, len = videos.length; i < len; i++) {
        var video = videos[i];
        var fromDate = $window.moment(video.from);
        var toDate = $window.moment(video.to);
        if(cDate.isSame(fromDate, 'minute')  || cDate.isSame(toDate, 'minute') ||
          (cDate.isBetween(fromDate, toDate, 'minute'))) {
          videoIndex = i;
          break;
        }
      }
      this._setVideoData(videoIndex);
    },

    _setVideoData: function _setVideoData(videoIndex) {
      var videos = this.userData.videos || [];
      if(videos.length > 0) {
        var userData = this.userData;
        userData.previousVideo = videoIndex > 0 ? videos[videoIndex - 1] : undefined;
        userData.currentVideo = videos[videoIndex];
        if(videoIndex >= 0) {
          userData.nextVideo = videos.length > videoIndex + 1 ? videos[videoIndex + 1] : undefined;
        } else {
          userData.nextVideo = videos[0];
        }
        this.currentVideoChanged.emit({
          current: userData.currentVideo,
          previous: userData.previousVideo,
          next: userData.nextVideo
        });
      }
    },

    _calculateClosestGroupLocations: function _calculateClosestGroupLocations() {
      // var currentGroupLocations = new $window.utils.Map();
      var date = this.currentDate.format('YYYY-MM-DD');
      var hour = this.currentDate.format('HH');
      var userIds = getObjectKeys(this.locationsByUser);

      for(var i = 0, len = userIds.length; i < len; i++) {
        var userId = userIds[i];
        var locationsByDay = this.groupData[userId].locationsByDay;
        var locationsByHour = locationsByDay.get(date);
        if(locationsByHour) {
          // var location = this._getClosestLocation(locationsByHour.get(hour) || []);
          var location = this._newGetClosestLocation(locationsByHour.get(hour) || []);
          self.store.hasLocation = (location) ? true : false;
          this.groupData[userId].currentLocation = location;
          if(this.currentUser && this.currentUser.id === userId) {
            this.currentUserLocationChanged.emit(this.groupData[userId]);
          }
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

    _newGetClosestLocation: function _newGetClosestLocation(locations) {
      var now = new Date(this.currentDate.format()).getTime();
      var before = [];
      var after = [];
      var max = locations.length;
      var threshold = 30000;
      var limitDate = now - threshold;
      var limitDiff = (limitDate - now) / (3600 * 24 * 1000);

      $window.console.group('Closest location');

      $window.console.groupCollapsed('Now');
      $window.console.info('Timestamp: ', now);
      $window.console.log('Date: ', new Date(now));
      $window.console.groupEnd();

      $window.console.log('Threshold: %s (milliseconds)', threshold);

      $window.console.groupCollapsed('Limit');
      $window.console.info('Timestamp: ', limitDate);
      $window.console.log('Date: ', new Date(limitDate));
      $window.console.warn('Diff: ', limitDiff);
      $window.console.groupEnd();

      $window.console.groupCollapsed('Locations');
      for(var i = 0; i < max; i++) {
        var tar = locations[i];
        var arrDate = new Date(tar.date.format()).getTime();
        var diff = (arrDate - now) / (3600 * 24 * 1000); // 3600 * 24 * 1000 = calculating milliseconds to days, for clarity.

        $window.console.log(locations[i]);

        if(diff > 0) {
          after.push({diff: diff, index: i});
        } else {
          before.push({diff: diff, index: i});
        }
      }
      $window.console.groupEnd();

      before.sort(function(a, b) {
        if(a.diff < b.diff) { return -1; }
        if(a.diff > b.diff) { return 1; }
        return 0;
      });

      var closestBefore = before[0];

      for(var j = 0; j < before.length; j++) {
        if(before[j].diff >= 0 && before[j].diff < closestBefore.diff) { closestBefore = before[j]; }
      }

      after.sort(function(a, b) {
        if(a.diff > b.diff) { return -1; }
        if(a.diff < b.diff) { return 1; }
        return 0;
      });

      var closestAfter = after[0];

      for(var k = 0; k < after.length; k++) {
        if(after[k].diff >= 0 && after[k].diff < closestAfter.diff) { closestAfter = after[k]; }
      }

      var closest;

      if(closestBefore && closestAfter) {
        closest = (Math.abs(closestBefore) < Math.abs(closestAfter)) ? closestBefore : closestAfter;
      } else if(closestBefore) {
        closest = closestBefore;
      } else {
        closest = closestAfter;
      }

      var thresholdAllow = Math.abs(closest.diff) <= Math.abs(limitDiff) && Math.abs(closest.diff) >= 0;

      $window.console.groupCollapsed('Locations grouped');
      $window.console.log('Before: ', before);
      $window.console.log('After: ', after);
      $window.console.groupEnd();

      $window.console.groupCollapsed('Closest');
      $window.console.info('Before: ', closestBefore);
      $window.console.info('After: ', closestAfter);
      $window.console.warn('Best: ', closest);
      $window.console.groupEnd();

      $window.console.log('Threshold allow: ', thresholdAllow);
      $window.console.groupEnd();

      return (thresholdAllow) ? locations[closest.index] : null;
    },

    _update: function _update() {
      if(!this.currentGroup || !this.period) {
        this.reset();
      } else {
        this._loadGroupLocationsVideosAndIncidents();
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
      $window.console.log('currentGroup.users updated', this.currentGroup);
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

    _indexIncidents: function _indexIncidents() {
      var userIds = getObjectKeys(this.incidentsByUser);
      for(var i = 0, len = userIds.length; i < len; i++) {
        var userId = userIds[i];
        var incidents = this.incidentsByUser[userId];
        var userData = this.groupData[userId];
        userData.incidents = incidents;
        userData.incidentsByDay = new IncidentsByDay(incidents);
      }
    },

    _indexVideos: function _indexVideos() {
      for(var i = 0, len = this.videos.length; i < len; i++) {
        var video = this.videos[i];
        var userData = this.groupData[video.userId];
        if(userData) {
          var userVideos = userData.videos || [];
          video.index = userVideos.length;
          userVideos.push(video);
          userData.videos = userVideos;
          if(userVideos.length > 0) {
            userData.nextVideo = userVideos[0];
          }
        }
      }
    },

    _getGroupLocationsVideosAndIncidents: function _getGroupLocationsVideosAndIncidents() {
      var toDate = this.period.period ? this.period.toDate : null;
      var groupId = this.currentGroup.id;
      return [
        this._groupService.getGroupLocations(groupId, this.period.fromDate, toDate),
        this._groupService.getGroupVideos(groupId, this.period.fromDate, toDate),
        this._groupService.getGroupIncidents(groupId, this.period.fromDate, toDate)
      ];
    },

    _getUserLocationsVideosAndIncidents: function _getUserLocationsVideosAndIncidents() {
      var toDate = this.period.period ? this.period.toDate : null;
      var userId = this.currentGroup.id;
      return [
        this._userService.getUserLocations(userId, this.period.fromDate, toDate),
        this._userService.getUserVideos(userId, this.period.fromDate, toDate),
        this._userService.getUserIncidents(userId, this.period.fromDate, toDate)
      ];
    },

    _loadGroupLocationsVideosAndIncidents: function _loadGroupLocationsVideosAndIncidents() {
      var promisses = this.currentGroup.isGroup ? this._getGroupLocationsVideosAndIncidents() : this._getUserLocationsVideosAndIncidents();

      var self = this;
      this.$q.all(promisses)
        .then(function(data) {

          if (Object.keys(data[0]).length === 0 || Object.keys(data[1]).length === 0) { // no user location on this interval

            var message;

            var gettextCatalog = self._gettextCatalog; // needed to make 'gulp pot' work

            if (Object.keys(data[0]).length === 0 && Object.keys(data[1]).length === 0 ) {
              message = gettextCatalog.getString('No location data or videos available for the selected interval');
            } else if (Object.keys(data[0]).length === 0) {
              message = gettextCatalog.getString('No location data available for the selected interval');
            } else {
              message = gettextCatalog.getString('No video available for the selected interval');
            }

            self._notify({
              templateUrl: 'app/views/notifications/warningNotification.html',
              position: 'right',
              message: message,
              duration: 3500
            });
          }

          self._setLocationsByUser(data[0]);
          self._setIncidentsByUser(data[2]);
          self.videos = data[1];
          self.incidents = data[2];
          self.groupData = {};
          self._updateGroupUsers();
          self._indexLocations();
          self._indexVideos();
          self._indexIncidents();
          self.groupDataChanged.emit(self.groupData);
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
    },
    _setIncidentsByUser: function _setIncidentsByUser(incidents) {
      if(this.currentGroup.isGroup) {
        this.incidentsByUser = incidents || {};
        self.store.incidentsByUser = this.incidentsByUser;
      } else {
        var userId = this.currentGroup.id;
        this.incidentsByUser = {};
        this.incidentsByUser[userId] = incidents || {};
        self.store.incidentsByUser = this.incidentsByUser;
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

    // Events
    this.usersIndexed = new $window.EventSignal();
    this.groupsChanged = new $window.EventSignal();
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
        var ngroups = groups[1];
        self._update(users, ngroups);
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
      this.usersIndexed.emit(this._indexedUsers);
      this.list = groups.concat(users);
      this.groupsChanged.emit(this.list);
    }
  };

  /****************************************************************/

  // Objects
  var groups = new Groups($q, userService, groupService);
  var groupsDataManager = new GroupsDataManager($q, $timeout, userService, groupService, notify, gettextCatalog);
  var googleMapsHelper = new GoogleMapsHelper($timeout);

  // Manager API
  this.loadUsersAndGroups = groups.load.bind(groups);
  this.store.hasLocation = true;

  this.setCurrentGroup = groupsDataManager.setCurrentGroup.bind(groupsDataManager);
  this.setCurrentUser = groupsDataManager.setCurrentUser.bind(groupsDataManager);
  this.setPeriod = groupsDataManager.setPeriod.bind(groupsDataManager);
  this.setCurrentDate = function setCurrentDate(currentDate) {
    $window.console.log('currentDate', currentDate);
    groupsDataManager.setCurrentDate(currentDate);
  };

  this.previousVideo = function previousVideo() {
    var userData = self.store.userData;
    if(userData && userData.previousVideo) {
      groupsDataManager.setCurrentVideo(userData.previousVideo);
    }
  };
  this.nextVideo = function nextVideo() {
    var userData = self.store.userData;
    if(userData && userData.nextVideo) {
      groupsDataManager.setCurrentVideo(userData.nextVideo);
    }
  };
  this.hasPreviousVideo = function hasPreviousVideo() {
    var userData = self.store.userData;
    return userData && userData.previousVideo;
  };
  this.hasNextVideo = function hasNextVideo() {
    var userData = self.store.userData;
    return userData && userData.nextVideo;
  };

  // User and Groups Events
  groups.usersIndexed.addListener(function(indexedUsers) {
    $window.console.log('indexedUsers', indexedUsers);
    groupsDataManager.setUsers(indexedUsers);
  });

  groups.groupsChanged.addListener(function(groups) {
    self.store.groups = groups;
    if (self.paramUserId) {
      for (var i = 0; i < Object.keys(self.store.groups).length; i++) {
        if (parseInt(self.store.groups[i].id) === parseInt(self.paramUserId) && !self.store.groups[i].isGroup) {
          self.setCurrentGroup(self.store.groups[i]);
          self.paramUserId = null;
          return;
        }
      }
    }
  });

  this.setCurrentUserId = function(userId) {
    if (userId) {
      //this.store.currentGroup = null;
      this.paramUserId = userId;
    }
  };

  // Group Locations and Videos Events
  groupsDataManager.currentGroupChanged.addListener(function(group) {
    $window.console.log('currentGroup', group);
    self.store.currentUser = undefined;
    self.store.currentGroup = group;
  });

  groupsDataManager.currentUserChanged.addListener(function(user) {
    $window.console.log('currentUser', user);
    self.store.currentUser = user;
  });

  groupsDataManager.groupDataChanged.addListener(function(groupData) {
    self.store.groupData = groupData;
    $window.console.log('groupData', groupData);
  });

  groupsDataManager.userDataChanged.addListener(function(userData) {
    $window.console.log('userData', userData);
    self.store.userData = userData;
    googleMapsHelper.updateUserLocations(userData);
  });

  groupsDataManager.currentGroupLocationsChanged.addListener(function(groupData) {
    $window.console.log('currentGroupLocations changed', groupData);
    googleMapsHelper.updateCurrentGroupLocationsMarkers(groupData, notify, gettextCatalog);
  });

  groupsDataManager.currentUserLocationChanged.addListener(function(userData) {
    $window.console.log('currentUserLocationChanged changed', userData);
    timelineService.setCurrentLocation(userData.currentLocation);
  });
  groupsDataManager.currentVideoChanged.addListener(function(videoData) {
    $window.console.log('currentVideoChanged', videoData);
  });

  /* Google Maps Data */
  googleMapsHelper.userLocationsChanged.addListener(function(userMapLocations) {
    if(!self.store.map) {
      self.store.map = {};
    }
    self.store.map.locations = userMapLocations;
    $window.console.log('map locations updated', self.store.map);
  });

  googleMapsHelper.groupLocationsMarkersChanged.addListener(function(groupLocationsMarkers) {
    if(!self.store.map) {
      self.store.map = {};
    }
    self.store.map.markers = groupLocationsMarkers;
    $window.console.log('map markers updated', self.store.map);
  });
});
