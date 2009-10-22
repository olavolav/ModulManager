
/*--------------POOL anzeigen---------------------------------------------------------*/
//				pool() wird in index.html aufgerufen
//              pool() ruft die poolrekursiv auf 
//              pool gibt XML-Datei zurï¿½ck  
//              Diese Datei enthï¿½lt folgende Funktionen: 
//					session_auswahl(),
//					drop_in_auswahl (),drop_in_pool()
//					ajax_to_server_by_add(),
//					ajax_to_server_by_remove(),ajax_to_server_by_grade(),
//					auswahlAnzeige(),
//					modul_loeschen(),get_custom_modul()
//
//--------------------------------------------------------------------------------------





// photo path

var wahlpflichtbild = "<img src='images/Wahlpflicht.png'>";
var pflichtbild = "<img src='images/Pflicht.png'>";
var wahlbild = "<img src='images/Wahl.png'>";
var unbekannter_modus_bild = "<img src='images/ModusUnbekannt.png'>";
	
var fragebild = "<img src='images/Fragezeichen.png'>";
var green_ipunkt = "<img src='images/iPunkt.png'>";
var ipunkt = "<img src='images/iPunktGelb.png'>";
var rote_ipunkt = "<img src='images/AusrufezeichenBlinkend.gif'>";
var rote_ipunkt_passiv = "<img src='images/Ausrufezeichen.png'>";
	
var loeschenbild = "<img src='images/Loeschen.png' style='position:relative; top:-5px; left:6px;'>";
var pfeil_rechts = "<img src='images/Pfeil-Rechts.png' style='padding-right:3px;'>";
var pfeil_unten = "<img src='images/Pfeil-Unten.png' style='padding-right:3px;'>";
var pfeil_leer = "<img src='images/Pfeil-Rechts-Leer.png' style='padding-right:3px;'>";
	
var warten_weiss = "<img src='images/Warten-HintergrundWeiss.gif' style='padding-right:3px;'>";
var warten_blau = "<img src='images/Warten-HintergrundBlau.gif' style='padding-right:3px;'>";
var warten_beige = "<img src='images/Warten-HintergrundBeige.gif' style='padding-right:3px;'>";





var change_credit_and_add_name_in_selection = function(handle){
	//alert("Hi change credit in selection");
	//credit ändern
	var c_text =$(handle).find(".credits_in_selection").text();
	$(handle).find(".modul_credit").text(c_text+" C");
	
	//name hizufügen
	var n_text = $(handle).find(".add_sel_name_in_sel").text();
	$(handle).find(".modul_name").append(n_text);
	
	return 0;
}

var change_credit_and_remove_name_in_pool = function(handle){
	
	//alert("Hi remove name in pool");
	//credit ändern
	var c_text =$(handle).find(".total_modul_credit").text();
	$(handle).find(".modul_credit").text(c_text+" C");
	
	//name remove
	var n_text = $(handle).find(".modul_name_in_pool").text();
	$(handle).find(".modul_name").text(n_text);
	
	return 0;
	
}

var set_image_to_green_ipunkt = function(noten_input){
	
	var this_parent = $(noten_input).parent().parent().get(0);
	$(this_parent).siblings().find(".ipunkt").html(green_ipunkt);
	
	
}

var set_point_to_comma = function(input_noten){
	alert("hallo set point to comma");

	var this_grade = $(input_noten).val();
	//var trim_grade = $.trim(this_grade);
	var check_komma = this_grade.search(/./);
	if(check_komma != -1){
		this_grade = this_grade.replace(/\./,",");
	}
	return this_grade;
	
}
var set_comma_to_point = function(){
	
	
}
// ipunkt ist gelb.
var set_image_to_ipunkt = function(noten_input){
	
	var this_parent = $(noten_input).parent().parent().get(0);
	$(this_parent).siblings().find(".ipunkt").html(ipunkt);
	
	
}

var selection_input_value_is_nill = function(input_noten){
	var result=true;
	var this_val = $(input_noten).val();
	if(this_val != ""){
		result=false;
	} 
	return result;
}


var selection_input_check = function(input_noten){
	
	var this_original;
	var this_grade = $(input_noten).val();
	var modul_id = $(input_noten).attr("rel");
	var trim_grade = $.trim(this_grade);
	
	
	//checken Noten.Dann wandele String erstmal zum Float
	var check_komma = this_grade.search(/./);
	if(check_komma != -1){
		this_original = this_grade.replace(/\./,",");
	}
	
	var this_float = parseFloat(trim_grade);
	
	
	if(isNaN(this_float)){
		alert("Geben Sie bitte eine Zahl zwischen 1.0 und 4.0  ein!");
		$(input_noten).attr("value","Note");
		set_image_to_ipunkt(input_noten);
	}
	else{
		//suche nach ',' in String trim_grade dann verwandel es zum '.'
		
		var new_trim_grade = trim_grade.replace(/,/,".");   //1,2-->1.2
		//alert("neu String :"+new_trim_grade);
		var new_float = parseFloat(new_trim_grade);
		if(new_float < 1 || new_float > 4 ){
			alert("Die Note muss eine Zahl zwischen von 1.0 und 4.0");
			set_image_to_ipunkt(input_noten);
			$(input_noten).attr("value","Note");
			
		}
		else{
			//alert(this_original+"ist OK");
			// daten zum Server schicken
			
			//Noten bleib im FELD und zwar in Form 1,3
			
			
			$(input_noten).attr("value",this_original);
			set_image_to_green_ipunkt(input_noten);
			ajax_to_server_by_grade(modul_id,new_float);
			// hier kann man Note klicken
			
			$("#note_berechnen").bind('click',ajax_to_server_by_get_grade);
			
		}
		$("#note_berechnen").text("Note aktualisieren");
		
	}
				
}

// Diese Funktion gehï¿½rt zu show_pool_by_out, also zum Ziehen eines Moduls vom Pool in die
// Auswahl. (im Such-Modus)
// Sie geht die Kategorien-Hierarchie nach oben hin durch und versteckt diese Ebenen.
// Der Aufruf erfolgt ï¿½ber die Funktion drop_in_auswahl().
function rekursiv_pool_by_out(handle, initial_tolerance){
    // gefragt is handle zur Kategorie
    var this_class = $(handle).attr("class");
    if(!((this_class=="pool_category")||(this_class=="search_category")))
        alert("Fehler: Handle in rekursiv_pool_by_out() ist keine Kategorie!");
	
    // alert("rekursiv_pool_by_out() ist jetzt gerade bei der Kategorie mit der ID: "+$(handle).attr("id"));

    var parent = $(handle).parent();
	
    // Der Sinn der initial_tolerance ist, dass man die Funktion auch aufrufen kann,
    // wenn in der ersten Ebene das entspr. Modul noch nicht verschoben wurde (OS)
    if (number_of_visible_items_in_category(handle) == initial_tolerance) {
        $(handle).attr("class","pool_category");
        $(handle).css("display","none");
        if ($(parent).attr("id") != "pool") rekursiv_pool_by_out(parent,0);
    }
}


