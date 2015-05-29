;(function(angular) {
  'use strict';

  var app = angular.module('copcastAdminApp');

  app.directive('userDropdown', function() {
    return {
      restrict: 'E',
      templateUrl: 'app/components/user_dropdown/user.dropdown.html',
      scope: {
        users: '=',
        selectedUser: '=?',
        onChangeUser: '&'
      },
      link: function(scope, element, attrs) {
        scope.selectUser = function selectUser(user) {
          scope.selectedUser = user;
          scope.onUserChange(user);
        };
      }
    };
  });
})(window.angular);
