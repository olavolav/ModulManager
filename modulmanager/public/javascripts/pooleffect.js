/*--------------------------------------------------------------------------------------
 *	     diese Datei macht den POOL beweglich mit slideDown und slideUP    				
 *		 und schickt die Daten modulID und entsprechenem Semester zum Server 			
 *       nachdem das gezogene Modul in Auswahl reingetan wurde                          	
 *								semesterhinzu,custom_check
 *								Ergreinis bei DROP in Auswahl
 *								"L�schen" bei SEMESTER wird geklick 
 *								mach unseres POOL droppable	
 *								mach ein pool_modul bei POOL draggable--		
 *								Noten eingeben und schicken bei (".semester").droppable
 *-------------------------------------------------------------------------------------*/






//function f�r Form-Check bei Custom-Moul
function updateTips(t,tips) {
			tips.text(t).effect("highlight",{},1500);
			
		}

//---------------------------------------------------------


var custom_check = function(name,credit,category_id,custom_semester,custom_id,tips,min,max){
	
	var custom_semester=custom_semester.attr("value");
	var custom_id=custom_id.attr("value");
    var category_id = category_id.attr("value");
	var this_credit=credit.val();
	var this_name =name.val();
	var this_credit_float = parseFloat(this_credit);
	
	
	if(name.val().length < min){
		
		name.addClass('ui-state-error');
		updateTips("Geben Sie bitte ein Name ein!",tips);
		return false;
	}
	
	if(this_credit.length < min || isNaN(this_credit_float)){
		credit.addClass('ui-state-error');
		updateTips("Credit Point ist eine Zahl zwischen 1.0 und 4.0 ",tips);
		return false;
	}
	else{
		
		var check_komma = this_credit.search(/,/);
		var this_credit_point=this_credit;
		
		if(check_komma != -1){
					this_credit_point = this_credit.replace(/\,/,".");
		}
		var this_credit_point_float = parseFloat(this_credit_point);
		
		
		ajax_server_by_custom(this_name,this_credit_point_float,category_id,custom_semester,custom_id);
		return true;
	}
	
	
} 









//---------- Drag and Drop----------------------------------------------------------


//-----------------------------------------------------------------------------------
//  mach ein pool_modul bei POOL draggable, den Pool-Baum beweglich-- und Ergreinis bei DROP in POOL
//  also Pool_droppable. 
//-----------------------------------------------------------------------------------


