angular.module('gettext').run(['gettextCatalog', function (gettextCatalog) {
/* jshint -W100 */
    gettextCatalog.setStrings('en', {"NOT_LOGGED":"Not logged","PAUSED":"Paused mission","RECORDING_OFFLINE":"In mission - Recording videos","RECORDING_ONLINE":"In mission - Recording videos","RECORDING":"In mission - Recording videos","STREAMING":"In mission - Live streaming","UPLOADING":"Uploading data to the server","LOGGED":"Logged in the Copcast app","SEEN_VIDEO":"Playing recorded videos","LOGGED_ADMIN":"User logged to the admin system","PLAYING_VIDEO":"Playing video in the History tab"});
/* jshint +W100 */
}]);