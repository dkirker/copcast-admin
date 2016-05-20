/* google */

'use strict';

describe('Controller:ExportCreationCtrl', function () {

  // load the controller's module
  beforeEach(angular.mock.module('copcastAdminApp'));

  var CreationCtrl,
    scope,
    exportService;

  // Initialize the controller and a mock scope
  beforeEach(angular.mock.inject(function ($controller, $rootScope, _exportService_) {
    scope = $rootScope.$new();
    exportService = _exportService_;
    CreationCtrl = $controller('ExportsCreationCtrl', {
      $scope: scope,
      exportService: exportService
    });
  }));

  it("defines period", function(){
    scope.exportObj.initialDate = "2016-05-03";
    scope.exportObj.endDate = "2016-05-04";
    scope.exportObj.period = true;
    scope.exportObj.recorderId = 1;

    var obj = scope.createExport();

    expect(scope.errorMessage).toBe(null);
    expect(obj.initialDate).toBe('2016-05-03 00:00');
    expect(obj.finalDate).toBe('2016-05-04 23:59');
  });

  it("defines day with time", function(){
    scope.exportObj.initialDate = "2016-05-03";
    scope.exportObj.initialTime = moment.utc().hour(12).minutes(33).toDate();
    scope.exportObj.endTime = moment.utc().hour(15).minutes(44).toDate();
    scope.exportObj.period = false;
    scope.exportObj.recorderId = 1;

    var obj = scope.createExport();

    expect(scope.errorMessage).toBe(null);
    expect(obj.initialDate).toBe('2016-05-03 12:33');
    expect(obj.finalDate).toBe('2016-05-03 15:44');
  });

});
