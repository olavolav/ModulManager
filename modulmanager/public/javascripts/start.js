
// Falls JavaScript funktioniert, die entspr. Warnung verstecken (OS)
$(document).ready(function(){
	$("#javascriptdoesnotwork").css("display","none");
});

var authenticityToken = function() {
    return $('#token').attr("content");
}

var authenticityTokenParameter = function(){
   return 'authenticity_token=' + encodeURIComponent(authenticityToken());
}
var update_schwerpunkt = function(s_id){
	
	$(".schwerpunkt_oben").attr("class","schwerpunkt_oben passive");
	
    // alert("hallo schwerpunkt "+s_id);

    $.ajax({
        type:"POST",
        url :"main/focus_selection",
        dataType:"text",
        cache:false,
        async:false,
        data:"id="+s_id+"&"+authenticityTokenParameter(),
        contentType:'application/x-www-form-urlencoded',
        error : function(a,b,c){
            alert ("AJAX-Fehler: update_schwerpunkt");
        }
    });
	
	$(".schwerpunkt_oben[id="+s_id+"]").attr("class","schwerpunkt_oben active");
}

var update_pordnung = function(po_id){
	
	$(".pruefungsordnung").attr("class","pruefungsordnung passive");

    // alert("hallo pruefungsordnung "+po_id);

    $.ajax({
        type:"POST",
        url :"main/version_selection",
        dataType:"text",
        cache:false,
        async:false,
        data:"version="+po_id+"&"+authenticityTokenParameter(),
        contentType:'application/x-www-form-urlencoded',
        error : function(a,b,c){
            alert ("AJAX-Fehler: update_pordnung");
        }
    });
	
	$(".pruefungsordnung[id="+po_id+"]").attr("class","pruefungsordnung active");
}
