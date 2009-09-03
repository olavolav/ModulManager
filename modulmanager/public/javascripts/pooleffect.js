


$(function(){
	
	/*------------Bachelor--------------------------------------------------------------*/
			
			$(".Bachelor .Bachelor-Arbeit").hide();
			$(".Bachelor .Kerncurriculum").hide();
			$(".Bachelor .Spezialisierung").hide();
			
			
			
			$('.Bachelor a').live("click",function(){
				
				$(".Bachelor .Bachelor-Arbeit").toggle("slow");
				$(".Bachelor .Kerncurriculum").toggle("slow");
				$(".Bachelor .Spezialisierung").toggle("slow");
				
				
				
		
			});
	
	/*------------Pflichtmodule---------------------------------------------------------*/
			
		/*	$(".Pflichtmodule .Grundkurse").hide();
			$(".Pflichtmodule .Praktika").hide();
			$(".Pflichtmodule .Mathematik").hide();	
			
			$(".Pflichtmodule a").live("click",function(){
				$(".Pflichtmodule .Grundkurse").toggle("slow");
				$(".Pflichtmodule .Praktika").toggle("slow");
				$(".Pflichtmodule .Mathematik").toggle("slow");
				
			});
		*/
	
		/*--------Grundkurse-----------------------------------------------*/
		
			$(".Grundkurse  ul").hide();
			$('.Grundkurse ').live("click",function(){
				$(".Grundkurse  ul").toggle("slow");
		
			});
	
		/*--------Praktika-------------------------------------------------*/
	
			$(".Praktika ul").hide();
			$('.Praktika').live("click",function(){
				$(".Praktika ul").toggle("slow");
		
			});
			
		/*--------Mathematik-------------------------------------------------*/
	
			$(".Mathematik ul").hide();
			$('.Mathematik').live("click",function(){
			$(".Mathematik ul").toggle("slow");
		
			});
			
	/*------------Spezialisierungsbereich---------------------------------------------------------*/
		/*--------Spezialisierungspraktikum-----------------------------------------------*/
			
			$(".Spezialisierungspraktikum ul").hide();
			$(".Spezialisierungspraktikum").live("click",function(){
				$(".Spezialisierungspraktikum ul").toggle("slow");
			});
			
		/*--------Einfuehrungen-----------------------------------------------*/
			
			$(".einfuehrungen ul").hide();
			$(".einfuehrungen").live("click",function(){
				$(".einfuehrungen ul").toggle("slow");
			});
			
		/*--------Spezielle Themen-----------------------------------------------*/
			
			$(".spezielle ul").hide();
			$(".spezielle").live("click",function(){
				$(".spezielle ul").toggle("slow");
			});
			
	////////////////////////////////////////////////////////////////////////////////////////////////
	
	/*------------Profilierungsbereich---------------------------------------------------------*/
	
			$(".Profilierungsbereich ul").hide();
			$(".Profilierungsbereich").live("click",function(){
				$(".Profilierungsbereich ul").toggle("slow");
			});
			
	/*------------Schlüsselkompetenzen---------------------------------------------------------*/
	
			$(".schluesselkompetenzen ul").hide();
			$(".schluesselkompetenzen").live("click",function(){
				$(".schluesselkompetenzen ul").toggle("slow");
			});

	/*------------Nanostrukturphysik---------------------------------------------------------*/

			$(".Nanostrukturphysik ul").hide();
			$(".Nanostrukturphysik").live("click",function(){
				$(".Nanostrukturphysik ul").toggle("slow");
				
				
			});
			
			
			
	/*------------Physikinformatik---------------------------------------------------------*/

			$(".Physikinformatik ul").hide();
			$(".Physikinformatik ").live("click",function(){
				$(".Physikinformatik  ul").toggle("slow");
			});
			
	/*------------Astro- und Geophysik---------------------------------------------------------*/

			$(".astro ul").hide();
			$(".astro").live("click",function(){
				$(".astro ul").toggle("slow");
			});
			
	/*------------Biophysik und Physik komplexer Systeme---------------------------------------------------------*/

			$(".biophysik ul").hide();
			$(".biophysik").live("click",function(){
				$(".biophysik ul").toggle("slow");
			});		
			
	/*------------Festkörper- und Materialphysik---------------------------------------------------------*/

			$(".materialphysik ul").hide();
			$(".materialphysik").live("click",function(){
				$(".materialphysik ul").toggle("slow");
			});	
			
	/*------------Kern- und Teilchenphysik---------------------------------------------------------*/

			$(".teilchenphysik ul").hide();
			$(".teilchenphysik").live("click",function(){
				$(".teilchenphysik ul").toggle("slow");
			});			
					
			
});//ende global function

	/*----------POOL Drag and Drop---------------------------------------------------------------------------*/
	
	$(function(){
		
		$("ul li").draggable({
			revert : "invalid"
			
			
		});
		$(".auswahlmodul").draggable({
			
			revert : "invalid"
		});
		
		
	});



	/*----------AJAX aufrufen wenn ein Modul in Auswahl reinziehen---------------------------------------------------------------------------*/
	
	$(function(){


                                $('.semester').droppable({
                                        //accept: 'li',
                                        hoverClass: 'drophover',

                                        drop: function(event, ui){
												
												// id von reingezogenem Modul und entsprechendem Semester holen
												
												var modulID = $(ui.draggable).attr("id"); 
												var semester = $(this).attr("id");
												$(ui.draggable).hide();
                                                
												
												// DATEN mit Modul-ID und semester zum Server schicken 
												// xml enthaltet die XML-DATEI  von abfragen/auswahl. Hier mit pool zum Testen
                                                var xml=$.ajax({
                                                        type: 'GET',
														//URL hier eigentlich abfragen/auswahl, hier mit pool zum Testen
                                                        url : 'http://localhost:3000/abfragen/pool',

                                                        cache:false,
                                                        dataType:'xml',
                                                        async :false,

                                                        contentType:'application/x-www-form-urlencoded',
														error: function(a, b, c){
														
															alert("Erorr");
															
														}
                                                        

                                                }).responseXML;//ende Ajax
                                                
												
												
												//-----Implementierung der Funktion auswahlAnzeige() mit XML-Datei von abfragen/auswahl******************
												// hier mit abfragen/pool zum Testen
												// immer noch bei DROP in DROPPABLE 
												
												var root = xml.documentElement;
												
												var auswahlAnzeige = function (modulID,semester,root){
													// var semester ist ID für das entsprechem Semester-Box
													$(root).find("module").each( function(){
														// suche module mit modulID
														
														if ( $(this).find("id").text() == modulID ){
															var name  = $(this).find("name").text();
															var short = $(this).find("short").text();
															var credits = $(this).find("credits").text();
															
															// das Modul in entsprechenem Semester hineinfügen
															
															//$("#"+semester).append("<div class='auswahlmodul'>"+"<ul><li>"+name+"</li><li>"+" ("+short+") "+"</li><li class='credits'>"+credits+"C</li></ul></div>").fadeOut("fast").fadeIn("fast");
															
															//formatieren mit Table
															
															$("#"+semester).append("<div class='auswahlmodul'>"+"<table border='0'><tbody><colgroup><col width='570'><col width='50'></colgroup><tr><td>"+name+"("+short+")<span style='color:red ;font-weight:bold' class='modulloeschen'>[X]</span></td>"+"<td>"+credits+"C</td></tr></tbody></table></div>").fadeOut("fast").fadeIn("fast");
															$(".auswahlmodul").draggable({
																revert:"invalid"
															});
															
														}
														
														
														
													});//ende each bei Suche nach ID von einem Modul
												}//ende auswahlAnzeige
                                                
												auswahlAnzeige(modulID,semester,root);	
													
													
													
													
													
												
												
												
                                                
												
                                                
												
												
                                         }//ende Drop
                                  });//ende droppable

								
	
									
	
	
								



                                      

                                        




    });//ende function für AJAX-Aufruf
	
	
	
	


















