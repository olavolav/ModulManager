
/*----------------POOL anzeigen-----------------------------------------------------*/
//---------------pool() wird in index.html aufrufen---------------------------------
//              pool() ruft die poolrekursiv auf------------------------------------ 
//              pool gibt XML-Datei zurück------------------------------------------         

//----------------------------------------------------------------------------------









//----Poolrekursive implementieren--------------------------------------

//+++++++++Rekursiv++++++++++++++++++++++++++++++++++++++++++++++++++++++



var poolrekursiv = function(root){
	
		// photo path
		var wahlpflichtbild = "<img src='images/Wahlpflicht.png' style='cursor:pointer'>";
		var pflichtbild     = "<img src='images/Pflicht.png' style='cursor:pointer'>";
		var wahlbild    = "<img src='images/Wahl.png' style='cursor:pointer' >";
		var fragebild     = "<img src='images/Fragezeichen.png' style='cursor:pointer'>";
		var ipunkt    = "<img src='images/iPunkt.png' style='cursor:pointer'>";

	
	
		
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
                                    $("#pool").append("<div class='" + name +  "' class='poolkategory' class='" + c +  "' >" +"<a id='a_link_bachelor'><span class='dreieck' style='display:inline; font-weight:bold; background-color:yellow'>> </span>"+name + "</a></div>");
                                    break;
									
							case "Nanostrukturphysik":
                                    
                                    $("#pool").append("<div class='" + name +  "' class='poolkategory' class='" + c +  "' >" +"<a><span class='dreieck' style='display:inline; font-weight:bold; background-color:yellow'>> </span>"+ name + "</a><div class='divinternpoolmodul'></div></div>");
                                    break;
									
							case "Physikinformatik":
                                    
                                    $("#pool").append("<div class='" + name +  "' class='poolkategory' class='" + c +  "' >" +"<a><span class='dreieck' style='display:inline; font-weight:bold; background-color:yellow'>> </span>"+ name + "</a><div class='divinternpoolmodul'></div></div>");
                                    break;


                            case "Astro- und Geophysik":
                                    var neuname = name.replace(/Astro- und Geophysik/g,"astro");
                                    $("#pool").append("<div class='" + neuname +  "' class='poolkategory' class='" + c +  "' >" +"<a><span class='dreieck' style='display:inline; font-weight:bold; background-color:yellow'>> </span>"+ name + "</a><div class='divinternpoolmodul'></div></div>");
                                    break;

                            case "Biophysik und Physik komplexer Systeme":
                                    var neuname = name.replace(/Biophysik und Physik komplexer Systeme/g,"biophysik");
                                    $("#pool").append("<div class='" + neuname +  "' class='poolkategory' class='" + c +  "' >" +"<a><span class='dreieck' style='display:inline; font-weight:bold; background-color:yellow'>> </span>"+ name + "</a><div class='divinternpoolmodul'></div></div>");
                                    break;

                            case "Festk&ouml;rper- und Materialphysik":
                                    var neuname = name.replace(/Festk&ouml;rper- und Materialphysik/g,"materialphysik");
                                    $("#pool").append("<div class='" + neuname +  "' class='poolkategory' class='" + c +  "' >" +"<a><span class='dreieck' style='display:inline; font-weight:bold; background-color:yellow'>> </span>"+ name + "</a><div class='divinternpoolmodul'></div></div>");
                                    break;

                            case "Kern- und Teilchenphysik":
                                    var neuname = name.replace(/Kern- und Teilchenphysik/g,"teilchenphysik");
                                    $("#pool").append("<div class='" + neuname +  "' class='poolkategory' class='" + c +  "' >" +"<a><span class='dreieck' style='display:inline; font-weight:bold; background-color:yellow'>> </span>"+ name + "</a><div class='divinternpoolmodul'></div></div>");
                                    break;

                            default:
                                    break;

                     }//ende 1.Switch
	
	
	
	                }
					
					// hier alle andere , die kein Schwerpunkt und Bachelor sind, durchlaufen
					// name ist  attr name in einem Knot
					// idnumber ist attr id in einem Knot
	                else {
	
	                    var idnumber = $(this).attr("id");
	                    switch (name){
                        // name = attr ("name")
                        // Eben Bachelor Allgemein



                        case "Bachelor-Arbeit":

                                $("#pool .Bachelor").append("<div class='" + name +  "'  class='poolkategory' id='" + idnumber +  "' >"+"<a><span class='dreieck' style='display:inline; font-weight:bold; background-color:yellow'>> </span>" + name +"</a>"+ "</div>");

                                //alert(name);
                                break;

                        case "Kerncurriculum":
                                $("#pool .Bachelor").append("<div class='" + name +  "' class='poolkategory' id='" + idnumber +  "' >" +"<a id='a_link_kern'><span class='dreieck' style='display:inline; font-weight:bold; background-color:yellow'>> </span>"+ name +"</a>"+ "</div>");
                                //alert(name);
                                break;

                                // Eben Bachelor Allgemein>Kern

                                case "Pflichtmodule":
                                        $("#pool .Bachelor .Kerncurriculum").append("<div class='" + name +  "' class='poolkategory' id='" + idnumber +  "' >" +"<a id='a_link_pflichtmodul'><span class='dreieck' style='display:inline; font-weight:bold; background-color:yellow'>> </span>"+ name + "</a></div>");

                                        break;

                                        // Eben Bachelor Allgemein>Kern>Pflichtmodule

                                        case "Grundkurse":
                                        $("#pool .Bachelor .Kerncurriculum .Pflichtmodule").append("<div class='" + name +  "'  class='poolkategory' id='" + idnumber +  "' >"+"<a><span class='dreieck' style='display:inline; font-weight:bold; background-color:yellow'>> </span>"+name +"</a><div class='divinternpoolmodul'></div></div>");

                                        break;

                                        case "Praktika":
                                        $("#pool .Bachelor .Kerncurriculum .Pflichtmodule").append("<div class='" + name +  "'  class='poolkategory' id='" + idnumber +  "' >" +"<a><span class='dreieck' style='display:inline; font-weight:bold; background-color:yellow'>> </span>"+ name +"</a><div class='divinternpoolmodul'></div></div>");

                                        break;

                                        case "Mathematik":
                                        $("#pool .Bachelor .Kerncurriculum .Pflichtmodule").append("<div class='" + name +  "'  class='poolkategory' id='" + idnumber +  "' >" +"<a><span class='dreieck' style='display:inline; font-weight:bold; background-color:yellow'>> </span>"+ name +"</a><div class='divinternpoolmodul'></div></div>");

                                        break;

                        case "Spezialisierung":
                                $("#pool .Bachelor").append("<div class='" + name +  "' class='poolkategory' id='" + idnumber +  "' >" +"<a id='a_link_spezialisierung'><span class='dreieck' style='display:inline; font-weight:bold; background-color:yellow'>> </span>"+ name +"</a>"+ "</div>");

                                break;

                                // Eben Bachelor Allgemein>Spezialisierung***********************************

                                case "Wahlpflichtmodule":
                                        $("#pool .Bachelor .Spezialisierung").append("<div class='" + name +  "' class='poolkategory' id='" + idnumber +  "' >"+"<a id='a_link_wahlpflicht'><span class='dreieck' style='display:inline; font-weight:bold; background-color:yellow'>> </span>" + name +"</a>"+ "</div>");

                                break;

                                        // Eben Bachelor Allgemein>Spezialisierung>Wahlpflichtmodule*************************

                                        case "Spezialisierungsbereich":
                                                $("#pool .Bachelor .Spezialisierung .Wahlpflichtmodule").append("<div class='" + name +  "' class='poolkategory' id='" + idnumber +  "' >" +"<a id='a_link_spezialisierungsbereich'><span class='dreieck' style='display:inline; font-weight:bold; background-color:yellow'>> </span>"+ name +"</a>"+ "</div>");
                                        break;

                                                // Eben Bachelor Allgemein>Spezialisierung>Wahlpflichtmodule>Spezialisierungsbereich*******************************

                                                case "Spezialisierungspraktikum":
                                                        $("#pool .Bachelor .Spezialisierung .Wahlpflichtmodule .Spezialisierungsbereich").append("<div class='" + name +  "' class='poolkategory' id='" + idnumber +  "' >" +"<a><span class='dreieck' style='display:inline; font-weight:bold; background-color:yellow'>> </span>"+ name +"</a>"+ "<div class='divinternpoolmodul'></div></div>");

                                                break;

                                                case "Einf&uuml;hrungen":
                                                        var neuname = name.replace(/Einf&uuml;hrungen/g,"einfuehrungen");
                                                        $("#pool .Bachelor .Spezialisierung .Wahlpflichtmodule .Spezialisierungsbereich").append("<div class='" + neuname +  "' class='poolkategory' id='" + idnumber +  "' >" +"<a><span class='dreieck' style='display:inline; font-weight:bold; background-color:yellow'>> </span>"+ name +"</a>"+ "<div class='divinternpoolmodul'></div></div>");

                                                        break;

                                                case "Spezielle Themen":
                                                        var neuname = name.replace(/Spezielle Themen/g,"spezielle");
                                                        $("#pool .Bachelor .Spezialisierung .Wahlpflichtmodule .Spezialisierungsbereich").append("<div class='" + neuname +  "' class='poolkategory' id='" + idnumber +  "' >"+"<a><span class='dreieck' style='display:inline; font-weight:bold; background-color:yellow'>> </span>"+ name + "</a>"+"<div class='divinternpoolmodul'></div></div>");

                                                break;


                        case "Profilierungsbereich":
                                                $("#pool .Bachelor .Spezialisierung .Wahlpflichtmodule").append("<div class='" + name +  "' class='poolkategory' id='" + idnumber +  "' >" +"<a><span class='dreieck' style='display:inline; font-weight:bold; background-color:yellow'>> </span>"+ name +"</a>"+ "<div class='divinternpoolmodul'></div></div>");
                                        break;


                           case "Schl&uuml;sselkompetenzen":
                                var neuname = name.replace(/Schl&uuml;sselkompetenzen/g,"schluesselkompetenzen");
								
                                $("#pool .Bachelor").append("<div  class='" +neuname +  "'   class='poolkategory' id='" + idnumber +  "' >" +"<a><span class='dreieck' style='display:inline; font-weight:bold; background-color:yellow'>> </span>"+ name + "</a><div class='divinternpoolmodul'></div></div>");

                                break;





                        default:
                                break;
                	}
				}
			}
				
				//nur module rausholen

         		 else if($(this).is("module")){  
         		 
				 	//suche nach seinem Vaterknot
	                var parent=$(this).parent().attr("name");
					
					//lese nach Inhalt des Moduls
					var modulname;
	                var modulid ;   
					var short; 
					var credits;
					
					
					$(this).each(function(){
						
						 modulname = $(this).find("name").text();
						 //alert(modulname);
	                 	 modulid   = $(this).find("id").text();
						 //alert(modulid);
						 short= $(this).find("short").text();
						 //alert(short);
						 credits=$(this).find("credits").text();
						 //alert(credits);
						 
					});
					
	
	                switch (parent) {
						
						
						
	                    case "Grundkurse":
	
	                            $("#pool .Bachelor .Kerncurriculum .Pflichtmodule .Grundkurse .divinternpoolmodul").append("<div class='poolmodule' id="+modulid+">"+"<table style='font-size:12px'><tr><td>"+pflichtbild+"</td><td>"+modulname+"</td>"+"<td><span class='short' style='display:none'>("+short+")</span></td>"+"<td><span class='X' style='display:none; color:red; font-weight:bold; cursor:pointer' onclick='javascript:modulloeschen("+modulid+")'>[X]</span>"+"</td><td><span class='fragebild' style='display:block'>"+fragebild+"</span></td>"+"<td><span class='ipunkt' style='display:none'>"+ipunkt+"</span></td>"+"<td>"+credits+"C</td></tr></table></div>");
								
	                            break;
	
	                    case "Praktika":
	
	                            $("#pool .Bachelor .Kerncurriculum .Pflichtmodule .Praktika .divinternpoolmodul").append("<div class='poolmodule' id="+modulid+">"+"<table style='font-size:12px'><tr><td>"+pflichtbild+"</td><td>"+modulname+"</td>"+"<td><span class='short' style='display:none'>("+short+")</span></td>"+"<td><span class='X' style='display:none; color:red; font-weight:bold; cursor:pointer' onclick='javascript:modulloeschen("+modulid+")'>[X]</span>"+"</td><td><span class='fragebild' style='display:block'>"+fragebild+"</span></td>"+"<td><span class='ipunkt' style='display:none'>"+ipunkt+"</span></td>"+"<td>"+credits+"C</td></tr></table></div>");
	                            break;
	
	                    case "Mathematik":
	
	                            $("#pool .Bachelor .Kerncurriculum .Pflichtmodule .Mathematik .divinternpoolmodul").append("<div class='poolmodule' id="+modulid+">"+"<table style='font-size:12px'><tr><td>"+pflichtbild+"</td><td>"+modulname+"</td>"+"<td><span class='short' style='display:none'>("+short+")</span></td>"+"<td><span class='X' style='display:none; color:red; font-weight:bold; cursor:pointer' onclick='javascript:modulloeschen("+modulid+")'>[X]</span>"+"</td><td><span class='fragebild' style='display:block'>"+fragebild+"</span></td>"+"<td><span class='ipunkt' style='display:none'>"+ipunkt+"</span></td>"+"<td>"+credits+"C</td></tr></table></div>");
	                            break;
	
	                    case "Spezialisierungspraktikum":
	                            $("#pool .Bachelor .Spezialisierung .Wahlpflichtmodule .Spezialisierungsbereich .Spezialisierungspraktikum .divinternpoolmodul").append("<div class='poolmodule' id="+modulid+">"+"<table style='font-size:12px'><tr><td>"+wahlpflichtbild+"</td><td>"+modulname+"</td>"+"<td><span class='short' style='display:none'>("+short+")</span></td>"+"<td><span class='X' style='display:none; color:red; font-weight:bold; cursor:pointer' onclick='javascript:modulloeschen("+modulid+")'>[X]</span>"+"</td><td><span class='fragebild' style='display:block'>"+fragebild+"</span></td>"+"<td><span class='ipunkt' style='display:none'>"+ipunkt+"</span></td>"+"<td>"+credits+"C</td></tr></table></div>");
	
	
	                    break;
	
	                    case "Einf&uuml;hrungen":
	                            $("#pool .Bachelor .Spezialisierung .Wahlpflichtmodule .Spezialisierungsbereich .einfuehrungen .divinternpoolmodul").append("<div class='poolmodule' id="+modulid+">"+"<table style='font-size:12px'><tr><td>"+wahlpflichtbild+"</td><td>"+modulname+"</td>"+"<td><span class='short' style='display:none'>("+short+")</span></td>"+"<td><span class='X' style='display:none; color:red; font-weight:bold; cursor:pointer' onclick='javascript:modulloeschen("+modulid+")'>[X]</span>"+"</td><td><span class='fragebild' style='display:block'>"+fragebild+"</span></td>"+"<td><span class='ipunkt' style='display:none'>"+ipunkt+"</span></td>"+"<td>"+credits+"C</td></tr></table></div>");
	
	
	                    break;
	
	                    case "Spezielle Themen":
	                            $("#pool .Bachelor .Spezialisierung .Wahlpflichtmodule .Spezialisierungsbereich .spezielle .divinternpoolmodul").append("<div class='poolmodule' id="+modulid+">"+"<table style='font-size:12px'><tr><td>"+wahlpflichtbild+"</td><td>"+modulname+"</td>"+"<td><span class='short' style='display:none'>("+short+")</span></td>"+"<td><span class='X' style='display:none; color:red; font-weight:bold; cursor:pointer' onclick='javascript:modulloeschen("+modulid+")'>[X]</span>"+"</td><td><span class='fragebild' style='display:block'>"+fragebild+"</span></td>"+"<td><span class='ipunkt' style='display:none'>"+ipunkt+"</span></td>"+"<td>"+credits+"C</td></tr></table></div>");
	
	
	                    break;
	
	                    case "Profilierungsbereich":
	                            $("#pool .Bachelor .Spezialisierung .Wahlpflichtmodule .Profilierungsbereich .divinternpoolmodul").append("<div class='poolmodule' id="+modulid+">"+"<table style='font-size:12px'><tr><td>"+wahlpflichtbild+"</td><td>"+modulname+"</td>"+"<td><span class='short' style='display:none'>("+short+")</span></td>"+"<td><span class='X' style='display:none; color:red; font-weight:bold; cursor:pointer' onclick='javascript:modulloeschen("+modulid+")'>[X]</span>"+"</td><td><span class='fragebild' style='display:block'>"+fragebild+"</span></td>"+"<td><span class='ipunkt' style='display:none'>"+ipunkt+"</span></td>"+"<td>"+credits+"C</td></tr></table></div>");
	
	
	                    break;
	
	
	
	                    case "Schl&uuml;sselkompetenzen":
	                            $("#pool .Bachelor .schluesselkompetenzen .divinternpoolmodul").append("<div class='poolmodule' id="+modulid+">"+"<table style='font-size:12px'><tr><td>"+wahlpflichtbild+"</td><td>"+modulname+"</td>"+"<td><span class='short' style='display:none'>("+short+")</span></td>"+"<td><span class='X' style='display:none; color:red; font-weight:bold; cursor:pointer' onclick='javascript:modulloeschen("+modulid+")'>[X]</span>"+"</td><td><span class='fragebild' style='display:block'>"+fragebild+"</span></td>"+"<td><span class='ipunkt' style='display:none'>"+ipunkt+"</span></td>"+"<td>"+credits+"C</td></tr></table></div>");
	                            break;
	                    case "Nanostrukturphysik":
	                            $("#pool .Nanostrukturphysik .divinternpoolmodul").append("<div class='poolmodule' id="+modulid+">"+"<table style='font-size:12px'><tr><td>"+wahlpflichtbild+"</td><td>"+modulname+"</td>"+"<td><span class='short' style='display:none'>("+short+")</span></td>"+"<td><span class='X' style='display:none; color:red; font-weight:bold; cursor:pointer' onclick='javascript:modulloeschen("+modulid+")'>[X]</span>"+"</td><td><span class='fragebild' style='display:block'>"+fragebild+"</span></td>"+"<td><span class='ipunkt' style='display:none'>"+ipunkt+"</span></td>"+"<td>"+credits+"C</td></tr></table></div>");
	                            break;
	
	                    case "Physikinformatik":
	                            $("#pool .Physikinformatik .divinternpoolmodul").append("<div class='poolmodule' id="+modulid+">"+"<table style='font-size:12px'><tr><td>"+wahlpflichtbild+"</td><td>"+modulname+"</td>"+"<td><span class='short' style='display:none'>("+short+")</span></td>"+"<td><span class='X' style='display:none; color:red; font-weight:bold; cursor:pointer' onclick='javascript:modulloeschen("+modulid+")'>[X]</span>"+"</td><td><span class='fragebild' style='display:block'>"+fragebild+"</span></td>"+"<td><span class='ipunkt' style='display:none'>"+ipunkt+"</span></td>"+"<td>"+credits+"C</td></tr></table></div>");
	                            break;
	                            //alert(id);?????????????????
	
	                    case "Astro- und Geophysik":
	
	
	                            $("#pool .astro .divinternpoolmodul").append("<div class='poolmodule' id="+modulid+">"+"<table style='font-size:12px'><tr><td>"+wahlpflichtbild+"</td><td>"+modulname+"</td>"+"<td><span class='short' style='display:none'>("+short+")</span></td>"+"<td><span class='X' style='display:none; color:red; font-weight:bold; cursor:pointer' onclick='javascript:modulloeschen("+modulid+")'>[X]</span>"+"</td><td><span class='fragebild' style='display:block'>"+fragebild+"</span></td>"+"<td><span class='ipunkt' style='display:none'>"+ipunkt+"</span></td>"+"<td>"+credits+"C</td></tr></table></div>");
	                            break;
	
	                    case "Biophysik und Physik komplexer Systeme":
	
	                            $("#pool .biophysik .divinternpoolmodul ").append("<div class='poolmodule' id="+modulid+">"+"<table style='font-size:12px'><tr><td>"+wahlpflichtbild+"</td><td>"+modulname+"</td>"+"<td><span class='short' style='display:none'>("+short+")</span></td>"+"<td><span class='X' style='display:none; color:red; font-weight:bold; cursor:pointer' onclick='javascript:modulloeschen("+modulid+")'>[X]</span>"+"</td><td><span class='fragebild' style='display:block'>"+fragebild+"</span></td>"+"<td><span class='ipunkt' style='display:none'>"+ipunkt+"</span></td>"+"<td>"+credits+"C</td></tr></table></div>");
	                            break;
	
	                    case "Festk&ouml;rper- und Materialphysik":
	
	                            $("#pool .materialphysik .divinternpoolmodul ").append("<div class='poolmodule' id="+modulid+">"+"<table style='font-size:12px'><tr><td>"+wahlpflichtbild+"</td><td>"+modulname+"</td>"+"<td><span class='short' style='display:none'>("+short+")</span></td>"+"<td><span class='X' style='display:none; color:red; font-weight:bold; cursor:pointer' onclick='javascript:modulloeschen("+modulid+")'>[X]</span>"+"</td><td><span class='fragebild' style='display:block'>"+fragebild+"</span></td>"+"<td><span class='ipunkt' style='display:none'>"+ipunkt+"</span></td>"+"<td>"+credits+"C</td></tr></table></div>");
	                            break;
	
	                    case "Kern- und Teilchenphysik":
	
								//---original---   $("#pool .teilchenphysik ul ").append("<li class='poolmodule' id="+modulid+">"+"<span>"+wahlpflichtbild+"</span>"+modulname+"<span style='display:none'>("+short+")</span>"+"<span style='display:none;color:red; font-weight:bold' class='modulloeschen' onclick='javascript:modulloeschen("+modulid+")'>[X]</span>"+"<span>"+fragebild+"</span>"+credits+"</li>");
								//$("#pool .teilchenphysik ul ").append("<li class='poolmodule' id="+modulid+">"+"<div style='float:left'>"+wahlpflichtbild+"</div>"+modulname+"<div class='shortXversteck' style='display:none; float: left'>("+short+")</div>"+"<div class='shortXversteck' style='display:none;color:red; font-weight:bold; float:left' class='modulloeschen' onclick='javascript:modulloeschen("+modulid+")'>[X]</div>"+"<div>"+fragebild+"</div>"+credits+"</li>");
								
								 $("#pool .teilchenphysik  .divinternpoolmodul").append("<div class='poolmodule' id="+modulid+">"+"<table style='font-size:12px'><tr><td>"+wahlpflichtbild+"</td><td>"+modulname+"</td>"+"<td><span class='short' style='display:none'>("+short+")</span></td>"+"<td><span class='X' style='display:none; color:red; font-weight:bold; cursor:pointer' onclick='javascript:modulloeschen("+modulid+")'>[X]</span>"+"</td><td><span class='fragebild' style='display:block'>"+"<a href='javascript:void(0)' onclick="+"document.getElementById('light').style.display='block'; document.getElementById('fade').style.display='block'"+">"+fragebild+"</a></span></td>"+"<td><span class='ipunkt' style='display:none'>"+ipunkt+"</span></td>"+"<td>"+credits+"C</td></tr></table></div>");
						
			
						
								
	                            break;
	
	
	
	
	                    default:
	                            break;
	                }
	



          }


                     poolrekursiv(this);





                    });//ende each


             }//ende erste Else

			



    }//ende poolrekursiv





