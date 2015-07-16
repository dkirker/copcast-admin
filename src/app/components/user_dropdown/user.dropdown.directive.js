;(function(angular) {
  'use strict';

  var app = angular.module('copcastAdminApp');

  app.directive('userDropdown', function($timeout) {
    return {
      restrict: 'E',
      templateUrl: 'app/components/user_dropdown/user.dropdown.html',
      scope: {
        users: '=ngModel',
        openOnLoad: '=?',
        onChangeUser: '&'
      },
      link: function(scope, el, attrs) {
        var $selectpicker = el.find('.selectpicker');
        var onChangeUser = scope.onChangeUser(); // Unwrap

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
