
/*--------------POOL anzeigen---------------------------------------------------------*/
//				pool() wird in index.html aufgerufen
//              pool() ruft die poolrekursiv auf 
//              pool gibt XML-Datei zurück  
//              Diese Datei enthält folgende Funktionen: 
//					session_auswahl(),
//					drop_in_auswahl (),
//					ajax_to_server_by_add(),
//					ajax_to_server_by_remove(),
//					auswahlAnzeige(),
//					modulloeschen()
//
//--------------------------------------------------------------------------------------





// photo path

	var wahlpflichtbild = "<img src='images/Wahlpflicht.png' style='cursor:pointer'>";
	var pflichtbild     = "<img src='images/Pflicht.png' style='cursor:pointer'>";
	var wahlbild    = "<img src='images/Wahl.png' style='cursor:pointer' >";
	var fragebild     = "<img src='images/Fragezeichen.png' style='cursor:pointer'>";
	var ipunkt    = "<img src='images/iPunkt.png' style='cursor:pointer'>";
	var rote_ipunkt    = "<img src='images/Ausrufezeichen.png' style='cursor:pointer'>";
	var loeschenbild = "<img src='images/Loeschen.png' style='cursor:pointer; position:relative; top:-10px; left:10px'>";








///////////////////MODULLOESCHEN loeschen////////////////////////
/// bei Click auf <span class="modulloeschen">

var modulloeschen = function (mod_id){
	
	
	$("#semester-content").find("div#"+mod_id).each(function(){
			
			$(this).remove();	
	});

	
	
	// remove das Modul
	//$(div).remove();
	
	// verstecktes Modul in Pool wieder anzegen
	$("#pool").find("div").each(function(){
		
		var this_id = $(this).attr("id");
		if(this_id == mod_id){
			
			$(this).css("display","block");
			$(this).css("top","0px");
			$(this).css("left","0px");
			$(this).find("span.fragebild").css("display","block");
			$(this).find("span.ipunkt").css("display","none");
			$(this).find("span.noten").css("display","none");
			$(this).find("#icon_loeschen").css("display","none");
			
		}
		
	});
	
	//ajax aufrufen
	
	ajax_to_server_by_remove(mod_id);
	
	
	
	

}//ende





// session_auswahl() implementieren. Die ruft action abfragen/auswahl per AJAX auf


var session_auswahl_rekursiv = function(root){
	
	//var semester = $(root).find("semester");
	var sem_content = $("#semester-content");
	
	
	
	 $(root).children().each( function(){
	 	
		var knoten_name = this.nodeName;
		
		
		
		
		
		// check Blätter
		if (knoten_name == "module"){
			
			// parent besuchen, parent_id ist semmester-count
			var parent = $(this).parent().get(0);
			var parent_id = $(parent).attr("count");   
			
			// modul_inhalt von  POOL in AUwahl kopieren.
			// d.h: suche nach Modul_id in POOL. Dann verändere das Inhalt von pool_modul COPY mit clone()
			// danach mach auswahl_modul draggble
			
			var mod_id = $(this).attr("id");
			
			$("#pool").find("div#"+mod_id).each(function(){
				
				var this_copy = $(this).clone(true);
				// display versteckte <span> in Pool-Modul, und remove andere 
	
				$(this_copy).find("div#icon_loeschen").css("display","block");
				$(this_copy).find("span.modul_short").css("display","block");
				$(this_copy).find("span.fragebild").css("display","none");
				$(this_copy).find("span.ipunkt").css("display","block");
				$(this_copy).find("span.noten").css("display","block");
				
				/*$(this).find("div#icon_loeschen").css("display","block");
				$(this).find("span.modul_short").css("display","block");
				$(this).find("span.fragebild").css("display","none");
				$(this).find("span.ipunkt").css("display","block");
				$(this).find("span.noten").css("display","block");*/
		
				var modul_inhalt = $(this_copy).html();
				
				$(sem_content).find("div.semester").each(function(){
					var x= $(this).attr("id");
				
					if (parent_id == x){
						$(this).append("<div class='auswahl_modul'>"+modul_inhalt+"</div>");
					}
				});//ende each intern
				
				
				// Pool akktuallisieren, also THIS verstecken
					
				$(this).hide();
				
			});//ende each
			
			return;
		}// ende Blätter
		
		//check semester
		else  if ( knoten_name == "semester"){
		 	
			var sem_id = $(this).attr("count");
			
			$(sem_content).append("<div class='semester' id='"+sem_id+"'>"+
										"<div class='subsemester'>"+
											"<h5>"+sem_id+".Semester"+"</h5>"+
										"</div>"+
										
								  "</div>");
			
		}
		
		session_auswahl_rekursiv(this);
		
		
		
	});//ende each
	
	// hier mache den Semester-Box droppable und bei Drop rufe die funktion drop_in_auswahl auf
	auswahl_droppable(".semester",".auswahl_modul");
}//ende 