////////POOL-Funktion gibt immer ganzen Module im POOL, und ----//////////////

		
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
	
	aktuellePoolXml=XML;
	
	
    poolrekursiv(root);


}//ende pool




//-----Implementierung der Funktion auswahlAnzeige() mit übergebenen Daten von UI-Draggable-
	
	var auswahlAnzeige = function (modulID,semester,modulinhalt){
							
							
				//$("#"+semester).append("<div class='auswahlmodul' id='"+modulID+"'><table border='0'><tbody><colgroup><col width='570'><col width='50'></colgroup><tr><td>"+name+"("+short+")<span style='color:red ;font-weight:bold' class='modulloeschen' onclick='javascript:modulloeschen("+modulID+")'>[X]</span></td><td>"+credits+"C</td></tr></tbody></table></div>");
				$("#"+semester+" .subsemester").append("<div class='auswahlmodul' id='"+modulID+"'>"
																+modulinhalt+
															"<div class='LVS' style='margin-left:150px' >"
																+"<select style='width:200px'>"+
																	"<option>Hallo LVS<option>"
																+"</select>"+
															"</div>"
														+"</div>");
				$(".auswahlmodul").draggable({
					revert : "invalid"
					
				});
	}//ende auswahlAnzeige
	

	


//////-----bei DROP in erstem Semester-BOX---------------------------------------------------------------
	
	$(function(){


        $('.semester').droppable({
                //accept: 'li',
                hoverClass: 'drophover',

                drop: function(event, ui){
						
						
						$(ui.draggable).hide();
						
						
						/// wartezeit-------------- 
						$('<div class="quick-alert">Bitte warten!</div>')
						 .appendTo($(this))
						 .fadeIn("fast")
						 .animate({opacity:1.0},1000)
						 .fadeOut("fast",function(){
						 	$(this).remove();
						 });	
							
							
						
						
						// id von reingezogenem Modul und entsprechendem Semester holen
						
						var semester = $(this).attr("id");
						
						
							
						
						
						var modulID = $(ui.draggable).attr("id"); 
						$(ui.draggable).find("span.short").css("display","block");
						
						$(ui.draggable).find("span.fragebild").css("display","none");
						$(ui.draggable).find("span.ipunkt").css("display","block");
						$(ui.draggable).find("span.X").css("display","block");
						
						var modulinhalt = $(ui.draggable).html();
						
						
						//(leer) verstecken
						$(this).find(".subsemester span.leer").css("display","none");
						
						
						// immer noch bei DROP in DROPPABLE 
						
						
						// Pool akktuallisieren
						
						
						$("#pool").find("div#"+modulID).each(function(){
							 $(this).hide();
							
						});
						
						
						
						// das reingezongen Modul mit der funktion auswahlAnzeige() zeigen
						
						
						// DATEN mit Modul-ID und semester zum Server(action add_module_to_selection) schicken 
						
						
                        $.ajax({
							
                                type: 'POST',
								url  : 'http://localhost:3000/abfragen/add_module_to_selection',
								cache:false,
                                dataType:'xml',
                                async :false,
								data  : "sem_count=1&mod_id=5",
								contentType:'application/x-www-form-urlencoded',
								
								success : function (msg){
									
								},
								
								
								
								error: function(a, b, c){
								
									alert("Erorr");
									
								}
                        });//ende Ajax
                        
                        auswahlAnzeige(modulID,semester,modulinhalt);
						
						
						
						
                        
			}//ende Drop
        });//ende droppable
	});//ende global function
	
	

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
            var neu = "<div class='semester' id='"+n+"'>"+"<div class='subsemester'><h5>"+n+".Semester"+"</h5><span class='leer' style='display:block; color:red'>(leer)</span></div></div>";
			

            $("#semester-content").append(neu);
		
			// "Löschen" wird immer in dem letzen Semester hinzufügen
			// d.h: andere ""Löschen" werden weggemacht.
			
			if (n >= 3){
				for ( i=2; i<n; i++ ){
					$(".semester"+"#"+i+" p").remove();
				}
			}
			$(".semester"+"#"+n).append("<p style='cursor:pointer' class='semesterloeschen'>L&ouml;schen</p>");
			
			
			
		
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
						var modulID = $(ui.draggable).attr("id");
						
							
						 
						$(ui.draggable).find("span.short").css("display","block");
						$(ui.draggable).find("span.fragebild").css("display","none");
						$(ui.draggable).find("span.ipunkt").css("display","block");
						$(ui.draggable).find("span.X").css("display","block");
						
						var modulinhalt = $(ui.draggable).html();
						
						
						
						$(this).find(".subsemester span.leer").css("display","none");
						
						// immer noch bei DROP in DROPPABLE 
						// das reingezongen Modul mit der funktion auswahlAnzeige() zeigen
						
						
						//$("#"+semester+" .subsemester").append("<div class='auswahlmodul' id='"+modulID+"'><table border='0'><tbody><colgroup><col width='570'><col width='50'></colgroup><tr><td>"+name+"("+short+")<span style='color:red ;font-weight:bold' class='modulloeschen' onclick='javascript:modulloeschen("+modulID+")'>[X]</span></td><td>"+credits+"C</td></tr></tbody></table></div>");
									
						
						// Pool akktuallisieren
						
						
						$("#pool").find("div#"+modulID).each(function(){
							 $(this).hide();
							
						});
						
						
                        
						
						
                            
                        // Daten mit ID von regezogenem Modul und entsprechenm Semester zum Server schicken
						   
	                    $.ajax({
	                    	type: 'POST',
	                    	
							url  : 'http://localhost:3000/abfragen/add_module_to_selection',
	                    	dataType:'xml',
							data : "sem_count=1&mod_id=4",
	                    	cache:false,
	                    	async :false,
	                    	contentType:'application/x-www-form-urlencoded',
	                   		success: function(msg){
								//alert("OK with add_module_to_selection");
	
	                   		 },
	                   		error: function (a,b,c){
	                            alert("Erorr");
	                   		 }
	
	           			 });// ende Ajax
							 
						auswahlAnzeige(modulID,semester,modulinhalt);	
					 }//ende Drop
					 
            });//droppable
    });//ende live
});//ende function


/////////////////////semester löschen//////////////////////////////////

// "Löschen" bei SEMESTER wird geklick 

$(function(){


	$(".semesterloeschen").live('click',function(){
		var l = $(".semester").length;
		if (l >= 3) {
		
			$(".semester" +"#"+l).remove();
			$(".semester" +"#"+(l - 1)).append("<p style='cursor:pointer' class='semesterloeschen'>L&ouml;schen</p>");
		}
		else if (l==2){
			$(".semester"+"#"+l).remove();
			
			
		}								
	});
}); //ende function

		///////////////////auswahlmodul loeschen////////////////////////
		/// bei Click auf <span class="modulloeschen">

var modulloeschen = function (modulID){
	// check ob alles leer ist
	//suche Vater <div class='subsemester'>
	
	var kinderanzahl = $("#"+modulID).parent().children().length;
	var subsemester = $("#"+modulID).parent().children();
	
	
	
	if( kinderanzahl==3 ) {
		$(subsemester).each(function(){
			if($(this).is("span")){
				$(this).css("display","block");
			}
		});
		
	
	}
	
	
	$("#"+modulID).remove();
	

}

		

		
		
		
		
		
		
		
		
		


