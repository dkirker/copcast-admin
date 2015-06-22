'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the copcastAdminApp
 */

var app = angular.module('copcastAdminApp');

app.controller('TranslateController', function($scope, gettextCatalog ) {

  $scope.init = function(){

    if(gettextCatalog.currentLanguage == 'pt_BR')
    {
      $scope.imgFlag = "assets/images/us-icon.png";
    }
    else
    {
      $scope.imgFlag = "assets/images/br-icon.png";
    }

  };

  $scope.clickLang = function () {


    if ($scope.imgFlag == "assets/images/br-icon.png")
    {
      $scope.imgFlag = "assets/images/us-icon.png"
      gettextCatalog.setCurrentLanguage('en');

    }
    else
    {
      $scope.imgFlag = "assets/images/br-icon.png"
      gettextCatalog.setCurrentLanguage('pt_BR');

    }

  };

  $scope.init();

});
