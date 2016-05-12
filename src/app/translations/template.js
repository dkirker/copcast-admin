'use strict';

angular.module('gettext').run(['gettextCatalog', function (gettextCatalog) {
/* jshint -W100 */
    gettextCatalog.setStrings('pt_BR', {'Admin <b class=\"caret\"></b>':'Admin<b class="caret"></b>','Groups':'Grupos','History':'Histórico','Logout':'Sair','Realtime':'Tempo real','Signed in as <user-name></user-name>\n                  &nbsp<a ng-href=\"#/logout\" translate=\"\">Logout</a>':'Logado como <user-name></user-name> & nbsp<a ng-href="#/logout" translate="">Sair</a>','Users':'Usuários'});
/* jshint +W100 */
}]);
