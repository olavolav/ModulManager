/* Copyright 2009,2010 adiungi GmbH, http://www.adiungi.de
for licensing questions please refer to the README
Created by Christian Beulke, Van Quan Nguyen and Olav Stetter */

$(document).ready(function(){
  // Falls JavaScript funktioniert, die entspr. Warnung verstecken (OS)
	$("#javascriptdoesnotwork").css("display","none");
	
  // An die PO- und SP-Auswahl-Radiobuttons die jew. Aktualisierungs-Funktionen knüpfen
	$("#pruefungsordnung input:radio").change( function() {
	  update_pordnung( $(this).attr("id") );
	});
	$("#schwerpunkt input:radio").change( function() {
    update_schwerpunkt( $(this).attr("id") );
	});

});

var authenticityToken = function() {
  return $('#token').attr("content");
};

var authenticityTokenParameter = function(){
   return 'authenticity_token=' + encodeURIComponent(authenticityToken());
};

function update_schwerpunkt(s_id) {
  // alert("hallo schwerpunkt "+s_id);
  $("#serverwait").show();
  $.ajax({
    type:"POST",
    url :"main/focus_selection",
    dataType:"text",
    cache:false,
    async:false,
    data:"id="+s_id+"&"+authenticityTokenParameter(),
    contentType:'application/x-www-form-urlencoded',
    error: function(XMLHttpRequest, textStatus, errorThrown) {
    	ajax_serverupdate_on_AJAX_warning("textStatus="+textStatus+",fn=update_schwerpunkt");
    }
  });
  $("#serverwait").fadeOut();
};

function update_pordnung(po_id) {
  // alert("hallo pruefungsordnung "+po_id);
  $("#serverwait").show();
  $.ajax({
    type:"POST",
    url :"main/version_selection",
    dataType:"text",
    cache:false,
    async:false,
    data:"version="+po_id+"&"+authenticityTokenParameter(),
    contentType:'application/x-www-form-urlencoded',
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			ajax_serverupdate_on_AJAX_warning("textStatus="+textStatus+",fn=update_pordnung");
		}
  });
  $("#schwerpunkt .SPsubclass").hide();

  // Schwerpunkt-Radio-Button zurück setzen
  $("#schwerpunkt .SPsubclass[id=belongstoPOid"+po_id+"] input[id=-1]").attr("checked","checked");

  $("#schwerpunkt .SPsubclass[id=belongstoPOid"+po_id+"]").show();
  $("#serverwait").fadeOut();
};

var ajax_serverupdate_on_AJAX_warning = function(text){
		// alert("ajax_serverupdate_on_AJAX_warning: start, text="+text);
    $.ajax({
        type: "POST",
        url : "abfragen/submit_AJAX_warning_to_log",
        dataType: "text",
        cache: false,
        async: true,
				timeout: 2500,
        data:"text="+text+"&"+authenticityTokenParameter(),
        contentType:'application/x-www-form-urlencoded',
				success: function() {
					alert("AJAX-Warnung: Die letzte Aktion konnte nicht gespeichert werden. "+
						"Das ModulManager-Team wurde unterrichtet, und wir werden uns so schnell "+
						"wie möglich um das Problem kümmern.");
					alert("debug="+text);
				},
        error: function(XMLHttpRequest, textStatus, errorThrown){
            alert ("AJAX-Fehler: Die Verbindung mit dem Server ist fehl geschlagen. "+
						"Bitte überprüfen Sie Ihre Netzwerk-Verbindung.");
						alert("debug="+text+", textStatus2="+textStatus);	
        }
    });
};