$(function(){
	
		
		


		// teil Form -Check bei dummy Modul
		var name=$("#name");
		var credit=$("#credit");
        var category_id = $("#category_id");
		var custom_semester=$("#custom_semester");
		var custom_id=$("#custom_id");
		
		var tips =$("#validateTips");
		var allFields = $([]).add(name).add(credit);
		
		$("#custom_dialog").dialog({
		 	modal:true,
			height:300,
			width:500,
			autoOpen:false,
			// hide:'slide',
			// show:'slide',
			
			buttons:{
				"Fertig":function(){
					
					var iValid=false;
					allFields.removeClass('ui-state-error');

					iValid = custom_check(name,credit,category_id,custom_semester,custom_id,tips,1,4);
					
					if (iValid) {
						
						var na = name.attr("value");
						var cre = credit.attr("value");
                        var cat = category_id.attr("value");
						var cus_sem=custom_semester.attr("value");
						var cus_id=custom_id.attr("value");
						
						
						
						var cus_modul = $("#pool #"+cus_id);
						$(cus_modul).attr("class","auswahl_modul ui-draggable");
						//$(cus_modul).find("span.custom").text("non-custom");
						$(cus_modul).find(".modul_name").text(na);
						$(cus_modul).find(".modul_credit").text(cre+" C");
						change_module_style_to_auswahl(cus_modul);
						$(cus_modul).find("span.inAuswahl").text("ja");
						
						$("#semester-content div.semester").each(function(){
							var this_id = $(this).attr("id");
							if(this_id == cus_sem){
								var this_subsemester = $(this).find(".subsemester");
								$(this_subsemester).append(cus_modul);
								
							}
			
						});
						var this_exsit = $(cus_modul).find("span.custom_exist").text();
						var cus_cat_id=$(cus_modul).find(".custom_category").text();
						if(this_exsit=="nein"){
							$(cus_modul).find("span.custom_exist").text("ja");
							get_custom_modul(cus_cat_id);
							get_custom_modul_in_the_search_table();
							
						}
						
						$(this).dialog('close');
						
					}
					
					
				}
			}
			
			
		 });
		
			
			
		 ////Ausname-Option
		 $("#exception_credit").click(function(){
		 	$(this).attr("value"," ");
		 })
		 			
         // info_box------------------------------------------------------------
			
		 
		 
		 $("#info_box").dialog({
                modal:true,
                height:300,
                width:500,
				position:'center',
                autoOpen:false,
                
				open:function(event,ui){
					$("#exception_credit").attr("value","Note");
					$("#exception_warn").attr("checked","");
					$("#exception_note").attr("checked","");
					//$(this).parent().css("top","167px");
				},	
				buttons:{
					"OK":function(){
							if ($("#box_info_exception").css("display") == "block") {
								update_modul_in_selection();
							}
                            $("#info_box").dialog('close');
							
					}
				}
		});

		
		
		// pool();
		
		$(".auswahl_modul,.auswahl_modul_clone,.auswahl_modul.ui-draggable,.partial_modul,.auswahl_modul.partial_modul.ui-draggable").draggable({
			
			revert : "invalid",
			helper : "clone",
			cursorAt:{right:125,top:13}
			
		});
		
		
		
		
		
		
	   $(".pool_modul,.custom_modul").draggable({
							
				revert : "invalid",
				helper : "clone",
				cursorAt:{left:120,top:13}
				
		});		
		
		
	   
		
	// am Anfang beim Seite-Laden alle Pool-modul verstecken.
	// danach dynamisch auf- und zu machen. 

	
	$("#pool .pool_modul").hide();
	
	$("#voratbox").droppable({
		
		hoverClass:'drophover',
		drop : function(event,ui){
			$(this).append(ui.draggable);
			
		}
	});
	
	
	
	
	
	// zur�ck in POOL , also mach #pool droppable
		
	$("#pool").droppable({
					
			accept     : '.auswahl_modul,.auswahl_modul_clone',// momentan gibt es nicht
			hoverClass : 'drophover',
			drop: function(event, ui){
				//alert("drop in pool");		
				var ui_draggable = $(ui.draggable);
				var mod_id = $(ui.draggable).attr("id");
				var this_pool = $(this);
				//$(ui.draggable).hide();
				$(ui.helper).remove();
				
				// drop_in_pool(mod_id, ui_draggable,this_pool);
				// neuerdings die gleiche Funktion wie wenn man auf den L�schen-Knopf klickt:
				modul_loeschen(mod_id);
			}
		
		});
		
		
		
		
	
		
		
		
		//-------------semester-Droppable--------------------------------------//
		//																	   //
		/////////////////////////////////////////////////////////////////////////
		
		
		$(".semester").droppable({
			
			hoverClass : 'drophover',
			accept     : '.pool_modul ,.auswahl_modul,.auswahl_modul_clone,.custom_modul',
			 drop: function(event, ui){
			 	
			 	
			 	// id von reingezogenem Modul und entsprechendem Semester holen
				 
				 var ui_draggable = $(ui.draggable);
				 var ui_helper = $(ui.helper);
				 var this_semester = $(this);		
				 var semester = $(this).attr("id");
				 var modul_id = $(ui.draggable).attr("id");
				 var modul_class = $(ui.draggable).attr("class");
				 
				 var custom_text = $(ui.draggable).find("span.custom").text();
				 var parts_text  = $(ui.draggable).find("span.modul_parts").text();
				 
				 var parts_exsit  = $(ui.draggable).find("span.modul_parts_exsit").html();
				 //alert("part_exsit :"+parts_exsit);
				
				 if(custom_text == "non-custom") {
				 	
					
				 	//check nach Teil_modul
					if((parts_text!="0") && (parts_exsit=="nein")){
						
						change_credit_and_add_name_in_selection(ui_draggable);
						drop_in_auswahl(modul_id,modul_class,semester,ui_draggable,this_semester,ui_helper);
						partial_modul_drop_in_auswahl(modul_id,modul_class,semester,ui_draggable,this_semester,ui_helper);
					}
					else
						drop_in_auswahl(modul_id,modul_class,semester,ui_draggable,this_semester,ui_helper);
					
				}
				
				 else{// hier sind custom_module
				 	if (modul_class == "auswahl_modul ui-draggable" || modul_class == "auswahl_modul" || modul_class == "auswahl_modul_clone ui-draggable") {
						drop_in_auswahl(modul_id, modul_class, semester, ui_draggable, this_semester, ui_helper);
					}
					else {
						custom_modul_drop_in_auswahl(modul_id, modul_class, semester, ui_draggable, this_semester, ui_helper);
						
					}
				}
				
				 //hier check nach dummy modul und normales Modul
				 //und check nach gesuchtes Modul.D.h: check modul_id_parent im Pool und
				 //guck ob das class search_modul hat. Wenn Ja dann aktualisiere Live Pool
			
				
				
				 
			}// ende drop
			 
		});//ende droppable	
		
		
		
		
		
		// hier ist die Note im input________________________NOTEN__________________________________________
		// bei Focus: die Note eingeben
		// beim Focus-Verlassen : die Event Change schickt die Note und Modul_ID per Ajax zum Server
		// Note berechnen
		
		
		
		// Klick bei Noten berechnen
		$("#note_berechnen").click(function(){
			ajax_to_server_by_get_grade();
			
		});
		
		$("input.noten_input").focus(function(){
			// da wird der Click bei 'Note berechen' deaktiviert
			if($(this).val()=="Note"){
				$(this).attr("value"," ");
				set_image_to_ipunkt(this);
				
			}
			//var modul_id = $(this).attr("rel");
			$("#note_berechnen").unbind('click');
			$("#note_berechnen").text("Note wird bearbeitet");
			
			
		});
		
		//onChange oder Enter dr�cken
		$("input.noten_input").bind("keypress",function(e){
			if(e.keyCode == 13){
				//alert("hallo Enter");
				$("#enter_trick").trigger('focus');
				selection_input_check(this);
			}
		});
		$("input.noten_input").change(function(){
				
				selection_input_check(this);
				
		});
		
		
		
		
		
		
		
});//ende


