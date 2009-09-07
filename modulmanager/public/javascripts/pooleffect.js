/*--------------------------------------------------------------------------------------*/
//	     diese Datei macht den POOL beweglich mit slideDown und slideUP    				*/
// 		 und schickt die Daten modulID und entsprechenem Semester zum Server 			*/
//       nachdem das gezogene Modul in Auswahl reingetan wurde                          */															*/
/*--------------------------------------------------------------------------------------*/



/*---------slideDown und slideUp für den Teil POOL--------------------------------------*/

	$(function(){
	
	/*------------Bachelor--------------------------------------------------------------*/
			
			$(".Bachelor .Bachelor-Arbeit").hide();
			$(".Bachelor .Kerncurriculum").hide();
			$(".Bachelor .Spezialisierung").hide();
			
			$(".Bachelor .schluesselkompetenzen").hide();
			
			$(".Bachelor .Kerncurriculum .Pflichtmodule").hide();
				
				//$(".Bachelor .Spezialisierung .Wahlpflichtmodule").hide();
			
			
			var flipBa=0;
			$('.Bachelor a#a_link_bachelor').live("click",function(){
				if(flipBa%2==0){
					$(this).find("span.dreieck").empty().text("v ");
					$(".Bachelor .Bachelor-Arbeit").slideDown("slow");
					$(".Bachelor .Kerncurriculum").slideDown("slow");
					$(".Bachelor .Spezialisierung").slideDown("slow");
					$(".Bachelor .schluesselkompetenzen").slideDown("slow");
				
				}
				else {
					$(this).find("span.dreieck").empty().text("> ");
					$(".Bachelor .Bachelor-Arbeit").slideUp("slow");
					$(".Bachelor .Kerncurriculum").slideUp("slow");
					$(".Bachelor .Spezialisierung").slideUp("slow");
					$(".Bachelor .schluesselkompetenzen").slideUp("slow");
				
				}
				flipBa++;
				
				
				
		
			});
			
			
	/*------------Kerncurriculum---------------------------------------------------------*/
					
			var flipkern=0;
			$('.Bachelor .Kerncurriculum a#a_link_kern').live("click",function(){
					if(flipkern%2==0){
						$(this).find("span.dreieck").empty().text("v ");
					}
					else{
						$(this).find("span.dreieck").empty().text("> ");
					}
					$(".Bachelor .Kerncurriculum .Pflichtmodule").toggle("slow");
					flipkern++;
				
			});
			
	
	
	/*------------Pflichtmodule----------------------------------------------------------*/
	
		$(".Grundkurse").hide();
		$(".Praktika").hide();
		$(".Mathematik").hide();
		
		var flippflichtmodul=0;
			
		$(".Bachelor .Kerncurriculum .Pflichtmodule a#a_link_pflichtmodul").live("click",function(){
			
			if (flippflichtmodul%2==0){
				$(this).find("span.dreieck").empty().text("v ");
			
				$(".Grundkurse").slideDown("slow");
				$(".Praktika").slideDown("slow");
				$(".Mathematik").slideDown("slow");
			}
			else {
				$(this).find("span.dreieck").empty().text("> ");
				$(".Grundkurse").slideUp("slow");
				$(".Praktika").slideUp("slow");
				$(".Mathematik").slideUp("slow");
				
			}
			flippflichtmodul++;	
			
		});
	
		/*--------Grundkurse------------------------------------------------------------*/
			var flip=0;
			$(".Grundkurse  .divinternpoolmodul").hide();
			$(".Bachelor .Kerncurriculum .Pflichtmodule .Grundkurse a").live("click",function(){
				
				if (flip % 2 == 0) {
					$(this).find("span.dreieck").empty().text("v ");
					$(".Grundkurse  .divinternpoolmodul").slideDown("slow");
					
				}
				else {
					$(this).find("span.dreieck").empty().text("> ");
					$(".Grundkurse  .divinternpoolmodul").slideUp("slow");
					
					
				}
				flip++;
			});
	
		/*--------Praktika-------------------------------------------------------------*/
			
			var flip1=0;
			$(".Praktika .divinternpoolmodul").hide();
			$('.Praktika a').live("click",function(){
				if (flip1 % 2 == 0) {
					$(this).find("span.dreieck").empty().text("v ");
					$(".Praktika .divinternpoolmodul").slideDown("slow");
				}
				else {
					$(this).find("span.dreieck").empty().text("> ");
					$(".Praktika  .divinternpoolmodul").slideUp("slow");
				}
				flip1++;
			});
			
		/*--------Mathematik----------------------------------------------------------*/
			var flip2=0;
			$(".Mathematik .divinternpoolmodul").hide();
			$('.Mathematik a').live("click",function(){
				if (flip2 % 2 == 0) {
					$(this).find("span.dreieck").empty().text("v ");
					$(".Mathematik .divinternpoolmodul").slideDown("slow");
				}
				else {
					$(this).find("span.dreieck").empty().text("> ");
					$(".Mathematik  .divinternpoolmodul").slideUp("slow");
				}
				flip2++;
			});
			
	/*------------Spezialisierungsbereich---------------------------------------------*/
	
	/*------------Spezialisierung---------------------------------------------------------*/
					
			var flipspezial=0;
			$(".Bachelor .Spezialisierung .Wahlpflichtmodule").hide();
			
			$('.Bachelor .Spezialisierung a#a_link_spezialisierung').live("click",function(){
				
					if(flipspezial%2==0){
						$(this).find("span.dreieck").empty().text("v ");
						
					}
					else{
						$(this).find("span.dreieck").empty().text("> ");
					}
					$(".Bachelor .Spezialisierung .Wahlpflichtmodule").toggle("slow");
					flipspezial++;
				
			});
			
			
			
			
			
	/*------------Wahlpflichtmodule---------------------------------------------------------*/
					
			var flipwahlpflicht=0;
			$(".Spezialisierungsbereich").hide();
			$(".Profilierungsbereich").hide();
			
			$('.Bachelor .Spezialisierung .Wahlpflichtmodule a#a_link_wahlpflicht').live("click",function(){
				
					if(flipwahlpflicht%2==0){
						$(this).find("span.dreieck").empty().text("v ");
						$(".Spezialisierungsbereich").slideDown("slow");
						$(".Profilierungsbereich").slideDown("slow");
						
					}
					else{
						$(this).find("span.dreieck").empty().text("> ");
						$(".Spezialisierungsbereich").slideUp("slow");
						$(".Profilierungsbereich").slideUp("slow");
					}
					
					flipwahlpflicht++;
				
			});
	
	
	/*------------------------Spezialisierungsbereich------------------------------------*/
	
			var flipspebereich=0;
			$(".Spezialisierungspraktikum ").hide();
			$(".einfuehrungen").hide();
			$(".spezielle").hide();
			
			$('.Spezialisierungsbereich a#a_link_spezialisierungsbereich').live("click",function(){
				
					if(flipspebereich%2==0){
						$(this).find("span.dreieck").empty().text("v ");
						$(".Spezialisierungspraktikum ").slideDown("slow");
						$(".einfuehrungen").slideDown("slow");
						$(".spezielle").slideDown("slow");
						
					}
					else {
						$(this).find("span.dreieck").empty().text("> ");
						$(".Spezialisierungspraktikum ").slideUp("slow");
						$(".einfuehrungen").slideUp("slow");
						$(".spezielle").slideUp("slow");
					}
				
					flipspebereich++;
			});
	
	
	
	
		/*--------Spezialisierungspraktikum-------------------------------------*/
		
			var flip2a=0;
			$(".Spezialisierungspraktikum .divinternpoolmodul").hide();
			
			$(".Spezialisierungspraktikum a").live("click",function(){
				if (flip2a % 2 == 0) {
					$(this).find("span.dreieck").empty().text("v ");
					$(".Spezialisierungspraktikum .divinternpoolmodul").slideDown("slow");
				}
				else {
					$(this).find("span.dreieck").empty().text("> ");
					$(".Spezialisierungspraktikum .divinternpoolmodul").slideUp("slow");
					
				}
				flip2a++;
			});
			
		/*--------Einfuehrungen-----------------------------------------------*/
			var flip3=0;
			$(".einfuehrungen .divinternpoolmodul").hide();
			$(".einfuehrungen a").live("click",function(){
				if (flip3 % 2 == 0) {
					$(this).find("span.dreieck").empty().text("v ");
					$(".einfuehrungen .divinternpoolmodul").slideDown("slow");
				}
				else {
					$(this).find("span.dreieck").empty().text("> ");
					$(".einfuehrungen .divinternpoolmodul").slideUp("slow");
					
				}
				flip3++;
			});
			
		/*--------Spezielle Themen-----------------------------------------------*/
			var flip4=0;
			$(".spezielle .divinternpoolmodul").hide();
			$(".spezielle a").live("click",function(){
				if (flip4 % 2 == 0) {
					$(this).find("span.dreieck").empty().text("v ");
				
					$(".spezielle .divinternpoolmodul").slideDown("slow");
				}
				else {
					$(this).find("span.dreieck").empty().text("> ");
					$(".spezielle .divinternpoolmodul").slideUp("slow");
				}
				flip4++;
			});
			
	////////////////////////////////////////////////////////////////////////////////////////////////
	
	/*------------Profilierungsbereich---------------------------------------------------------*/
			var flip5=0;
			$(".Profilierungsbereich .divinternpoolmodul").hide();
			$(".Profilierungsbereich a").live("click",function(){
				if (flip5 % 2 == 0) {
					$(this).find("span.dreieck").empty().text("v ");
					$(".Profilierungsbereich .divinternpoolmodul").slideDown("slow");
				}
				else {
					$(this).find("span.dreieck").empty().text("> ");
					$(".Profilierungsbereich .divinternpoolmodul").slideUp("slow");
				}
				flip5++;
			});
			
	/*------------Schlüsselkompetenzen---------------------------------------------------------*/
	
			var flipkom=0;
			$(".Bachelor .schluesselkompetenzen .divinternpoolmodul").hide();
			
			$(".Bachelor .schluesselkompetenzen a").live("click",function(){
				if (flipkom % 2 == 0) {
					$(this).find("span.dreieck").empty().text("v ");
					$(".schluesselkompetenzen .divinternpoolmodul").slideDown("slow");
				}
				else {
					$(this).find("span.dreieck").empty().text("> ");
					$(".schluesselkompetenzen .divinternpoolmodul").slideUp("slow");
					
				}
				flipkom++;
			});

	/*------------Nanostrukturphysik----------------------------------------------------------*/
			
			var flip6=0;
			$(".Nanostrukturphysik .divinternpoolmodul").hide();
			$(".Nanostrukturphysik a").live("click",function(){
				if (flip6 % 2 == 0) {
					$(this).find("span.dreieck").empty().text("v ");
					$(".Nanostrukturphysik .divinternpoolmodul").slideDown("slow");
				}
				else {
					$(this).find("span.dreieck").empty().text("> ");
					$(".Nanostrukturphysik .divinternpoolmodul").slideUp("slow");
				}
				flip6++;
				
			});
			
			
			
	/*------------Physikinformatik---------------------------------------------------------*/
			var flip7=0;
			$(".Physikinformatik .divinternpoolmodul").hide();
			$(".Physikinformatik a").live("click",function(){
				if (flip7 % 2 == 0) {
					$(this).find("span.dreieck").empty().text("v ");
					$(".Physikinformatik  .divinternpoolmodul").slideDown("slow");
				}
				else {
					$(this).find("span.dreieck").empty().text("> ");
					$(".Physikinformatik  .divinternpoolmodul").slideUp("slow");
				}
				flip7++;
			});
			
	/*------------Astro- und Geophysik---------------------------------------------------------*/

			var flip8=0;
			$(".astro .divinternpoolmodul").hide();
			$(".astro a").live("click",function(){
				if (flip8 % 2 == 0) {
					$(this).find("span.dreieck").empty().text("v ");
					$(".astro .divinternpoolmodul").slideDown("slow");
				}
				else {
					$(this).find("span.dreieck").empty().text("> ");
					$(".astro .divinternpoolmodul").slideUp("slow");
				}
				flip8++;
			});
			
	/*------------Biophysik und Physik komplexer Systeme----------------------------------------*/

			var flip9=0;
			$(".biophysik .divinternpoolmodul").hide();
			$(".biophysik a").live("click",function(){
				if (flip9 % 2 == 0) {
					$(this).find("span.dreieck").empty().text("v ");
					$(".biophysik .divinternpoolmodul").slideDown("slow");
				}
				else {
					$(this).find("span.dreieck").empty().text("> ");
					$(".biophysik .divinternpoolmodul").slideUp("slow");
				}
				flip9++;
			});		
			
	/*------------Festkörper- und Materialphysik------------------------------------------------*/

			var flip10=0;
			$(".materialphysik .divinternpoolmodul").hide();
			$(".materialphysik a").live("click",function(){
				if (flip10 % 2 == 0) {
					$(this).find("span.dreieck").empty().text("v ");
					$(".materialphysik .divinternpoolmodul").slideDown("slow");
				}
				else {
					$(this).find("span.dreieck").empty().text("> ");
					$(".materialphysik .divinternpoolmodul").slideUp("slow");
				}	
				flip10++;
			});	
			
	/*------------Kern- und Teilchenphysik------------------------------------------------------*/
			var flip11=0;
			$(".teilchenphysik .divinternpoolmodul").hide();
			$(".teilchenphysik a").live("click",function(){
				if (flip11 % 2 == 0) {
					$(this).find("span.dreieck").empty().text("v ");
					$(".teilchenphysik .divinternpoolmodul").slideDown("slow");
				}
				else {
					$(this).find("span.dreieck").empty().text("> ");
					$(".teilchenphysik .divinternpoolmodul").slideUp("slow");
				}
				flip11++;
			});			
					
			
	});//ende global function
	

/*----------POOL Drag and Drop----------------------------------------------------------*/
	
	$(function(){
		// mach unseres POOL droppable
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



	
	
		
		
	
	
	
	

	
	


















