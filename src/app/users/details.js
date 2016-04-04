'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:UsersDetailsCtrl
 * @description
 * # UsersDetailsCtrl
 * Controller of the copcastAdminApp
 */
angular.module('copcastAdminApp')
  .controller('UsersDetailsCtrl', function ($scope, $routeParams, $http, $location, ServerUrl, Upload, gettext, userService) {
    var $upload = Upload;
    $scope.hasProfilePicture = false;
    $scope.userPicture = '';
    $scope.blnShowTab = [true, false, false] ;

    userService.getAdminRoles().then(function(roles){
      $scope.adminRoles = roles;
    });

    userService.getRoles().then(function(roles){
      $scope.allRoles = roles;
    });

    $scope.canEditAdmin = function(){
      return $scope.adminRoles && $scope.adminRoles.length > 0;
    };

    $scope.canUpdate = function(){
      return $scope.user && $scope.allRoles.indexOf($scope.user.role) > -1;
    }

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
            $scope.pictureUrl = ServerUrl + '/pictures/'+$scope.user.id+'/medium/show?t=' + new Date().getTime();

          });
        }
      }
    };


    //callback to change password
    $scope.changePassword = function () {
      $scope.passwordMessage = '';
      if(!$scope.currentPassword){
        $scope.passwordMessage = gettext('Current password filed is empty.');
        return;
      }
      if(!$scope.newPassword || !$scope.passwordConfirmation){
        $scope.passwordMessage = gettext('Password or password confirmation are empty.');
        return;
      }
      if($scope.newPassword !== $scope.passwordConfirmation){
        $scope.passwordMessage = gettext('Wrong password combination');
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
        if (data.errors){
          $scope.serverMessage = data.errors[0].message;
        } else {
          $scope.serverMessage = data;
        }
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
    userService.getUser($routeParams.id).then(function(data) {
      $scope.user = data;
      if($scope.user.profilePicture){
        $scope.hasProfilePicture = true;
        $scope.pictureUrl = ServerUrl + '/pictures/'+$scope.user.id+'/medium/show';
      }

    },function(data) {
    });

    //list of groups
    $http.get(ServerUrl + '/groups').success(function(data){
      $scope.groups = data;
    });

  });
