var update_schwerpunkt = function(s_id){
	
	$(".schwerpunkt_oben").css("background","white");

    alert("hallo schwerpunkt "+s_id);

    $.ajax({
        type:"POST",
        url :"main/focus_selection",
        dataType:"text",
        cache:false,
        async:false,
        data:s_id,
        contentType:'application/x-www-form-urlencoded',
        error : function(a,b,c){
            alert ("error mit update_schwerpunkt");
        }
    });
	
	$(".schwerpunkt_oben[id="+s_id+"]").css("background","#d8eef7");
}
