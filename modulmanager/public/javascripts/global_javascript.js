
/*--------------POOL anzeigen---------------------------------------------------------*/
//				pool() wird in index.html aufgerufen
//              pool() ruft die poolrekursiv auf 
//              pool gibt XML-Datei zurück  
//              Diese Datei enthält folgende Funktionen: 
//					session_auswahl(),
//					drop_in_auswahl (),drop_in_pool()
//					ajax_to_server_by_add(),
//					ajax_to_server_by_remove(),ajax_to_server_by_grade(),
//					auswahlAnzeige(),
//					modul_loeschen(),get_custom_modul()
//
//--------------------------------------------------------------------------------------





// photo path

	var wahlpflichtbild = "<img src='images/Wahlpflicht.png'>";
	var pflichtbild = "<img src='images/Pflicht.png'>";
	var wahlbild = "<img src='images/Wahl.png'>";
	var unbekannter_modus_bild = "<img src='images/ModusUnbekannt.png'>";
	
	var fragebild = "<img src='images/Fragezeichen.png'>";
	var ipunkt = "<img src='images/iPunkt.png'>";
	var gelber_ipunkt = "<img src='images/iPunktGelb.png'>";
	var rote_ipunkt = "<img src='images/AusrufezeichenBlinkend.gif'>";
	var rote_ipunkt_passiv = "<img src='images/Ausrufezeichen.png'>";
	
	var loeschenbild = "<img src='images/Loeschen.png' style='position:relative; top:-5px; left:6px;'>";
	var pfeil_rechts = "<img src='images/Pfeil-Rechts.png' style='padding-right:3px;'>";
	var pfeil_unten = "<img src='images/Pfeil-Unten.png' style='padding-right:3px;'>";
	var pfeil_leer = "<img src='images/Pfeil-Rechts-Leer.png' style='padding-right:3px;'>";
	
	var warten_weiss = "<img src='images/Warten-HintergrundWeiss.gif' style='padding-right:3px;'>";
	var warten_blau = "<img src='images/Warten-HintergrundBlau.gif' style='padding-right:3px;'>";
	var warten_beige = "<img src='images/Warten-HintergrundBeige.gif' style='padding-right:3px;'>";




// Diese Funktion gehört zu show_pool_by_out, also zum Ziehen eines Moduls vom Pool in die Auswahl.
// Sie versteckt aber ganz Kategorien, sollte also nur verwendet werden, falls gesucht wird.
// Der Aufruf erfolgt über die Funktion drop_in_auswahl().
function rekursiv_pool_by_out(first_father){
		$(first_father).removeClass("search_category");
		$(first_father).addClass("pool_category");
		
		var parent = $(first_father).parent().get(0);
		
		if ($(parent).hasClass("search_category")) {
			var this_siblings = $(first_father).siblings();
			var sib_anzahl = $(this_siblings).filter(function(index){
			
				return $(this).hasClass("search_category")
			});
			if($(sib_anzahl).length == 0){
				$(parent).hide();
				rekursiv_pool_by_out(parent);
				
			}
			
		}
		
		else {
			$(first_father).hide();
		}	
			
		
}

// Funktionen für das Ziehen eines Moduls vom Pool in die Auswahl
var show_pool_by_out = function(pool_modul){
	
	
	//var modul_parent = $("#pool").find("#"+modul_id).parent().get(0);
	var modul_parent = $(pool_modul).parent().get(0);
	
	var this_siblings = $(modul_parent).siblings();
	var sib_anzahl =$(this_siblings).filter(function(index){
		return $(this).hasClass(".search_modul")
		
	});
	// falls es in der gleichen Katgeorie keine weiteren angezeigten Module gibt
	if($(sib_anzahl).length == 0 ){
		var first_father = $(modul_parent).parent().get(0);
		$(first_father).hide();
		rekursiv_pool_by_out(first_father);
	}
		
}// ende out

function rekursiv_pool_by_in(first_father){
	
	$(first_father).show();
	flip_arrow_of_category("unten",first_father);
	// $(first_father).removeClass("pool_category"); test (OS)
	// 	$(first_father).addClass("search_category");
	var this_parent = $(first_father).parent().get(0);
	if($(this_parent).hasClass("pool_category")){
		rekursiv_pool_by_in(this_parent);
	}
	return;
}

