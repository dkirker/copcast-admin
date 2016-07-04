/**
 * Created by arthur on 04/07/16.
 */

/**
 * Copcast - Password Meter
 * 04/07/2016
 * Arthur Vasconcelos <vasconcelos.arthur@gmail.com>
 *
 * Usague:
 *
 * <password-meter
 *   id-hash="STRING || Default: Date.now()"
 *   label-text="STRING || Default: 'New Password:'"
 *   ng-model="ANGULAR.MODEL"
 *   min-length="NUMBER || Default: 8"
 *   disabled="fn() BOOL || Default: fn() false"
 *   tip="STRING || Default: '- Minimum 8 digits.'">
 * </password-meter>
 */

'use strict';

var app = angular.module('copcastAdminApp');

app.directive('passwordMeter', function($window, $timeout) {
  return {
    restrict: 'E',
    templateUrl: 'app/components/password_meter/password.meter.html',
    scope: {
      idHash: '=?',
      labelText: '=?',
      ngModel: '=',
      minLength: '=?',
      disabled: '&?',
      tip: '=?'
    },
    link: function(scope, el/*, attrs*/) {
      /* Instantiate attributes */
      if (!scope.idHash)    scope.idHash    = Date.now();
      if (!scope.labelText) scope.labelText = 'New Password:';
      if (!scope.minLength) scope.minLength = 8;
      if (!scope.disabled)  scope.disabled  = function(){ return true };
      if (!scope.tip)       scope.tip       = '- Minimum 8 digits.';

      /* Password level */
      var strength = {
        1: "Worst",
        2: "Bad",
        3: "Weak",
        4: "Good",
        5: "Strong"
      };

      /* Logic */
      $timeout(function(){
        var meter = $('#password-strength-meter-' + scope.idHash);
        var text = $('#password-strength-text-' + scope.idHash);
        text.hide();

        $('#input-password-' + scope.idHash).keyup(function(){
          var $self = $(this);
          var password = $self.val();
          var result = zxcvbn(password);

          if (password !== "") {
            meter.val(result.score + 1);
            text.text(strength[result.score + 1]).fadeIn();
          } else {
            meter.val(0);
            text.fadeOut();
            setTimeout(function(){
              text.text("");
            }, 500);
          }
        });
      }, 100);
    }
  };
});
