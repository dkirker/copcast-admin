/**
 * Created by brunosiqueira on 04/11/15.
 */
  'use strict';

angular.module('copcastAdminApp').filter('totalAndMinutesToHours', function(){
  return function(activity){
    var recorded = activity.recordingTime !== undefined ? parseInt(activity.recordingTime) : 0;
    var streamed = activity.streamedTime !== undefined ? parseInt(activity.streamedTime) : 0;
    var paused = activity.pausedTime !== undefined ? parseInt(activity.pausedTime) : 0;
    var total = recorded + streamed + paused;

    var hours = Math.floor(parseInt(total) / 60);
    var min = parseInt(total) - hours * 60;

    return ('0' + hours).slice(-2) + ':' + ('0' + min).slice(-2);
  };
});

