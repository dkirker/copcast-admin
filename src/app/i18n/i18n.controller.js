'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:TranslateController
 * @description
 * # TranslateController
 * Controller of the copcastAdminApp
 */

var app = angular.module('copcastAdminApp');

app.controller('TranslateController', function($scope, gettextCatalog, TranslateService ) {

  $scope.init = function(){

    TranslateService.setLanguage();

  };

  $scope.clickLang = function () {


    if ($scope.imgFlag == "assets/images/br-icon.png")
    {
      $scope.imgFlag = "assets/images/us-icon.png"
      gettextCatalog.setCurrentLanguage('pt_BR');

    }
    else
    {
      $scope.imgFlag = "assets/images/br-icon.png"
      gettextCatalog.setCurrentLanguage('en');

    }

  };

  $scope.init();

});
