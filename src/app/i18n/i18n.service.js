'use strict';

/**
 * @ngdoc function
 * @name i18n.service:TranslateService
 * @description
 * # TranslateService
 * Controller of the copcastAdminApp
 */

var app = angular.module('copcastAdminApp');
app.service('TranslateService',function($rootScope, gettextCatalog){

    //method to set the flags regarding the actual language
    this.setLanguage = function()
    {
      if(gettextCatalog.currentLanguage == 'pt_BR')
      {
        $rootScope.imgFlag = "assets/images/us-icon.png";
        gettextCatalog.setCurrentLanguage('pt_BR');
      }
      else
      {
        $rootScope.imgFlag = "assets/images/br-icon.png";
        gettextCatalog.setCurrentLanguage('en');

      }
    };

    //method to change the actual flag/language


  }

);
