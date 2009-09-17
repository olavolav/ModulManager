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


//Ergreinis bei DROP in Auswahl--

var auswahl_droppable = function(semester,auswahl_modul){
	
	$(semester).droppable({
			
			hoverClass : 'drophover',
			 drop: function(event, ui){
			 
			 	// id von reingezogenem Modul und entsprechendem Semester holen
				 
				 var ui_draggable = $(ui.draggable);
				 var this_semester = $(this);		
				 var semester = $(this).attr("id");
				 var modul_id = $(ui.draggable).attr("id"); 
				
				  
				//  drop() ruft ajax_to_server() und auswahlanzeige() auf
				 
				 drop_in_auswahl(modul_id,semester,ui_draggable,this_semester);
				 
			}// ende drop
			 
		});//ende droppable	
		
		
		// auswahl_modul draggable machen
		
		$(auswahl_modul).draggable({
			
			revert : "invalid",
			helper : "clone"
			
		});
		
		$("input").focus(function(){
			
			$(this).attr("value"," ");
			
		});
	
	
	
};


//-----------------------------------------------------------------------------------
//  mach ein pool_modul bei POOL draggable-- und Ergreinis bei DROP in POOL
//-----------------------------------------------------------------------------------

$(function(){

		$(".pool_module").draggable({
			
			revert : "invalid",
			helper : "clone"
			
		});
		
		$(".auswahlmodul").draggable({
			
			revert : "invalid"
			
		});
		
			
		$("#pool").droppable({
			
			accept     : '.auswahl_modul',
			hoverClass : 'drophover',
			drop       : function(event,ui){
				
				var ui_draggable = $(ui.draggable);
				var mod_id = $(ui.draggable).attr("id");
				alert(mod_id);
				
				drop_in_pool(mod_id,ui_draggable);
		
	  		  }//ende drop
	  	});
		
});


//////////////////////semesterhinzu///////////-------------------------------------------


$(function(){

    $('#semesterhinzu').live("click",function(){
			
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
							"<p style='cursor:pointer; display:block' class='semesterloeschen'>L&ouml;schen</p>"
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
	});//ende live
});//ende function



// "Löschen" bei SEMESTER wird geklick -----------------------------------------------------



$(function(){

	
	
	$(".semesterloeschen").live('click',function(){
		
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
		
		
	});
}); //ende function



//// mach unseres POOL droppable------------------


/*
$(function(){
	
		
		$("#pool").droppable({
			
			accept     : '.auswahlmodul',
			hoverClass : 'drophover',
			drop       : function(event,ui){
				alert("drop");
				$(ui.draggable).hide();
				
				//suche nach ID von reingezogenem Modul, dann akktualisiere den Pool
				var modul_id = $(ui.draggable).attr("id");
				
				$("#pool").find("#"+modulID).each(function(){
					
					$(this).show();
					
				});
				
				// DATEN mit Modul-ID und semester zum Server(action remove_module_from_selection) schicken
				
				 ajax_to_server_by_remove(modul_id);
				
				
			}//ende Drop bei #pool droppable
		});
		
});//ende function



*/	
	
		
		
	
	
	
	

	
	


















