'use strict';

var app = angular.module('copcastAdminApp');

app.directive('userDropdown', function($window, $timeout, HistoryManager) {

  return {
    restrict: 'E',
    templateUrl: 'app/components/user_dropdown/user.dropdown.html',
    scope: {
      users: '=ngModel',
      onChangeUser: '&'
    },
    link: function(scope, el/*, attrs*/) {
      var $selectpicker = el.find('.selectpicker');
      var onChangeUser = scope.onChangeUser(); // Unwrap


      if (HistoryManager.paramUserId) {
        scope.currentUser = {id: HistoryManager.paramUserId, isGroup: null};
      } else {
        try {
          scope.currentUser = HistoryManager.store.currentGroup;
          scope.openOnLoad = false;
          //scope.currentUserId = HistoryManager.paramUserId || HistoryManager.store.currentGroup;
          //scope.currentUserData = {id: HistoryManager.store.currentGroup.id, isGroup: HistoryManager.store.currentGroup.isGroup};
          //scope.openOnLoad = false;
        } catch (err) {
          scope.currentUserId = 0;
          scope.openOnLoad = true;
        }
      }

      $selectpicker.on('change', function() {
        $timeout(function () {
          var userObj = JSON.parse($selectpicker.val());

          // $window.console.info('HistoryManager.store.groups: ', HistoryManager.store.groups);
          // $window.console.log('');

          for (var i=0; i<Object.keys(HistoryManager.store.groups).length; i++) {

            // $window.console.log('==================== START ' + i + ' ====================');
            // $window.console.info('HistoryManager.store.groups[i]: ', HistoryManager.store.groups[i]);
            // $window.console.info('userObj: ', userObj);
            // $window.console.log('==================== -- ====================');
            // $window.console.info('HistoryManager.store.groups[i].id: ', HistoryManager.store.groups[i].id);
            // $window.console.info('parseInt(HistoryManager.store.groups[i].id): ', parseInt(HistoryManager.store.groups[i].id));
            // $window.console.info('userObj[0]: ', userObj[0]);
            // $window.console.info('parseInt(userObj[0]): ', parseInt(userObj[0]));
            // $window.console.info('Check equal: ', parseInt(HistoryManager.store.groups[i].id) == parseInt(userObj[0]));
            // $window.console.info('Check identic: ', parseInt(HistoryManager.store.groups[i].id) === parseInt(userObj[0]));
            // $window.console.log('==================== -- ====================');
            // $window.console.info('HistoryManager.store.groups[i].isGroup: ', HistoryManager.store.groups[i].isGroup);
            // $window.console.info('userObj[1]: ', userObj[1]);
            // $window.console.info('Check equal: ', HistoryManager.store.groups[i].isGroup == userObj[1]);
            // $window.console.info('Check identic: ', HistoryManager.store.groups[i].isGroup === userObj[1]);
            // $window.console.info('New check identic: ', HistoryManager.store.groups[i].isGroup === userObj[1] || (typeof HistoryManager.store.groups[i].isGroup === 'undefined' && (typeof userObj[1] === 'object' && userObj[1] === null)));
            // $window.console.log('==================== END ' + i + ' ====================');
            // $window.console.log('');

            if (parseInt(HistoryManager.store.groups[i].id) === parseInt(userObj[0]) && (HistoryManager.store.groups[i].isGroup === userObj[1] || (typeof HistoryManager.store.groups[i].isGroup === 'undefined' && (typeof userObj[1] === 'object' && userObj[1] === null)))) {
              // $window.console.warn('>>>>>>>>>> HERE i = ' + i + ' <<<<<<<<<<');
              userObj = HistoryManager.store.groups[i];
              break;
            }
          }

          onChangeUser(userObj);
        });
      });

      if(scope.openOnLoad) {
        $timeout(function () {
          $selectpicker.next().find('button').click();
        }, 500);
      }

      scope.$watchCollection('users', function() {
        $timeout(function () {
          $selectpicker.selectpicker('refresh');
        });
      });
    }
  };
});
