'use strict';

var app = angular.module('copcastAdminApp');

app.directive('player', function($sce, $timeout, $window, historyService) {
  return {
    restrict: 'E',
    templateUrl: 'app/history/player/player.html',
    replace: true,
    scope: {
      collection: '=',
      users: '=',
      incidents: '=',
      nowVideo: '=',
      cover: '=',
      src: '=',
      currentVideo: '=?',
      onChangeUser: '&',
      onPreviousVideo: '&',
      onNextVideo: '&',
      hasPreviousVideo: '=?',
      hasNextVideo: '=?'
    },
    link: function(scope/*, el*/) {
      var onChangeUser = scope.onChangeUser(); // Unwrap
      var onPreviousVideo = scope.onPreviousVideo(); // Unwrap
      var onNextVideo = scope.onNextVideo(); // Unwrap

      var $video = angular.element('#copcastVideo');
      var video = $video[0];

      scope.wantSee =  false;

      var lastSrc;

      function videoPlayer($video) {
        /** Video Settings */

        var checkTime = function(i) {
          if (i < 10) { i = '0' + i; }
          return i;
        };

        //Time format converter - 00:00
        var timeFormat = function(seconds, withZero){
          withZero = typeof withZero !== 'undefined' ? withZero : true;

          var m = null;

          if(withZero) {
            m = Math.floor(seconds/60)<10 ? '0'+Math.floor(seconds/60) : Math.floor(seconds/60);
          } else {
            m = Math.floor(seconds/60);
          }

          var s = Math.floor(seconds-(m*60))<10 ? '0'+Math.floor(seconds-(m*60)) : Math.floor(seconds-(m*60));
          return m + ':' + s;
        };

        var controlClock = function(date, currentTime){
          var d = new Date(date);
          var m = Math.floor(currentTime/60);
          var s = Math.floor(currentTime-(m*60));

          d.setMinutes(d.getMinutes() + m);
          d.setSeconds(d.getSeconds() + s);

          return checkTime(d.getHours()) + ':' + checkTime(d.getMinutes()) + ':' + checkTime(d.getSeconds());
        };

        //display video buffering bar
        var startBuffer = function() {
          var currentBuffer = $video[0].buffered.end(0);
          var maxduration = $video[0].duration;
          var perc = 100 * currentBuffer / maxduration;
          angular.element('.bufferBar').css('width',perc+'%');

          if(currentBuffer < maxduration) {
            $window.setTimeout(startBuffer, 500);
          }
        };

        //display current video play time
        $video.on('timeupdate', function() {
          var currentPos = $video[0].currentTime;
          var maxduration = $video[0].duration;
          var perc = 100 * currentPos / maxduration;
          angular.element('.timeBar').css('width',perc+'%');
          angular.element('.current').text(timeFormat(currentPos));
          angular.element('.dragger-timer').text(timeFormat(currentPos, false));

          angular.element('.clock')
            .text(controlClock(angular.element('.clock').attr('data-video-time'), currentPos));
        });

        var startTime = function() {
          var today = new Date();
          var h = today.getHours();
          var m = today.getMinutes();
          var s = today.getSeconds();
          m = checkTime(m);
          s = checkTime(s);

          angular.element('.scene .controls .clock').text(h + ':' + m + ':' + s);

          $window.setTimeout(startTime, 500);
        };

        var playpause = function() {
          if($video[0].paused || $video[0].ended) {
            angular.element('.play-pause').find('.glyphicon').addClass('glyphicon-pause').removeClass('glyphicon-play');
            $video[0].play();
          }
          else {
            angular.element('.play-pause').find('.glyphicon').addClass('glyphicon-play').removeClass('glyphicon-pause');
            $video[0].pause();
          }
        };

        $video[0].removeAttribute('controls');
        // startTime();

        $video.on('loadedmetadata', function() {
          //set video properties
          angular.element('.current').text(timeFormat(0));
          angular.element('.duration').text(timeFormat($video[0].duration));
          // updateVolume(0, 0.7);

          //start to get video buffering data
          $window.setTimeout(startBuffer, 150);

          //bind video events
          angular.element('.scene')
            .hover(function() {
              angular.element('.controls').stop().fadeIn();
            }, function() {
              angular.element('.controls').stop().fadeOut();
            })
            .on('click', function() {
              angular.element('.play-pause').find('.glyphicon').addClass('glyphicon-pause').removeClass('glyphicon-play');
              angular.element(this).unbind('click');
              $video[0].play();
            });
        });

        //== CONTROLS EVENTS ==//

        // video screen and play button clicked
        $video.on('click', function() { playpause(); } );
        angular.element('.play-pause').on('click', function() { playpause(); } );

        // fullscreen button clicked
        angular.element('.icons.fullscreen').on('click', function() {
          if($window.$.isFunction($video[0].webkitEnterFullscreen)) {
            $video[0].webkitEnterFullscreen();
          }
          else if ($window.$.isFunction($video[0].mozRequestFullScreen)) {
            $video[0].mozRequestFullScreen();
          }
          else {
            $window.alert('Your browsers doesn\'t support fullscreen');
          }
        });

        //== VIDEO EVENTS ==//

        //video canplay event
        $video.on('canplay', function() {
          angular.element('.loading').fadeOut(100);
        });

        //video canplaythrough event
        //solve Chrome cache issue
        var completeloaded = false;
        $video.on('canplaythrough', function() {
          completeloaded = true;
        });

        //video ended event
        $video.on('ended', function() {
          angular.element('.play-pause').find('.glyphicon').addClass('glyphicon-play').removeClass('glyphicon-pause');
          $video[0].pause();
        });

        //video seeking event
        $video.on('seeking', function() {
          //if video fully loaded, ignore loading screen
          if(!completeloaded) {
            angular.element('.loading').fadeIn(200);
          }
        });

        //video seeked event
        $video.on('seeked', function() { });

        //video waiting for more data event
        $video.on('waiting', function() {
          angular.element('.loading').fadeIn(200);
        });

        //== VIDEO PROGRESS BAR ==//

        // when video timebar clicked
        var updatebar = function(x) {
          var progress = angular.element('.player-progress');

          //calculate drag position
          //and update video currenttime
          //as well as progress bar
          var maxduration = $video[0].duration;
          var position = x - progress.offset().left;
          var percentage = 100 * position / progress.width();

          if(percentage > 100) {
            percentage = 100;
          }

          if(percentage < 0) {
            percentage = 0;
          }

          angular.element('.timeBar').css('width',percentage+'%');
          $video[0].currentTime = maxduration * percentage / 100;
        };

        var timeDrag = false;	/* check for drag event */

        angular.element('.player-progress').on('mousedown', function(e) {
          timeDrag = true;
          updatebar(e.pageX);
        });

        angular.element($window.document).on('mouseup', function(e) {
          if(timeDrag) {
            timeDrag = false;
            updatebar(e.pageX);
          }
        });

        angular.element($window.document).on('mousemove', function(e) {
          if(timeDrag) {
            updatebar(e.pageX);
          }
        });

        /** End Video Settings */
      }

      videoPlayer($video);

      $video.on('play',function(){
        historyService.registerVideoPlay($video[0].src, $video[0].currentTime, scope.selectedUser).then(function(){
          $window.console.log('registered video watching');
        });
      });

      /*
       * Watchers
       */
      scope.$watchCollection('collection', function() {
        scope.isNone = typeof scope.collection === 'undefined';
        scope.isGroup = scope.collection && scope.collection.isGroup && !scope.collection.username ? true : false;

        scope.totalIncidents = 0;

        var user = null;

        if (scope.isGroup && (scope.collection.users && scope.collection.users.length > 0)) {
          user =  scope.collection.users[0];

          $window.$.each(scope.incidents, function(index, item){
            scope.totalIncidents += item.length;

            $window.$.each(scope.collection.users, function(uindex, user){
              if (user.id === index) { user.incidents = item.length; }
            });
          });
        } else {
          var hasUsers = scope.users && scope.users.length > 0;
          user = hasUsers ? scope.users[0] : null;
        }

        angular.element('.officersList').perfectScrollbar();

        scope.setUser(user);
        $video[0].src = undefined;

        $window.setTimeout(function(){
          var largest = 0;
          angular.element('.officerChest').each(function(index, item){
            var width = 0;

            angular.element(item).children().each(function(cindex, citem){
              width += angular.element(citem).outerWidth(true);
            });

            largest = (width > largest) ? width : largest;
          }).css({ width: largest + 10 });
        }, 100);
      });

      scope.$watch('src', function() {
        // $window.console.log('NOW VIDEO: ', scope.nowVideo);
        // $window.console.log('COVER: ', scope.cover);
        // $window.console.log('SRC: ', scope.src);

        scope.wantSee = false;
        $video[0].src = undefined;
      });

      scope.$watch('wantSee', function() {
        if(lastSrc === scope.src || !scope.wantSee) {
          return;
        }

        lastSrc = scope.src;
        $video[0].src = scope.src ? scope.src : '';

        console.warn('NOW VIDEO: ', scope.nowVideo);

        var clock = new Date(scope.nowVideo.from);
        angular.element('.clock')
          .text(clock.getHours() + ':' + clock.getMinutes() + ':' + clock.getSeconds())
          .attr('data-video-time', scope.nowVideo.from);

        angular.element('.timeBar').css('width','0%');
        angular.element('.current').text(0);
        angular.element('.dragger-timer').text('0:00');
        $video[0].currentTime = 0;

        $video[0].play();
      });

      /*
       * Scope functions
       */
      scope.wantSeeAction = function wantSee(){
        scope.wantSee = true;
      };

      scope.closeMuteAlert = function closeMuteAlert() {
        angular.element('.closeMe').parent().slideUp();
      };

      scope.setUser = function setUser(user) {
        scope.selectedUser = user;
        onChangeUser(user);
      };

      scope.previousVideo = function previousVideo() {
        if (! angular.element('.button.previous').hasClass('disabled')) {
          scope.wantSee = false;
          $video[0].src = undefined;
          onPreviousVideo();
        }
      };

      scope.nextVideo = function nextVideo() {
        if (! angular.element('.button.next').hasClass('disabled')) {
          scope.wantSee = false;
          $video[0].src = undefined;
          onNextVideo();
        }
      };

      scope.hasVideo = function() {
        return scope.selectedUser && scope.src;
      };

      /*
       * Video functions
       */
      scope.trustSrc = function trustSrc(src) {
        return $sce.trustAsResourceUrl(src);
      };
    }
  };
});
