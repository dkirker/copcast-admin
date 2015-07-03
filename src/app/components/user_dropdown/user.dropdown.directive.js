;(function(angular) {
  'use strict';

  var app = angular.module('copcastAdminApp');

  app.directive('userDropdown', function($timeout) {
    return {
      restrict: 'E',
      templateUrl: 'app/components/user_dropdown/user.dropdown.html',
      scope: {
        users: '=',
        selectedUser: '=?',
        openOnLoad: '=?',
        onChangeUser: '&'
      },
      link: function(scope, el, attrs) {
        var $selectpicker = el.find('.selectpicker');

        $selectpicker.on('change', function() {
          $timeout(function () {
            console.log('selecionado', $selectpicker.val());
            var userObj = JSON.parse($selectpicker.val());
            scope.selectedUser = userObj;
            scope.onChangeUser()(userObj);
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
