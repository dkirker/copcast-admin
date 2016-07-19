'use strict';

/**
 * Created by brunosiqueira on 12/04/16.
 */

angular.module('copcastAdminApp').filter('kbytes', function() {
  return function(bytes, precision) {
    if (isNaN(parseFloat(bytes)) || !isFinite(bytes) || parseFloat(bytes) === 0) { return '-'; }
    if (typeof precision === 'undefined') { precision = 1; }

    var k = 1024;
    var units = ['kB', 'MB', 'GB', 'TB', 'PB'];
    var number = Math.floor(Math.log(bytes) / Math.log(k));
    var humanReadable = (bytes / Math.pow(k, number)).toFixed(precision) +  ' ' + units[number];
    return humanReadable;
  };
});