//////////////////////semesterhinzu////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////



var sem_hinzu = function(){
	
	$(function(){
		
		 
		 
		 
    	 var n = $('#semester-content div.semester').length+1;
			// alert("Neues Semester bekommt ID: "+n);
			
			// neue Semester und L�schen reintun
			// <div class="semester" id="5">
			//		<div class='subsemester'> 
			//				semester 10
			//		</div>
			//		<p>
			//			L�schen
			//		</p>
			// </div>
            var neu = "<div class='semester' id='"+n+"'>"+
							"<div class='subsemester'><h5>"
									+n+" .Semester"+
								"</h5>"+
								//"<span class='leer' style='display:none;'>(leer)</span>"+
							"</div>"+
							"<button class='semesterloeschen' onClick='sem_loeschen("+n+");'>L&ouml;schen</button>"+
					  "</div>";
			
			$("#semester-content").append(neu);
		
			// "L�schen" wird immer in dem letzen Semester hinzuf�gen
			// d.h: andere ""L�schen" werden weggemacht.
			$(".semester[id="+(n-1)+"] button").css("display","none");
			$(".semester[id="+n+"] button").css("display","block");
			
			// ein Modul reinziehn
			
            $(".semester").droppable({
				
                    hoverClass:'drophover',
					
                   /* drop: function(event,ui){
						
					 var ui_draggable = $(ui.draggable);
					 var ui_helper = $(ui.helper);
					 var this_semester = $(this);		
					 var semester = $(this).attr("id");
					 var modul_id = $(ui.draggable).attr("id");
					 var modul_class = $(ui.draggable).attr("class");
					 
					//  drop() ruft ajax_to_server() und auswahlanzeige() auf
				 
					 drop_in_auswahl(modul_id,modul_class,semester,ui_draggable,this_semester,ui_helper);
				
								
						
					}//ende Drop
					*/
					drop: function(event, ui){
			 	
			 	
			 	// id von reingezogenem Modul und entsprechendem Semester holen
				 
				 var ui_draggable = $(ui.draggable);
				 var ui_helper = $(ui.helper);
				 var this_semester = $(this);		
				 var semester = $(this).attr("id");
				 var modul_id = $(ui.draggable).attr("id");
				 var modul_class = $(ui.draggable).attr("class");
				 
				 var custom_text = $(ui.draggable).find("span.custom").text();
				 var parts_text  = $(ui.draggable).find("span.modul_parts").text();
				 //alert("parts_text ="+parts_text);
				 var parts_exsit  = $(ui.draggable).find("span.modul_parts_exsit").html();
				 //alert("part_exsit :"+parts_exsit);
				
				 if(custom_text == "non-custom") {
				 	
					
				 	//check nach Teil_modul
					if((parts_text!="0") && (parts_exsit=="nein")){
						//alert("Teil modul kommem gleich");
						partial_modul_drop_in_auswahl(modul_id,modul_class,semester,ui_draggable,this_semester,ui_helper);
					}
					drop_in_auswahl(modul_id,modul_class,semester,ui_draggable,this_semester,ui_helper);
					
				}
				
				 else{// hier sind custom_module
				 	if (modul_class == "auswahl_modul ui-draggable" || modul_class == "auswahl_modul" || modul_class == "auswahl_modul_clone ui-draggable") {
						drop_in_auswahl(modul_id, modul_class, semester, ui_draggable, this_semester, ui_helper);
					}
					else {
						custom_modul_drop_in_auswahl(modul_id, modul_class, semester, ui_draggable, this_semester, ui_helper);
					}
				}
				
				 //hier check nach dummy modul und normales Modul
				 //und check nach gesuchtes Modul.D.h: check modul_id_parent im Pool und
				 //guck ob das class search_modul hat. Wenn Ja dann aktualisiere Live Pool
			
				
				
				 
			}// ende drop
					 
            });//droppable
            
	
	});//ende function
	
}//ende




