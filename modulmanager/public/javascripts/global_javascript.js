
/*--------------POOL anzeigen---------------------------------------------------------*/
//				pool() wird in index.html aufgerufen
//              pool() ruft die poolrekursiv auf 
//              pool gibt XML-Datei zur�ck  
//              Diese Datei enth�lt folgende Funktionen: 
//					session_auswahl(),
//					drop_in_auswahl (),
//					ajax_to_server_by_add(),
//					ajax_to_server_by_remove(),
//					auswahlAnzeige(),
//					modulloeschen()
//
//--------------------------------------------------------------------------------------





// photo path

	var wahlpflichtbild = "<img src='images/Wahlpflicht.png'>";
	var pflichtbild     = "<img src='images/Pflicht.png'>";
	var wahlbild    = "<img src='images/Wahl.png'>";
	var fragebild     = "<img src='images/Fragezeichen.png'>";
	var ipunkt    = "<img src='images/iPunkt.png'>";
	var rote_ipunkt    = "<img src='images/Ausrufezeichen.png'>";
	var loeschenbild = "<img src='images/Loeschen.png' style='position:relative; top:-5px; left:6px;'>";
	var pfeil_rechts = "<img src='images/Pfeil-Rechts.png' style='padding-right:3px;'>";
	var pfeil_unten = "<img src='images/Pfeil-Unten.png' style='padding-right:3px;'>";
	var warten_weiss = "<img src='images/Warten-HintergrundWeiss.gif' style='padding-right:3px;'>";
	var warten_blau = "<img src='images/Warten-HintergrundBlau.gif' style='padding-right:3px;'>";
	var warten_beige = "<img src='images/Warten-HintergrundBeige.gif' style='padding-right:3px;'>";




// implementieren die Funktion pfeil_tauschen()
//die wird in pool_rekursiv() benutzt

var pfeil_tauschen = function(category_id){
	alert("drin");
	
}

// Anzeigen bzw. verstecken der anf�nglichen Hilfe und der Navigations-Kn�pfe
var show_navi = function(){
	$("#navi_optional").slideDown();
	$("#navimovedown").toggle()
	$("#navimoveup").show()
}
var hide_navi = function(){
	$("#navi_optional").slideUp();
	$("#navimovedown").show()
	$("#navimoveup").hide()
}


///////////////////MODULLOESCHEN loeschen////////////////////////
/// bei Click auf <span class="modulloeschen">

var modulloeschen = function (mod_id){

	
	$("#semester-content div.semester").find("div#"+mod_id).each(function(){
		
			
			//$(this).hide();
			
			// ver�ndere css style
			//alert("hallo modulloeschen");
			$(this).find("span.fragebild").css("display","block");
			$(this).find("span.ipunkt").css("display","none");
			$(this).find("span.noten").css("display","none");
			$(this).find("#icon_loeschen").css("display","none");
			$(this).attr("class","pool_modul");
			
			var this_id = $(this).attr("id");
			var this_modul = $(this);
			// ersmal hide
			$(this_modul).hide();
			// suche nach mod_id_parent im Pool
			
			$("."+this_id+"_parent").each(function(){
				
				
			
				//var this_parent = $(this).parent().get(0);
				var this_text = $(this).text();
				//alert(this_text);
				if(this_text==""){
					
					var das_span = $(this_modul).find("span.imAuswahl");
					$(das_span).text("nein");
					
				
					$(this).append(this_modul);
					
					
					// check den Vater-Kategory, ob der gerade offen ist
					var the_father = $(this).parent().get(0);
					$(the_father).find(".pool_modul,.pool_modul.ui-draggable").each(function(){
						
						var this_display = $(this).css("display");
						if(this_display=="block"){
							$(this_modul).show();
						}
					});
					
					
				}// ende if leer
				else{
					//alert("nicht leer");
					// remove this_modul weil das Original ist schon da
					//$(this_modul).remove();
					var this_span = $(this).find("span.imAuswahl");// this hier ist mod_id_parent
					var the_other_modul=$(this).find("#"+mod_id);
					$(this_span).text("nein");
					// check den Vater-Kategory, ob der gerade offen ist
					var the_father = $(this).parent().get(0);
					$(the_father).find(".pool_modul,.pool_modul.ui-draggable").each(function(){
						
						var this_display = $(this).css("display");
						if(this_display=="block"){
							$(the_other_modul).css("display","block");
						}
					});
					
				}
			});
			
	});
	

	//ajax aufrufen
	
	ajax_to_server_by_remove(mod_id);
	
	
}//ende





