var update_schwerpunkt = function(s_id){
	
	$(".schwerpunkt_oben").attr("class","schwerpunkt_oben passive");
	
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
        data:"version="+po_id,
        contentType:'application/x-www-form-urlencoded',
        error : function(a,b,c){
            alert ("error mit update_pordnung");
        }
    });
	
	$(".pruefungsordnung[id="+po_id+"]").attr("class","pruefungsordnung active");
}
