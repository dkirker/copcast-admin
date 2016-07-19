angular.module('gettext').run(['gettextCatalog', function (gettextCatalog) {
/* jshint -W100 */
    gettextCatalog.setStrings('pt_BR', {"<b>WARNING</b>\n      &nbsp;&nbsp;|&nbsp;&nbsp;\n      This video does not have a location stamp, user was out of range when recording.":"<b>AVISO</b>\n      &nbsp;&nbsp;|&nbsp;&nbsp;\n      Este vídeo não possui uma localização, o usuário estava fora do alcance no momento.","<i class=\"glyphicon glyphicon-triangle-left\"></i>\n      Previous":"<i class=\"glyphicon glyphicon-triangle-left\"></i>\n      Anterior","<input type=\"checkbox\" ng-model=\"group.isAdmin\" i-check=\"\"> Is Admin?":"<input type=\"checkbox\" ng-model=\"group.isAdmin\" i-check=\"\"> É administrador?","<input type=\"checkbox\" ng-model=\"period\" i-check=\"\">\n        Period?":"<input type=\"checkbox\" ng-model=\"period\" i-check=\"\">\n        Período?","<input type=\"checkbox\" ng-model=\"user.isAdmin\" i-check=\"\"> Is Admin?":"<input type=\"checkbox\" ng-model=\"user.isAdmin\" i-check=\"\"> É Administrador?","Accident?":"Acidente?","Active officers":"Usuário ativos","Address:":"Endereço","Admin":"Admin","All Officers":"Exibir Todos","All fields are required.":"Todos os campos são obrigatórios.","Are you sure to delete this user?":"Você tem certeza que deseja excluir este usuário?","Are you sure you want to delete this group?":"Você tem certeza que deseja excluir este grupo?","Argument?":"Discussão?","Arrest?":"Voz de Prisão?","Audio is automatically disabled and available only on export.\n        <a href=\"javascript:;\" class=\"closeMe\" ng-click=\"closeMuteAlert()\"><i class=\"glyphicon glyphicon-remove\"></i></a>":"O áudio é desabilitado automaticamente e está disponível somente na exportação.\n        <a href=\"javascript:;\" class=\"closeMe\" ng-click=\"closeMuteAlert()\"><i class=\"glyphicon glyphicon-remove\"></i></a>","Audit Log":"Relatório de Auditoria","Audit Report":"Relatório de Auditoria","Back":"Voltar","Battery":"Bateria","Brand":"Marca","Citation?":"Multa?","Confirm New Password:":"Confirme Nova Senha:","Connection:":"Tipo de Conexão:","Copcast Data Log":"Relatório de Uso","Create User":"Criar Usuário","Created At":"Criado Em","Current Password:":"Senha Corrente:","Current password filed is empty.":"Senha atual está vazia","Data in the device:":"Dados no celular:","Data remaining to be uploaded from device":"Dados ainda armazenados no celular","Date":"Data","Date created":"Data de Criação","Date is not valid":"Data não é válida","Date is required":"Data é obrigatória","Date range":"Período","Date/Time:":"Data/Hora:","Date:":"Data:","Disabled":"Desabilitado","Email sent successfully":"Email enviado com sucesso","Email:":"Email:","Enabled":"Habilitado","End Time:":"Horário Final:","End date is not valid":"Data fina não é válida","Export date":"Data de Exportação","Export date:":"Data de Exportação:","Exported Videos":"Vídeos Exportados","Exported by":"Exportado por","Exporter:":"Usuário que Exportou:","Extra Information":"Informações Adicionais","Filter":"Filtro","Filter by user or group...":"Filtrar por usuário ou grupo…","Forgot Password?":"Esqueceu a senha?","From:":"De:","Go Back":"Voltar","Group":"Grupo","Group Type":"Tipo do Grupo","Group details":"Detalhes do Grupo","Group:":"Grupo:","Groups":"Grupos","History":"Histórico","Incident Report":"Relatório de Incidentes","Incident Reports":"Relatórios de Incidentes","Incidents Flagged":"Incidentes Marcados","Initial Time:":"Horário Inicial:","Invalid data range.":"Período Inválido","Invalid date range.":"Período Inválido.","Invalid date.":"Data inválida.","Invalid interval. Please check the date range.":"Período inválido. Verifique as datas selecionadas.","Is Admin?":"É Admin?","Is Enabled?":"Habilitado?","Latitude:":"Latitude:","Livestream":"Transmissão ao vivo","Loading...":"Carregando...","Logout":"Sair","Longitude:":"Longitude:","Name":"Nome","Name:":"Nome:","New Export":"Nova Exportação","New Video Export":"Nova Exportação","New group":"Novo grupo","Next\n      <i class=\"glyphicon glyphicon-triangle-right\"></i>":"Próximo\n      <i class=\"glyphicon glyphicon-triangle-right\"></i>","No battery information":"Sem dados da bateria","No data found...":"Nenhuma informação encontrada…","No data selected.":"Nenhuma informação selecionada.","No export found.":"Nenhuma exportação encontrada","No location data available for the selected interval":"Não há dados de localização para o intervalo selecionado","No location data or videos available for the selected interval":"Não há dados de localização ou vídeos para o intervalo selecionado","No video available for the selected interval":"Não há vídeos para o intervalo selecionado","Normal":"Normal","Not able to start streaming now. Try again later.":"Não foi possível iniciar a transmissão agora. Tente novamente mais tarde.","Number of Injured":"Número de Feridos","Number of flagged incidents":"Número de incidentes registrados","Number of hours of recorded footage (hh:mm)":"Número de horas de gravação (hh:mm)","Number of hours of streamed footage (hh:mm)":"Número de horas de transmissão (hh:mm)","Number of incidents":"Número de incidentes","Number of missions initiated":"Número de missões iniciadas","Number of personnel who accessed the system":"Número de pessoas que acessaram o sistema","Number of times mission was stopped":"Número de vezes que a missão foi interrompida","Overview":"Visão Geral","Password":"Senha","Password or password confirmation are empty.":"Senha ou nova senha estão vazias.","Preferred language:":"Língua preferencial:","Profile picture":"Foto do perfil","ROLE_TIP":"<b>Usuários nível 1 possuem permissão para:</b> <ol style=\"list-style-type: upper-roman;\"> <li>Registrar novos aparelhos no sistema;</li> <li>Ver localizações em tempo real;</li> <li>Ver localizações e mapas de calor no histórico;</li> <li>Ver transmissões de vídeos em tempo real (sem áudio, somente vídeo);</li> </ol> <b>Usuários nível 2 possuem também permissão para:</b> <ol style=\"list-style-type: upper-roman;\"> <li>Ver gravações no histórico (sem áudio, somente vídeo);</li>  <li>Acessar o relatório de auditoria;</li> <li>Criar usuários nível 1;</li> </ol> <b> Usuários nível 3 possuem também permissão para:</b> <ol style=\"list-style-type: upper-roman;\"> <li>Exportar gravações originais;</li> <li> Criar usuários nível 2;</li> </ol>","Real-time":"Tempo Real","Recorded By:":"Gravado por:","Recorded by":"Gravado em","Recording Date":"Data de Gravação","Recording Date:":"Data de Gravação:","Repeat your password:":"Repita sua senha:","Report\n        <small translate=\"\">from {{filter.fromDate  | date:\"dd/MM/yyyy\"}} to {{filter.toDate  | date:\"dd/MM/yyyy\"}}</small>":"Relatório\n        <small translate=\"\">de {{filter.fromDate  | date:\"dd/MM/yyyy\"}} até {{filter.toDate  | date:\"dd/MM/yyyy\"}}</small>","Reset Password":"Redefinir senha","Resistance?":"Houve Resistência","Return to video export list.":"Voltar para a lista de exportações","Role:\n              <a class=\"glyphicon glyphicon-question-sign\" data-toggle=\"popover\" data-placement=\"{{ isMobile ? 'top' : 'left'}}\" data-trigger=\"focus\" role=\"button\" tabindex=\"0\" title=\"Roles explanation\" data-content=\"{{ 'ROLE_TIP' | translate }}\" style=\"text-decoration: none\"></a>":"Perfil:\n              <a class=\"glyphicon glyphicon-question-sign\" data-toggle=\"popover\" data-placement=\"{{ isMobile ? 'top' : 'left'}}\" data-trigger=\"focus\" role=\"button\" tabindex=\"0\" title=\"Roles explanation\" data-content=\"{{ 'ROLE_TIP' | translate }}\" style=\"text-decoration: none\"></a>","Role:\n          <i class=\"glyphicon glyphicon-question-sign\" data-toggle=\"popover\" data-placement=\"{{ isMobile ? 'top' : 'left'}}\" data-trigger=\"click\" title=\"Roles explanation\" data-content=\"{{ 'ROLE_TIP' | translate }}\"></i>":"Perfil:\n          <i class=\"glyphicon glyphicon-question-sign\" data-toggle=\"popover\" data-placement=\"{{ isMobile ? 'top' : 'left'}}\" data-trigger=\"click\" title=\"Roles explanation\" data-content=\"{{ 'ROLE_TIP' | translate }}\"></i>","SIGN IN":"LOGAR","Search:":"Buscar:","Seen at:":"Visualizado em:","Select a date range to present related data.":"Selecione um período para apresentar dados relacionados.","Select a group or user":"Selecione um grupo ou usuário","Select a user or group":"Selecione um grupo ou usuário","Severity":"Severidade","Severity of incident":"Severidade do incidente","Signed in as":"Logado como","Something went wrong, please try again.":"Algo ocorreu errado. Por favor, tente de novo.","Start time":"Horário de Início","Status":"Status","Status:":"Status:","The email or password you entered doesn't match.":"O usuário ou a senha não são válidos.","The password and its confirmation don't match":"A senha e a confirmação não são iguais","There are no videos for the user and period chosen.":"Não existem vídeos para o usuário e período escolhidos.","This video has been deleted, or is unavailable.":"O vídeo foi excluído ou é inválido.","Time range":"Período:","To:":"Até:","Total Mission Time":"Tempo Total de Missões","Total recording time":"Tempo total em gravação","Total streaming time":"Tempo total em transmissão ao vivo","Total time paused":"Tempo total pausado","Total uploaded data<br><small>(compressed)</small>":"Total de dados transmitidos<br><small>(comprimidos)</small>","Traffic incidents reported":"Incidentes de tráfego reportados","Trying to send email...":"Tentando enviar email…","Type an valid email address":"Digite um endereço de email válido","Type of citation":"Tipo de multa","Type your email":"Digite seu email","Update":"Atualizar","Usage log\n            <span class=\"label label-default\" translate=\"\">grouped by day</span>":"Log de Uso\n            <span class=\"label label-default\" translate=\"\">Agrupado por dia</span>","Use Lethal Force?":"Uso de Força Letal?","Use of Force?":"Uso da Força?","User":"Usuário","User Management":"Gerenciamento de Usuários","User details":"Detalhes do Usuário","User is required":"Usuário é obrigatório","User name:":"Usuário:","User:":"Usuário:","Username":"Nome de usuário","Username:":"Nome de usuário:","Users":"Usuários","Video Export":"Exportação de Vídeos","Video URL":"Endereço do Vídeo","Video Watched:":"Vídeo Assistido:","Videos Exported":"Videos Exportados","Videos exported":"Vídeos exportados","Videos viewed":"Vídeos visualizados","View history":"Ver histórico","Viewed by":"Visualizado por","Viewing timestamp":"Início da visualização","We found no files for this export.":"Não encontramos arquivos para realizar esta exportação","Wrong password combination":"Combinação de senha errada","You do not have permission to access Copcast Admin":"Você não possui permissão para acessar o Copcast.","Your browser does not support videos.":"Seu browser não suporta vídeos","Your video(s) is being generated. You will receive an e-mail notification once the export is complete!":"Seu(s) vídeo(s) estão sendo gerados. Você receberá um e-mail notificando quando o processo finalizar!","action":"atividade","back":"voltar","can not stream right now.":"não é possível transmitir neste momento.","cancel":"cancelar","change password":"alterar senha","create new group":"criar novo grupo","create new user":"criar novo usuário","date":"data","delete":"excluir","delete group":"excluir grupo","delete user":"excluir usuário","disabled live streaming.":"desabilitar transmissão.","download exported files":"download dos vídeos exportados","edit":"editar","from {{filter.fromDate  | date:\"dd/MM/yyyy\"}} to {{filter.toDate  | date:\"dd/MM/yyyy\"}}":"de {{filter.fromDate  | date:\"dd/MM/yyyy\"}} até {{filter.toDate  | date:\"dd/MM/yyyy\"}}","group name":"nome do grupo","grouped by day":"agrupado por dia","has flagged an incident":"reportou um incidente","has paused the mission.":"pausou a missão.","has resumed the mission.":"iniciou a missão.","is no longer connected":"não está mais conectado","is requesting livestream":"solicitou a transmissão","to":"até","update group":"atualizar grupo","update user":"atualizar usuário","username":"nome do usuário","view":"visão","{{ collection.users.length }} Officers":"{{ collection.users.length }} Oficiais","{{ totalIncidents }} Incidents":"{{ totalIncidents }} Incidentes","NOT_LOGGED":"Não conectado","PAUSED":"Gravação interrompida","RECORDING_OFFLINE":"Missão iniciada - gravando vídeos localmente","RECORDING_ONLINE":"Missão iniciada - gravando vídeos localmente","RECORDING":"Missão iniciada - gravando vídeos localmente","STREAMING":"Missão iniciada - Transmitindo vídeos em tempo real","UPLOADING":"Enviando dados para o servidor","LOGGED":"Conectado","LOGGED_OFF":"Saiu da aplicação","IDLE":"Conectado","SEEN_VIDEO":"Usuário viu um vídeo do próprio celular.","LOGGED_ADMIN":"Usuário se conectou na interface administrativa","PLAYING_VIDEO":"Usuário viu um vídeo pela interface administrativa","AVAILABLE":"DISPONÍVEL","EXPIRED":"EXPIRADO","PENDING":"PENDENTE"});
/* jshint +W100 */
}]);