// session_auswahl() implementieren. Die ruft action abfragen/auswahl per AJAX auf


var session_auswahl_rekursiv = function(root){
	
	var sem_content = $("#semester-content");
	
	$(root).children().each( function(){
	 	
		var knoten_name = this.nodeName;
		
		// check Bl�tter
		if (knoten_name == "module"){
			
			var parent = $(this).parent().get(0);
			var parent_id = $(parent).attr("count");   	
			
			// entsprechenem  modul_id im Pool suchen, dann clonen ins Auswahl
			// dann verstecken die originalen Module im Pool
			//
			
			var mod_id = $(this).attr("id");
			
			//suche im Pool
			
			var modul_im_pool = $("#pool").find("div#"+mod_id);
			var das_erste = $(modul_im_pool).eq(0);
			
			// die originalen Module verstecken
			//und den span.imAuswahl auf "ja" setzen
			//und alle vor dem Clone 
			var auswahl_modul_clone=$(das_erste).clone(true);

			$(modul_im_pool).each(function(){
				
				$(this).hide();
				$(this).find("span.imAuswahl").text("ja");
				
			});
			
			
			// ver�ndern erstmal die interne im Modul bei dem Clone
			//besonders hat die Klone die class "auswahl_modul_clone"
			//zur Indentifizierung bei alle erster Ver�nderung im Auswahl 
			
						
			$(auswahl_modul_clone).attr("class","auswahl_modul_clone");
			$(auswahl_modul_clone).find("div#icon_loeschen").css("display","block");
			$(auswahl_modul_clone).find("span.fragebild").css("display","none");
			$(auswahl_modul_clone).find("span.ipunkt").css("display","block");
			$(auswahl_modul_clone).find("span.noten").css("display","block");
			$(auswahl_modul_clone).find("span.imAuswahl").text("ja");
			
			// reinstecken das Klone im Auswahl
			$(sem_content).find("div.semester").each(function(){
				var x= $(this).attr("id");
			
				if (parent_id == x){
					
					$(this).find(".subsemester").append(auswahl_modul_clone);
					
				}
			});//ende each intern
			
			
		
			return;
		}// ende Bl�tter
		
		
		
		
		
		//check semester
		else  if ( knoten_name == "semester"){
		 	
			var sem_id = $(this).attr("count");
			
			$(sem_content).append("<div class='semester' id='"+sem_id+"'>"+
										"<div class='subsemester'>"+
											"<h3>"+sem_id+".Semester"+"</h3>"+
											"<span class='leer' style='display:none;color:red'>(leer)</span>"+
										"</div>"+
										"<p style='cursor:pointer; display:none;color:red' class='semesterloeschen' onClick='sem_loeschen("+sem_id+")'>L&ouml;schen</p>"+
								  "</div>" );
								 
			
		}// ende else if
		
		session_auswahl_rekursiv(this);
		
		});//ende each
	    
}//ende 




//session_auswahl-----------------------------------------------------------------------



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
	
	
	// rekursiv aufrufen 
	
	
	session_auswahl_rekursiv(root);
	
	// Loeschen anzeigen.Wir suchen das letzten Semester.
	var last_semester = $("#semester-content div.semester:last");
	$(last_semester).find("p.semesterloeschen").css("display","block");
	

	
}//ende 




//   AJAX zum Server---------------------------------------------------------------------	


