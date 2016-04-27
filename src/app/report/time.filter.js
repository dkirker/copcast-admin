/**
 * Created by brunosiqueira on 04/11/15.
 */
(function(angular, moment) {
  'use strict';

  angular.module('copcastAdminApp').filter('minutesToHours', minutesToHours);

  function minutesToHours(){
    return function(minutes){
      if (minutes == undefined || minutes == 0){
        return "00:00"
      }

      var hours = Math.floor(parseInt(minutes) / 60).toString();
      var min = parseInt(minutes) - hours * 60;

      return (hours.length > 1 ? hours : "0" + hours ) + ':'+("0" + min).slice(-2);

    }

  }
})(window.angular, window.moment);

