		var pool = function(){


                                                       var XML = $.ajax({

                                                                type: 'GET',
                                                                url: 'http://localhost:3000/abfragen/pool',
                                                                async: false,
                                                                contentType: 'application/x-www-form-urlencoded',


                                                                error: function(a, b, c){
                                                                        alert('Error');
                                                                }



                                                        }).responseXML; //ende AJAX

                                                        var root = XML.documentElement;
														
														//+++++++++Rekursiv++++++++++++++++++++++++++++++++++++++++++

                                                        var poolrekursiv = function(root){
                                                            var allchildren = $(root).children();

                                                                var children = allchildren.length; // anfang 7 Kinder
                                                                        if(children ==0) {
                                                                                return;
                                                                        }

                                                                        else {

                                                                                $(root).children().each(function(){

                                                                                //alle Kinder in einem Konten durchlaufen


                                                                                  if ($(this).attr("name")) {    //gibt es attr: name? ( module haben keine attr name)

                                                                                                          var name = $(this).attr("name");    //attr name  in ein attr class  umwandeln

                                                                                                        if ($(this).attr("class")) {        // check class bei Allgemein und allen Schwerrpunk, modul hat kein

                                                                                                                var c = $(this).attr("class");

                                                                                                                switch (name){

                                                                                                                        case "Bachelor":
                                                                                                                                $("#pool").append("<div class='" + name +  "' class='poolkategory' class='" + c +  "' >" +"<a>" +name + "</a></div>");
                                                                                                                                break;
																																
																														case "Nanostrukturphysik":
                                                                                                                                
                                                                                                                                $("#pool").append("<div class='" + name +  "' class='poolkategory' class='" + c +  "' >" +"<a>"+ name + "</a><ul></ul></div>");
                                                                                                                                break;
																																
																														case "Physikinformatik":
                                                                                                                                
                                                                                                                                $("#pool").append("<div class='" + name +  "' class='poolkategory' class='" + c +  "' >" +"<a>"+ name + "</a><ul></ul></div>");
                                                                                                                                break;


                                                                                                                        case "Astro- und Geophysik":
                                                                                                                                var neuname = name.replace(/Astro- und Geophysik/g,"astro");
                                                                                                                                $("#pool").append("<div class='" + neuname +  "' class='poolkategory' class='" + c +  "' >" +"<a>"+ name + "</a><ul></ul></div>");
                                                                                                                                break;

                                                                                                                        case "Biophysik und Physik komplexer Systeme":
                                                                                                                                var neuname = name.replace(/Biophysik und Physik komplexer Systeme/g,"biophysik");
                                                                                                                                $("#pool").append("<div class='" + neuname +  "' class='poolkategory' class='" + c +  "' >" +"<a>"+ name + "</a><ul></ul></div>");
                                                                                                                                break;

                                                                                                                        case "Festk&ouml;rper- und Materialphysik":
                                                                                                                                var neuname = name.replace(/Festk&ouml;rper- und Materialphysik/g,"materialphysik");
                                                                                                                                $("#pool").append("<div class='" + neuname +  "' class='poolkategory' class='" + c +  "' >" +"<a>"+ name + "</a><ul></ul></div>");
                                                                                                                                break;

                                                                                                                        case "Kern- und Teilchenphysik":
                                                                                                                                var neuname = name.replace(/Kern- und Teilchenphysik/g,"teilchenphysik");
                                                                                                                                $("#pool").append("<div class='" + neuname +  "' class='poolkategory' class='" + c +  "' >" +"<a>"+ name + "</a><ul></ul></div>");
                                                                                                                                break;

                                                                                                                        default:
                                                                                                                                break;

                                                                                                                }



                                                                                                        }

                                                                                                        else {

                                                                                                                var idnumber = $(this).attr("id");
                                                                                                                switch (name){
                                                                                                                        // name = attr ("name")
                                                                                                                        // Eben Bachelor Allgemein



                                                                                                                        case "Bachelor-Arbeit":

                                                                                                                                $("#pool .Bachelor").append("<div class='" + name +  "'  class='poolkategory' id='" + idnumber +  "' >" + name + "</div>");

                                                                                                                                //alert(name);
                                                                                                                                break;

                                                                                                                        case "Kerncurriculum":
                                                                                                                                $("#pool .Bachelor").append("<div class='" + name +  "' class='poolkategory' id='" + idnumber +  "' >" + name + "</div>");
                                                                                                                                //alert(name);
                                                                                                                                break;

                                                                                                                                // Eben Bachelor Allgemein>Kern

                                                                                                                                case "Pflichtmodule":
                                                                                                                                        $("#pool .Bachelor .Kerncurriculum").append("<div class='" + name +  "' class='poolkategory' id='" + idnumber +  "' >" +"<a>"+ name + "</a></div>");

                                                                                                                                        break;

                                                                                                                                        // Eben Bachelor Allgemein>Kern>Pflichtmodule

                                                                                                                                        case "Grundkurse":
                                                                                                                                        $("#pool .Bachelor .Kerncurriculum .Pflichtmodule").append("<div class='" + name +  "'  class='poolkategory' id='" + idnumber +  "' >"+name +"<ul></ul></div>");

                                                                                                                                        break;

                                                                                                                                        case "Praktika":
                                                                                                                                        $("#pool .Bachelor .Kerncurriculum .Pflichtmodule").append("<div class='" + name +  "'  class='poolkategory' id='" + idnumber +  "' >" + name +"<ul></ul></div>");

                                                                                                                                        break;

                                                                                                                                        case "Mathematik":
                                                                                                                                        $("#pool .Bachelor .Kerncurriculum .Pflichtmodule").append("<div class='" + name +  "'  class='poolkategory' id='" + idnumber +  "' >" + name +"<ul></ul></div>");

                                                                                                                                        break;

                                                                                                                        case "Spezialisierung":
                                                                                                                                $("#pool .Bachelor").append("<div class='" + name +  "' class='poolkategory' id='" + idnumber +  "' >" + name + "</div>");

                                                                                                                                break;

                                                                                                                                // Eben Bachelor Allgemein>Spezialisierung***********************************

                                                                                                                                case "Wahlpflichtmodule":
                                                                                                                                        $("#pool .Bachelor .Spezialisierung").append("<div class='" + name +  "' class='poolkategory' id='" + idnumber +  "' >" + name + "</div>");

                                                                                                                                break;

                                                                                                                                        // Eben Bachelor Allgemein>Spezialisierung>Wahlpflichtmodule*************************

                                                                                                                                        case "Spezialisierungsbereich":
                                                                                                                                                $("#pool .Bachelor .Spezialisierung .Wahlpflichtmodule").append("<div class='" + name +  "' class='poolkategory' id='" + idnumber +  "' >" + name + "</div>");
                                                                                                                                        break;

                                                                                                                                                // Eben Bachelor Allgemein>Spezialisierung>Wahlpflichtmodule>Spezialisierungsbereich*******************************

                                                                                                                                                case "Spezialisierungspraktikum":
                                                                                                                                                        $("#pool .Bachelor .Spezialisierung .Wahlpflichtmodule .Spezialisierungsbereich").append("<div class='" + name +  "' class='poolkategory' id='" + idnumber +  "' >" + name + "<ul></ul></div>");

                                                                                                                                                break;

                                                                                                                                                case "Einf&uuml;hrungen":
                                                                                                                                                        var neuname = name.replace(/Einf&uuml;hrungen/g,"einfuehrungen");
                                                                                                                                                        $("#pool .Bachelor .Spezialisierung .Wahlpflichtmodule .Spezialisierungsbereich").append("<div class='" + neuname +  "' class='poolkategory' id='" + idnumber +  "' >" + name + "<ul></ul></div>");

                                                                                                                                                        break;

                                                                                                                                                case "Spezielle Themen":
                                                                                                                                                        var neuname = name.replace(/Spezielle Themen/g,"spezielle");
                                                                                                                                                        $("#pool .Bachelor .Spezialisierung .Wahlpflichtmodule .Spezialisierungsbereich").append("<div class='" + neuname +  "' class='poolkategory' id='" + idnumber +  "' >" + name + "<ul></ul></div>");

                                                                                                                                                break;


                                                                                                                        case "Profilierungsbereich":
                                                                                                                                                $("#pool .Bachelor .Spezialisierung .Wahlpflichtmodule").append("<div class='" + name +  "' class='poolkategory' id='" + idnumber +  "' >" + name + "<ul></ul></div>");
                                                                                                                                        break;


                                                                                                                           case "Schl&uuml;sselkompetenzen":
                                                                                                                                var neuname = name.replace(/Schl&uuml;sselkompetenzen/g,"schluesselkompetenzen");
																																
                                                                                                                                $("#pool").append("<div  class='" +neuname +  "'   class='poolkategory' id='" + idnumber +  "' >" +"<a>"+ name + "</a><ul></ul></div>");

                                                                                                                                break;





                                                                                                                        default:
                                                                                                                                break;
                                                                                                                }



                                                                                                        }






                                                                                  }

                                                                                  else if($(this).is("module")){  //nur module rausholen
                                                                                                        var parent=$(this).parent().attr("name");
                                                                                                        var name = $(this).find("name").text();
                                                                                                        var id   = $(this).find("id").text();

                                                                                                        switch (parent) {
                                                                                                                case "Grundkurse":

                                                                                                                        $("#pool .Bachelor .Kerncurriculum .Pflichtmodule .Grundkurse ul").append("<li class='poolmodule' id="+id+">"+name+"</li>");
																														
                                                                                                                        break;

                                                                                                                case "Praktika":

                                                                                                                        $("#pool .Bachelor .Kerncurriculum .Pflichtmodule .Praktika ul").append("<li class='poolmodule' id="+id+">"+name+"</li>");
                                                                                                                        break;

                                                                                                                case "Mathematik":

                                                                                                                        $("#pool .Bachelor .Kerncurriculum .Pflichtmodule .Mathematik ul").append("<li class='poolmodule' id="+id+">"+name+"</li>");
                                                                                                                        break;

                                                                                                                case "Spezialisierungspraktikum":
                                                                                                                        $("#pool .Bachelor .Spezialisierung .Wahlpflichtmodule .Spezialisierungsbereich .Spezialisierungspraktikum ul").append("<li class='poolmodule' id="+id+">"+name+"</li>");


                                                                                                                break;

                                                                                                                case "Einf&uuml;hrungen":
                                                                                                                        $("#pool .Bachelor .Spezialisierung .Wahlpflichtmodule .Spezialisierungsbereich .einfuehrungen ul").append("<li class='poolmodule' id="+id+">"+name+"</li>");


                                                                                                                break;

                                                                                                                case "Spezielle Themen":
                                                                                                                        $("#pool .Bachelor .Spezialisierung .Wahlpflichtmodule .Spezialisierungsbereich .spezielle ul").append("<li class='poolmodule' id="+id+">"+name+"</li>");


                                                                                                                break;

                                                                                                                case "Profilierungsbereich":
                                                                                                                        $("#pool .Bachelor .Spezialisierung .Wahlpflichtmodule .Profilierungsbereich ul").append("<li class='poolmodule' id="+id+">"+name+"</li>");


                                                                                                                break;



                                                                                                                case "Schl&uuml;sselkompetenzen":
                                                                                                                        $("#pool .schluesselkompetenzen ul").append("<li class='poolmodule' id="+id+">"+name+"</li>");
                                                                                                                        break;
                                                                                                                case "Nanostrukturphysik":
                                                                                                                        $("#pool .Nanostrukturphysik ul").append("<li class='poolmodule' id="+id+">"+name+"</li>");
                                                                                                                        break;

                                                                                                                case "Physikinformatik":
                                                                                                                        $("#pool .Physikinformatik ul").append("<li class='poolmodule' id="+id+">"+name+"</li>");
                                                                                                                        break;
                                                                                                                        //alert(id);?????????????????

                                                                                                                case "Astro- und Geophysik":


                                                                                                                        $("#pool .astro ul ").append("<li class='poolmodule' id="+id+">"+name+"</li>");
                                                                                                                        break;

                                                                                                                case "Biophysik und Physik komplexer Systeme":

                                                                                                                        $("#pool .biophysik ul ").append("<li class='poolmodule' id="+id+">"+name+"</li>");
                                                                                                                        break;

                                                                                                                case "Festk&ouml;rper- und Materialphysik":

                                                                                                                        $("#pool .materialphysik ul ").append("<li class='poolmodule' id="+id+">"+name+"</li>");
                                                                                                                        break;

                                                                                                                case "Kern- und Teilchenphysik":

                                                                                                                        $("#pool .teilchenphysik ul ").append("<li class='poolmodule' id="+id+">"+name+"</li>");
                                                                                                                        break;




                                                                                                                default:
                                                                                                                        break;
                                                                                                        }




                                                                                  }


                                                                                poolrekursiv(this);





                                                                                });//ende each


                                                                        }//ende erste Else





                                                        }//ende poolrekursiv

                                                        poolrekursiv(root);


                         }//ende pool
						 
		//////////////////////semesterhinzu/////////////////////////////////////

		$(function(){

                                $('#semesterhinzu').live("click",function(){
                                        var n = $('#semester-content div.semester').length+1;
										
										// var l für Löschen gedacht
										var l = $('#semester-content div.semester').length+1;
										
										
										
										// neue Semester und Löschen reintun
										// <div class="semester">
										//		<div class='subsemester'> 
										//				semester 10
										//		</div>
										//		<p>
										//			Löschen
										//		</p>
										// </div>
                                        var neu = "<div class='semester' id='semester"+n+"'>"+"<div class='subsemester'><h5>"+n+".Semester"+"</h5></div></div>";
										

                                        $("#semester-content").append(neu);
									
										// "Löschen" wird immer in dem letzen Semester hinzufügen
										// d.h: andere ""Löschen" werden weggemacht.
										
										if (n >= 3){
											for ( i=2; i<n; i++ ){
												$("#semester"+i+" p").remove();
											}
										}
										$("#semester"+n).append("<p style='cursor:pointer' class='semesterloeschen'>L&ouml;schen</p>");
										
										
										
									
										// ein Modul reinziehn
                                        $(".semester").droppable({
                                                hoverClass:'drophover',
												
                                                drop: function(event,ui){
													
														var modulID = $(ui.draggable).attr("id"); 
														
														var semester = $(this).attr("id");
														
														
														$(ui.draggable).hide();

                                                        
                                                       
                                                        var xml=$.ajax({
                                                        	type: 'POST',
                                                        	url :'http://localhost:3000/abfragen/pool',
                                                        	dataType:'xml',
															data : "name:quan",
                                                        	cache:false,
                                                        	async :true,
                                                        	contentType:'application/x-www-form-urlencoded',
                                                       		success: function(msg){

                                                       		 },
                                                       		error: function (a,b,c){
                                                                alert("Erorr");
                                                       		 }

                                               			 }).responseXML;
														 
														 //das reingezogenem Modul anzeigen
														 
														 var root = xml.documentElement;
														 
														 $(root).find("module").each(function(){
														 	if ( $(this).find("id").text() == modulID ){
																var name  = $(this).find("name").text();
																
																var short = $(this).find("short").text();
																var credits = $(this).find("credits").text();
																
																//$("#"+semester).append("<div class='auswahlmodul'>"+name+" ("+short+") "+credits+"C"+"</div>").fadeOut("fast").fadeIn("fast");
																
																// formatieren mit Table
																
																$("#"+semester+" .subsemester").append("<div class='auswahlmodul'>"+"<table border='0'><tbody><colgroup><col width='570'><col width='50'></colgroup><tr><td>"+name+"("+short+")<span style='color:red ;font-weight:bold' class='modulloeschen'>[X]</span></td><td>"+credits+"C</td></tr></tbody></table></div>");
																$("#"+semester).fadeOut("fast").fadeIn("fast");
																$(".auswahlmodul").draggable({
																	
																	revert:"invalid"
																});
															}
															
														 	
														 });//ende each bei suche nach ID-Modul
														 


                                                }//ende Drop
                                        });//droppable
                                });//ende live
		});//ende function


		/////////////////////semester löschen//////////////////////////////////
		
		// "Löschen" wird geklick 
		
		$(function(){

		
		$(".semesterloeschen").live('click',function(){
			var l = $(".semester").length;
			if (l >= 3) {
			
				$("#semester" + l).remove();
				$("#semester" + (l - 1)).append("<p style='cursor:pointer' class='semesterloeschen'>L&ouml;schen</p>");
			}
			else if (l==2){
				$("#semester"+l).remove();
				
				
			}								
		});
		}); //ende function
		
		///////////////////auswahlmodul loeschen///////////////////////////////
		/// bei Click auf <span class="modulloeschen">
		$(function(){
			
			$("span.modulloeschen").live("click",function(){
				
				$(this).remove();
			});
			
			
			
			
		});
		
		
		
		
		
		
		
		
		
		
		
		
		