// Funktionen fï¿½r das Ziehen eines Moduls vom Pool in die Auswahl (im Such-Modus)
/* var show_pool_by_out = function(pool_modul){
	
	//var modul_parent = $("#pool").find("#"+modul_id).parent().get(0);
	var modul_parent = $(pool_modul).parent().get(0);
	
	var this_siblings = $(modul_parent).siblings();
	var sib_anzahl =$(this_siblings).filter(function(index){
		return $(this).hasClass(".search_modul")
		
	});
	// falls es in der gleichen Katgeorie keine weiteren angezeigten Module gibt
	if($(sib_anzahl).length == 0 ){
		var first_father = $(modul_parent).parent().get(0);
		$(first_father).hide();
		rekursiv_pool_by_out(first_father);
	}
	
}// ende out */

// Das wird nur aufgerufen, wenn ein Modul in den Pool zurueck kommt (via modul_loeschen), dass
// mit der momentanen Suche Ã¼berein stimmt
function rekursiv_pool_by_in(first_father){
	
    $(first_father).show();
    flip_arrow_of_category("unten",first_father);

	if ($(first_father).is(".pool_category"))
		$(first_father).attr("class","search_category");
		
    var this_parent = $(first_father).parent().get(0);
    if($(this_parent).is(".pool_category")){
        rekursiv_pool_by_in(this_parent);
    }
    return;
}

// Funktionen fï¿½r das Ziehen eines Moduls von der Auswahl in den Pool
// neuerdings alles in modul_loeschen() (OS)
/* var show_pool_by_in = function(modul_id){
	
	
	var append_modul;
	
	// versteck das Modul im Semester
	$("#semester-content div.semester").find("div#"+modul_id).each(function(){
			//alert("hallo modul_loeschen");
			change_module_style_to_pool(this);
			$(this).attr("class","pool_modul");
			var das_span = $(this).find("span.inAuswahl");
			$(das_span).text("nein");
			$(this).hide();
			append_modul = $(this);
	});
	
	
	
	//such modul_id im pool
	var modul = $("#pool").find("#"+modul_id).eq(0);
	
	//check ob es um ein live_search_modul geht.
	var this_class = $("#pool").find("."+modul_id+"_parent").eq(0).attr("class");
	alert("parent class: "+this_class);
	if(this_class == modul_id+"_parent search_modul"){
		alert("Dies ist ein Modul, das mit der momentanen Pool-Suche uebereinstimmt.");
		
		//suche alle parent-umgebung
		$("."+modul_id+"_parent").each(function(){
			
			if (module_div_present_in_parent($(this))) $(this).append($(append_modul));

			var this_modul = $(this).find("div.pool_modul");
			$(this_modul).show();
			
			var first_father = $(this).parent().get(0);
			
			rekursiv_pool_by_in(first_father);
		});
	}
	else{//hier wird das Modul entweder in im Live nachdem das Modul gerade
		 // in Auswahl reingetan und wieder sofort in Pool zurï¿½ck.
		 // Zunï¿½chst werden die Modul_id im Table#suche ermittelt
		 
		if (!search_is_active()) {
			alert("Momentan wird nicht gesucht.");
			modul_loeschen(modul_id);
		}		
		else {
			alert("Dies ist ein Modul, das mit der momentanen Pool-Suche nicht uebereinstimmt. (es wird gesucht)");
			var this_tr = $("table#suche tbody").find("." + modul_id).eq(0);
			var live_modul = false;
			
			//hier check ob die Module gerade gesucht werden.
			if ($(this_tr).css("display") == "table-row" || $(this_tr).css("display") == "block" || $(this_tr).css("display") == "") {
				live_modul = true;
				var hi = $(this_tr).css("display");
				
			}
			
			if (live_modul) {
				alert("hallo search modul im Table");
				var modul_search_id = $(this_tr).attr("class");
				$(this).parent().addClass("search_modul");
				$(modul).show();
				var first_father = $(this_parent).parent().get(0);
				rekursiv_pool_by_in(first_father);
				
				//$("."+modul_search_id+"_parent").
			}
		}	
	}
	//ajax aufrufen
	
	ajax_to_server_by_remove(modul_id);
	
	
	
}//ende in */





// Anzeigen bzw. verstecken der anfaenglichen Hilfe und der Navigations-Knoepfe
var show_navi = function(){
    $("#navi_optional").slideDown();
    $("#navimovedown").toggle();
    $("#navimoveup").show();
	$("#ueberblick").css("width","100%");
	$("#ueberblick").css("position","relative");
	$("#middle").css("margin-left","1%");
}
var hide_navi = function(){
    $("#navi_optional").slideUp();
    $("#navimovedown").show();
    $("#navimoveup").hide();
	$("#ueberblick").css("width","22%");
	$("#ueberblick").css("position","fixed");
	$("#middle").css("margin-left","24%");
}

// Fixieren bzw. 

var hide_partial_modul = function(){
	
	
	$("#pool .partial_modul").hide();
	
	
}

//--------CUSTOM-MODUL--------------------------------------------------------------------

var custom_modul_rekursiv = function (handle){
	
		var handle_id = $(handle).attr("id");
		
		//alert("hallo custom-rekursive");
		$(handle).children().not("a,.nichtleer").each(function(){
			
			var this_class = $(this).attr("class");
			var this_rel = $(this).attr("rel");
			
			if (this_class == "pool_category") {
				custom_modul_rekursiv(this);
			}
			else{
				if(this_rel =="mod_parent"){
					var this_modul = $(this).children().not(".nichtleer").eq(0);
					
					if(($(this_modul).hasClass("custom_modul"))&&($(this_modul).css("display")=="block")){
						//alert("hallo custom_modul");
						var i = $(this_modul).css("display");
						//alert("Dispaly:"+i);
						$(this_modul).hide();
						$(this_modul).attr("class","pool_modul");
						//alert("Handle_id : "+handle_id+" und das ist block");
						
						// versteck alle anderen custom im gleichen Kategorie
						$(this).siblings().each(function(){
							//alert("hallo bruder");
							var this_kind = $(this).children().not(".nichtleer").eq(0);
							var cl = $(this_kind).attr("class");
							
							if($(this_kind).hasClass("custom_modul")){
								$(this_kind).hide();
								var p=$(this_kind).css("display");
								//alert("Class : "+cl);
								
							}
						});
					}
					
					
				}
				return;
			}
			
			
		});	
		
	
	
}

