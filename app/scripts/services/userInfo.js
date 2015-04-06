/**
 * Created by brunosiqueira on 06/04/15.
 */
'use strict';


angular.module('copcastAdminApp')
app.directive('userName', function(loginService) {
  return {
    restrict: 'E',
    template  : loginService.getUserName()
  };
});
