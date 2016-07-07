'use strict';


angular.module('copcastAdminApp')
  .controller('DebugCtrl', function ($scope, $window, $rootScope, socket) {
    // $scope.user = user;
    $scope.dump = socket;

    var dumpCB = function(data) {
      console.log(data.dump)
    }

    $scope.update = function () {
      console.warn("requesting dump");
      socket.emit('dump', dumpCB);
    };

  });
