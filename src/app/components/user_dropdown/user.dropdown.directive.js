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

        try {
          scope.currentUserId = HistoryManager.store.currentGroup.id;
          scope.openOnLoad = false;
        } catch (err) {
          scope.currentUserId = 0;
          scope.openOnLoad = true;
        }

        $selectpicker.on('change', function() {
          $timeout(function () {
            var userObj = JSON.parse($selectpicker.val());
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
