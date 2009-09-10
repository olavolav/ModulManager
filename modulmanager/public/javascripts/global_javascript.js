
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
	
		//$("<div class='auswahl_modul'>Bitte warte</div>").appendTo($("#"+semester+" .subsemester")).fadeIn("fast").fadeOut("slow");
							
		$("#"+semester+" .subsemester").append("<div class='auswahl_modul' id='"+modul_id+"'>"
														+modulinhalt+
													"<div class='LVS' style='margin-left:150px' >"
														+"<select style='width:200px'>"
														
															+"<option>Hallo LVS<option>"
															
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
	
	//var children = $(root).children();
	//var laenge   = children.length;

	// nach kinder suchen
			
	$(root).children().each(function(){
				
				
			
		var knoten_name=this.nodeName;
		
		if (knoten_name == "module"){
			
			var parent      = $(this).parent().get(0);
			var parent_name = $(parent).attr("name");
			var parent_id   = $(parent).attr("category_id");
			
			
			var modul_name = $(this).find("name").text();
			
			var credits = $(this).find("credits").text();
			var mudul_short = $(this).find("short").text();
			var modul_id = $(this).attr("id");
							
			$("#pool #" +parent_id).append("<div class='pool_modul' id='" + modul_id + "'>" +
							"<table style='font-size: 12px; width: 100%'>" +
								"<tr>" +
									"<td style=' width:10% '>" 
										+pflichtbild+
									"</td>" +
									"<td style=' width:69% '>" +
										modul_name +
									"</td>" +
									"<td width:10%>" +"<a href = \"javascript:void(0)\" onclick = \"document.getElementById('light').style.display='block';document.getElementById('fade').style.display='block'\">"
										+fragebild +"</a>"+
									"</td>" +
									"<td style=' width:10%; font-weight:bold '>" +
										credits +
									"</td>" +
								"</tr>" +
							"</table>" +
							"</div");
							
							
							
							$(".pool_modul").draggable({
							
								revert: "invalid"
							});
							
			
			
		
		
			return;
		}//ende check Module
		
		
	
		 else if (knoten_name == "category") {
		 	
			
			var category_id   = $(this).attr("category_id");
			var category_name = $(this).attr("name");
			var parent = $(this).parent().get(0);
			var parent_name = parent.nodeName;
		
			//check nach Schwerpunkt und Bachelor,also 1.te Ebene
			if (parent_name == "root"){
				
	
				$("#pool").append("<div class='pool_category' id='" + category_id + "'>" + category_name + "</div>");
			
			}//ende Scherpunk
		
			else if (parent_name == "category"){
			
				// suche parend_id in #pool
				
				var parent_id   = $(parent).attr("category_id");
				
				$("#pool #"+parent_id).append("<div class='pool_category' id='" + category_id + "'>" + category_name + "</div>");
			
			}//ende else für andere Kategorie
		
		
		//rekursiv
		poolrekursiv(this);

	}//ende else category
	
	
 });// ende nach Children
	
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
	
	//aktuellePoolXml=XML;
	
	
    poolrekursiv(root);


}//ende pool






		


