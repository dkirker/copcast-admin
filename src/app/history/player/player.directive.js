;(function(angular) {
  'use strict';

  var app = angular.module('copcastAdminApp');

  app.directive('player', function($sce, $timeout) {
    return {
      restrict: 'E',
      templateUrl: 'app/history/player/player.html',
      replace: true,
      scope: {
        user: '=',
        src: '='
      },
      link: function(scope, el) {
        var $video = el.find('video');
        var lastSrc;

        scope.time = formatTime(0);

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

        scope.$watch('src', function() {
          if(lastSrc === scope.src) {
            return;
          }
          var video = $video[0];
          lastSrc = scope.src;
          video.src = scope.src ? scope.src : '';
          video.load();
        })
      }
    };
  });
})(window.angular);