var ajax_to_server_by_add = function (modul_id,semester){
	//alert("mod_id="+modul_id+" und semester="+semester);
	//alert("modul_id="+modul_id+"semester="+semester);
	$.ajax({
							
            type: 'POST',
			url  : 'http://localhost:3000/abfragen/add_module_to_selection',
			cache:false,
            dataType:'text',
            async :false,
			data  : "mod_id="+modul_id+"&"+"sem_count="+semester,
			contentType:'application/x-www-form-urlencoded',
			error :  function (a,b,c){
				alert(b);
			}
			
     });//ende Ajax

	 ueberblick();
	
}



	



var ajax_to_server_by_remove = function (modul_id){
	//alert("mod_id="+modul_id);
	$.ajax({
							
            type: 'POST',
			url  : 'abfragen/remove_module_from_selection',
			cache:false,
            dataType:'text',
            async :false,
			data  : "mod_id="+modul_id,
			contentType:'application/x-www-form-urlencoded',
			error :  function (a,b,c){
				alert("problem with remove_module_from_selection");
			}
			
     });//ende Ajax

	 ueberblick();
	
}// ende



var ajax_to_server_by_remove_semester = function (sem_count){
	//alert("sem_count="+sem_count);
	$.ajax({
			
			type: 'POST',
			url : 'abfragen/remove_semester_from_selection',
			dataType:'text',
			cache : false,
			async : false,
			data  : "sem_count="+sem_count,
			contentType:'application/x-www-form-urlencoded',
			error : function (a,b,c){
				alert("problem with abfragen/remove_semester_from_selection");
			}
		
	});
	ueberblick();
	
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
		
		
}//ende auswahlAnzeige


// DROP in Auswahl

var drop_in_auswahl = function (modul_id,modul_class,semester,ui_draggable,this_semester,ui_helper){
	
	// wartezeit anzeigen
	
	
	$('<div class="quick-alert">'+warten_beige+'Bitte warten!</div>')
		 .appendTo($(this_semester))
		 .fadeIn("fast")
		 .animate({opacity:1.0},2000)
		 .fadeOut("fast",function(){
		 	$(this).remove();
	 });
		 
	
	
	// vesteck (leer) in  Semester
				
	//$(this_semester).find(".subsemester span.leer").css("display", "none");
		
	// display versteckte <span> in Pool-Modul, und remove andere 
	// kopieren und ver�ndern class pool_modul zum auswahl_modul
	
	
	//var this_copy = $(ui_draggable).clone(true);
	//var this_copy_class = $(this_copy).attr("class");
	
	
	
	
	var this_draggable_class = $(ui_draggable).attr("class");
	
	
		
	//var this_draggable_class = $(ui_draggable).attr("class");
	//alert(this_helper_class);
	
	// check ob das reingezogenem Modul aus POOL kommt.
	// Wenn ja dann ver�ndern inhalt, und versteck das Modul im POOL.
	// Wenn nein ( also bereits im Auswahl) dann remove per AJAX erstmal das Modul aus SESSION,
	// dann wieder add per AJAX
	
	if (this_draggable_class =="pool_modul ui-draggable" || this_draggable_class=="pool_modul"){
		//alert("hallo pool_modul");
		$(ui_draggable).find("div#icon_loeschen").css("display","block");
		$(ui_draggable).find("span.fragebild").css("display","none");
		$(ui_draggable).find("span.ipunkt").css("display","block");
		$(ui_draggable).find("span.noten").css("display","block");
		$(ui_draggable).attr("class","auswahl_modul ");
		
		var this_span = $(ui_draggable).find("span.imAuswahl");
		$(this_span).text("schonWEG");
		
		//vertecken die anderen gleichen Module
	
		$("."+modul_id+"_parent").each(function(){
			//alert("drin");
			$(this).find("div.pool_modul").each(function(){
				var das_span = $(this).find("span.imAuswahl");
				var x = $(das_span).text();
				//alert("span="+x);
				if(x=="nein"){
					$(this).hide();
					$(das_span).text("ja");
				}
				
			});
			
		});
		
	}//ende if pool_modul class
	else if(this_draggable_class=="auswahl_modul_clone ui-draggable" || this_draggable_class=="auswahl_modul_clone"  ){
		//alert("hallo "+this_draggable_class);
		ajax_to_server_by_remove(modul_id);
		
	}//ende check mit "auswahl_modul_clone"
	
	else {
		//alert("Hallo altes auswahl_modul");
		ajax_to_server_by_remove(modul_id);
		
		
	}//ende if auswahl_modul class
	
	// append hier
	var this_subsemester = $(this_semester).find("div.subsemester");
	//$(ui_draggable).appendTo($(this_subsemester));
	$(this_subsemester).append(ui_draggable);
	
	
	 
	
	
	// DATEN mit modul_id und semester zum Server(action add_module_to_selection) schicken 
			
		ajax_to_server_by_add(modul_id,semester); 
			
	// modul in Auswahl anzeigen
			
	//	auswahlAnzeige(modul_id,semester,modulinhalt);
		 
}//ende drop in auswahl


