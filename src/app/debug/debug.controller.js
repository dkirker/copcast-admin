'use strict';



angular.module('copcastAdminApp')
  .controller('DebugCtrl', function ($scope, $window, $rootScope, socket) {
    // $scope.user = user;
    $scope.dump = socket;
    $scope.dumptxt = 'not yet';

    

    var dumpCB = function(data) {
      console.log($scope);

      $scope.dumptxt = JSON.stringify(data.dump, null, '  ');
      $scope.$apply();
    }

    $scope.update = function () {
      console.warn("requesting dump");
      socket.emit('dump', dumpCB);
    };

  });
