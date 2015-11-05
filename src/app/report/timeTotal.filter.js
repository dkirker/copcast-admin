/**
 * Created by brunosiqueira on 04/11/15.
 */
(function(angular, moment) {
  'use strict';

  angular.module('copcastAdminApp').filter('totalAndMinutesToHours', minutesToHours);

  function minutesToHours(){
    return function(activity){
      var recorded = activity.recordedTime != undefined ? parseInt(activity.recordedTime) : 0;
      var streamed = activity.streamedTime != undefined ? parseInt(activity.streamedTime) : 0;
      var paused = activity.pausedTime != undefined ? parseInt(activity.pausedTime) : 0;
      var total = recorded + streamed + paused;

      var hours = Math.floor(parseInt(total) / 60);
      var min = parseInt(total) - hours * 60;

      return hours + ':'+min

    }

  }
})(window.angular, window.moment);