//-----Drop in POOL----------------------------------------------------------------------


var drop_in_pool = function(mod_id,ui_draggable,this_pool){
	
	
	// style ver�ndern
	
	$(ui_draggable).attr("class","pool_modul");
	$(ui_draggable).find("div#icon_loeschen").css("display","none");
	$(ui_draggable).find("span.fragebild").css("display","block");
	$(ui_draggable).find("span.ipunkt").css("display","none");
	$(ui_draggable).find("span.noten").css("display","none");
	$(ui_draggable).find("span.imAuswahl").text("nein");
	// erstmal hide()
	$(ui_draggable).hide();
	//suchen den leeren Vaten mod_id+"_parent" dann append ui_draggable
	// danach setzen die anderen Module aus "nein" in span.imAuswahl
	
	$("."+mod_id+"_parent").each(function(){
		//alert("drin");
		var this_text = $(this).text();
		
		if(this_text ==""){
			
			$(this).append(ui_draggable);
			// check den Vater-Kategory, ob der gerade offen ist
			var the_father = $(this).parent().get(0);
			$(the_father).find(".pool_modul,.pool_modul.ui-draggable").each(function(){
				//alert("drin leer");
				var this_display = $(this).css("display");
				if(this_display=="block"){
					$(ui_draggable).show();
				}
			});
			
			
		}//ende if
		else{
			
			// remove ui-draggable weil das original schon da ist
			//$(ui_draggable).remove();
			var this_span = $(this).find("span.imAuswahl");//this hier ist mod_id_parent
			var the_other_modul = $(this).find("#"+mod_id);
			$(this_span).text("nein");
			// check den Vater-Kategory, ob der gerade offen ist
			var the_father = $(this).parent().get(0);
			$(the_father).find(".pool_modul,.pool_modul.ui-draggable").each(function(){
				//alert("drin nicht leer");
				var this_display = $(this).css("display");
				
				if(this_display=="block"){
					$(the_other_modul).show();
				}
			});
		}
		
	});//ende each
	
	
	//ajax aufrufen
	
	ajax_to_server_by_remove(mod_id);
	
}//ende

//----Poolrekursive implementieren-------------------------------------------------------

//poolrekursive()  implementieren

