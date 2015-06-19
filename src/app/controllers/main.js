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

  gettextCatalog.currentLanguage = 'pt_BR';

});