var get_custom_modul = function(category_id){
	//alert("hallo get_custom_modul mit "+category_id);
    // die Funktion zeigt nur ein display_none Custom_modul im Pool an
	
	var this_cat = $("#pool").find("#"+category_id);
	var the_first = $(this_cat).find(".custom_modul").filter(function(index){
		return index==0;
	});
	
	// class verï¿½ndern. custom-->pool_modul. Damit wird nur ein custom_modul im Pool ist
	
    $(the_first).removeClass("custom_modul").addClass("pool_modul ui-draggable");
    $(the_first).show();
	
}//ende get_custom_modul


var get_custom_modul_in_the_search_table = function(){
	// custom_modul in Suche-Table
	var the_first;
	var custom_modul = $("#suche").find("tr[rel='custom_modul']").filter(function(index){
		if(index==0){
			the_first=$(this);
		}
		return index!=0
	});
	
	$(custom_modul).hide();
	$(the_first).attr("rel","pool_modul").show();
	
	
}

// Wofï¿½r ist diese Funktion? Bitte noch kommentieren oder lï¿½schen (OS)
var modul_search = function(){
	
    $("#suche").show();
    var this_tr = $("#suche").find("tr");
    $(this_tr).each(function(){
        var this_display = $(this).css("display");
        if(this_display=="block"){
            alert("ja");
        }
		
    });
		
	
	
}//ende function


///////////////////MODULLOESCHEN loeschen////////////////////////
/// bei Click auf <div class="modul_loeschen">
/// neuerdings auch beim Ziehen zum Pool (OS)
var partial_modul_loeschen = function (mod_id,all_sem_destroy){
	//alert("hallo partial_modul_loeschen");
	//alert("hallo sub "+all_sem_destroy);
	//suche teil-Module
	$("#semester-content div.subsemester").find("div").each(function(){
		if($(this).find(".modul_parent_attr").text()== mod_id){
			var this_id = $(this).attr("id");
			//alert(this_id);
			sub_modul_loeschen(this,this_id,all_sem_destroy);
		}
	});
	ueberblick();
}
var modul_loeschen = function (mod_id,all_sem_destroy){
    // Die Schleife hier sollte eigentlich unnoetig sein, wenn jedes Modul nur 1x in der
    // Auswahl sein kann, ausser bei Drop in den Pool, dann 2x: (OS)
    // Letzteres sollte man vielleicht nochmal anschauen irgendwann. (OS)
    // if ($("#semester-content div.semester").find("div#"+mod_id).length > 1)
    //alert("Warnung: Dieses Modul (ID "+mod_id+") ist in der Auswahl: "+$("#semester-content div.semester").find("div#"+mod_id).length+"-mal enthalten!");
	
	//alert(mod_id);
	//alert("sem_detroy="+all_sem_destroy);
	$("#semester-content div.semester").find("div#"+mod_id).each(function(){
		
		var this_mod_parts = $(this).find(".modul_parts").text();
		var this_mod_par_attr = $(this).find("span.modul_parent_attr").text();
		//alert("Mod-Parts ="+this_mod_parts);
		//check nach Teil-Modul
		if((this_mod_parts != "0")|| (this_mod_par_attr !="nein")){
			var check = confirm("Wollen Sie komplette Module loeschen?");
			if(check == true){
				
				if(this_mod_par_attr != "nein"){
					//hier ist Teil-modul
					//such nach head-modul-->löschen
					var head_modul = $("#semester-content div.semester").find("div#"+this_mod_par_attr);
					change_credit_and_remove_name_in_pool(head_modul);
					sub_modul_loeschen(head_modul,this_mod_par_attr,all_sem_destroy);
					partial_modul_loeschen(this_mod_par_attr,all_sem_destroy);
				}
				else{
					//hier ist head-Modul
					change_credit_and_remove_name_in_pool(this);
					sub_modul_loeschen(this,mod_id,all_sem_destroy);
					partial_modul_loeschen(mod_id,all_sem_destroy);
				}
			}
		}
		else{
			sub_modul_loeschen(this,mod_id,all_sem_destroy);
		}
	}); 

    

}//ende modul_loeschen


var sub_modul_loeschen = function (this_mod,mod_id,all_sem_destroy){
	
		
   		// alert("hallo modul_loeschen (Schleife, 1x pro Modul in der Auwahl) class: "+$(this).attr("class"));
        // aendere CSS style
       	change_module_style_to_pool(this_mod);
		var kopf_modul_check = $(this_mod).find(".modul_parts").text();
		var parent_attr_check = $(this_mod).find(".modul_parent_attr").text();
		var pool_modul = "pool_modul";
		//wenn ein Teil_modul ist, dann hat das class "partial",
		// damit das nicht in Pool angezeigt wird.
		if($(this_mod).attr("class")=="auswahl_modul partial_modul"){
			//alert("du bist teil_modul");
			pool_modul = "partial_modul";
			
		}
        $(this_mod).attr("class",pool_modul);
		//check nach Head-modul. Wenn ja, dann setze span.modul_parts_exsit auf "nein"
		if ($(this_mod).find("span.modul_parts_exsit").text()=="ja"){
			$(this_mod).find("span.modul_parts_exsit").text("nein");
		}
        var this_id = $(this_mod).attr("id");
        var this_modul = $(this_mod);
        var modul_itself_has_not_been_moved = true;
        // ersmal hide
        $(this_modul).hide();
        // suche nach mod_id_parent im Pool
		
        // alert("Dieses Modul (bzw. dessen Parent) kommt im Pool "+($("#pool ."+this_id+"_parent").length)+" mal vor.");
					
        $("#pool ."+this_id+"_parent").each(function(){

            var arrow_type = which_arrow_is_visible($(this).parent());
            // alert("arrow_type: "+arrow_type);
			
            var the_father = $(this).parent();
            // alert("the_father class: "+the_father.attr("class"));
            if(!module_div_present_in_parent($(this))){
			
                $(this).append(this_modul);
                modul_itself_has_not_been_moved = false;
				
                // rauskopiert aus unten:
                // check den Vater-Kategory, ob der gerade offen ist (neu, OS)
                if (arrow_type == "leer")
                    flip_arrow_of_category("rechts",$(this).parent());
                else if (arrow_type == "unten") {
                    
                    //if ((!(search_is_active())) || $(this).is(".search_modul")) {
					  if (!(search_is_active())) {
						if (pool_modul != "partial_modul") {
							//alert("pool_modul = "+pool_modul);
							$(this).find("#" + mod_id).css("display", "block");
						}
						
					}
                // else $(this).find("#"+mod_id).css("display","none");
                }
				
            }// ende if leer
			
            else { // Modul ist schon im Pool, nur versteckt
				
                // check den Vater-Kategory, ob der gerade offen ist (neu, OS)
                if (arrow_type == "leer")
                    flip_arrow_of_category("rechts",$(this).parent());
                else if (arrow_type == "unten") {
                    if ((!search_is_active()) || $(this).is(".search_modul")) {
                        $(this).find("#"+mod_id).css("display","block");
						// alert("test: 1");
					}
                }
            }

            // inAuswahl-Tag setzen (OS)
            $(this).find("#"+mod_id+" span.inAuswahl").text("nein");
            // alert("inAuswahl gesetzt auf (OS): "+$(this).find("#"+mod_id+" span.inAuswahl").text());
			
            if (search_is_active() && $(this).is(".search_modul") &&
				((which_arrow_is_visible($(this).parent())!="rechts")||($(the_father).is(".pool_category")))) {
					//$(this).find("#"+mod_id).css("display","block");
					var this_mod = $(this).find("#"+mod_id).eq(0);
					if(($(this_mod).attr("class")!="partial_modul")||($(this_mod).attr("class")!="partial_modul ui-draggable")){
						$(this_mod).show();
					}
				
				// alert("test: 2");
                rekursiv_pool_by_in(the_father);
			}
            else if (which_arrow_is_visible(the_father) == "leer")
                flip_arrow_of_category("rechts",the_father);
						
        }); // Ende der Schleife durch alle parent divs

        // Das hier nimmt immer noch an, dass es maximal ein Parent gibt, bei dem das Modul nicht nur
        // wieder auf sichtbar geschaltet werden musste. (OS)
        if (modul_itself_has_not_been_moved) {
            // alert("Aha, das Modul in der Auswahl selbst wurde gar nicht verschoben, dann koennen wir es ja loeschen!");
            $(this_modul).remove();
        }
    // else alert("Aha, das Modul wurde verschoben, dann loeschen wir es besser nicht.");

    

    // AJAX aufrufen und Session-DB aktualisieren
    ajax_to_server_by_remove(mod_id);
	if((kopf_modul_check == "0")&&(parent_attr_check=="nein")&&(all_sem_destroy!="10000")){
		ueberblick();
	}
    
    

}//ende sub_modul_loeschen