//session_auswahl------------------------------------------------------------------------------------------

var session_auswahl = function (){
	
	
	var XML = $.ajax({
		
		type : 'GET',
		url  : 'abfragen/auswahl',
		async: false,
	    contentType: 'application/x-www-form-urlencoded',
		error : function(a,b,c){
			
			alert("error mit abfragen/auswahl");
		}
		
		}).responseXML;
		
	
		
	var root = XML.documentElement;
	
	
	// rekursiv aufrufen und semester-content am Anfang leeren
	var sem_content = $("#semester-content");
	sem_content.empty();
	session_auswahl_rekursiv(root);
	
	
	
	
	
	
				
	
	
	
	
}//ende 










//   AJAX zum Server---------------------------------------------------------------------	


var ajax_to_server_by_add = function (modul_id,semester){
	
	$.ajax({
							
            type: 'POST',
			url  : 'http://localhost:3000/abfragen/add_module_to_selection',
			cache:false,
            dataType:'xml',
            async :true,
			data  : "mod_id="+modul_id+"&"+"sem_count="+semester,
			contentType:'application/x-www-form-urlencoded',
			//error :  function (a,b,c){
			//	alert("problem with add_module_to_selection");
			//}
			
     });//ende Ajax

	
	
}

	
var ajax_to_server_by_remove = function (modul_id){
	
	$.ajax({
							
            type: 'POST',
			url  : 'abfragen/remove_module_from_selection',
			cache:false,
            dataType:'xml',
            async :false,
			data  : "mod_id="+modul_id,
			contentType:'application/x-www-form-urlencoded',
			//error :  function (a,b,c){
			//	alert("problem with remove_module_from_selection");
			//}
			
     });//ende Ajax

	
	
}// ende



var ajax_to_server_by_remove_semester = function (sem_count){
	
	$.ajax({
			
			type: 'POST',
			url : 'abfragen/remove_semester_from_selection',
			cache : false,
			async : false,
			data  : "sem_count="+sem_count,
			contentType:'application/x-www-form-urlencoded',
			error : function (a,b,c){
				alert("problem with abfragen/remove_semester_from_selection");
			}
		
	});
	
	
}



//----------------------------



var auswahlAnzeige = function (modul_id,semester,modulinhalt){
	
		//$("<div class='auswahl_modul'>Bitte warte</div>").appendTo($("#"+semester+" .subsemester")).fadeIn("fast").fadeOut("slow");
							
		$("#"+semester+" .subsemester").append("<div class='auswahl_modul' id='"+modul_id+"'>"
														+modulinhalt+
													// "<div class='LVS' style='margin-left:150px' >"
													// 	+"<select style='width:200px'>"
													// 	
													// 		+"<option>Hallo LVS<option>"
													// 		
													// 	+"</select>"+
													"</div>"
												+"</div>");
		$(".auswahl_modul").draggable({
			revert : "invalid"
			
		});
		
}//ende auswahlAnzeige


// DROP in Auswahl

