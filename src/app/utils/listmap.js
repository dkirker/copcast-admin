'use strict';
;(function() {
  /*
   * Map
   */
  function ListMap() {
    this._map = new utils.Map();
  }
  ListMap.prototype = {
    put: function put(key, value) {
      if(!this.containsKey(key)) {
        this._map.put(key, []);
      }
      this._map.get(key).push(value);
    },

    get: function get(key) {
      return this._map.get(key);
    },

    keys: function keys() {
      return this._map.keys();
    },

    size: function size() {
      return this._map.size();
    },

    containsKey: function containsKey(key) {
      return this._map.containsKey(key)
    },

    first: function first(key) {
      return key
        ? getFirstArrayElement(this.get(key))
        : this._map.first();
    },

    last: function last(key) {
      return key
        ? getLastArrayElement(this.get(key))
        : this._map.last();
    },

    getMap: function getMap() {
      return this._map.getMap();
    }

  };

  function getFirstArrayElement(array) {
    if(isArray(array) && array.length > 0) {
      return array[0];
    }
  }

  function getLastArrayElement(array) {
    if(isArray(array) && array.length > 0) {
      return array[array.length - 1];
    }
  }

  function isArray(value) {
    return value && value instanceof Array;
  }

  var utils = window.utils || {};
  utils.ListMap = ListMap;

  window.utils = utils;
})();