//info_box


var info_box_selection = function(modul_id){
		//schreib modul_id in attr "rel", um später wieder 
		//Modul in Auswahl zu finden
		
		
		$("#exception_credit").attr("rel",modul_id);  
		$("#box_info").empty();
		$("#box_info_exception").show();
        $("#box_info_pool").hide();
		
		$('#info_box').dialog('open');
		ajax_to_server_by_get_module_info(modul_id);
		
}

var info_box = function(modul_id){
        $("#box_info").empty();
        $("#info_box").dialog('open');
        $("#box_info_exception").hide();
        $("#box_info_pool").show();
        
		ajax_to_server_by_get_module_info(modul_id);

}

var update_modul_in_selection = function (){
	//alert("hallo uapdate");
	//check, ob man etwas in Ausnahme verändert hat
	//if ($("#box_info_exception").css("display") == "block"){
	
	
		var modul_id = $("#exception_credit").attr("rel");
		var this_modul = $("#semester-content .subsemester").find("div#"+modul_id).eq(0);	
		
		var v=$("#exception_credit").val();
		var warn_checked = $("#exception_warn:checked").val();
		var note_checked = $("#exception_note:checked").val();
		
		// remove credit-option,warnung- und note-option falls die schon bereits vorhanden sind
		var this_credit =$(this_modul).find("p.credit-option");
		$(this_credit).html("");
		var this_warn = $(this_modul).find("p.warnung-option");
		$(this_warn).html("");
		var this_note =$(this_modul).find("p.note-option");
		$(this_note).html("");
		
		
		//credit
		if(($.trim(v)=="Note")||($.trim(v)=="")){
			//alert("nicht Verändern");
		}
		else{
			
			//alert("Verändern Exception_credit ="+v);
			$(this_modul).find(".modul_credit").text(v+" C");
			$(this_credit).html("Credit-Zahl wird zum "+v+" ver&auml;ndert");
			//$(this_modul).append("<p class='credit-option'>Credit-Zahl wird zum "+v+" ver&auml;ndert<p>");
			
		}
		//alert("warn-checked = "+warn_checked);
		
		//warnung
		if (warn_checked == "checkbox") 
			$(this_warn).html("Warnung deaktiviert");
			//$(this_modul).append("<p  class='warnung-option'>Warnung deaktiviert<p>");
		//note	
		if(note_checked=="checkbox")
			$(this_note).html("Note streichen"); 
			//$(this_modul).append("<p class='note-option'>Note streichen<p>"); 
	//}
}//ende






// session_auswahl() implementieren. Die ruft action abfragen/auswahl per AJAX auf

var change_custom_in_pool_by_session_load = function(das_erste,custom_name,custom_credit){
	//alert("Hallo custom_change");
	$(das_erste).find(".modul_name").text(custom_name);
	$(das_erste).find(".modul_credit").text(custom_credit);
	$(das_erste).attr("class","pool_modul ui-draggable");

	return 0;
	
}
var session_auswahl_rekursiv = function(root){
	
    var sem_content = $("#semester-content");
	
    $(root).children().each( function(){
	 	
        var knoten_name = this.nodeName;
		
        // check Blï¿½tter
        if (knoten_name == "module"){
			
            var parent = $(this).parent().get(0);
            var parent_id = $(parent).attr("count");
			// entsprechenem  modul_id im Pool suchen, dann clonen ins Auswahl
            // dann verstecken die originalen Module im Pool
			var mod_id = $(this).attr("id");
			var mod_grade = $(this).attr("grade");
			//alert(mod_id);
			var modul_im_pool = $("#pool").find("div#"+mod_id);
            var das_erste = $(modul_im_pool).eq(0);
			
			
			
			
			//custom_modul laden: Name und credit verändern
			
			/*if($(this).hasClass("custom")){
				alert("Hallo custom_modul_in_auswahl ID: "+mod_id);
				var custom_name = $(this).attr("name");
				//alert("Dumy "+this_name);
				var custom_credit    = $(this).attr("credits");
				//alert("Dummy"+this_credit);
				change_custom_in_pool_by_session_load(das_erste,custom_name,custom_credit);
			}*/
			
			
			
            // die originalen Module verstecken
            //und den span.inAuswahl auf "ja" setzen
            //und alle vor dem Clone
            var auswahl_modul_clone=$(das_erste).clone(true);
			$(modul_im_pool).each(function(){
				$(this).hide();
                $(this).find("span.inAuswahl").text("ja");
			});
			
			
            // verï¿½ndern erstmal die interne im Modul bei dem Clone
            //besonders hat die Klone die class "auswahl_modul_clone"
            //zur Indentifizierung bei alle erster Verï¿½nderung im Auswahl
			
						
            $(auswahl_modul_clone).attr("class","auswahl_modul_clone");
            change_module_style_to_auswahl(auswahl_modul_clone);
			
			// Noten setzen
			if(mod_grade != "" ){
				//alert(mod_grade);
				var this_noten=$(auswahl_modul_clone).find(".noten_input");
				var this_grade = mod_grade;
				//set comma
				var check_komma = mod_grade.search(/./);
				if(check_komma != -1){
					this_grade = mod_grade.replace(/\./,",");
				}
				
				$(this_noten).val(this_grade);
				
				set_image_to_green_ipunkt(this_noten);
			}
			
			$(auswahl_modul_clone).find("span.inAuswahl").text("ja");
			
			//check nach Kopfmodul. Wenn ja dann credit und name verändern
			if($(auswahl_modul_clone).find(".modul_parts").text()!="0"){
				change_credit_and_add_name_in_selection(auswahl_modul_clone);
				$(auswahl_modul_clone).find(".modul_parts_exsit").text("ja");
			}
			
			//check nach Teil-Modul
			if($(auswahl_modul_clone).find(".modul_parent_attr").text()!="nein"){
				$(auswahl_modul_clone).show();
			}
			
			
			
            // reinstecken das Klone im Auswahl
            $(sem_content).find("div.semester").each(function(){
                var x= $(this).attr("id");
				if (parent_id == x){
					$(this).find(".subsemester").append(auswahl_modul_clone);
				}
            });//ende each intern
			return;
        }// ende Blï¿½tter
		
		
		
		
		
        //check semester
        else  if ( knoten_name == "semester"){
		 	
            var sem_id = $(this).attr("count");
			
            $(sem_content).append("<div class='semester' id='"+sem_id+"'>"+
                "<div class='subsemester'>"+
                "<h5>"+sem_id+". Semester"+"</h5>"+
                //"<span class='leer' style='display:none;color:red'></span>"+
                "</div>"+
                "<button style='display:none;' class='semesterloeschen' onClick='sem_loeschen("+sem_id+");'>L&ouml;schen</button>"+
                "</div>" );
								 
			
        }// ende else if
		
        session_auswahl_rekursiv(this);
		
    });//ende each
	    
}//ende 




