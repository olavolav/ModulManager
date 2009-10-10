/*--------------------------------------------------------------------------------------
 *	     diese Datei macht den POOL beweglich mit slideDown und slideUP    				
 *		 und schickt die Daten modulID und entsprechenem Semester zum Server 			
 *       nachdem das gezogene Modul in Auswahl reingetan wurde                          	
 *								semesterhinzu,custom_check
 *								Ergreinis bei DROP in Auswahl
 *								"Löschen" bei SEMESTER wird geklick 
 *								mach unseres POOL droppable	
 *								mach ein pool_modul bei POOL draggable--		
 *								Noten eingeben und schicken bei (".semester").droppable
 *-------------------------------------------------------------------------------------*/






//function für Form-Check bei Custom-Moul
function updateTips(t,tips) {
			tips.text(t).effect("highlight",{},1500);
			
		}

//---------------------------------------------------------


var custom_check = function(name,credit,custom_semester,custom_id,tips,min,max){
	
	var custom_semester=custom_semester.attr("value");
	var custom_id=custom_id.attr("value");
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
		
		
		ajax_server_by_custom(this_name,this_credit_point_float,custom_semester);
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
		var custom_semester=$("#custom_semester");
		var custom_id=$("#custom_id");
		
		var tips =$("#validateTips");
		var allFields = $([]).add(name).add(credit);
		
		$("#custom_dialog").dialog({
		 	modal:true,
			height:300,
			width:500,
			autoOpen:false,
			hide:'slide',
			show:'slide',
			buttons:{
				"Fertig":function(){
					var iValid=false;
					allFields.removeClass('ui-state-error');

					iValid = custom_check(name,credit,custom_semester,custom_id,tips,1,4);
					
					if (iValid) {
						
						var na = name.attr("value");
						var cre = credit.attr("value");
						var cus_sem=custom_semester.attr("value");
						var cus_id=custom_id.attr("value");
						
						
						
						var cus_modul = $("#pool #"+cus_id);
						$(cus_modul).find(".modul_name").text(na);
						$(cus_modul).find(".modul_credit").text(cre+" C");
						$(cus_modul).find(".fragebild").css("display","none");
						$(cus_modul).find(".ipunkt").css("display","block");
						$(cus_modul).find("#icon_loeschen").css("display","block");
						$(cus_modul).find(".noten").css("display","block");
						$(cus_modul).find("span.custom").text("non-custom");
						$(cus_modul).find("span.imAuswahl").text("ja");
						
						$("#semester-content div.semester").each(function(){
							var this_id = $(this).attr("id");
							if(this_id == cus_sem){
								var this_subsemester = $(this).find(".subsemester");
								$(this_subsemester).append(cus_modul);
								
							}
			
						});
						get_custom_modul();
						$(this).dialog('close');
						
					}
					
					
				}
			}
			
			
		 });
		
		
		// pool();
		
		$(".auswahl_modul,.auswahl_modul_clone,.auswahl_modul.ui-draggable").draggable({
			
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
	
	
	
	
	
	// zurück in POOL , also mach #pool droppable
		
	$("#pool").droppable({
					
			accept     : '.auswahl_modul,.auswahl_modul_clone',// momentan gibt es nicht
			hoverClass : 'drophover',
			drop: function(event, ui){
				//alert("drop in pool");		
				var ui_draggable = $(ui.draggable);
				var mod_id = $(ui.draggable).attr("id");
				var this_pool = $(this);
				$(ui.helper).hide();
				
				drop_in_pool(mod_id, ui_draggable,this_pool);
				
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
				 
				 if(custom_text == "non-custom"){
				 	
					//  drop() ruft ajax_to_server() und auswahlanzeige() auf
				 	drop_in_auswahl(modul_id,modul_class,semester,ui_draggable,this_semester,ui_helper);
				 }
				 else{
				 	
				 	custom_modul_drop_in_auswahl(modul_id,modul_class,semester,ui_draggable,this_semester,ui_helper);
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
			ajax_to_server_by_examination_grade();
			
		});
		
		$("input.noten_input").focus(function(){
			// da wird der Click bei 'Note berechen' deaktiviert
			 
			$(this).attr("value"," ");
			$("#note_berechnen").unbind('click');
			$("#note_berechnen").text("Note bearbeiten");
				
			
		});
		
		//onChange oder Enter drücken
		$("input.noten_input").bind("keypress",function(e){
			if(e.keyCode == 13){
				
				$("#note_berechnen").text("Note berechnen");
				$("#note_berechnen").bind('click',ajax_to_server_by_examination_grade);
			}
		});
		$("input.noten_input").change(function(){
				var this_original;
				var this_grade = $(this).val();
				var modul_id = $(this).attr("rel");
				var trim_grade = $.trim(this_grade);
				
				
				//checken Noten.Dann wandele String erstmal zum Float
				
				
				
				var check_komma = this_grade.search(/./);
				if(check_komma != -1){
					this_original = this_grade.replace(/\./,",");
				}
				var this_float = parseFloat(trim_grade);
				
				
				if(isNaN(this_float)){
					alert("Geben Sie bitte eine Zahl zwischen 1.0 und 4.0  ein!");
				}
				else{
					//suche nach ',' in String trim_grade dann verwandel es zum '.'
					
					var new_trim_grade = trim_grade.replace(/,/,".");   //1,2-->1.2
					//alert("neu String :"+new_trim_grade);
					var new_float = parseFloat(new_trim_grade);
					if(new_float < 1 || new_float > 4 ){
						alert("Die Note muss eine Zahl zwischen von 1.0 und 4.0");
						$(this).attr("value","Note");
					}
					else{
						//alert(this_original+"ist OK");
						// daten zum Server schicken
						
						//Noten bleib im FELD und zwar in Form 1,3
						
						
						$(this).attr("value",this_original);
						
						ajax_to_server_by_grade(modul_id,new_float);
						// hier kann man Note klicken
						$("#note_berechnen").text("Note berechnen");
						$("#note_berechnen").bind('click',ajax_to_server_by_examination_grade);
						
					}
					
					
				}
				
				
				
				
				
				return false;
		});
		
		
		
		
		
		
		
});//ende


//////////////////////semesterhinzu////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////



var sem_hinzu = function(){
	
	$(function(){
		
		 
		 
		 
    	 var n = $('#semester-content div.semester').length+1;
			// alert("Neues Semester bekommt ID: "+n);
			
			// neue Semester und Löschen reintun
			// <div class="semester" id="5">
			//		<div class='subsemester'> 
			//				semester 10
			//		</div>
			//		<p>
			//			Löschen
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
		
			// "Löschen" wird immer in dem letzen Semester hinzufügen
			// d.h: andere ""Löschen" werden weggemacht.
			$(".semester[id="+(n-1)+"] button").css("display","none");
			$(".semester[id="+n+"] button").css("display","block");
			
			// ein Modul reinziehn
			
            $(".semester").droppable({
				
                    hoverClass:'drophover',
					
                    drop: function(event,ui){
						
					 var ui_draggable = $(ui.draggable);
					 var ui_helper = $(ui.helper);
					 var this_semester = $(this);		
					 var semester = $(this).attr("id");
					 var modul_id = $(ui.draggable).attr("id");
					 var modul_class = $(ui.draggable).attr("class");
					 
				 
				 
				  
				
				  
					//  drop() ruft ajax_to_server() und auswahlanzeige() auf
				 
					 drop_in_auswahl(modul_id,modul_class,semester,ui_draggable,this_semester,ui_helper);
				
								
						
					}//ende Drop
					 
            });//droppable
            
	
	});//ende function
	
}//ende




///////////////////////////////////////////////////////////////////////////////////
// "Löschen" bei SEMESTER wird geklick -------------------------------------------
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
					show_pool_by_in($(this).attr("id"));
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
	// alert("call: toggle_category("+category_id+")")
	var handle = $("#pool").find("#"+category_id);
	
	
	if($(handle).find(">a .pfeil_unten").css("display")=="none") {
		// Kategorie öffnen
		var count = 0;
		$(handle).children().not("a, .nichtleer, .imAuswahl").each(function(){
			var this_class = $(this).attr("class");
			// Prüfen, ob sich darunter Kategorien oder Module befinden
			if((this_class=="pool_category")||(this_class=="search_category")) {
				$(this).css("display","block");
				count++;
				// Schleife um Icon auf Pfeil-Leer zu setzen, falls nötig
				if(number_of_visible_items_in_category(this) == 0) {
					flip_arrow_of_category("leer",this);
				}
			}
			else {
				$(this).children().each(function(){
					if ($(this).find(">span.imAuswahl").text()=="nein" && ($(this).attr("class")=="pool_modul" || $(this).attr("class")=="pool_modul ui-draggable")) {
						$(this).css("display","block");
						count++;
					}
				});
			}
		});
		
		// falls kein Element angezeigt wird, entspr. Icon anzeigen
		if (count == 0) flip_arrow_of_category("leer",handle);
		else flip_arrow_of_category("unten",handle);
	}
	else if($(handle).find(">a .pfeil_leer").css("display")=="none"){
		// Kategorie schließen
		flip_arrow_of_category("rechts",handle);
		
		$(handle).children().not("a, .nichtleer, .imAuswahl").each(function(){
			var this_class = $(this).attr("class");
			// Prüfen, ob sich darunter Kategorien oder Module befinden
			if((this_class=="pool_category")||(this_class=="search_category")) {
				$(this).css("display","none");
			}
			else {
				$(this).find(">*").css("display","none")
			}
		});
	}
	// Bei leerer Kategorie passiert einfach nichts.
}

var number_of_visible_items_in_category = function(handle){
	// gefragt is handle zur Kategorie
	var this_class = $(handle).attr("class");
	if(!((this_class=="pool_category")||(this_class=="search_category")))
		alert("Fehler: Handle in number_of_visible_items_in_category() ist keine Kategorie!")
		
	var count = 0;
	$(handle).children().not("a, .nichtleer, .imAuswahl").each(function(){
		this_class = $(this).attr("class");
		// Prüfen, ob sich darunter Kategorien oder Module befinden
		if((this_class=="pool_category")||(this_class=="search_category"))
			count++;
		else {
			$(this).children().each(function(){
				if ($(this).find(">span.imAuswahl").text()=="nein") {
					count++;
				}
			});
		}
	});
	// alert("number_of_visible_items_in_category: "+count)
	return (count);
}

var flip_arrow_of_category = function(type,handle){
	// gefragt is handle zur Kategorie
	var this_class = $(handle).attr("class");
	if(!((this_class=="pool_category")||(this_class=="search_category")))
		alert("Fehler: Handle in flip_arrow_of_category() ist keine Kategorie!")
	
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
			alert("Fehler in flip_arrow_of_category: Typ "+type+" unbekannt!")
	}
}

var which_arrow_is_visible = function(handle){
	// gefragt is handle zur Kategorie
	var this_class = $(handle).attr("class");
	if(!((this_class=="pool_category")||(this_class=="search_category")))
		alert("Fehler: Handle in which_arrow_is_visible() ist keine Kategorie!")

	var result = "unbekannt";
	if ($(handle).find(">a .pfeil_unten").css("display") == "inline") result = "unten";
	else {
		if ($(handle).find(">a .pfeil_rechts").css("display") == "inline") result = "rechts";
		else if ($(handle).find(">a .pfeil_leer").css("display") == "inline") result = "leer";
	}
	
	return result;
}