// Funktionen für das Ziehen eines Moduls von der Auswahl in den Pool
// neuerdings alles in modul_loeschen() (OS)
/* var show_pool_by_in = function(modul_id){
	
	
	var append_modul;
	
	// versteck das Modul im Semester
	$("#semester-content div.semester").find("div#"+modul_id).each(function(){
			//alert("hallo modul_loeschen");
			change_module_style_to_pool(this);
			$(this).attr("class","pool_modul");
			var das_span = $(this).find("span.inAuswahl");
			$(das_span).text("nein");
			$(this).hide();
			append_modul = $(this);
	});
	
	
	
	//such modul_id im pool
	var modul = $("#pool").find("#"+modul_id).eq(0);
	
	//check ob es um ein live_search_modul geht.
	var this_class = $("#pool").find("."+modul_id+"_parent").eq(0).attr("class");
	alert("parent class: "+this_class);
	if(this_class == modul_id+"_parent search_modul"){
		alert("Dies ist ein Modul, das mit der momentanen Pool-Suche uebereinstimmt.");
		
		//suche alle parent-umgebung
		$("."+modul_id+"_parent").each(function(){
			
			if (module_div_present_in_parent($(this))) $(this).append($(append_modul));

			var this_modul = $(this).find("div.pool_modul");
			$(this_modul).show();
			
			var first_father = $(this).parent().get(0);
			
			rekursiv_pool_by_in(first_father);
		});
	}
	else{//hier wird das Modul entweder in im Live nachdem das Modul gerade
		 // in Auswahl reingetan und wieder sofort in Pool zurück.
		 // Zunächst werden die Modul_id im Table#suche ermittelt
		 
		if (!search_is_active()) {
			alert("Momentan wird nicht gesucht.");
			modul_loeschen(modul_id);
		}		
		else {
			alert("Dies ist ein Modul, das mit der momentanen Pool-Suche nicht uebereinstimmt. (es wird gesucht)");
			var this_tr = $("table#suche tbody").find("." + modul_id).eq(0);
			var live_modul = false;
			
			//hier check ob die Module gerade gesucht werden.
			if ($(this_tr).css("display") == "table-row" || $(this_tr).css("display") == "block" || $(this_tr).css("display") == "") {
				live_modul = true;
				var hi = $(this_tr).css("display");
				
			}
			
			if (live_modul) {
				alert("hallo search modul im Table");
				var modul_search_id = $(this_tr).attr("class");
				$(this).parent().addClass("search_modul");
				$(modul).show();
				var first_father = $(this_parent).parent().get(0);
				rekursiv_pool_by_in(first_father);
				
				//$("."+modul_search_id+"_parent").
			}
		}	
	}
	//ajax aufrufen
	
	ajax_to_server_by_remove(modul_id);
	
	
	
}//ende in */





// Anzeigen bzw. verstecken der anfänglichen Hilfe und der Navigations-Knöpfe
var show_navi = function(){
	$("#navi_optional").slideDown();
	$("#navimovedown").toggle();
	$("#navimoveup").show();
}
var hide_navi = function(){
	$("#navi_optional").slideUp();
	$("#navimovedown").show();
	$("#navimoveup").hide();
}


var get_custom_modul = function(){
	
	// die Funktion zeigt nur ein display_none Custom_modul im Pool an
	var the_first;
	var custom_modul = $("#pool").find("div.custom_modul ").filter(function(index){
		if(index==0){the_first=$(this)}
		return index!=0
		
	});
	
	$(custom_modul).hide();
	var g = $(custom_modul).length;
	
	
	var x = $(the_first).attr("class");
	// class verändern. custom-->pool_modul. Damit wird nur ein custom_modul im Pool ist
	
	$(the_first).removeClass("custom_modul").addClass("pool_modul ui-draggable");
	$(the_first).show();
	
	
	
}//ende get_custom_modul

var modul_search = function(){
	
	$("#suche").show();
	var this_tr = $("#suche").find("tr");
	$(this_tr).each(function(){
		var this_display = $(this).css("display");
		if(this_display=="block"){
			alert("ja");
		}
		
	});
		
	
	
}//ende function


///////////////////MODULLOESCHEN loeschen////////////////////////
/// bei Click auf <div class="modul_loeschen">
/// neuerdings auch beim Ziehen zum Pool (OS)