//session_auswahl-----------------------------------------------------------------------



var session_auswahl = function (){
	
	
    var XML = $.ajax({
		
        type : 'GET',
        url  : 'abfragen/auswahl',
        async: false,
        contentType: 'application/x-www-form-urlencoded',
        error : function(a,b,c){
			
            alert("error mit abfragen/auswahl");
        }
		
    }).responseXML;
		
	
		
    var root = XML.documentElement;
	
	
    // rekursiv aufrufen
	
    $("semester-content").empty();
    session_auswahl_rekursiv(root);
	
    // Loeschen anzeigen.Wir suchen das letzten Semester.
    var last_semester = $("#semester-content div.semester:last");
    $(last_semester).find("button.semesterloeschen").css("display","block");
	

	
}//ende 




//   AJAX zum Server---------------------------------------------------------------------	

var ajax_to_server_by_get_module_info = function (modul_id){
	 $.ajax({

                type : 'POST',
                url  : '/abfragen/get_module_info',
                async: false,
                dataType:'text',
                contentType: 'application/x-www-form-urlencoded',
				data :"module_id="+modul_id,
                success : function(html){

                        $("#info_box #box_info").append(html);
                }/*,
                error: function(a,b,c){
                        alert(b);
						
                }*/



        });
	
}
var ajax_to_server_by_add = function (modul_id,semester){
    //alert("mod_id="+modul_id+" und semester="+semester);
    //alert("modul_id="+modul_id+"semester="+semester);
    $.ajax({
							
        type: 'POST',
        url  : 'abfragen/add_module_to_selection',
        cache:false,
        dataType:'text',
        async :false,
        data  : "mod_id="+modul_id+"&"+"sem_count="+semester,
        contentType:'application/x-www-form-urlencoded'/*,
        error :  function (a,b,c){
            alert(b);
        }*/
			
    });//ende Ajax

    //ueberblick();
	
}

var ajax_to_server_by_remove = function (modul_id){
    //alert("mod_id="+modul_id);
    $.ajax({
							
        type: 'POST',
        url  : 'abfragen/remove_module_from_selection',
        cache:false,
        dataType:'text',
        async :false,
        data  : "mod_id="+modul_id,
        contentType:'application/x-www-form-urlencoded'/*,
        error :  function (a,b,c){
            alert("problem with remove_module_from_selection");
        }*/
			
    });//ende Ajax

    //ueberblick();
	
}// ende



var ajax_to_server_by_remove_semester = function (sem_count){
    //alert("sem_count="+sem_count);
    $.ajax({
			
        type: 'POST',
        url : 'abfragen/remove_semester_from_selection',
        dataType:'text',
        cache : false,
        async : false,
        data  : "sem_count="+sem_count,
        contentType:'application/x-www-form-urlencoded'/*,
        error : function (a,b,c){
            alert("problem with abfragen/remove_semester_from_selection");
        }*/
		
    });
    ueberblick();
	
}

var ajax_to_server_by_grade = function(modul_id,grade){
	
    //alert(grade);
    //alert(modul_id);
    $.ajax({
        type:"POST",
        url :"abfragen/save_module_grade",
        dataType:"text",
        cache:false,
        async:false,
        data:"mod_id="+modul_id+"&"+"grade="+grade,
        contentType:'application/x-www-form-urlencoded'/*,
        error : function(a,b,c){
            alert ("error mit save_module_grade");
        }*/
    });
				
	
}

//----------------------------


var ajax_to_server_by_get_grade = function(){
   
	
    $.ajax({
		
        type : 'GET',
        url  : '/abfragen/note',
        async: false,
        contentType: 'application/x-www-form-urlencoded',
        success : function(html){
			$("#die_note").empty();
        	$("#die_note").append(html);
			

        }/*,
        error: function(a,b,c){
            alert("problem with /abfragen/note");
        }*/
		

		
    });
	
	
	
	
}


function ajax_server_by_custom(this_name,this_credit_point_float,custom_semester,custom_id){
	
	
    $.ajax({
        type:"POST",
        url :"abfragen/add_custom_module_to_selection",
        dataType:"text",
        cache:false,
        async:false,
        data:"name="+this_name+"&"+"credits="+this_credit_point_float+"&"+"sem_count="+custom_semester+"&"+"mod_id="+custom_id,
        contentType:'application/x-www-form-urlencoded'/*,
        error : function(a,b,c){
            alert ("error mit add_custom_module_to_selection");
        }*/
    });
	
}






var auswahlAnzeige = function (modul_id,semester,modulinhalt){

    $("#"+semester+" .subsemester").append("<div class='auswahl_modul' id='"+modul_id+"'>"
        +modulinhalt+
        "</div>"
        +"</div>");
		
}//ende auswahlAnzeige


