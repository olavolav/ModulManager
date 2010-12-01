/* Copyright 2009,2010 adiungi GmbH, http://www.adiungi.de
for licensing questions please refer to the README
Created by Christian Beulke, Van Quan Nguyen and Olav Stetter */


// Falls JavaScript funktioniert, die entspr. Warnung verstecken (OS)
$(document).ready(function(){
	$("#javascriptdoesnotwork").css("display","none");
});

var authenticityToken = function() {
    return $('#token').attr("content");
};

var authenticityTokenParameter = function(){
   return 'authenticity_token=' + encodeURIComponent(authenticityToken());
};
var update_schwerpunkt = function(s_id){
	
	if (!$(".schwerpunkt_oben[id="+s_id+"]").hasClass("active")) {
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

		$(".schwerpunkt_oben").attr("class","schwerpunkt_oben passive");
		// $(".backtomain").slideDown();
		$(".schwerpunkt_oben[id="+s_id+"]").attr("class","schwerpunkt_oben active");
		$("#serverwait").fadeOut();
	}
};

var update_pordnung = function(po_id){
	
	if (!$(".pruefungsordnung[id="+po_id+"]").hasClass("active")) {
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
	
		$(".pruefungsordnung").attr("class","pruefungsordnung passive");
		$(".pruefungsordnung[id="+po_id+"]").attr("class","pruefungsordnung active");
		// $(".backtomain").slideDown();
		$(".SPsubclass").hide();
		$(".SPsubclass[id=belongstoPOid"+po_id+"]").show();
		$("#serverwait").fadeOut();
	}
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
