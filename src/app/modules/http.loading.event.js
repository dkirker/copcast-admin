;(function(angular, $) {
    'use strict';

    var app = angular.module('copcastAdminApp');

    app.factory('loadingEventHttpInterceptor', ['$q',
        function ($q) {
            return {
                request: function (config) {
                    if (config.method === 'GET') {
                        $(document).trigger('http-get-started');
                    }
                    return config || $q.when(config);
                },
                response: function (response) {
                    if (response.config.method === 'GET') {
                        $(document).trigger('http-get-finished');
                    }
                    return response;
                }
            };
        }
    ]);

    app.config(['$httpProvider',
        function ($httpProvider) {
            $httpProvider.interceptors.push('loadingEventHttpInterceptor');
        }
    ]);

})(window.angular, window.jQuery);