// DROP in Auswahl

var drop_in_auswahl = function (modul_id,modul_class,semester,ui_draggable,this_semester,ui_helper){
    // alert("ID: "+modul_id+", class:"+modul_class);
    // alert("Pool parent class: "+$("#pool ."+modul_id+"_parent").eq(0).attr("class"))
		
    $('<div class="quick-alert">'+warten_beige+'Bitte warten!</div>')
    .appendTo($(this_semester))
    .fadeIn("fast")
    .animate({
        opacity:1.0
    },1000)
    .fadeOut("fast",function(){
        $(this).remove();
    });
		 
    var this_draggable_class = $(ui_draggable).attr("class");
	var kopf_modul_check = $(ui_draggable).find(".modul_parts").text();
	
	
    // check ob das reingezogenem Modul aus POOL kommt.
    // Wenn ja dann verï¿½ndern inhalt, und versteck das Modul im POOL.
    // Wenn nein ( also bereits im Auswahl) dann remove per AJAX erstmal das Modul aus SESSION,
    // dann wieder add per AJAX
	
    // alert("Modul class: "+this_draggable_class);
    if ((this_draggable_class =="pool_modul ui-draggable")||(this_draggable_class=="pool_modul")) {
        //alert("Modul kommt aus dem Pool");
        change_module_style_to_auswahl(ui_draggable);
        $(ui_draggable).find("span.inAuswahl").text("ja");
        $(ui_draggable).attr("class","auswahl_modul");
		
        // var modul_parent = $(ui_draggable).parent().get(0);
        // Falls das Modul die "search_modul"-Eigenschaft hat, wird natï¿½rlich auch gerade gesucht,
        // die entspr. Abfrage erï¿½brigt sich also.
        var this_category = $(ui_draggable).parent().parent();
        if($(ui_draggable).parent().is(".search_modul")){
            // alert("drop_in_auswahl(): So, erstmal die Kategorie wo das Modul raus gezogen wurde...");
            // show_pool_by_out(this_category);
            // test OS
            // rekursiv_pool_by_out(this_category);
            rekursiv_pool_by_out(this_category,1);
        }
        else {
			
            // alert("Aha, Suche ist nicht aktiv - visible items:"+number_of_visible_items_in_category(this_category));
            if (number_of_visible_items_in_category(this_category) == 1) {
				flip_arrow_of_category("leer", this_category);
			}
			
        }
		
		
        // Die anderen gleichen Module verstecken (fast gleich zum Prozedere oben)
        $("."+modul_id+"_parent").each(function(){

            // ...falls das nicht das direkt verschobene Modul ist, denn der append-Befehl kommt
            // ja erst spï¿½ter (OS)
            if ($(this).find("span.inAuswahl").text() == "nein") {
                // inAuswahl-Tag setzen und Modul verstecken (OS):
                $(this).find("span.inAuswahl").text("ja");
                $(this).find(".pool_modul,.search_modul").css("display","none");
				
                // hier ein parent() weniger als oben, weil wir ja schon surch die parent-Divs laufen (OS)
                var this_category = $(this).parent();
                if($(this).is(".search_modul")){
                    // alert("drop_in_auswahl(): Eine weitere Kopie muss raus...");
                    rekursiv_pool_by_out(this_category,0);
                }
                else {
					
                    // alert("Aha, Suche ist nicht aktiv - visible items:"+number_of_visible_items_in_category(this_category));
                    if (number_of_visible_items_in_category(this_category) == 1)
                        flip_arrow_of_category("leer",this_category);
                }
            }
        });
			
    }//ende if pool_modul class
	
    else{ //if(this_draggable_class=="auswahl_modul_clone ui-draggable" || this_draggable_class=="auswahl_modul_clone" || this_draggable_class=="auswahl_modul partial_modul" ){
        //alert("Modul kommt aus der Auswahl.");
        //alert("hallo "+this_draggable_class);
        //alert("start remove");
		ajax_to_server_by_remove(modul_id);
		//alert(" remove ende");
    }
	
   
	
    // append hier
    var this_subsemester = $(this_semester).find("div.subsemester");
	
    $(this_subsemester).append(ui_draggable);
	
	 
    // einbinden search function
    //$("#pool").append("<script type='text/javascript'>$(document).ready(function () {		$('table#suche tbody tr').live('click',function(){  var this_class = $(this).attr('class'); $('#pool .'+this_class+'_parent').each(function(){  if($(this).find('.pool_modul')){alert('hallo pool_modul');}else{alert('kein pool_modul');}       });  }); })</script>");
	
    // DATEN mit modul_id und semester zum Server(action add_module_to_selection) schicken
    ajax_to_server_by_add(modul_id,semester);
	if(kopf_modul_check=="0"){
		ueberblick();
	}
	

			
//	auswahlAnzeige(modul_id,semester,modulinhalt);
		 
}//ende drop in auswahl




//implement :   custom_modul_drop_in_auswahl---------------------------------------------

var custom_modul_drop_in_auswahl = function(modul_id,modul_class,semester,ui_draggable,this_semester,ui_helper){
	
	
    var check_open=false;
    $("#custom_semester").attr("value",semester);
    $("#custom_id").attr("value",modul_id);
	
    $('#custom_dialog').dialog('open');
	
	
	
	
	
	
}
var partial_modul_drop_in_auswahl = function(modul_id,modul_class,semester,ui_draggable,this_semester,ui_helper){
	
	//parts_exit  aus "ja" setzen
	$(ui_draggable).find("span.modul_parts_exsit").text("ja");
	
	var this_sub = $(this_semester).find("div.subsemester");
	var this_vater = $(ui_draggable).parent().get(0);
	
	// bring  partial-modul ins Auswahl
	var the_first=$("#pool").find("."+modul_id+"_parent").eq(0);
	var partial_module = $(the_first).nextAll().filter(function(index){
		return $(this).find("span.modul_parent_attr").text()==modul_id;
	});
	
	$(partial_module).each(function(){
		var this_child = $(this).children().eq(1);
		$(this_child).attr("class","auswahl_modul partial_modul");
		var this_id = $(this_child).attr("id");
		$(this_child).show();
		change_module_style_to_auswahl(this);
		$(this_sub).append(this_child);
		ajax_to_server_by_add(this_id,semester);
		
	});
	ueberblick();
	
}

