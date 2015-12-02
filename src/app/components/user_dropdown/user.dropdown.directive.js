;(function(angular) {
  'use strict';

  var app = angular.module('copcastAdminApp');

  app.directive('userDropdown', function($timeout, HistoryManager) {

    return {
      restrict: 'E',
      templateUrl: 'app/components/user_dropdown/user.dropdown.html',
      scope: {
        users: '=ngModel',
        onChangeUser: '&',
      },
      link: function(scope, el, attrs) {
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
            for (var i=0; i<Object.keys(HistoryManager.store.groups).length; i++) {
              if (parseInt(HistoryManager.store.groups[i].id) == parseInt(userObj[0]) && HistoryManager.store.groups[i].isGroup == userObj[1]) {
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
})(window.angular);
