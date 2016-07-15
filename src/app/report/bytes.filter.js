'use strict';

/**
 * Created by brunosiqueira on 12/04/16.
 */

angular.module('copcastAdminApp').filter('bytes', function() {
  return function(bytes, precision) {
    if (isNaN(parseFloat(bytes)) || !isFinite(bytes) || parseFloat(bytes) === 0) { return '-'; }
    if (typeof precision === 'undefined') { precision = 1; }

    var k = 1024;
    var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'];
    var number = Math.floor(Math.log(bytes) / Math.log(k));
    var humanReadable = (bytes / Math.pow(k, number)).toFixed(precision) +  ' ' + units[number];

    console.group('BYTES FILTER');
    console.log('bytes: ', bytes);
    console.log('precision: ', precision);
    console.log('units: ', units);
    console.log('number: ', number);
    console.log('return: ', humanReadable);
    console.groupEnd();

    return humanReadable;
  };
});
