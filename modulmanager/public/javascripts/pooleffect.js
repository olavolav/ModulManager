/*--------------------------------------------------------------------------------------
 *	     diese Datei macht den POOL beweglich mit slideDown und slideUP    				
 *		 und schickt die Daten modulID und entsprechenem Semester zum Server 			
 *       nachdem das gezogene Modul in Auswahl reingetan wurde                          	
 *								semesterhinzu
 *								Ergreinis bei DROP in Auswahl
 *								"L�schen" bei SEMESTER wird geklick 
 *								mach unseres POOL droppable	
 *								mach ein pool_modul bei POOL draggable--					
 *-------------------------------------------------------------------------------------*/






//---------- Drag and Drop----------------------------------------------------------





	
	





//-----------------------------------------------------------------------------------
//  mach ein pool_modul bei POOL draggable, den Pool-Baum beweglich-- und Ergreinis bei DROP in POOL
//  also Pool_droppable
//-----------------------------------------------------------------------------------

$(function(){

		// pool();
		
		$(".auswahl_modul,.auswahl_modul_clone").draggable({
			
			revert : "invalid",
			helper : "clone"
			
		});
		
		$(".auswahl_modul.ui-draggable").draggable({
			
			revert : "invalid"
		});
		
		
		
		
	   $(".pool_modul").draggable({
							
				revert : "invalid",
				helper : "clone"
				/*drag  : function(event,ui){
					
					alert("anfang");
					alert("topOffset="+ui.offset.top);
					alert("leftOffset="+ui.offset.left);
					//var this_pos = $(ui.helper).css("position");
					//alert("position="+this_pos);
					
				}*/
				
				
				
						
							
							
		});		
		
		/*  $(".pool_modul.ui-draggable").draggable({
							
				revert : "invalid",
				helper : "clone"
				
				
				
						
							
							
		});	*/	
		
	// am Anfang beim Seite-Laden alle Pool-modul verstecken.
	// danach dynamisch auf- und zu machen. 

	
	$("#pool .pool_modul").hide();
	
	/*var parents = $("#pool .pool_modul").parent();
	var par_parents = $(parents).parent();
	
	$(par_parents).each(function(){
		var par_parent_id = $(par_parents).attr("id");
			$("#"+par_parent_id+" a").live("click", function(){
				alert("drin");
				// check span.imAuswahl. Wenn Ja dann vertecken mit hide()
				var parent_knoten = $(this).parent();
				var this_children =$(parent_knoten).children();
				$(this_children).find("div").each(function(){
					
					$(this).toggle();
					
			});

		});
	});*/
	
	$("#pool .pool_modul,#pool .pool_modul.ui-draggable").each(function(){
			var parent = $(this).parent().get(0);
			
			var parent_parent=$(parent).parent().get(0);
			var parent_parent_id = $(parent_parent).attr("id");
			//var parent_a  = $(parent).find("a");
			var this_modul = $(this);
		
			$("#"+parent_parent_id+" a").live("click", function(){
				
				
				
				
				var imAuswahl = $(this_modul).find("span.imAuswahl");
				var imAuswahl_text = $(imAuswahl).text();
				//$(this_modul).toggle("fast");
				
				if (imAuswahl_text == "ja") {
					//alert(imAuswahl_text);
					$(this_modul).hide();
				}
				else if (imAuswahl_text == "nein") {
						
						$(this_modul).toggle("fast");
						
				}
				
			});
		
	});  //ende each
	
	
	
	
		
		
		// zur�ck in POOL , also mach #pool droppable
		
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
		
		
		
		
		
		
		$("input").focus(function(){
			
			$(this).attr("value"," ");
			
		});
		
		
		
		
});//ende


//////////////////////semesterhinzu////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////



var sem_hinzu = function(){
	
	$(function(){

    	 var n = $('#semester-content div.semester').length+1;
		
			// var l f�r L�schen gedacht
			
			var l = $('#semester-content div.semester').length+1;
			
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
									+n+".Semester"+
								"</h5><span class='leer' style='display:block; color:red'>(leer)</span>"+
							"</div>"+
							"<p style='cursor:pointer; display:block' class='semesterloeschen' onClick='javascrip:sem_loeschen()'>L&ouml;schen</p>"
					  "</div>";
			
			$("#semester-content").append(neu);
		
			// "L�schen" wird immer in dem letzen Semester hinzuf�gen
			// d.h: andere ""L�schen" werden weggemacht.
			
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
// "L�schen" bei SEMESTER wird geklick -------------------------------------------
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








	
		
		
	
	
	
	

	
	


















