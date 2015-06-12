'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:UsersDetailsCtrl
 * @description
 * # UsersDetailsCtrl
 * Controller of the copcastAdminApp
 */
angular.module('copcastAdminApp')
  .controller('UsersDetailsCtrl', function ($scope, $routeParams, $http, $location, ServerUrl, Upload) {
    var $upload = Upload;
    $scope.hasProfilePicture = false;
    $scope.userPicture = '';
    $scope.blnShowTab = [true, false, false] ;

    //load the picture
    $scope.$watch('files', function () {
      $scope.upload($scope.files);
    });

    $scope.upload = function (files) {
      if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          Upload.upload({
            url: ServerUrl + '/users/'+$scope.user.id+'/upload-picture',
            method: 'POST',
            data: {userPicture: $scope.userPicture},
            file: files[0]
          }).progress(function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
          }).success(function (data, status, headers, config) {
            console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
            $scope.hasProfilePicture = true;
            $scope.pictureUrl = '';
            $scope.pictureUrl = ServerUrl + '/pictures/'+$scope.user.id+'/medium/show';

          });
        }
      }
    };


    //callback to change password
    $scope.changePassword = function () {
      $scope.passwordMessage = '';
      if(!$scope.currentPassword){
        $scope.passwordMessage = 'Current password filed is empty.';
        return;
      }
      if(!$scope.newPassword || !$scope.passwordConfirmation){
        $scope.passwordMessage = 'Password or password confirmation are empty.';
        return;
      }
      if($scope.newPassword !== $scope.passwordConfirmation){
        $scope.passwordMessage = 'Wrong password combination';
        return;
      }
      $http.post(ServerUrl + '/users/' + $scope.user.id+'/change-password',
        { password: { oldPassword:$scope.currentPassword, newPassword: $scope.newPassword } }).success(function(data){
          $location.path('/user-list');
        }).error(function(data) {
          $scope.passwordMessage = data;
          $scope.currentPassword = '';
          $scope.newPassword = '';
          $scope.passwordConfirmation = '';
        });
    };

    // callback for ng-click 'updateUser':
    $scope.updateUser = function () {
      $http.post(ServerUrl + '/users/' + $scope.user.id, $scope.user).success(function(data){
        $location.path('/user-list');
      }).error(function(data) {
        $scope.serverMessage = data;
      });
    };

    // callback for ng-click 'cancel':
    $scope.cancel = function () {
      $location.path('/user-list');
    };

    // callback for ng-click 'cancel':
    $scope.clickTab = function (nTab) {
      $scope.blnShowTab = [false, false, false];
      $scope.blnShowTab[nTab-1] = true;
    };

    //get a user by id
    $http.get(ServerUrl + '/users/'+ $routeParams.id).success(function(data) {
      $scope.user = data;
      $http.get(ServerUrl + '/users/me').success(function(data) {
        if(data.length === 0){
          return;
        }
        if($scope.user.profilePicture){
          $scope.hasProfilePicture = true;
          $scope.pictureUrl = ServerUrl + '/pictures/'+$scope.user.id+'/medium/show';
        }
      });
    }).error(function(data) {
    });

    //list of groups
    $http.get(ServerUrl + '/groups').success(function(data){
      $scope.groups = data;
    });

  });