//-----Drop in POOL----------------------------------------------------------------------
/* var drop_in_pool_veraltet = function(mod_id,ui_draggable,this_pool){
	
	
	// style verï¿½ndern
	
	$(ui_draggable).attr("class","pool_modul");
	change_module_style_to_pool(ui_draggable);
	$(ui_draggable).find("span.inAuswahl").text("nein");
	// erstmal hide()
	$(ui_draggable).hide();
	//suchen den leeren Vater mod_id+"_parent" dann append ui_draggable
	// danach setzen die anderen Module aus "nein" in span.inAuswahl
	
	$("#pool ."+mod_id+"_parent").each(function(){
		//alert("drin");
		var this_text = $(this).text();
		
		if(this_text ==""){
			
			$(this).append(ui_draggable);
			// check den Vater-Kategory, ob der gerade offen ist
			var the_father = $(this).parent().get(0);
			$(the_father).find(".pool_modul,.pool_modul.ui-draggable").each(function(){
				//alert("drin leer");
				var this_display = $(this).css("display");
				if(this_display=="block"){
					$(ui_draggable).show();
				}
			});
			
			
		}//ende if
		else{
			
			// remove ui-draggable weil das original schon da ist
			//$(ui_draggable).remove();
			var this_span = $(this).find("span.inAuswahl");//this hier ist mod_id_parent
			var the_other_modul = $(this).find("#"+mod_id);
			$(this_span).text("nein");
			// check den Vater-Kategory, ob der gerade offen ist
			var the_father = $(this).parent().get(0);
			$(the_father).find(".pool_modul,.pool_modul.ui-draggable").each(function(){
				//alert("drin nicht leer");
				var this_display = $(this).css("display");
				
				if(this_display=="block"){
					$(the_other_modul).show();
				}
			});
		}
		
	});//ende each
	
	
	//ajax aufrufen
	
	ajax_to_server_by_remove(mod_id);
	
}//ende */

//----Poolrekursive implementieren-------------------------------------------------------

// den Pool (d.h. das XML-Resultat der Pool-Anfrage) rekursiv durchgehen und Module und Kategorien
// in zugeklappter Form in den Pool einfï¿½gen.
// Ob ein Modul in der Auswahl ist oder nicht spielt hier noch keine Rolle, das passiert erst spï¿½ter
// mit Hilfe der Funktion session_auswahl.
var poolrekursiv = function(XMLhandle){
    var appendString = '';
    $(XMLhandle).children().each(function(){
        var knoten_name=this.nodeName;
        var parent = $(this).parent().get(0);
        var parent_name = parent.nodeName;
		
        switch(this.nodeName) {
            case "category":
                var category_id   = $(this).attr("category_id");
                var category_name = $(this).attr("name");
				
                // if (parent_name == "root" && $(this).children()[0])
                if (parent_name == "root")
                    appendString += "<div class='pool_category' id='" + category_id + "' rel=''>";
                else
                    appendString += "<div style='margin-left:6px;display:none;' class='pool_category' "+"id='"+category_id+"' rel=''>";
					
                appendString += "<a style='cursor:pointer' alt='Kategorie auf- und zuklappen' onClick='javascript:toggle_category(\""+category_id+"\");'>"+
                "<span class='pfeil_rechts' style='display:inline'>"+pfeil_rechts+"</span>"+
                "<span class='pfeil_unten' style='display:none'>"+pfeil_unten+"</span>"+
                "<span class='pfeil_leer' style='display:none'>"+pfeil_leer+"</span>"+
                category_name+
                "</a>";
                // rekursiver Teil
                appendString += poolrekursiv(this);
                appendString += "</div>";
                break;
				
            case "module":
                var parent_name = $(parent).attr("name");
                var parent_id   = $(parent).attr("category_id");
                var parent_a    = $("#pool #"+parent_id).find("a");
                //var parent_a_class = $(parent_a).attr("class");
                var parent_a_id= $(parent_a).attr("id");
                //alert(parent_a_class);

                var modul_name = $(this).find("name").text();
                var modul_mode = $(this).find("mode").text();
                var credits = $(this).find("credits").text();
				var modul_short = $(this).find("short").text();
				var modul_parts = $(this).find("parts").text(); 
				
				
				 
                var modul_id = $(this).attr("id");
                var modul_class=$(this).attr("class");
				var check_modul_partial=$(this).attr("partial");
				var has_grade="ja";
				var modul_has_grade=$(this).attr("has_grade");
				if(modul_has_grade == "false"){
					has_grade = "nein";
				}

                //check Modul_ART : Pflicht? WP?
                var bild;
                // so sollte es eigentlich sein (ist mit CB besprochen):
                switch(modul_mode) {
                    case "p":
                        bild = pflichtbild;
                        break;
                    case "wp":
                        bild = wahlpflichtbild;
                        break;
                    case "w":
                        // Dieser Fall kommt momentan nicht vor
                        bild = wahlbild;
                        break;
                    default:
                        bild = unbekannter_modus_bild;
                        break;
                }
                // momentaner Hack:
                //                if (modul_mode == "p") bild = pflichtbild;
                //                else bild = wahlpflichtbild;

                // hiet ist span.inAuswahl fï¿½r die Besetzung eines Modul in Auswahl gedacht.
                //span.custom sagt, dass ein modul normal oder ein dummy-modul ist
                //span.custom_exist sagt, dass das dummy-modul bereits im pool ist
				var this_sel_name=$(this).find("add_sel_name").text();
                var pool_modul_class="pool_modul";
				var modul_parent_attr="nein";
				var partial_mod_name="";
				
				// Teil_modul_ name wird angehängt
				if($(this).attr("parent") != ""){
					pool_modul_class="partial_modul";
					modul_parent_attr=$(this).attr("parent");
					//alert(modul_parent_attr);
					//check nach Teil_Modul_Name add_sel_name
					partial_mod_name = this_sel_name;
					
					
				}
				var custom_category="nein";
                if(modul_class=="custom"){
					
                    pool_modul_class="custom_modul";
					custom_category=parent_id;
					
                }
				
				//check nach total_credits, die nur im Pool beim Kopfmodul angezeigt wird. 
				var this_total_credits="0";
				var total_credits=$(this).attr("total_credits");
				var credits_in_selection = credits;
				
				if(total_credits!=""){
					this_total_credits=total_credits;// für das KopfmodulModul, das wieder zurück in Pool ist
					credits=total_credits;
					
				}
				
				
				
                appendString += "<div class='" + modul_id + "_parent ' rel='mod_parent'><div class='nichtleer'></div><div class='"+
                pool_modul_class+"' id='" + modul_id + "' >" +
                // "<div id='icon_loeschen' style='display:none; cursor:pointer; float:right; width:12px;height:0px;overflow:visible;' onclick='show_pool_by_in(" +
                "<div class='icon_loeschen' style='display:none; cursor:pointer; float:right; width:12px;height:0px;overflow:visible;' onclick='modul_loeschen(" +
                modul_id +","+modul_id+")'>" +loeschenbild +"</div>" +
                "<span class='inAuswahl' style='display:none'>nein</span>" +
                "<span class='custom' style='display:none'>"+modul_class+"</span>"+
                "<span class='custom_exist' style='display:none'>nein</span>"+
				"<span class='custom_category' style='display:none'>"+custom_category+"</span>"+
				"<span class='modul_parts' style='display:none'>"+modul_parts+"</span>"+
				"<span class='modul_parts_exsit' style='display:none'>"+"nein"+"</span>"+
				"<span class='modul_parent_attr' style='display:none'>"+modul_parent_attr+"</span>"+
				"<span class='add_sel_name_in_sel' style='display:none'>"+this_sel_name+"</span>"+
				"<span class='modul_name_in_pool' style='display:none'>"+modul_name+"</span>"+
				"<span class='total_modul_credit' style='display:none'>"+this_total_credits+"</span>"+
				"<span class='credits_in_selection' style='display:none'>"+credits_in_selection+"</span>"+
                "<table cellspacing='0' cellpadding='0' style='width:100%; border:1px;'>" +
                "<tbody>" +
                "<tr>" +
                "<td style=' width:22px;padding:1px 2px 0px 2px; '>"+bild+"</td>"+
                // test, raus mit der width-Angabe (OS)
				// "<td class='modul_name' style='width:99%'>"+modul_name+"</td>"+
                "<td class='modul_name' >"+modul_name+partial_mod_name+"</td>"+
					
                // Kurzbezeichnung raus aus der Auswahl (OS)
                // "<td style=' width:20%'>" +
                // 	"<span class='modul_short' style='display:none'>"+"("+modul_short+")"+"</span>"+
                // "</td>"+

                "<td style=' width:22px;display:table-cell' class='fragebild_td'>" +
				"<a style='cursor:pointer' onclick='javascript:info_box("+modul_id+");'>"+
                "<span class='fragebild' style='display:block;margin:0px 0px 0px 0px;' >"+fragebild+"</span>"+
				"</a>"+
                "</td>" +

                "<td style='width:25px;display:none;margin-right:0px;' class='noten_input_td' >" +
                "<span class='noten'>" +
				"<span class='modul_has_grade' style='display:none;'>"+has_grade+"</span>"+
                "<input class='noten_input' type='text' size='5' style='margin-right:5px;' rel='"+modul_id+"' value='Note' />"+
                "</span>" +
                "</td>" +

                "<td style=' width:22px;display:none' class='ipunkt_td'>" +
				"<a style='cursor:pointer' onclick='javascript:info_box_selection("+modul_id+");'>"+
                "<span class='ipunkt' style='padding:1px 2px 0px 0px;'>"+ipunkt+"</span>"+
				"</a>"+
                "</td>" +

                "<td class='modul_credit' style='width:32px;text-align:right;font-weight:bold'>" +
                credits +" C" +
                "</td>" +
                "</tr>" + "</tbody>" + "</table>" +
				"<p class='credit-option' style='display:none'></p>"+
				"<p class='warnung-option' style='display:none'></p>"+
				"<p class='note-option' style='display:none'></p>"+
                "</div></div>";

                //kopieren das Modul in search_table  fï¿½r die Suche
                $("#suche tbody").append("<tr class='"+modul_id+"' rel='"+pool_modul_class+"' >"+"<td>"+modul_id+"</td>"+"<td>"+modul_name+"</td>"+"</tr>");
				
            default:
                // Hmm, warum kommt das hier noch so oft? Spï¿½ter mal nachschauen!
                // alert("Fehler: Pool-XML-Abfrage enthaelt ungueltige Elemente!");
                break;
        }
    });
    return appendString;
}//ende poolrekursiv