var modul_loeschen = function (mod_id){
	// Die Schleife hier sollte eigentlich unnötig sein, wenn jedes Modul nur 1x in der
	// Auswahl sein kann: (OS)
	// alert("Dieses Modul (ID "+mod_id+") ist in der Auswahl: "+$("#semester-content div.semester").find("div#"+mod_id).length+"-mal enthalten.");
	if ($("#semester-content div.semester").find("div#"+mod_id).length > 1)
		alert("Warnung: Dieses Modul (ID "+mod_id+") ist in der Auswahl: "+$("#semester-content div.semester").find("div#"+mod_id).length+"-mal enthalten!");
	
	$("#semester-content div.semester").find("div#"+mod_id).each(function(){

		// alert("hallo modul_loeschen (Schleife, 1x pro Modul in der Auwahl) class: "+$(this).attr("class"));
		// ändere CSS style
		change_module_style_to_pool(this);
		$(this).attr("class","pool_modul");
		
		var this_id = $(this).attr("id");
		var this_modul = $(this);
		var modul_itself_has_not_been_moved = true;
		// ersmal hide
		$(this_modul).hide();
		// suche nach mod_id_parent im Pool
		
		alert("Dieses Modul (bzw. dessen Parent) kommt im Pool "+($("#pool ."+this_id+"_parent").length)+" mal vor.");
					
		$("#pool ."+this_id+"_parent").each(function(){

			var arrow_type = which_arrow_is_visible($(this).parent());
			// alert("arrow_type: "+arrow_type);
			
			var the_father = $(this).parent();
			// alert("the_father class: "+the_father.attr("class"));
			if(!module_div_present_in_parent($(this))){
			
				$(this).append(this_modul);
				modul_itself_has_not_been_moved = false;

				// check den Vater-Kategory, ob der gerade offen ist
				// $(the_father).find(".pool_modul,.pool_modul.ui-draggable").each(function(){
				// 	if ($(this).css("display")=="block") $(this_modul).css("display","block");
				// });
				
				// rauskopiert aus unten:
				// check den Vater-Kategory, ob der gerade offen ist (neu, OS)
				if (arrow_type == "leer")
					flip_arrow_of_category("rechts",$(this).parent());
				else if (arrow_type == "unten") {
					// $(this).find(".pool_modul,.pool_modul.ui-draggable,.search_modul.ui-draggable").css("display","block");
					// $(this).parent().find("#"+mod_id).css("display","block");
					$(this).find("#"+mod_id).css("display","block");
					// $(this_modul).css("display","block");
				}
				
			}// ende if leer
			
			else { // Modul ist schon im Pool, nur versteckt
				
				// check den Vater-Kategory, ob der gerade offen ist (neu, OS)
				if (arrow_type == "leer")
					flip_arrow_of_category("rechts",$(this).parent());
				else if (arrow_type == "unten") {
					// $(this).find(".pool_modul,.pool_modul.ui-draggable,.search_modul.ui-draggable").css("display","block");
					$(this).find("#"+mod_id).css("display","block");
				}
				
			}

			// inAuswahl-Tag setzen (OS)
			// alert("inAuswahl vorher (OS): "+$(this).find("#"+mod_id+" span.inAuswahl").text());
			$(this).find("#"+mod_id+" span.inAuswahl").text("nein");
			// alert("inAuswahl nachher (OS): "+$(this).find("#"+mod_id+" span.inAuswahl").text());

			if (search_is_active() && $(this).is(".search_modul"))
				rekursiv_pool_by_in(the_father);
			else if (which_arrow_is_visible(the_father) == "leer")
				flip_arrow_of_category("rechts",the_father);
						
		}); // Ende der Schleife durch alle parent divs

		// Das hier nimmt immer noch an, dass es maximal ein Parent gibt, bei dem das Modul nicht nur
		// wieder auf sichtbar geschaltet werden musste. (OS)
		if (modul_itself_has_not_been_moved) {
			alert("Aha, das Modul in der Auswahl selbst wurde gar nicht verschoben, dann koennen wir es ja loeschen!");
			$(this_modul).remove();
		}
		else alert("Aha, das Modul wurde verschoben, dann loeschen wir es besser nicht.");

	}); // Ende der Schleife durch alle entspr. Module in der Auswahl

	// AJAX aufrufen und Session-DB aktualisieren
	ajax_to_server_by_remove(mod_id);

}//ende modul_loeschen




// session_auswahl() implementieren. Die ruft action abfragen/auswahl per AJAX auf


