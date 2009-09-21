/*--------------------------------------------------------------------------------------
 *	     diese Datei macht den POOL beweglich mit slideDown und slideUP    				
 *		 und schickt die Daten modulID und entsprechenem Semester zum Server 			
 *       nachdem das gezogene Modul in Auswahl reingetan wurde                          	
 *								semesterhinzu
 *								Ergreinis bei DROP in Auswahl
 *								"Löschen" bei SEMESTER wird geklick 
 *								mach unseres POOL droppable	
 *								mach ein pool_modul bei POOL draggable--					
 *-------------------------------------------------------------------------------------*/






//---------- Drag and Drop----------------------------------------------------------





	
	





//-----------------------------------------------------------------------------------
//  mach ein pool_modul bei POOL draggable, den Pool-Baum beweglich-- und Ergreinis bei DROP in POOL
//  also Pool_droppable
//-----------------------------------------------------------------------------------

$(function(){

		
		
		$(".auswahl_modul").draggable({
			
			revert : "invalid",
			helper : "clone"
			
		});
		
		
		
		
		
		
	   $(".pool_modul").draggable({
							
				revert : "invalid",
				helper : "clone"
				
				
				
						
							
							
		});		
		
	// am Anfang beim Seite-Laden alle Pool-modul verstecken.
	// danach dynamisch auf- und zu machen. 

	
	$("#pool .pool_modul").hide();
	
	$("#pool .pool_modul").each(function(){
			var parent = $(this).parent().get(0);
			var parent_id = $(parent).attr("id");
			//var parent_a  = $(parent).find("a");
			var this_modul = $(this);
		
			$("#"+parent_id+" a").live("click", function(){
				
				// check span.imAuswahl. Wenn Ja dann vertecken mit hide()
				
				var imAuswahl = $(this_modul).find("span.imAuswahl");
				var imAuswahl_text = $(imAuswahl).text();
				
				
				if (imAuswahl_text == "ja") {
					//alert(imAuswahl_text);
					$(this_modul).hide();
				}
				else if (imAuswahl_text == "nein") {
						
						$(this_modul).toggle("fast");
						
					}
			});
		
		});// ende each
		
		
		// zurück in POOL , also mach #pool droppable
		
		$("#pool").droppable({
							
			accept     : '.auswahl_modul',// momentan gibt es nicht
			hoverClass : 'drophover',
			drop: function(event, ui){
			
				var ui_draggable = $(ui.draggable);
				var mod_id = $(ui.draggable).attr("id");
				//alert(mod_id);
				
				drop_in_pool(mod_id, ui_draggable);
				
			}
		
		});
		
		
		
		
	/*	$(".pool_modul").droppable({
							
			accept     : '.auswahl_modul',// momentan gibt es nicht
			hoverClass : 'drophover',
			drop: function(event, ui){
			
				var ui_draggable = $(ui.draggable);
				var mod_id = $(ui.draggable).attr("id");
				alert(mod_id);
				
				drop_in_pool(mod_id, ui_draggable);
				
			}
		});*/
		
		
		
		//-------------semester-Droppable--------------------------------------//
		//																	   //
		/////////////////////////////////////////////////////////////////////////
		
		
		$(".semester").droppable({
			
			hoverClass : 'drophover',
			accept     : '.pool_modul ,.auswahl_modul',
			 drop: function(event, ui){
			 	
			 	
			 	// id von reingezogenem Modul und entsprechendem Semester holen
				 
				 var ui_draggable = $(ui.draggable);
				 var ui_helper = $(ui.helper);
				 var this_semester = $(this);		
				 var semester = $(this).attr("id");
				 var modul_id = $(ui.draggable).attr("id");
				 
				  
				
				  
				//  drop() ruft ajax_to_server() und auswahlanzeige() auf
				 
				 drop_in_auswahl(modul_id,semester,ui_draggable,this_semester,ui_helper);
				 
			}// ende drop
			 
		});//ende droppable	
		
		
		
		
		
		
		$("input").focus(function(){
			
			$(this).attr("value"," ");
			
		});
		
		
		
		
});//ende


//////////////////////semesterhinzu////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////



var sem_hinzu = function(){
	
	$(function(){

    	 var n = $('#semester-content div.semester').length+1;
		
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
								"</h5><span class='leer' style='display:block; color:red'>(leer)</span>"+
							"</div>"+
							"<p style='cursor:pointer; display:block' class='semesterloeschen' onClick='javascrip:sem_loeschen()'>L&ouml;schen</p>"
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
						
						// id von reingezogenem Modul und entsprechendem Semester holen
				 
						 var ui_draggable = $(ui.draggable);
						 var this_semester = $(this);		
						 var semester = $(this).attr("id");
						 var modul_id = $(ui.draggable).attr("id"); 
						  
						//  drop() ruft ajax_to_server() und auswahlanzeige() auf
						 
						 drop_in_auswahl(modul_id,semester,ui_draggable,this_semester);
								
						
					}//ende Drop
					 
            });//droppable
            
	
	});//ende function
	
}//ende




///////////////////////////////////////////////////////////////////////////////////
// "Löschen" bei SEMESTER wird geklick -------------------------------------------
//   sem_loeschen()
///////////////////////////////////////////////////////////////////////////////////

var sem_loeschen = function(){
	
	
	$(function(){

		// confirm
		var bestaetigen = confirm("wollen Sie das Semester wirklich loeschen?");
		
		if (bestaetigen == true) {
			var parent = $(this).parent().get(0);
			
			// paren_id ist semester-count
			var parent_id = $(parent).attr("id");
			
			$(parent).remove();
			var laenge = $("#semester-content").children().length;
			
			var semester = $("#semester-content").find("div#" + laenge);
			$(semester).find("p").css("display", "block");
			
			//ajax aufrufen
			ajax_to_server_by_remove_semester(parent_id);
			
		} // ende confirm
		
		
	
	}); //ende function
	
}//ende








	
		
		
	
	
	
	

	
	


















