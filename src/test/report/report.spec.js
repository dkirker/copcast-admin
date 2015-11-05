/**
 * Created by brunosiqueira on 27/10/15.
 */
/* google */
/**
 * Created by bruno on 2/3/15.
 */
'use strict';

describe('Controller: RealtimeCtrl', function () {

  // load the controller's module
  beforeEach(angular.mock.module('copcastAdminApp'));

  var ReportCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();

    ReportCtrl = $controller('ReportCtrl', {
      $scope: scope
    });
  }));

  it('should present a map', function () {

  });

});
