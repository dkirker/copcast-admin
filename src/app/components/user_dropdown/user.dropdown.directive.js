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
        scope.change = function change() {
          var userObj = JSON.parse(scope.user);
          scope.selectedUser = userObj;
          scope.onChangeUser()(userObj);
        };
      }
    };
  });
})(window.angular);