var drop_in_auswahl = function (modul_id,semester,ui_draggable,this_semester){
	
	// pool_modul bei Drop in Auswahl verstecken
	
	    $(ui_draggable).hide();
		
		
	// wartezeit anzeigen
	
		$('<div class="quick-alert">Bitte warten!</div>')
			 .appendTo($(this_semester))
			 .fadeIn("fast")
			 .animate({opacity:1.0},3000)
			 .fadeOut("fast",function(){
			 	$(this).remove();
		 });
		 
	
	
	// vesteck (leer) in erstem Semester
				
		$(this_semester).find(".subsemester span.leer").css("display", "none");
		
	// display versteckte <span> in Pool-Modul, und remove andere 
	
		$(ui_draggable).find("div#icon_loeschen").css("display","block");
	
	 	$(ui_draggable).find("span.modul_short").css("display","block");
		$(ui_draggable).find("span.fragebild").css("display","none");
		$(ui_draggable).find("span.ipunkt").css("display","block");
		$(ui_draggable).find("span.noten").css("display","block");
		
		
	// verändertte modul_inhalten auslesen
	
		var modulinhalt = $(ui_draggable).html();
		
		
			
	// Pool akktuallisieren
					
		$("#pool").find("div").each(function(){
			var this_id = $(this).attr("id");
			
			if (this_id == modul_id) {
				
				$(this).hide();
				
			}				
		});
						
	// DATEN mit modul_id und semester zum Server(action add_module_to_selection) schicken 
			
		ajax_to_server_by_add(modul_id,semester); 
			
	// modul in Auswahl anzeigen
			
		auswahlAnzeige(modul_id,semester,modulinhalt);
		 
}//ende drop in auswahl


//-----Drop in POOL--------------------------------------------------------------------------


var drop_in_pool = function(mod_id,ui_draggable){
	
	$(ui_draggable).remove();
	
	// TOp und Left des Modul auf Null zurücksetzen, damit sich das Modul wieder in POOL an den richtigen Ort befindet
	
	$("#pool").find("div").each(function(){
		
		var this_id = $(this).attr("id");
		if(this_id == mod_id){
			
			$(this).css("display","block");
			$(this).css("top","0px");
			$(this).css("left","0px");
			$(this).find("span.fragebild").css("display","block");
			$(this).find("span.ipunkt").css("display","none");
			$(this).find("span.noten").css("display","none");
			$(this).find("#icon_loeschen").css("display","none");
		}
		
	});
	
	//ajax aufrufen
	
	ajax_to_server_by_remove(mod_id);
}//ende





		
//----Poolrekursive implementieren-------------------------------------------------------


//poolrekursive()  implementieren

