/**
 * Created by brunosiqueira on 28/04/16.
 */
describe('Filter: BytesFilter', function () {
  'use strict';

  var $filter;

  beforeEach(function () {
    angular.mock.module('copcastAdminApp');

    inject(function (_$filter_) {
      $filter = _$filter_;
    });
  });

  it('show 1 kb successfully', function () {
    var result = $filter('bytes')(1024, 2);

    // Assert.
    expect(result).toEqual('1.00 kB');
  });
  it('show 1 Mb successfully', function () {
    var result = $filter('bytes')(1048576, 2);

    // Assert.
    expect(result).toEqual('1.00 MB');
  });
  it('show nothing when receives null', function () {
    var result = $filter('bytes')(null, 2);

    // Assert.
    expect(result).toEqual('-');
  });
  it('show nothing when receives 0', function () {
    var result = $filter('bytes')(0, 2);

    // Assert.
    expect(result).toEqual('-');
  });
});