//POOL-Funktion gibt immer ganzen Module im POOL zurï¿½ck, 
//und ruft AJAX auf  ------------------------------

	
var pool = function(){

    var XML = $.ajax({

        type: 'GET',
        url: 'abfragen/pool',
        async: false,
        contentType: 'application/x-www-form-urlencoded',
        error : function(a,b,c){
            alert("problem with pool");
        }
    }).responseXML; //ende AJAX

    var root = XML.documentElement;
	var this_pool = $("#pool");
    $("#pool").empty();
	
    // Pool anzeigen
    $("#pool").append(poolrekursiv(root));
	
	
   
	hide_partial_modul();
    session_auswahl();
	//get_custom_modul();
	get_custom_modul_in_the_search_table();
	custom_modul_rekursiv(this_pool);
    ueberblick();
	
}//ende pool

var search_is_active = function(){
    // Nicht besonders schï¿½n, funktioniert zum Beispiel nicht mehr, wenn man einen Start-
    // String im Such-Feld vorgibt. Reicht aber momentan. (OS)
    return ($("#qs").val() != "" );
}

var change_module_style_to_pool = function(handle){
	// style für option
	$(handle).find("p.credit-option").css("display","none");
	$(handle).find("p.warnung-option").css("display","none");
	$(handle).find("p.note-option").css("display","none");
	$(handle).find("div.icon_loeschen").css("display","none");
   	
	jQuery.each(jQuery.browser, function(i) {
		if($.browser.msie){
			$(handle).find(".fragebild_td").css("display","inline");
		}
		else{
			$(handle).find(".fragebild_td").css("display","table-cell");
		}
		
	});
    $(handle).find(".ipunkt_td").css("display","none");
	$(handle).find(".noten_input_td").css("display","none");
	
    return 0;
}

var change_module_style_to_auswahl = function(handle){
	// style für option
	$(handle).find("p.credit-option").css("display","block");
	$(handle).find("p.warnung-option").css("display","block");
	$(handle).find("p.note-option").css("display","block");
	
    $(handle).find("div.icon_loeschen").css("display","block");
    $(handle).find(".fragebild_td").css("display","none");
    //$(handle).find(".ipunkt_td").css("display","table-cell");
	
	jQuery.each(jQuery.browser, function(i) {
      		//alert("hallo "+i);
			if($.browser.msie){
				
					
					$(handle).find(".ipunkt_td").css("display","inline");
					if ($(handle).find("span.modul_has_grade").text() != "nein") {
						$(handle).find(".noten_input_td").css("display", "inline");
					}
					
			}	
				
			else {	
					
					$(handle).find(".ipunkt_td").css("display","table-cell");
					if ($(handle).find("span.modul_has_grade").text() != "nein") {
						$(handle).find(".noten_input_td").css("display", "table-cell");
					}
			}
			
	});
	/*$(handle).find(".ipunkt_td").css("display","table-column");
	if ($(handle).find("span.modul_has_grade").text() != "nein") {
		$(handle).find(".noten_input_td").css("display", "table-column");
		//$(handle).find(".noten_input_td").css("display", "inline");
		
	}*/
	
    return 0;
}

var module_div_present_in_parent = function(parent_handle){
    // recht uebler Hack (OS)
    var result = ($(parent_handle).text() != "")
	
    // if (result) alert("module_div_present_in_parent: true");
    // else alert("module_div_present_in_parent: false");
	
    return result;
}
