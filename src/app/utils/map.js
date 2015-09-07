'use strict';
;(function() {
  /*
   * Map
   */
  function Map() {
    this._map = {};
  }
  Map.prototype = {
    put: function put(key, value) {
      this._map[key] = value;
    },

    get: function get(key) {
      return this._map[key];
    },

    keys: function keys() {
      return Object.keys(this._map);
    },

    size: function size() {
      return this.keys().length;
    },

    containsKey: function containsKey(key) {
      var value = this.get(key);
      return value !== null &&
             value !== undefined;
    },

    first: function first() {
      if(this.size() > 0) {
        return this.get(this.keys()[0]);
      }
    },

    last: function last() {
      var size = this.size()
      if(size > 0) {
        return this.get(this.keys()[size - 1]);
      }
    },

    getMap: function getMap() {
      return this._map;
    }
  };

  var utils = window.utils || {};
  utils.Map = Map;

  window.utils = utils;
})();