///////////////////////////////////////////////////////////////////////////////////
// "L�schen" bei SEMESTER wird geklick -------------------------------------------
//   sem_loeschen()
///////////////////////////////////////////////////////////////////////////////////

var sem_loeschen = function(l){
	
		lint = parseInt(l);
		
	  	// alert("Klick auf Loeschen-Knopf von Semester mit ID: "+lint);

		// confirm nur beim Semester >=2
		
		if (parseInt(l) != "1") {
			
			//$("#semester-content #"+l);
			var this_semester = $(".semester[id="+lint+"]");
			
			var this_modules = $(this_semester).find(".auswahl_modul,.auswahl_modul_clone");
			// alert("Anzahl Module darin: "+this_modules.length);
			
			// Abfrage erfolgt nur falls sich mind. ein Modul im Semster befindet
			if (this_modules.length>0) {
			var bestaetigen = confirm("Wollen Sie das Semester komplett entfernen?");
			}
			else var bestaetigen = true;
			
			if (bestaetigen == true) {
				
				//erstmal hide(), aber noch nicht remove()
				$(this_semester).hide();
				// Module wieder im Pool anzeigen (keine Ahnung wo das passiert, OS)
				
				this_modules.each(function(){
					// alert("Modul mit ID "+$(this).attr("id")+" soll geloescht werden...");
					$(this).css("display","none");
					modul_loeschen($(this).attr("id"));
				});
				
				$(this_semester).remove();
				// Loeschen anzeigen.Wir suchen das vorletzten Semester.
				
				if (lint > 1) {
					$(".semester[id="+(lint-1)+"] button").css("display","block");
					
					//ajax aufrufen
					// wir rufen nur Ajax auf wenn es sich um ein nicht leer semester handelt.
					if (this_modules.length > 0) {
						ajax_to_server_by_remove_semester(lint);
					}
				}
				
				
				
				
			} // ende confirm
		}
		
		
	
	
}//ende



