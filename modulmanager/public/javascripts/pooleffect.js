/*--------------------------------------------------------------------------------------*/
//	     diese Datei macht den POOL beweglich mit slideDown und slideUP    				*/
// 		 und schickt die Daten modulID und entsprechenem Semester zum Server 			*/
//       nachdem das gezogene Modul in Auswahl reingetan wurde                          */															*/
/*--------------------------------------------------------------------------------------*/














/*---------- Drag and Drop----------------------------------------------------------*/


//DROP in Auswahl--

$(function(){
		
		//jedes Semester in Auswahl hat class="semester" und id
	
		$(".semester").droppable({
			
			hoverClass : 'drophover',
			 drop: function(event, ui){
			 
			 	$(ui.draggable).hide();
			 
			 	/// wartezeit-------------- 
				$('<div class="quick-alert">Bitte warten!</div>')
				 .appendTo($(this))
				 .fadeIn("fast")
				 .animate({opacity:1.0},3000)
				 .fadeOut("fast",function(){
				 	$(this).remove();
				 });
				 
				 // id von reingezogenem Modul und entsprechendem Semester holen
						
				 var semester = $(this).attr("id");
				 var modul_id = $(ui.draggable).attr("id"); 	
				 
				 // display versteckte <span> in Pool-Modul, und remove andere 
				 
				 $(ui.draggable).find("span.modul_short").css("display","block");
						
				 $(ui.draggable).find("span.fragebild").css("display","none");
				 $(ui.draggable).find("span.ipunkt").css("display","block");
				 $(ui.draggable).find("span.modul_loeschen").css("display","block");
						
				 var modulinhalt = $(ui.draggable).html();
				
				 // Pool akktuallisieren
						
				 $("#pool").find("div#"+modul_id).each(function(){
				
					 $(this).hide();
							
				});
			 
			 
			 
			 	// DATEN mit modul_id und semester zum Server(action add_module_to_selection) schicken 
				
				ajax_to_server_by_add(modul_id,semester); 
				
				
				// modul in Auswahl anzeigen
				
				auswahlAnzeige(modul_id,semester,modulinhalt);
			 
			 
			 }// ende drop
			 
		});//ende droppable	
		
		
}); //ende function DROP in Auswahl




//-----------------------------------------------------------------------------------
//  mach ein pool_modul bei POOL draggable--
//-----------------------------------------------------------------------------------

$(function(){

		$(".pool_module").draggable({
			
			revert : "invalid",
			helper : "clone"
			
		});
		
		$(".auswahlmodul").draggable({
			
			revert : "invalid"
			
		});
		
});


//-----------------------

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
					$(".semester" + "#" + i + " p").remove();
				}
				
			}
			
			
			
			
			
		
			// ein Modul reinziehn
            $(".semester").droppable({
                    hoverClass:'drophover',
					
                    drop: function(event,ui){
						
						$(ui.draggable).hide();
						
						/// wartezeit-------------- 
						$('<div class="quick-alert">Bitte warten!</div>')
						 .appendTo($(this))
						 .fadeIn("fast")
						 .animate({opacity:1.0},1000)
						 .fadeOut("fast",function(){
						 	$(this).remove();
						 });	
						
						// Daten von reingezogenem Modul kopieren
							
						var semester = $(this).attr("id");
						var modul_id = $(ui.draggable).attr("id");
						var modulinhalt = $(ui.draggable).html();
						
						$(ui.draggable).find("span.modul_short").css("display","block");
						
						$(ui.draggable).find("span.fragebild").css("display","none");
						$(ui.draggable).find("span.ipunkt").css("display","block");
						$(ui.draggable).find("span.modul_loeschen").css("display","block");
						
						var modulinhalt = $(ui.draggable).html();
						
						
						//(leer) verstecken
						$(this).find(".subsemester span.leer").css("display","none");

						
						
						
						// immer noch bei DROP in DROPPABLE 
						// das reingezongen Modul mit der funktion auswahlAnzeige() zeigen
						
						
						// Pool akktuallisieren
						
						$("#pool").find("div#"+modul_id).each(function(){
							 
							 $(this).hide();
							
						});
						
						
                        
						
						// DATEN mit modul_id und semester zum Server(action add_module_to_selection) schicken 
				
						ajax_to_server_by_add(modul_id,semester); 
				
						// modul in Auswahl anzeigen
				
						auswahlAnzeige(modul_id,semester,modulinhalt);
						
					 }//ende Drop
					 
            });//droppable
	});//ende live
});//ende function



//-----------------------


// "Löschen" bei SEMESTER wird geklick --------------------------------------------------

$(function(){


	$(".semesterloeschen").live('click',function(){
		var l = $(".semester").length;
		if (l >= 3) {
		
			$(".semester" +"#"+l).remove();
			$(".semester" +"#"+(l - 1)).append("<p style='cursor:pointer; ' class='semesterloeschen'>L&ouml;schen</p>");
		}
		else if (l==2){
			$(".semester"+"#"+l).remove();
			
			
		}								
	});
}); //ende function






//// mach unseres POOL droppable------------------
$(function(){
	
		
		$("#pool").droppable({
			
			accept     : '.auswahlmodul',
			hoverClass : 'drophover',
			drop       : function(event,ui){
				
				$(ui.draggable).hide();
				
				//suche nach ID von reingezogenem Modul, dann akktualisiere den Pool
				var modulID = $(ui.draggable).attr("id");
				
				
				
				
				
				$("#pool").find("#"+modulID).each(function(){
					
					$(this).show();
					
				});
				
				// DATEN mit Modul-ID und semester zum Server(action remove_module_from_selection) schicken
				
				 $.ajax({
							
                    type: 'POST',
					url  : 'http://localhost:3000/abfragen/remove_module_from_selection',
					cache:false,
                    dataType:'xml',
                    async :false,
					data  : "mod_id=1",
					contentType:'application/x-www-form-urlencoded',
					success : function (msg){
						alert("ok with remove_module_from_selection");
					},
					error: function(a, b, c){
					
						//alert("Erorr");
						
					}
                 });//ende Ajax
				
				
			}//ende Drop bei #pool droppable
		});
		
		//  mach ein poolmodul bei POOL draggable
		$(".poolmodule").draggable({
			revert : "invalid",
			helper : "clone"
			
			
		});
		$(".auswahlmodul").draggable({
			
			revert : "invalid"
		});
		
		
});//ende function



	
	
		
		
	
	
	
	

	
	


















