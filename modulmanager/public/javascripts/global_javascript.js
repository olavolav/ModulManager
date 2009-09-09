
/*--------------POOL anzeigen---------------------------------------------------------*/
//--------------pool() wird in index.html aufgerufen------------------------------------
//              pool() ruft die poolrekursiv auf---------------------------------------- 
//              pool gibt XML-Datei zurück----------------------------------------------   
//              trim() entleert Leerzeichen
//              umwandeln() wandert &uuml; in Form ue usw.      
//
//--------------------------------------------------------------------------------------


// photo path

	var wahlpflichtbild = "<img src='images/Wahlpflicht.png' style='cursor:pointer'>";
	var pflichtbild     = "<img src='images/Pflicht.png' style='cursor:pointer'>";
	var wahlbild    = "<img src='images/Wahl.png' style='cursor:pointer' >";
	var fragebild     = "<img src='images/Fragezeichen.png' style='cursor:pointer'>";
	var ipunkt    = "<img src='images/iPunkt.png' style='cursor:pointer'>";




var trim = function (satz){
	
	var neusatz = satz.toString();
	var tmp=[];
	var newArray;
	var laenge=neusatz.length;
	
	for (i=0; i<laenge; i++){
		
		sub=neusatz.substr(i,1);
		if (sub !=" "){
			
			tmp.push(sub);
		}
	
	}
	
	newArray=tmp.join("");
	return newArray;
	
}


var umwandeln = function(satz){

	var neusatz = satz.toString();
	var klein = neusatz.toLowerCase();
	var suche = klein.search(/&.+/);
	var ergebnis = "nicht";
	
	if (suche != -1) {
	
		var pos = klein.indexOf("&");
		var umlaut = klein.substr(pos,6); // &uuml; 
		
		switch (umlaut) {
		
			case "&uuml;":
				ergebnis = klein.replace(/&uuml;/g, "ue");
				break;
				
			case "&ouml;":
				ergebnis = klein.replace(/&ouml;/g, "oe");
				break;
				
			case "&auml;":
				
				ergebnis = klein.replace(/&auml;/g, "ae");
				break;
				
			default:
				break;
				
		}
		return ergebnis;
	}//ende if
	else {
		return neusatz;
	}
	
	
}



//   AJAX zum Server---------------------------------------------------------------------	
var ajax_to_server_by_add = function (modul_id,semester){
	
	$.ajax({
							
            type: 'POST',
			url  : 'http://localhost:3000/abfragen/add_module_to_selection',
			cache:false,
            dataType:'xml',
            async :false,
			data  : "mod_id="+modul_id+"&"+"sem_count="+semester,
			contentType:'application/x-www-form-urlencoded',
			error: function(a, b, c){
			
				alert("Erorr");
				
			}
     });//ende Ajax

	
	
}

	
var ajax_to_server_by_remove = function (modul_id){
	
	$.ajax({
							
            type: 'POST',
			url  : 'http://localhost:3000/abfragen/remove_module_from_selection',
			cache:false,
            dataType:'xml',
            async :false,
			data  : "mod_id="+modul_id,
			contentType:'application/x-www-form-urlencoded',
			error: function(a, b, c){
			
				alert("Erorr");
				
			}
     });//ende Ajax

	
	
}



var auswahlAnzeige = function (modul_id,semester,modulinhalt){
		
							
		$("#"+semester+" .subsemester").append("<div class='auswahl_modul' id='"+modul_id+"'>"
														+modulinhalt+
													"<div class='LVS' style='margin-left:150px' >"
														+"<select style='width:200px'>"+
															"<option>Hallo LVS<option>"
														+"</select>"+
													"</div>"
												+"</div>");
		$(".auswahl_modul").draggable({
			revert : "invalid"
			
		});
		
}//ende auswahlAnzeige




//----Poolrekursive implementieren-------------------------------------------------------


//poolrekursive()  implementieren--------------------------------------------------------

var poolrekursiv = function(root){
	
	   var allchildren = $(root).children();
	   var laenge      = allchildren.length;  
	   
	   // durchsuche alle Kinder von root  
	   
	   $(root).children().each(function(){
	   	
			// check ob Modul oder Kategory
			
			var tagname=this.nodeName;
			
			//if check category----------------------------------------------------------
			
			if (tagname=="category"){
				
				var parent_name = $(this).parent().get(0).nodeName;
				var parent      = $(this).parent().get(0);
				
				//check root
				
				if (parent_name == "root") {
					
					
					var category_name = $(this).attr("name");
					$("#pool").append("<div class='pool_category' id='"+trim(umwandeln(category_name))+"'>" + category_name + "</div>");
					
				}//ende if check root
				
				else {
					
					
					var category_name = $(this).attr("name");
					var parent = $(this).parent().get(0);
					var parent_name = trim(umwandeln($(parent).attr("name")));
					$("#pool"+" #"+parent_name).append("<div class='pool_category' id='"+trim(umwandeln(category_name))+"'>" + category_name + "</div>");
					
				}
				
				// rekursiv 
				poolrekursiv(this);
				
			} // ende if check category
			
			
			// else check modul------------------------------------------------------------
			
			else {
				
				var modul_name= $(this).find("name").text();
				var credits   = $(this).find("credits").text();
				var mudul_short     = $(this).find("short").text();
				var modul_id     = $(this).find("id").text();
				var parent    = $(this).parent().get(0);
				var parent_name = trim(umwandeln($(parent).attr("name")));
				
				// suche nach parent_id ( also neue ID) im Pool
				
				$("#pool"+" #"+parent_name).append("<div class='pool_modul' id='"+modul_id+"'>"
														+"<table style='font-size: 12px; width: 100%'>"
															+"<tr>"
																+"<td style=' width:10% '>"
																	+pflichtbild
																+"</td>"
																+"<td style=' width:69% '>"
																	+modul_name
																+"</td>"
																+"<td width:10%>"
																	+fragebild
																+"</td>"
																+"<td style=' width:10%; font-weight:bold '>"
																	+credits
																+"</td>"
															+"</tr>"
														+"</table>"
													+"</div>");
				
				$(".pool_modul").draggable({
					
					revert : "invalid"
				});
				return;
			}
			
		});// ende Each für alle category

}//ende poolrekursiv




////////POOL-Funktion gibt immer ganzen Module im POOL, und ------------------------------

		
var pool = function(){

	var XML = $.ajax({

	    type: 'GET',
	    url: 'http://localhost:3000/abfragen/pool',
	    async: false,
	    contentType: 'application/x-www-form-urlencoded',
		error: function(a, b, c){
	            alert('Error');
	    }
	


   }).responseXML; //ende AJAX

    var root = XML.documentElement;
	
	aktuellePoolXml=XML;
	
	
    poolrekursiv(root);


}//ende pool






		