var toggle_category = function(category_id){
	// alert("call: toggle_category("+category_id+")");
	var handle = $("#pool").find("#"+category_id);	
	var temparrow = which_arrow_is_visible(handle);
	
	switch (temparrow) {
		case "rechts":
			// Kategorie �ffnen
			var count = 0;
			$(handle).children().not("a, .nichtleer, .inAuswahl").each(function(){
				var this_class = $(this).attr("class");
				// Pr�fen, ob sich darunter Kategorien oder Module befinden
				// if(((this_class=="pool_category")&&(!search_is_active()))||(this_class=="search_category")) {
				if((this_class=="pool_category")||(this_class=="search_category")) {
					// alert("Darunter befindet sich eine Kategorie.");
					if (!search_is_active()) {
						$(this).css("display","block");
						count++;
						// Schleife um Icon auf Pfeil-Leer zu setzen, falls n�tig, sollte aber nicht (OS)
						if (number_of_visible_items_in_category(this) == 0) flip_arrow_of_category("leer",this);
					}
					else if (this_class=="search_category") {
						if ($(this).attr("class") != "partial_modul") {
							$(this).css("display", "block");
							count++;
						}
						else $(this).hide();
					}
				}
				else {
					// alert("Darunter befindet sich ein Modul.");
					$(this).children().each(function(){
						if ($(this).find(">span.inAuswahl").text()=="nein") {
							if (search_is_active()) {
								if ($(this).parent().is(".search_modul")) {
									if ($(this).attr("class") != "partial_modul") {
										$(this).css("display", "block");
										count++;
									}
								}
							}
							else {
								// die folgende Abfrage ist n�tig, damit custom_modul-Divs nicht
								// angezeigt werden (OS)
								if ($(this).is(".pool_modul")) {
									$(this).css("display","block");
									count++;
								}
							}
						}
						// das Folgende k�nnte auch unn�tig sein, aber schaden kann's wohl nicht (OS)
						else $(this).css("display","none");
					});
				}
			});
		
			// falls kein Element angezeigt wird, entspr. Icon anzeigen
			if (count == 0) flip_arrow_of_category("leer",handle);
			else flip_arrow_of_category("unten",handle);
			
			break;

		case "unten":
			// Kategorie schlie�en
			flip_arrow_of_category("rechts",handle);
		
			// Elemente darunter verstecken
			$(handle).children().not("a, .nichtleer, .inAuswahl").each(function(){
				var this_class = $(this).attr("class");
				// Pr�fen, ob sich darunter Kategorien oder Module befinden
				if((this_class=="pool_category")||(this_class=="search_category"))
					$(this).css("display","none");
				else $(this).find(">*").css("display","none")
			});
			
			break;
			
		case "leer":
			// Bei leerer Kategorie passiert einfach nichts.
			break;
			
		default:
			alert("Fehler: Ungueltiger Pfeil-Wert in toggle_category().");
		
	}
}

var number_of_visible_items_in_category = function(handle){
	// gefragt is handle zur Kategorie
	var this_class = $(handle).attr("class");
	if(!((this_class=="pool_category")||(this_class=="search_category")))
		alert("Fehler: Handle in number_of_visible_items_in_category() ist keine Kategorie!");
		
	var count = 0;
	$(handle).children().not("a, .nichtleer, .inAuswahl").each(function(){
		this_class = $(this).attr("class");
		// Zun�chst Pr�fen, ob sich darunter Kategorien oder Module befinden
		if((this_class=="pool_category")||(this_class=="search_category")) {
			// also geht es um eine Kategorie
			if (search_is_active()) {
			  if (this_class=="search_category") count++;
			}
			else count++;
		}
		else { // also geht es um Module
			$(this).children().each(function(){
				if (($(this).find(">span.inAuswahl").text()=="nein")&&($(this).is(".pool_modul"))) {
					if (search_is_active()) {
						if ($(this).parent().is(".search_modul")) count++;
					}
					else count++;
				}
			});
		}
	});
	// alert("number_of_visible_items_in_category: "+count);
	return (count);
}

var flip_arrow_of_category = function(type,handle){
	// gefragt is handle zur Kategorie
	var this_class = $(handle).attr("class");
	//if(!((this_class=="pool_category")||(this_class=="search_category")))
		//alert("Fehler: Handle in flip_arrow_of_category() ist keine Kategorie!");
	
	switch(type){
		case "rechts":
			$(handle).find(">a .pfeil_unten").css("display","none");
			$(handle).find(">a .pfeil_rechts").css("display","inline");
			$(handle).find(">a .pfeil_leer").css("display","none");
			break;
						
		case "unten":
			$(handle).find(">a .pfeil_unten").css("display","inline");
			$(handle).find(">a .pfeil_rechts").css("display","none");
			$(handle).find(">a .pfeil_leer").css("display","none");
			break;
			
		case "leer":
			$(handle).find(">a .pfeil_unten").css("display","none");
			$(handle).find(">a .pfeil_rechts").css("display","none");
			$(handle).find(">a .pfeil_leer").css("display","inline");
			break;
		default:
			alert("Fehler in flip_arrow_of_category: Typ "+type+" unbekannt!");
	}
}

var which_arrow_is_visible = function(handle){
	// gefragt is handle zur Kategorie
	var this_class = $(handle).attr("class");
	if(!((this_class=="pool_category")||(this_class=="search_category")))
		alert("Fehler: Handle in which_arrow_is_visible() ist keine Kategorie!");

	var result = "unbekannt";
	if ($(handle).find(">a .pfeil_unten").css("display") == "inline") result = "unten";
	else {
		if ($(handle).find(">a .pfeil_rechts").css("display") == "inline") result = "rechts";
		else if ($(handle).find(">a .pfeil_leer").css("display") == "inline") result = "leer";
	}
	
	return result;
}