var session_auswahl_rekursiv = function(root){
	
	var sem_content = $("#semester-content");
	
	$(root).children().each( function(){
	 	
		var knoten_name = this.nodeName;
		
		// check Blätter
		if (knoten_name == "module"){
			
			var parent = $(this).parent().get(0);
			var parent_id = $(parent).attr("count");   	
			
			// entsprechenem  modul_id im Pool suchen, dann clonen ins Auswahl
			// dann verstecken die originalen Module im Pool
			
			var mod_id = $(this).attr("id");
			
			//suche im Pool
			
			var modul_im_pool = $("#pool").find("div#"+mod_id);
			var das_erste = $(modul_im_pool).eq(0);
			
			// die originalen Module verstecken
			//und den span.inAuswahl auf "ja" setzen
			//und alle vor dem Clone 
			var auswahl_modul_clone=$(das_erste).clone(true);

			$(modul_im_pool).each(function(){
				
				$(this).hide();
				$(this).find("span.inAuswahl").text("ja");
				
			});
			
			
			// verändern erstmal die interne im Modul bei dem Clone
			//besonders hat die Klone die class "auswahl_modul_clone"
			//zur Indentifizierung bei alle erster Veränderung im Auswahl 
			
						
			$(auswahl_modul_clone).attr("class","auswahl_modul_clone");
			change_module_style_to_auswahl(auswahl_modul_clone);
			// $(auswahl_modul_clone).find("div#icon_loeschen").css("display","block");
			// $(auswahl_modul_clone).find("span.fragebild").css("display","none");
			// $(auswahl_modul_clone).find("span.ipunkt").css("display","block");
			// $(auswahl_modul_clone).find("span.noten").css("display","block");
			$(auswahl_modul_clone).find("span.inAuswahl").text("ja");
			
			// reinstecken das Klone im Auswahl
			$(sem_content).find("div.semester").each(function(){
				var x= $(this).attr("id");
			
				if (parent_id == x){
					
					$(this).find(".subsemester").append(auswahl_modul_clone);
					
				}
			});//ende each intern
			
			
		
			return;
		}// ende Blätter
		
		
		
		
		
		//check semester
		else  if ( knoten_name == "semester"){
		 	
			var sem_id = $(this).attr("count");
			
			$(sem_content).append("<div class='semester' id='"+sem_id+"'>"+
										"<div class='subsemester'>"+
											"<h5>"+sem_id+". Semester"+"</h5>"+
											//"<span class='leer' style='display:none;color:red'></span>"+
										"</div>"+
										"<button style='display:none;' class='semesterloeschen' onClick='sem_loeschen("+sem_id+");'>L&ouml;schen</button>"+
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
	
	$("semester-content").empty();
	session_auswahl_rekursiv(root);
	
	// Loeschen anzeigen.Wir suchen das letzten Semester.
	var last_semester = $("#semester-content div.semester:last");
	$(last_semester).find("button.semesterloeschen").css("display","block");
	

	
}//ende 




//   AJAX zum Server---------------------------------------------------------------------	


var ajax_to_server_by_add = function (modul_id,semester){
	//alert("mod_id="+modul_id+" und semester="+semester);
	//alert("modul_id="+modul_id+"semester="+semester);
	$.ajax({
							
            type: 'POST',
			url  : 'abfragen/add_module_to_selection',
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

var ajax_to_server_by_grade = function(modul_id,grade){
	
	//alert(grade);
	//alert(modul_id);
	$.ajax({
					type:"POST",
					url :"abfragen/save_module_grade",
					dataType:"text",
					cache:false,
					async:false,
					data:"mod_id="+modul_id+"&"+"grade="+grade,
					contentType:'application/x-www-form-urlencoded',
					error : function(a,b,c){
							alert ("error mit save_module_grade");
					}
	});
				
	
}

//----------------------------


var ajax_to_server_by_examination_grade = function(){
	alert("hallo ajax_to_server_by_examination_grade ");
	
	var grade_by_text = $.ajax({
		
		type : 'GET',
		url  : '/abfragen/get_examination_grade',
		async: false,
		contentType: 'application/x-www-form-urlencoded',
		success : function(html){ 
			
			//bindThickBoxEvents();
			

		},
		error: function(a,b,c){
			alert("problem with /abfragen/get_examination_grade");
		}
		

		
	}).responseText;
	
	
	
	
}


function ajax_server_by_custom(this_name,this_credit_point_float,custom_semester){
	
	
	$.ajax({
					type:"POST",
					url :"abfragen/add_custom_modul_to_selection",
					dataType:"text",
					cache:false,
					async:false,
					data:"name="+this_name+"&"+"credits="+this_credit_point_float+"&"+"sem_count="+custom_semester,
					contentType:'application/x-www-form-urlencoded',
					error : function(a,b,c){
							alert ("error mit add_custom_modul_to_selection");
					}
	});
	
}






var auswahlAnzeige = function (modul_id,semester,modulinhalt){

		$("#"+semester+" .subsemester").append("<div class='auswahl_modul' id='"+modul_id+"'>"
														+modulinhalt+
													"</div>"
												+"</div>");
		
}//ende auswahlAnzeige


// DROP in Auswahl

var drop_in_auswahl = function (modul_id,modul_class,semester,ui_draggable,this_semester,ui_helper){
	// alert("ID: "+modul_id+", class:"+modul_class);
	// alert("Pool parent class: "+$("#pool ."+modul_id+"_parent").eq(0).attr("class"))
		
	$('<div class="quick-alert">'+warten_beige+'Bitte warten!</div>')
		 .appendTo($(this_semester))
		 .fadeIn("fast")
		 .animate({opacity:1.0},1000)
		 .fadeOut("fast",function(){
		 	$(this).remove();
	 });
		 
	var this_draggable_class = $(ui_draggable).attr("class");
	
	// check ob das reingezogenem Modul aus POOL kommt.
	// Wenn ja dann verändern inhalt, und versteck das Modul im POOL.
	// Wenn nein ( also bereits im Auswahl) dann remove per AJAX erstmal das Modul aus SESSION,
	// dann wieder add per AJAX
	
	// alert("Modul class: "+this_draggable_class);
	if (this_draggable_class =="pool_modul ui-draggable" || this_draggable_class=="pool_modul") {
		alert("Modul kommt aus dem Pool");
		change_module_style_to_auswahl(ui_draggable);
		$(ui_draggable).find("span.inAuswahl").text("ja");
		$(ui_draggable).attr("class","auswahl_modul");
		
		// var modul_parent = $(ui_draggable).parent().get(0);
		// Falls das Modul die "search_modul"-Eigenschaft hat, wird natürlich auch gerade gesucht,
		// die entspr. Abfrage erübrigt sich also.
		if($(ui_draggable).parent().is(".search_modul")){
			show_pool_by_out(ui_draggable);
		}
		else {
			var this_category = $(ui_draggable).parent().parent();
			// alert("Aha, Suche ist nicht aktiv - visible items:"+number_of_visible_items_in_category(this_category));
			if (number_of_visible_items_in_category(this_category) == 0)
				flip_arrow_of_category("leer",this_category);
		}
		
		
		// Die anderen gleichen Module verstecken (fast gleich zum Prozedere oben)
		$("."+modul_id+"_parent").each(function(){
						
			// inAuswahl-Tag setzen und Modul verstecken (OS):
			$(this).find("span.inAuswahl").text("ja");
			$(this).find(".pool_modul,.search_modul").css("display","none");
				
			if($(this).parent().is(".search_modul")){
				show_pool_by_out(this);
			}
			else {
				// hier ein parent weniger als oben, weil wir ja schon surch die parent-Divs laufen (OS)
				var this_category = $(this).parent();
				// alert("Aha, Suche ist nicht aktiv - visible items:"+number_of_visible_items_in_category(this_category));
				if (number_of_visible_items_in_category(this_category) == 0)
					flip_arrow_of_category("leer",this_category);
			}
		});
			
	}//ende if pool_modul class
	
	else if(this_draggable_class=="auswahl_modul_clone ui-draggable" || this_draggable_class=="auswahl_modul_clone"  ){
		alert("Modul kommt aus der Auswahl.");
		//alert("hallo "+this_draggable_class);
		ajax_to_server_by_remove(modul_id);
		
	}//ende check mit "auswahl_modul_clone"
	
	else {
		alert("Modul kommt woher? Hmm, normales auswahl_modul oder so. (OS)");
		//alert("Hallo altes auswahl_modul");
		ajax_to_server_by_remove(modul_id);
		
		
	}//ende if auswahl_modul class
	
	// append hier
	var this_subsemester = $(this_semester).find("div.subsemester");
	
	
				
	
	
	//$(ui_draggable).appendTo($(this_subsemester));
	$(this_subsemester).append(ui_draggable);
	
	 
	// einbinden search function
	//$("#pool").append("<script type='text/javascript'>$(document).ready(function () {		$('table#suche tbody tr').live('click',function(){  var this_class = $(this).attr('class'); $('#pool .'+this_class+'_parent').each(function(){  if($(this).find('.pool_modul')){alert('hallo pool_modul');}else{alert('kein pool_modul');}       });  }); })</script>");
	
	// DATEN mit modul_id und semester zum Server(action add_module_to_selection) schicken 
			
		ajax_to_server_by_add(modul_id,semester); 
			
	// modul in Auswahl anzeigen
			
	//	auswahlAnzeige(modul_id,semester,modulinhalt);
		 
}//ende drop in auswahl




//implement :   custom_modul_drop_in_auswahl---------------------------------------------

var custom_modul_drop_in_auswahl = function(modul_id,modul_class,semester,ui_draggable,this_semester,ui_helper){
	
	
	var check_open=false;
	$("#custom_semester").attr("value",semester);
	$("#custom_id").attr("value",modul_id);
	
	$('#custom_dialog').dialog('open');
	
	
	
	
	
	
}

//-----Drop in POOL----------------------------------------------------------------------
/* var drop_in_pool_veraltet = function(mod_id,ui_draggable,this_pool){
	
	
	// style verändern
	
	$(ui_draggable).attr("class","pool_modul");
	change_module_style_to_pool(ui_draggable);
	$(ui_draggable).find("span.inAuswahl").text("nein");
	// erstmal hide()
	$(ui_draggable).hide();
	//suchen den leeren Vater mod_id+"_parent" dann append ui_draggable
	// danach setzen die anderen Module aus "nein" in span.inAuswahl
	
	$("#pool ."+mod_id+"_parent").each(function(){
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
			var this_span = $(this).find("span.inAuswahl");//this hier ist mod_id_parent
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
	
}//ende */

//----Poolrekursive implementieren-------------------------------------------------------

// den Pool (d.h. das XML-Resultat der Pool-Anfrage) rekursiv durchgehen und Module und Kategorien
// in zugeklappter Form in den Pool einfügen.
// Ob ein Modul in der Auswahl ist oder nicht spielt hier noch keine Rolle, das passiert erst später
// mit Hilfe der Funktion session_auswahl.
var poolrekursiv = function(XMLhandle){
	var appendString = '';
	$(XMLhandle).children().each(function(){				
		var knoten_name=this.nodeName;
		var parent = $(this).parent().get(0);
		var parent_name = parent.nodeName;
		
		switch(this.nodeName) {
			case "category":
				var category_id   = $(this).attr("category_id");			
				var category_name = $(this).attr("name");
				
				// if (parent_name == "root" && $(this).children()[0])
				if (parent_name == "root")
					appendString += "<div class='pool_category' id='" + category_id + "'>";
				else
					appendString += "<div style='margin-left:6px;display:none;' class='pool_category' "+"id='"+category_id+"'>";
					
				appendString += "<a onClick='javascript:toggle_category(\""+category_id+"\");'>"+
					"<span class='pfeil_rechts' style='display:inline'>"+pfeil_rechts+"</span>"+
					"<span class='pfeil_unten' style='display:none'>"+pfeil_unten+"</span>"+
					"<span class='pfeil_leer' style='display:none'>"+pfeil_leer+"</span>"+
					category_name+
					"</a>";
				// rekursiver Teil
				appendString += poolrekursiv(this);
				appendString += "</div>";
				break;
				
			case "module":
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
				var modul_class=$(this).attr("class");

				//check Modul_ART : Pflicht? WP?
				var bild;
				// so sollte es eigentlich sein (ist mit CB besprochen):
				/* switch(modul_mode) {
					case "p":
						bild = pflichtbild;
						break;
					case "wp":
						bild = wahlpflichtbild;
						break;
					case "w":
						// Dieser Fall kommt momentan nicht vor
						bild = wahlbild;
						break;
					default:
						bild = unbekannter_modus_bild;
						break;
				} */
				// momentaner Hack:
				if (modul_mode == "p") bild = pflichtbild;
				else bild = wahlpflichtbild;

				// hiet ist span.inAuswahl für die Besetzung eines Modul in Auswahl gedacht.
				//span.custom sagt, dass ein modul normal oder ein dummy-modul ist
				//span.custom_exist sagt, dass das dummy-modul bereits im pool ist
				var pool_modul_class="pool_modul";
				if(modul_class=="custom"){ pool_modul_class="custom_modul"}


				appendString += "<div class='" + modul_id + "_parent'><div class='nichtleer'></div><div class='"+
					pool_modul_class+"' id='" + modul_id + "' >" +
					// "<div id='icon_loeschen' style='display:none; cursor:pointer; float:right; width:12px;height:0px;overflow:visible;' onclick='show_pool_by_in(" +
					"<div class='icon_loeschen' style='display:none; cursor:pointer; float:right; width:12px;height:0px;overflow:visible;' onclick='modul_loeschen(" +
					modul_id +")'>" +loeschenbild +"</div>" +
					"<span class='inAuswahl' style='display:none'>nein</span>" +
					"<span class='custom' style='display:none'>"+modul_class+"</span>"+
					"<span class='custom_exist' style='display:none'>nein</span>"+
					"<table cellspacing=1 cellpadding=0 style='width: 100%; border:1px;'>" +
					"<tbody>" +
					"<tr>" +
					"<td style=' width:22px;padding:1px 2px 0px 2px; '>"+bild+"</td>"+
					"<td class='modul_name' style=' width:99%'>"+modul_name+"</td>"+
					
					// Kurzbezeichnung raus aus der Auswahl (OS)
					// "<td style=' width:20%'>" +
					// 	"<span class='modul_short' style='display:none'>"+"("+modul_short+")"+"</span>"+
					// "</td>"+

					"<td style=' width:22px; '>" +
					"<span class='fragebild' style='display:block;padding:1px 2px 0px 7px;'>"+fragebild+"</span>"+
					"</td>" +

					"<td style=' width:25px'>" +
					"<span class='noten' style='display:none'>" +
					"<input class='noten_input' type='text' size='5' rel='"+modul_id+"' value='Note' />"+
					"</span>" +
					"</td>" +

					"<td style=' width:22px'>" +
					"<span class='ipunkt' style='display:none;padding:1px 2px 0px 7px;'>"+ipunkt+"</span>"+
					"</td>" +

					"<td class='modul_credit' style='min-width:32px;text-align:right;font-weight:bold'>" +
					credits +" C" +
					"</td>" +
					"</tr>" + "</tbody>" + "</table>" +
					"</div></div>";

				//kopieren das Modul in search_table  für die Suche
				$("#suche tbody").append("<tr class='"+modul_id+"' >"+"<td>"+modul_id+"</td>"+"<td>"+modul_name+"</td>"+"</tr>");
				
			default:
				// Hmm, warum kommt das hier noch so oft? Später mal nachschauen!
				// alert("Fehler: Pool-XML-Abfrage enthaelt ungueltige Elemente!")
				break;
		}
	});
	return appendString;
}//ende poolrekursiv


//POOL-Funktion gibt immer ganzen Module im POOL zurück, 
//und ruft AJAX auf  ------------------------------

	
var pool = function(){

	var XML = $.ajax({

	    type: 'GET',
	    url: 'abfragen/pool',
	    async: false,
	    contentType: 'application/x-www-form-urlencoded',
		error : function(a,b,c){
			alert("problem with pool");
		}
   }).responseXML; //ende AJAX

    var root = XML.documentElement;
	$("#pool").empty();
	
	// Pool anzeigen
    $("#pool").append(poolrekursiv(root));
	
	get_custom_modul();
 	session_auswahl();
	ueberblick();
	
}//ende pool

var search_is_active = function(){
	return ($("#qs").val() != "" );
}

var change_module_style_to_pool = function(handle){
	$(handle).find("div.icon_loeschen").css("display","none");
	$(handle).find("span.fragebild").css("display","block");
	$(handle).find("span.ipunkt").css("display","none");
	$(handle).find("span.noten").css("display","none");
	
	return 0;	
}

var change_module_style_to_auswahl = function(handle){
	$(handle).find("div.icon_loeschen").css("display","block");
	$(handle).find("span.fragebild").css("display","none");
	$(handle).find("span.ipunkt").css("display","block");
	$(handle).find("span.noten").css("display","block");
	
	return 0;
}

var module_div_present_in_parent = function(parent_handle){
	// recht übler Hack (OS)
	var result = ($(parent_handle).text() != "")
	
	if (result) alert("module_div_present_in_parent: true");
	else alert("module_div_present_in_parent: false");
	
	return result;
}