var poolrekursiv = function(root){
	
	// nach kinder suchen
			
	$(root).children().each(function(){
				
		var knoten_name=this.nodeName;
		
		if (knoten_name == "category") {
		 	
			var category_id   = $(this).attr("category_id");
			var category_name = $(this).attr("name");
			var parent = $(this).parent().get(0);
			var parent_name = parent.nodeName;
			
			// check ob seine Kinder Module sind. Wenn ja dann toggle kinder
			var kinder = $(this).children()[0];
			var namen  = kinder.nodeName;
		
			//check nach Schwerpunkt und Bachelor,also 1.te Ebene
			if (parent_name == "root"){
				
				$("#pool").append("<div class='pool_category' id='" + category_id + "'>" +

									">"+ "<a>"+category_name +"</a>"+ 
						 
						 		"</div>");
								
				// hier noch mal :check ob seine Kinder Module sind. Wenn ja dann toggle kinder
				
				if(namen == "module"){
					
					$("#pool").append("<script>$(function(){ $(\"#"+category_id+" a\").live('click', function(){ $(\"#"+category_id+" .pool_modul\").slideToggle('slow');  });    })</script>");
					
				}				
				
			}//ende Schwerpunkt
		
			else{
			
				// suche parend_id in #pool
				
				var parent_id   = $(parent).attr("category_id");
				
				$("#pool #"+parent_id).append("<div style='margin-left:5px;' class='pool_category'  id='" + category_id + "'>" +
												
												 ">"+category_name +
												 
												"</div>");
			
				// hier noch mal :check ob seine Kinder Module sind. Wenn ja dann toggle kinder	
				
				
				
   				if(namen == "module"){
					
					$("#pool").append("<script>$(function(){ $(\"#"
							+category_id+
						"\").live('click', function(){ $(\"#"+category_id+" .pool_modul\").slideToggle('slow'); "+
													" });    })</script>");
					
				}				
							
			
			}//ende else für andere Kategorie
		
		
		//rekursiv
		poolrekursiv(this);
		
	}
		
	else if (knoten_name == "module"){
			
			
			var parent      = $(this).parent().get(0);
			var parent_name = $(parent).attr("name");
			var parent_id   = $(parent).attr("category_id");
			
			
			var modul_name = $(this).find("name").text();
			var modul_mode = $(this).find("mode").text();
			var credits = $(this).find("credits").text();
			var modul_short = $(this).find("short").text();
			
			var modul_id = $(this).attr("id");
			
			//check Modul_ART : Pflicht? WP?
			var bild;
			if(modul_mode == "p"){
				
				bild = pflichtbild;
			}
			else {
				
				bild = wahlpflichtbild;
			}
							
			$("#pool #"+parent_id).append("<div class='pool_modul' id='" + modul_id + "' >" +
						"<div id='icon_loeschen' style='display:none; cursor:pointer; float:right; width:20px;height:0px;overflow:visible;' onclick='modulloeschen("+modul_id+")'>"+
							loeschenbild+
						"</div>"+
						
						"<table style='font-size: 12px; width: 100%; border:1px;'>" +
							"<tbody>"+
								"<tr>" +
									"<td style=' width:22px '>"+ 
										bild+
									"</td>" +
									"<td style=' width:99%'>" +
										"<span'>"+modul_name+"</span>"+
										
									"</td>"+
									// Kurzbezeichnung raus aus der Auswahl (OS)
									// "<td style=' width:20%'>" +
									// 	"<span class='modul_short' style='display:none'>"+"("+modul_short+")"+"</span>"+
									// 	
									// "</td>"+
									
									"<td style=' width:22px; '>" +
										"<span class='fragebild' style='display:block'>"+ 
											fragebild+ 
										"</span>"+
									
									"</td>"+
									
									"<td style=' width:22px'>"+
										"<span class='noten' style='display:none'>"+
											"<input type='text' size='2' value='note' />"+
											
										"</span>"+
									"</td>"+
									
									"<td style=' width:22px'>"+
										"<span class='ipunkt' style='display:none'>"+ipunkt+"</span>"+
									"</td>"+
									
									"<td style='min-width:32px;text-align:right;font-weight:bold'>"+
											credits +" C"+
									"</td>" +
								"</tr>" +
							"</tbody>"+
						"</table>" +
						"</div");
							
							
						// pool_modul beweglich
							
						$(".pool_modul").draggable({
							
							revert : "invalid", 
							helper : "clone"
							
							
							
						});
						// noten focus
						$("input").focus(function(){
			
							$(this).attr("value"," ");
			
						});
		
						
						// pool_ modul am Anfang verstecken mit hide()
						
						//$("#pool #"+parent_id+" .pool_modul").hide();
						
						
							
			
			
		
		
			return;
		}//ende check Module

	
	
	
 });// ende nach Children
	
}//ende poolrekursiv


//POOL-Funktion gibt immer ganzen Module im POOL zurück, 
//und ruft AJAX auf  ------------------------------

		
var pool = function(){

	var XML = $.ajax({

	    type: 'GET',
	    url: 'http://localhost:3000/abfragen/pool',
	    async: false,
	    contentType: 'application/x-www-form-urlencoded'
		
	


   }).responseXML; //ende AJAX

    var root = XML.documentElement;
	
	//aktuellePoolXml=XML;
	
	
    poolrekursiv(root);
	session_auswahl();


}//ende pool


		


