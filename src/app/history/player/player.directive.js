;(function(angular) {
  'use strict';

  var app = angular.module('copcastAdminApp');

  app.directive('player', function($sce, $timeout) {
    return {
      restrict: 'E',
      templateUrl: 'app/history/player/player.html',
      replace: true,
      scope: {
        group: '=',
        src: '=',
        videos: '=',
        currentVideo: '=?',
        onChangeUser: '&'
      },
      link: function(scope, el) {
        var onChangeUser = scope.onChangeUser(); // Unwrap
        var $video = el.find('video');
        var video = $video[0];
        var lastSrc;
        var currentVideoIndex = -1;

        scope.time = formatTime(0);

        /*
         * Watchers
         */
        scope.$watchCollection('group', function() {
          var group = scope.group;
          var groupHasUsers = group && group.users && group.users.length > 0;
          var user = groupHasUsers ? group.users[0] : null;
          scope.setUser(user);
        });

        scope.$watch('src', function() {
          if(lastSrc === scope.src) {
            return;
          }
          lastSrc = scope.src;
          video.src = scope.src ? scope.src : '';
          video.load();
        });

        scope.$watch('videos', function() {
          video.pause();
          video.currentTime = 0;
          scope.currentVideo = undefined;
          scope.currentVideoIndex = -1;
        });

        /*
         * Scope functions
         */
        scope.setUser = function setUser(user) {
          scope.selectedUser = user;
          onChangeUser(user);
        };

        scope.playVideo = function playVideo() {
          if(video.src) {
            video.play();
          }
        }

        scope.previousVideo = function previousVideo() {

        }

        scope.nextVideo = function nextVideo() {
          scope.selectedUser = user;
          onChangeUser(user);
        }

        /*
         * Video functions
         */
        scope.trustSrc = function trustSrc(src) {
          return $sce.trustAsResourceUrl(src);
        };

        $video.on('timeupdate', function(event){
          onTrackedVideoFrame(this.currentTime, this.duration);
        });

        function onTrackedVideoFrame(currentTime, duration){
          $timeout(function() {
            scope.time = formatTime(currentTime);
          });
        }

        function formatTime(time) {
          var seconds = rightPad(time | 0, '00', 2);
          var minutes = rightPad(time / 60 | 0, '00', 2);
          var hours = rightPad(time / 60 / 60 | 0, '00', 2);
          return '<strong>' + hours + ':' + minutes + '</strong>:' + seconds;
        }

        function rightPad(str, padStr, size) {
          var strPad = padStr + str;
          return strPad.substr(strPad.length - size, size);
        }
      }
    };
  });
})(window.angular);
