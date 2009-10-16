var update_schwerpunkt = function(s_id){
	
	$(".schwerpunkt_oben").css("background","white");
	
    // alert("hallo schwerpunkt "+s_id);

    $.ajax({
        type:"POST",
        url :"main/focus_selection",
        dataType:"text",
        cache:false,
        async:false,
        data:"id="+s_id,
        contentType:'application/x-www-form-urlencoded',
        error : function(a,b,c){
            alert ("error mit update_schwerpunkt");
        }
    });
	
	$(".schwerpunkt_oben[id="+s_id+"]").css("background","#d8eef7");
}

var update_pordnung = function(po_id){
	
	$(".pruefungsordnung").css("background","white");

    // alert("hallo pruefungsordnung "+po_id);

    $.ajax({
        type:"POST",
        url :"main/version_selection",
        dataType:"text",
        cache:false,
        async:false,
        data:"version="+po_id,
        contentType:'application/x-www-form-urlencoded',
        error : function(a,b,c){
            alert ("error mit update_pordnung");
        }
    });
	
	$(".pruefungsordnung[id="+po_id+"]").css("background","#d8eef7");
}