var poolrekursiv = function(root){
	
	// nach kinder suchen
			
	$(root).children().each(function(){
				
		var knoten_name=this.nodeName;
		var parent = $(this).parent().get(0);
		var parent_name = parent.nodeName;
		
		if (knoten_name == "category") {
		 	
			var category_id   = $(this).attr("category_id");
			
			var category_name = $(this).attr("name");
			
			
			//var parent_id   = $(parent).attr("category_id");
			
			// check ob seine Kinder Module sind. Wenn ja dann toggle kinder
			//var kinder = $(this).children()[0];
			//var namen  = kinder.nodeName;
			//check nach Schwerpunkt und Bachelor,also 1.te Ebene
			if (parent_name == "root" && $(this).children()[0]){
				
				
				$("#pool").append("<div class='pool_category' id='" + category_id + "'>" +

									
									"<a id='id_"+category_id+"'>"+"<span class='bild'>"+pfeil_rechts+"</span>"+category_name +"</a>"+ 
						 
						 		"</div>");
				$("#pool").append("<script>$(function(){ $(\"#"+category_id+" a#id_"+category_id+" \").live('click', function(){  $(\"#"+category_id+" a#id_"+category_id+" \").nextAll().toggle(); var this_img=$(\"#pool #"+category_id+ " a#id_"+category_id+" \").find('img'); var this_src=$(this_img).attr('src'); if(this_src=='http://localhost:3000/images/Pfeil-Rechts.png'){$(this_img).attr('src','http://localhost:3000/images/Pfeil-Unten.png')}else{$(this_img).attr('src','http://localhost:3000/images/Pfeil-Rechts.png')}             });});</script>");	
				
								
								
								 			
				
			}//ende Schwerpunkt
		
			else{ //hier es geht um untergeordneten Kategories.
			
				// suche parend_id in #pool
				
				var parent_id   = $(parent).attr("category_id");
				var parent_a    = $("#pool #"+parent_id).find("a");
				var parent_a_id = $(parent_a).attr("id");
				
				
			  
				$("#pool #"+parent_id).append("<div style='margin-left:5px;' class='pool_category'  id='" + category_id + "'>" +
												
												// "> "+
												
												"<a id='id_"+category_id+"'>"+pfeil_rechts+category_name +"</a>"+
												 
												"</div>");
				// verstecke untergeordneten Kategories
				
				$("#pool #"+parent_id+" #"+category_id).hide();	
				
				
				// hier checken ob die Kategories die Bl�tter enthalten
				// wenn nein dann macht untergeornete Kategories toggle
				// wenn ja dann macht die Bl�tter toggle
				// hier wird das Pfeil-Bildchen bei jedem Click ver�ndert
				
				var this_children = $(this).children()[0];
				var child_name    = this_children.nodeName;
				if (child_name == "category"){
					$("#pool").append("<script>"+
									 "$(function(){"+   
					
										"$(\"#"+category_id+" a#id_"+category_id+" \").live('click',function(){"+
												"var this_img=$(\"#pool #"+category_id+ " a#id_"+category_id+" \").find('img'); var this_src=$(this_img).attr('src'); if(this_src=='http://localhost:3000/images/Pfeil-Rechts.png'){$(this_img).attr('src','http://localhost:3000/images/Pfeil-Unten.png');}else {$(this_img).attr('src','http://localhost:3000/images/Pfeil-Rechts.png')}"+
												"$(\"#"+category_id+" a#id_"+category_id+" \").nextAll().toggle();           "+
										
										"})"+
								
								
									"})</script>");
				}
				else if(child_name == "module"){
					$("#pool").append("<script>"+
									 "$(function(){"+   
					
										"$(\"#"+category_id+" a#id_"+category_id+" \").live('click',function(){"+
										
												"$(\"#"+category_id+" .pool_modul \").each(function(){"+
												
														"var imAuswahl = $(this).find('span.imAuswahl');"+
														"var imAuswahl_text = $(imAuswahl).text();"+
														"if (imAuswahl_text == 'ja'){$(this).hide();}"+
														"else if (imAuswahl_text == 'nein'){$(this).toggle('fast');}});"+
														"var this_img=$(\"#pool #"+category_id+ " a#id_"+category_id+" \").find('img'); var this_src=$(this_img).attr('src'); if(this_src=='http://localhost:3000/images/Pfeil-Rechts.png'){$(this_img).attr('src','http://localhost:3000/images/Pfeil-Unten.png');}else {$(this_img).attr('src','http://localhost:3000/images/Pfeil-Rechts.png')}         "+
										"})"+
								
								
									"})</script>");
					
					
				}
				
				// 	untergeordneten Kategories wieder zeigen bei Click auf den Schwerpunkt-Vater						
				//$("#pool").append("<script>$(function(){ $(\"#" + parent_id + " #"+parent_a_id+"\").live('click', function(){ $(\"#" + parent_id + " #"+category_id+"\").toggle('slow'); var this_img=$(\"#" + parent_id + " #"+parent_a_id+"\").find('img'); var this_src=$(this_img).attr('src'); if(this_src=='images/Pfeil-Rechts.png'){$(this_img).attr('src','images/Pfeil-Unten.png');}else {$(this_img).attr('src','images/Pfeil-Rechts.png');}                              }); })</script>");								
												
		}//ende else f�r andere Kategorie
		
		
		//rekursiv
		poolrekursiv(this);
		
	}
		
	else if (knoten_name == "module"){
			
			
			
			var parent_name = $(parent).attr("name");
			var parent_id   = $(parent).attr("category_id");
			var parent_a    = $("#pool #"+parent_id).find("a");
			//var parent_a_class = $(parent_a).attr("class");
			var parent_a_id= $(parent_a).attr("id");
			//alert(parent_a_class);
			
			
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
			
			// hiet ist span.imAuswahl f�r die Besetzung eines Modul in Auswahl gedacht.
							
			$("#pool #"+parent_id).append("<div class='"+modul_id+"_parent'><div class='nichtleer'></div><div class='pool_modul' id='" + modul_id + "' >" +
						"<div id='icon_loeschen' style='display:none; cursor:pointer; float:right; width:12px;height:0px;overflow:visible;' onclick='modulloeschen("+modul_id+")'>"+
							loeschenbild+
						"</div>"+
						"<span class='imAuswahl' style='display:none'>nein</span>"+
						"<table cellspacing=1 cellpadding=0 style='width: 100%; border:1px;'>" +
							"<tbody>"+
								"<tr>" +
									"<td style=' width:22px;padding:1px 2px 0px 2px; '>"+ 
										bild+
									"</td>" +
									"<td style=' width:99%'>" +
										"<span>"+modul_name+"</span>"+
										
									"</td>"+
									// Kurzbezeichnung raus aus der Auswahl (OS)
									// "<td style=' width:20%'>" +
									// 	"<span class='modul_short' style='display:none'>"+"("+modul_short+")"+"</span>"+
									// 	
									// "</td>"+
									
									"<td style=' width:22px; '>" +
										"<span class='fragebild' style='display:block;padding:1px 2px 0px 7px;'>"+ 
											fragebild+ 
										"</span>"+
									
									"</td>"+
									
									"<td style=' width:25px'>"+
										"<span class='noten' style='display:none'>"+
											"<input class='noten_input' type='text' size='5' value='Note' />"+
											
										"</span>"+
									"</td>"+
									
									"<td style=' width:22px'>"+
										"<span class='ipunkt' style='display:none;padding:1px 2px 0px 7px;'>"+ipunkt+"</span>"+
									"</td>"+
									
									"<td style='min-width:32px;text-align:right;font-weight:bold'>"+
											credits +" C"+
									"</td>" +
								"</tr>" +
							"</tbody>"+
						"</table>" +
						"</div></div>");
							
							
						// pool_modul beweglich
							
						
						
						
						
		
						
						// pool_ modul am Anfang verstecken mit hide()
						
						//$("#pool #"+parent_id+" .pool_modul").hide();
						
						// toggle Bl�tter wenn die untergeordneten Kategories geklickt werden
						//$("#pool").append("<script>$(function(){ $(\"#pool #" + parent_id + " ."+parent_a_class+"\").live('click', function(){ $(\"#pool #" + parent_id + " .pool_modul\").toggle('slow');  });    })</script>");
						
						//$(function(){ $("#pool #" + parent_id + " ."+parent_a_class).live('click', function(){ $("#pool #" + parent_id + " .pool_modul").toggle('slow');  });    });
			
			
		
		
			return;
		}//ende check Module

	
	
	
 });// ende nach Children
	
}//ende poolrekursiv


//POOL-Funktion gibt immer ganzen Module im POOL zur�ck, 
//und ruft AJAX auf  ------------------------------

	
 var pool = function(){

	var XML = $.ajax({

	    type: 'GET',
	    url: 'http://localhost:3000/abfragen/pool',
	    async: false,
	    contentType: 'application/x-www-form-urlencoded',
		error : function(a,b,c){
			alert("problem with pool");
		}
		
	


   }).responseXML; //ende AJAX

    var root = XML.documentElement;
	$("#pool").empty();
	//aktuellePoolXml=XML;
	
	
    poolrekursiv(root);
 	session_auswahl();
	ueberblick();
	
	
}//ende pool


		


