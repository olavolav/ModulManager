/*--------------------------------------------------------------------------------------
 *	     diese Datei macht den POOL beweglich mit slideDown und slideUP    				
 *		 und schickt die Daten modulID und entsprechenem Semester zum Server 			
 *       nachdem das gezogene Modul in Auswahl reingetan wurde                          	
 *								semesterhinzu
 *								Ergreinis bei DROP in Auswahl
 *								"Löschen" bei SEMESTER wird geklick 
 *								mach unseres POOL droppable	
 *								mach ein pool_modul bei POOL draggable--		
 *								Noten eingeben und schicken bei (".semester").droppable
 *-------------------------------------------------------------------------------------*/






//---------- Drag and Drop----------------------------------------------------------





	
//-----------------------------------------------------------------------------------
//  mach ein pool_modul bei POOL draggable, den Pool-Baum beweglich-- und Ergreinis bei DROP in POOL
//  also Pool_droppable. 
//-----------------------------------------------------------------------------------








$(function(){

		
		/* $("#dialog").dialog({
		 	modal:true,
			hide:'slide',
			show:'slide'
		 });
		*/
		
		// pool();
		
		$(".auswahl_modul,.auswahl_modul_clone,.auswahl_modul.ui-draggable").draggable({
			
			revert : "invalid",
			helper : "clone",
			cursorAt:{right:125,top:13}
			
		});
		
		
		
		
		
		
	   $(".pool_modul").draggable({
							
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
			accept     : '.pool_modul ,.auswahl_modul,.auswahl_modul_clone',
			 drop: function(event, ui){
			 	
			 	
			 	// id von reingezogenem Modul und entsprechendem Semester holen
				 
				 var ui_draggable = $(ui.draggable);
				 var ui_helper = $(ui.helper);
				 var this_semester = $(this);		
				 var semester = $(this).attr("id");
				 var modul_id = $(ui.draggable).attr("id");
				 var modul_class = $(ui.draggable).attr("class");
				 
				 
				 //  drop() ruft ajax_to_server() und auswahlanzeige() auf
				 
				 drop_in_auswahl(modul_id,modul_class,semester,ui_draggable,this_semester,ui_helper);
				
				 
			}// ende drop
			 
		});//ende droppable	
		
		
		
		
		
		// hier ist die Note im input________________________NOTEN__________________________________________
		// bei Focus: die Note eingeben
		// beim Focus-Verlassen : die Event Change schickt die Note und Modul_ID per Ajax zum Server
		
		$("input[type='text']").focus(function(){
			 
			$(this).attr("value"," ");
			
		});
		
		$("input[type='text']").change(function(){
				
				var this_grade = $(this).val();
				var modul_id = $(this).attr("rel");
				
				//checken Noten.Dann wandele String erstmal zum Float
				
				
				var trim_grade = $.trim(this_grade);
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
						$(this).attr("value","");
					}
					else{
						//alert(new_float+"ist OK");
						// daten zum Server schicken
						
						//Noten bleib im FELD
						$(this).attr("value",new_float);
				
						ajax_to_server_by_grade(modul_id,new_float);
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
		// alert(n);
		
			// var l für Löschen gedacht
			
			var l = $('#semester-content div.semester').length+1;
			
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
									+n+".Semester"+
								"</h5><span class='leer' style='display:none; color:red'>(leer)</span>"+
							"</div>"+
							"<p style='cursor:pointer; display:block' class='semesterloeschen' onClick='sem_loeschen("+l+")'>L&ouml;schen</p>"+
					  "</div>";
			
			$("#semester-content").append(neu);
		
			// "Löschen" wird immer in dem letzen Semester hinzufügen
			// d.h: andere ""Löschen" werden weggemacht.
			
			if (n >= 3) {
				for (i = 2; i < n; i++) {
					$(".semester" + "#" + i + " p").css("display","none");
				}
				
			}
			
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
	
	
	  	//alert(l);

		// confirm nur beim Semester >=2
		
		if (parseInt(l) != "1") {
			var bestaetigen = confirm("wollen Sie das Semester wirklich loeschen?");
			if (bestaetigen == true) {
			
				//$("#semester-content #"+l);
				var this_semester = $("#semester-content #" + l);
				
				//erstmal hide(), aber noch nicht remove()
				$(this_semester).hide();
				var this_children = $(this_semester).find("div.subsemester").children();
				var this_length = $(this_children).length;
				
				// Module wieder im Pool anzeigen
				// wieso >2? denn da ein für <h3>semster</h3> und ein für <span>leer</span>
				
				if(this_length > 2){
					var i=2; // beginnen mit 3.tes Kind, also index i=2
					
					for(i ; i<this_length; i++){
						var this_child = $(this_children)[i];
						var mod_id     = $(this_child).attr("id");
						
						modulloeschen(mod_id);
						
						
					}
					
				}
				
				
				$(this_semester).remove();
				// Loeschen anzeigen.Wir suchen das vorletzten Semester.
				
				if (parseInt(l) > 2) {
					var last_semester = $("#semester-content div.semester:last");
					$(last_semester).find("p.semesterloeschen").css("display", "block");
					//ajax aufrufen
					// wir rufen nur Ajax auf wenn es sich um ein nicht leer semester handelt.
					//if (this_length != 2) {
						ajax_to_server_by_remove_semester(l);
					//}
				}
				
				
				
				
			} // ende confirm
		}
		
		
	
	
}//ende








	
		
		
	
	
	
	

	
	


















