/*--------------POOL anzeigen---------------------------------------------------------*/
//				pool() wird in index.html aufgerufen
//              pool() ruft die poolrekursiv auf 
//              pool gibt XML-Datei zur�ck  
//              Diese Datei enth�lt folgende Funktionen: 
//					session_auswahl(),
//					drop_in_auswahl (),drop_in_pool()
//					ajax_serverupdate_add(),
//					ajax_serverupdate_remove(),ajax_serverupdate_grade(),
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
var gruener_ipunkt = "<img src='images/iPunkt.png'>";
var gelber_ipunkt = "<img src='images/iPunktGelb.png'>";
var roter_ipunkt = "<img src='images/Ausrufezeichen.png'>";
	
var loeschenbild = "<img src='images/Loeschen.png' style='position:relative; top:-4px; left:8px;'>";
var pfeil_rechts = "<img src='images/Pfeil-Rechts.png' style='padding-right:3px;'>";
var pfeil_unten = "<img src='images/Pfeil-Unten.png' style='padding-right:3px;'>";
var pfeil_leer = "<img src='images/Pfeil-Rechts-Leer.png' style='padding-right:3px;'>";
	
var warten_weiss = "<img src='images/Warten-HintergrundWeiss.gif' style='padding-right:3px;'>";
var warten_blau = "<img src='images/Warten-HintergrundGrau.gif' style='padding-right:3px;'>";
var warten_semester_animation = "<img src='images/Warten-HintergrundSemester.gif' style='padding-right:3px;'>";

// wenn der �berblick fertig geladen wurde, den Lade-Balken verscheinden lassen (OS)
$(document).ready(function(){
    $("#pleasewait").slideUp("slow");
    // Klickbare Info-Buttons sollen beim dr�berfahren animiert werden (OS)
    // F�r das Analogon im �berblick siehe ueberblick.js
    $(".ipunkt_td, .fragebild").mouseenter(function(){
        $(this).animate({
            opacity: 0.4
        }, "fast");
        $(this).animate({
            opacity: 1.0
        }, "slow");
    });
});

var change_credit_and_add_name_in_selection = function(handle){
    //credit �ndern
    var c_text =$(handle).find(".credits_in_selection").text();
    $(handle).find(".modul_credit").text(c_text+" C");
    //name hizuf�gen
    var n_text = $(handle).find(".add_sel_name_in_sel").text();
    $(handle).find(".modul_name").append(n_text);
	
    return 0;
}

// Diese Funktion ändert entgegen dem Namen nicht nur die Farbe des Info-Icons, sondern setzt auch
// den ".is_error"-Text des Moduls (OS)
// Diese Funktion ersetzt die alten Funktionen:
// - set_image_to_gruener_ipunkt
// - set_image_to_green_or_red_ipunkt
// - set_image_to_red_ipunkt_and_error_to_yes
// - set_image_to_ipunkt
// Fehlt möglicherweise noch: Ausnahme-Optionen-Verhalten
var flip_module_infoicon_on_event = function(type,handle){
    // gefragt is handle zur Kategorie
    var this_class = $(handle).attr("class");
    if(!($(handle).hasClass("auswahl_modul_clone")||$(handle).hasClass("auswahl_modul")||$(handle).hasClass("custom_modul"))) {
        alert("Fehler: Handle in flip_module_infoicon_on_event() ist kein Modul (class="+this_class+")!");
    }
	
    switch(type){
			// Die ersten beiden Events sollten optimiert sein, da die Fehler-Überprüfung bei jeder
			// Änderung aufgerufen wird. Bei den Noten-Events unten ist das nicht so wichtig.
	    case "error":
				// In dem Fall ist klar, was passieren muss, unabhängig von der Note wird das Icon auf
				// rot gesetzt, falls das nicht ohnehin schon der Fall ist:
				if ($(handle).find(".is_error").text() != "ja") {
			  	$(handle).find(".ipunkt").html(roter_ipunkt);
					// Soll hier noch eine jQuery-Animation rein?
			  	$(handle).find(".is_error").text("ja");
				}
				break;
				
	    case "no_error":
				if ($(handle).find(".is_error").text() != "nein") {
			  	$(handle).find(".is_error").text("nein");
					// Abhängig davon, ob das Modul benotet ist, wird das Icon auf gelb oder grün gesetzt
					if (($(handle).find(".modul_has_grade").text()=="ja")&&($(handle).find(".noten_input").val()!="Note"))
				  	$(handle).find(".ipunkt").html(gelber_ipunkt);
				  else $(handle).find(".ipunkt").html(gruener_ipunkt);
				}
				break;
				
	    case "entered_grade":
				// Falls kein Fehler vorliegt, wird das Icon auf grün gesetzt
				if ($(handle).find(".is_error").text() != "ja")
					$(handle).find(".ipunkt").html(gruener_ipunkt);
				break;
				
	    case "invalid_grade":
				// Falls kein Fehler vorliegt, wird das Icon auf gelb gesetzt
				if ($(handle).find(".is_error").text() != "ja")
					$(handle).find(".ipunkt").html(gelber_ipunkt);
				break;
			
			case "init":
				// Das ist für den Fall gedacht, wenn man ein Modul in die Auwahl zieht, und also alle
				// anderen Event-Arten möglich sind
				// Nur benutzt in der Funktion change_module_style_to_auswahl
				if ($(handle).find(".is_error").text() == "nein") {
					// Abhängig davon, ob das Modul benotet ist, wird das Icon auf gelb oder grün gesetzt
					if (($(handle).find(".modul_has_grade").text()=="ja") && (($(handle).find(".noten_input").val()!="Note")||($(handle).find(".noten_input").val()!="")))
				  	$(handle).find(".ipunkt").html(gelber_ipunkt);
				  else $(handle).find(".ipunkt").html(gruener_ipunkt);
				}
				else $(handle).find(".ipunkt").html(roter_ipunkt);
				
				break;
				
			default:
				alert("Fehler in flip_module_infoicon_on_event: Typ "+type+" unbekannt!");
		}
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
    var this_grade      = $(input_noten).val();
    var modul_id        = $(input_noten).attr("rel");
    var trim_grade      = $.trim(this_grade);
    var check_komma     = this_grade.search(/./);
		var module_handle   = $(input_noten).parent().parent().parent().parent().parent().parent();
    
    if(check_komma != -1){
        this_original = this_grade.replace(/\./,",");
    }
	
    var this_float      = parseFloat(trim_grade);
	
    if(isNaN(this_float)){
        alert("Bitte geben Sie eine Zahl zwischen 1,0 und 4,0 ein.");
        $(input_noten).attr("value","Note");
				flip_module_infoicon_on_event("invalid_grade",module_handle);
        $("#note_berechnen").text("");
    } else {
        //suche nach ',' in String trim_grade dann verwandel es zum '.'
        var new_trim_grade  = trim_grade.replace(/,/,".");   //1,2-->1.2
        var new_float       = parseFloat(new_trim_grade);

        if(new_float < 1 || new_float > 4 ){
            alert("Bitte geben Sie eine Zahl zwischen 1,0 und 4,0 ein.");
						flip_module_infoicon_on_event("invalid_grade",module_handle);
            $(input_noten).attr("value","Note");
            $("#note_berechnen").text("");
        } else {
            $(input_noten).attr("value",this_original);
						flip_module_infoicon_on_event("entered_grade",module_handle);
            // if(!check_error_by_span(input_noten)){
            //     set_image_to_gruener_ipunkt(input_noten);
            // }
            ajax_serverupdate_grade(modul_id,new_float);
            // hier kann man Note klicken
            ajax_request_grade();
        }
        $("#note_berechnen").text("");
    }
}

// Diese Funktion geh�rt zu show_pool_by_out, also zum Ziehen eines Moduls vom Pool in die
// Auswahl. (im Such-Modus)
// Sie geht die Kategorien-Hierarchie nach oben hin durch und versteckt diese Ebenen.
// Der Aufruf erfolgt �ber die Funktion drop_in_auswahl().
function rekursiv_pool_by_out(handle, initial_tolerance){
    // gefragt is handle zur Kategorie
    var this_class = $(handle).attr("class");
    if(!((this_class=="pool_category")||(this_class=="search_category"))) {
        alert("Fehler: Handle in rekursiv_pool_by_out() ist keine Kategorie!");
    }

    var parent = $(handle).parent();
	
    // Der Sinn der initial_tolerance ist, dass man die Funktion auch aufrufen kann,
    // wenn in der ersten Ebene das entspr. Modul noch nicht verschoben wurde (OS)
    if (number_of_visible_items_in_category(handle) == initial_tolerance) {
        $(handle).attr("class","pool_category");
        $(handle).css("display","none");
        if ($(parent).attr("id") != "pool") rekursiv_pool_by_out(parent,0);
    }
}

// Das wird nur aufgerufen, wenn ein Modul in den Pool zurueck kommt (via modul_loeschen), dass
// mit der momentanen Suche überein stimmt
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

// Aendern der Schriftgrösse
function font_size(points){
    $("body,table").css("font-size",points+"px");
}


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
    $("#help_optional").hide();
    $("#helpmovedown").show();
}
var show_minihelp = function(){
    $("#help_optional").slideDown();
    $("#helpmovedown").hide();
}


// Fixieren bzw. 

var hide_partial_modul = function(){
    $("#pool .partial_modul").hide();
}

//--------CUSTOM-MODUL--------------------------------------------------------------------

var custom_modul_rekursiv = function (handle){
    //    var handle_id = $(handle).attr("id");
    $(handle).children().not("a,.nichtleer").each(function(){
        
        var this_class  = $(this).attr("class");
        var this_rel    = $(this).attr("rel");
			
        if (this_class == "pool_category") {
            custom_modul_rekursiv(this);
        } else {
            if(this_rel =="mod_parent"){
                var this_modul = $(this).children().not(".nichtleer").eq(0);
                if(($(this_modul).hasClass("custom_modul"))&&($(this_modul).css("display")=="block")){
                    //                    var i = $(this_modul).css("display");
                    $(this_modul).hide();
                    $(this_modul).attr("class","pool_modul");
                    // versteck alle anderen custom im gleichen Kategorie
                    $(this).siblings().each(function(){
                        var this_kind   = $(this).children().not(".nichtleer").eq(0);
                        //                        var cl          = $(this_kind).attr("class");
                        if($(this_kind).hasClass("custom_modul")){
                            $(this_kind).hide();
                        //                            var p = $(this_kind).css("display");
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
    // die Funktion zeigt nur ein display_none Custom_modul in einem Category im  Pool an
	
    var this_cat = $("#pool").find("#"+category_id);
    var the_first = $(this_cat).find(".custom_modul").filter(function(index){
        return index==0;
    });
	
    // class ver�ndern. custom-->pool_modul. Damit wird nur ein custom_modul im Pool ist
    if(search_is_active){
        var father = $(the_first).parent().get(0);
        $(father).addClass("search_modul");
    }
    $(the_first).removeClass("custom_modul").addClass("pool_modul ui-draggable");
    $(the_first).show();
	
}//ende get_custom_modul

var get_and_change_custom_modul_in_the_table = function(modul_id,new_name,cat_id){
	
    var this_tr = $("#suche").find("."+modul_id);
    $(this_tr).find(">.td_custom_name").text(new_name);
    //get the first custom modul
    var the_first = $("#suche").find("tr[rel='custom_modul']").filter(function(index){
        var this_text = $(this).find(">.cat_check").text();
        if(this_text==cat_id){
            return this;
        }
    }).eq(0);
    $(the_first).attr("rel","pool_modul").show();
}


var custom_modul_in_the_search_table_rekursiv = function(){
    // custom_modul in Suche-Table
    //alert("custom in the table");
	
    $("#suche").find("tr[rel='custom_modul']").each(function(){
        //alert("hall custom");
        var td_cat_check = $(this).find(">td.cat_check");
        var cat_id = $(td_cat_check).text();
        var check  = $(td_cat_check).attr("rel");
        //alert("cat_id ="+cat_id+"check ="+check);
		
        if(check == "noCheck"){
            //alert("hallo check");
            $(this).attr("rel","pool_modul");
            $(this).show();
            //versteck die andere mit gleichen Cat_id
            $(this).siblings().each(function(){
				
                var td = $(this).find(">td.cat_check");
                if($(td).text()==cat_id){
					
                    $(td).attr("rel","checked");
                }
            });
        }
		
    });
	
	
	
	
	
	
	
/*var the_first;
	var custom_modul = $("#suche").find("tr[rel='custom_modul']").filter(function(index){
		if(index==0){
			the_first=$(this);
		}
		return index!=0
	});
	
	$(custom_modul).hide();
	$(the_first).attr("rel","pool_modul").show();
	*/
	
}

// Wof�r ist diese Funktion? Bitte noch kommentieren oder l�schen (OS)
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
    $("#middle div.subsemester").find("div").each(function(){
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
    //$("#semester-content div.semester").find("div#"+mod_id).each(function(){
    $("#middle div.semester").find("div#"+mod_id).each(function(){
		
        var this_mod_parts = $(this).find(".modul_parts").text();
        var this_mod_par_attr = $(this).find("span.modul_parent_attr").text();
        //alert("Mod-Parts ="+this_mod_parts);
        //check nach Teil-Modul
        if((this_mod_parts != "0")|| (this_mod_par_attr !="nein")){
            var check = confirm("Dieses Modul besteht aus mehreren Teilmodulen - wenn Sie es entfernen, werden alle weiteren Teile ebenfalls entfernt.");
            if(check == true){
				
                if(this_mod_par_attr != "nein"){
                    //hier ist Teil-modul
                    //such nach head-modul-->l�schen
                    var head_modul = $("#middle div.semester").find("div#"+this_mod_par_attr);
                    change_credit_and_remove_name_in_pool(head_modul);
                    $(head_modul).find(".head_modul_in_pool").text("ja");
                    sub_modul_loeschen(head_modul,this_mod_par_attr,all_sem_destroy);
                    partial_modul_loeschen(this_mod_par_attr,all_sem_destroy);
                }
                else{
                    //hier ist head-Modul
                    // setzen "ja" beim span.head_modul_in_pool ( wegen AJAX)
                    $(this).find(".head_modul_in_pool").text("ja");
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
                        //check nach dummy.
                        if($(this).find("span.custom").text()!="custom"){
                            $(this).find("#" + mod_id).css("display", "block");
                        }
                    }
                }
            // else $(this).find("#"+mod_id).css("display","none");
            }
				
        }// ende if leer
			
        else { // Modul ist schon im Pool, nur versteckt
            //alert("hallo");
            // check den Vater-Kategory, ob der gerade offen ist (neu, OS)
            if (arrow_type == "leer")
                flip_arrow_of_category("rechts",$(this).parent());
            else if (arrow_type == "unten") {
                if ((!search_is_active()) || $(this).is(".search_modul")) {
                	
                    if($(this).find("span.custom").text()!="custom")
                        $(this).find("#"+mod_id).css("display","block");
                //else alert("na, hier bist du wieder ein dummy");
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
                if($(this_mod).find("span.custom").text()!="custom"){
                    $(this_mod).show();
                }
                else alert("ich bin da das Dummy in search-active");
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
    ajax_serverupdate_remove(mod_id);
    if((kopf_modul_check == "0")&&(parent_attr_check=="nein")&&(all_sem_destroy!="10000")){
        ueberblick();
    }
}//ende sub_modul_loeschen

//info_box


var info_box_selection = function(modul_id){
    //schreib modul_id in attr "rel", um sp�ter wieder
    //Modul in Auswahl zu finden
		
		
    $("#exception_credit").attr("rel",modul_id);
    $("#box_info").empty();
    $("#box_info_exception").show();
    $("#box_info_pool").hide();
    $("#box_info_combobox").hide();
    $("#box_info_overview").hide();
		
    ajax_request_module_info(modul_id);
    $('#info_box').dialog('open');
		
}

var info_box = function(modul_id){
    $("#box_info").empty();
    $("#box_info_exception").hide();
    $("#box_info_combobox").hide();
    $("#box_info_overview").hide();
    $("#box_info_pool").show();
        
    ajax_request_pool_module_info(modul_id);
    $("#info_box").dialog('open');
}

var update_modul_in_selection = function (){
    //checken ob das Modul in Vorratbox
    var modul_in_vorratbox = false;
    //check, ob man etwas in Ausnahme veraendert hat
    //    var exception_change = $("#exception_change").val();
    var credit_exception_change = $("#credit_exception_change").val();
	
    var modul_id = $("#exception_credit").attr("rel");
    var this_modul = $("#semester-content .subsemester").find("div#"+modul_id).eq(0);
    var this_modul_in_subsemester=$(this_modul).text();
    if(this_modul_in_subsemester==""){
        modul_in_vorratbox=true;
    }
	
    //suche das Modul in Vorratbox
    if(modul_in_vorratbox){
        this_modul=$("#semesterBOX .subsemester").find("div#"+modul_id).eq(0);
    }
	
    var v=$("#exception_credit").val();
    var warn_checked = $("#exception_warn:checked").val();
    var note_checked = $("#exception_note:checked").val();
		
    // entfernen credit-option,warnung- und note-option falls die schon bereits vorhanden sind
    var this_credit =$(this_modul).find("p.credit-option");
    
    var this_warn = $(this_modul).find("p.warnung-option");
    $(this_warn).html("");
    var this_note =$(this_modul).find("p.note-option");
    $(this_note).html("");
		
    if(v!="Credits" && v!="" && credit_exception_change=="true"){
        $(this_credit).html("");
        $("#exception_change").attr("value","true");
        $("#credit_exception_change").attr("value","false");
        $(this_modul).find(".modul_credit").text(v+" C");
        $(this_credit).html("Ausnahme: Credit-Zahl wurde ver&auml;ndert");
        ajax_serverupdate_change_credits(modul_id,v);
    }
		
    //warnung
    if (warn_checked == "checkbox") {
        ajax_serverupdate_remove_warning(modul_id);
        $(this_warn).html("Ausnahme: Warnungen deaktiviert");
    } else if(warn_checked==undefined) {
        ajax_serverupdate_add_warning(modul_id);
    }
    //note
    if(note_checked=="checkbox") {
        ajax_serverupdate_remove_grade(modul_id);
        $(this_note).html("Ausnahme: Note wird nicht eingebracht");
    } else if(note_checked==undefined) {
        ajax_serverupdate_add_grade(modul_id);
    }
    // category
    //    var category_id = $("#category_category_id").val();
    //    ajax_serverupdate_set_category(modul_id, category_id);



    //    checken, ob man �berhaupt Ausnahme-Optionen veraendert hat.
    //        erst wenn ja dann wird ueberblick() akktuallisiert
    if($("#exception_change").val()=="true"){
        ueberblick();
        $("#exception_change").attr("value","false");
    }

// Übergangsweise wird immer der Überblick aktualisiert, damit die Veränderungen
// in der Bereichs-ComboBox sichtbar werden
//    ueberblick();

}//ende

var update_dummy_modul_in_selection = function(dummy_modul){
    //alert("Hallo update dummy");
    //check ob man das Note-streichen im Dialog ankreuzt
    var ch =$("#custom_dialog form #note_streichen #note_checkbox:checked").val();
    //alert("checked="+ch);
	
    if(ch=="checkbox"){
        $(dummy_modul).find("p.note-option").css("display","block").text("Ausnahme: Note wird nicht eingebracht");
        var dummy_id = $(dummy_modul).find("> span.modul_id").text();
        //alert("Dummy_id = "+dummy_id);
        ajax_serverupdate_remove_grade(dummy_id);
        $("#note_checkbox").attr("checked","");
    }
    return 0;
}	







// session_auswahl() implementieren. Die ruft action abfragen/auswahl per AJAX auf

var change_custom_in_pool_by_session_load = function(das_erste,custom_name,custom_credit){
    //alert("Hallo custom_change");
    $(das_erste).find(".modul_name").text(custom_name);
    $(das_erste).find(".modul_credit").text(custom_credit+" C");
    $(das_erste).attr("class","pool_modul ui-draggable");
    $(das_erste).find(".custom_exist").text("ja");

    return 0;
	
}
var change_custom_in_selection_by_session_load = function(auswahl_modul_clone,custom_name,custom_credit){
	
    //alert("hi change custom");
    $(auswahl_modul_clone).find(".modul_name").text(custom_name);
    $(auswahl_modul_clone).find(".modul_credit").text(custom_credit+" C");
    $(auswahl_modul_clone).attr("class","pool_modul ui-draggable");
    $(auswahl_modul_clone).find(".custom_exist").text("ja");

    return 0;
	
}

var set_mod_has_grade_to_no = function(handle){
    $(handle).find("span.modul_has_grade").text("nein");
	
}

var session_auswahl_rekursiv = function(root){
	
    var sem_content = $("#semester-content");
	
    $(root).children().each( function(){
        var knoten_name = this.nodeName;
        // check Bl�tter
        if (knoten_name == "module"){
            var parent = $(this).parent().get(0);
            var parent_id = $(parent).attr("count");
            // entsprechenem  modul_id im Pool suchen, dann clonen ins Auswahl
            // dann verstecken die originalen Module im Pool
            var mod_id = $(this).attr("id");
            var mod_grade = $(this).attr("grade");
            //has_general_grade:Das zeit an, ob dieses Modul normalerweise benotet ist.
            //momentan has_general_grade noch nicht benutzt. Es soll set_mod_has_grade_to_no(auswahl_modul_clone) benuztz werden, 
            //damit Noten_feld weg ist.
            //Has_grade zeigt an, ob das Modul derzeit benotet ist, d.h. die Note gestrichen wurde.
            var mod_has_grade=$(this).attr("has_grade");
            var mod_credit=$(this).attr("credits");
            var mod_has_warning=$(this).attr("has_warning");
            var modul_im_pool = $("#pool").find("div#"+mod_id);
            var das_erste = $(modul_im_pool).eq(0);

            var modul_has_additional_info = $("#pool").find("div#"+mod_id).find(".additional_info").eq(0).text();
            // alert("ModID="+mod_id+", AddInfo="+modul_has_additional_info);
			
            // die originalen Module verstecken
            //und den span.inAuswahl auf "ja" setzen
            //und alle vor dem Clone
            var auswahl_modul_clone=$(das_erste).clone(true);
            $(modul_im_pool).each(function(){
                $(this).hide();
                $(this).find("span.inAuswahl").text("ja");
            });
            //custom_modul laden: Name und credit ver�ndern
            if($(this).hasClass("custom")){
                var custom_name = $(this).attr("name");
                var custom_credit    = $(this).attr("credits");
                change_custom_in_selection_by_session_load(auswahl_modul_clone,custom_name,custom_credit);
            }
			
            // ver�ndern erstmal die interne im Modul bei dem Clone
            //besonders hat die Klone die class "auswahl_modul_clone"
            //zur Indentifizierung bei alle erster Ver�nderung im Auswahl
			
            // check ob die Note derzeit gestrichen wurde.
            if(mod_has_grade=="false"){
                $(auswahl_modul_clone).find("p.note-option").html("Ausnahme: Note wird nicht eingebracht");
            }			
            $(auswahl_modul_clone).attr("class","auswahl_modul_clone");
            change_module_style_to_auswahl(auswahl_modul_clone);
            //geaenderte Credits? und Warnung deaktivieren?
            //wenn ja dann die entsprechenen Meldungen anzeigen
            if(mod_credit!=""){
                $(auswahl_modul_clone).find("p.credit-option").html("Ausnahme: Credit-Zahl wurde ver&auml;ndert");
                $(auswahl_modul_clone).find("td.modul_credit").text(mod_credit+" C");
            }
            if(mod_has_warning=="false"){
                $(auswahl_modul_clone).find("p.warnung-option").html("Ausnahme: Warnungen deaktiviert");
            }
            // Noten setzen
            if(mod_grade != "" ){
                var this_noten=$(auswahl_modul_clone).find(".noten_input");
                var this_grade = mod_grade;
                //set comma
                var check_komma = mod_grade.search(/./);
                if(check_komma != -1){
                    this_grade = mod_grade.replace(/\./,",");
                }
                $(this_noten).val(this_grade);
								flip_module_infoicon_on_event("entered_grade",auswahl_modul_clone);
            }
            if (check_error(mod_id))
							flip_module_infoicon_on_event("error",auswahl_modul_clone);

            $(auswahl_modul_clone).find("span.inAuswahl").text("ja");
            //check nach Kopfmodul. Wenn ja dann credit name und head_modul_in_pool ver�ndern
            if($(auswahl_modul_clone).find(".modul_parts").text()!="0"){
                $(auswahl_modul_clone).find(".head_modul_in_pool").text("nein");
                change_credit_and_add_name_in_selection(auswahl_modul_clone);
                $(auswahl_modul_clone).find(".modul_parts_exsit").text("ja");
            }
            //check nach Teil-Modul
            if($(auswahl_modul_clone).find(".modul_parent_attr").text()!="nein"){
                $(auswahl_modul_clone).show();
            }

            // VoratBOX
            if(parent_id == "0"){
                var sem = $("#middle").find("#semesterBOX .subsemester");
                $(sem).append(auswahl_modul_clone);
            }
            // reinstecken das Klone im Auswahl
            $(sem_content).find("div.semester").each(function(){
                var x= $(this).attr("id");
                if (parent_id == x){
                    $(this).find(".subsemester").append(auswahl_modul_clone);
                }
            });//ende each intern

            // Falls nötig, noch die zusätzliche Combobox anzeigen
            if(modul_has_additional_info == "true") {
                // alert("Hier kommt vom Server noch eine Combobox.");
                ajax_request_combobox(mod_id);
                $(auswahl_modul_clone).find(".additional_info").text("drop_down_schon_in_auswahl");
            }
            return;
        }// ende Bl�tter
        //check semester
        else  if ( knoten_name == "semester"){
            var sem_id = $(this).attr("count");
            if (sem_id != "0") {
                $(sem_content).append("<div class='semester' id='" + sem_id + "'>" +
                    "<div class='subsemester'>" +
                    "<h5>" +
                    sem_id +
                    ". Semester" +
                    "</h5>" +
                    //"<span class='leer' style='display:none;color:red'></span>"+
                    "</div>" +
                    "<a style='display:none;' class='semesterloeschen' onClick='sem_loeschen(" +
                    sem_id +
                    ");'>Semester entfernen</a>" +
                    "</div>");
            }
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
            alert("AJAX-Fehler: auswahl");
        }
    }).responseXML;
    var root = XML.documentElement;
    // rekursiv aufrufen
    $("semester-content").empty();
    $("#middle").find("#semesterBOX .subsemester").empty(); // VoratBOX
    session_auswahl_rekursiv(root);
    // Loeschen anzeigen.Wir suchen das letzten Semester.
    var last_semester = $("#semester-content div.semester:last");
    $(last_semester).find("a.semesterloeschen").css("display","inline");
}//ende 

//   AJAX zum Server---------------------------------------------------------------------	

var ajax_request_module_info = function (modul_id){
    $.ajax({
        type : 'POST',
        url  : '/abfragen/get_module_info',
        async: false,
        dataType:'text',
        contentType: 'application/x-www-form-urlencoded',
        data :"module_id="+modul_id+"&"+authenticityTokenParameter(),
        success : function(html){
            // alle Ausnahme-Option ersmal auf Null setzen
            $("#exception_credit").attr("checked", "");
            $("#exception_warn").attr("checked", "");
            $("#exception_note").attr("checked", "");
            $("#info_box #box_info").append(html);
            // Mein Versuch, die Checkboxen zu selektieren, wenn die entsprechenden Optionen gesetzt sind...
            if($("#has_grade").text() == '0') {
                $("#exception_note").attr("checked", "checked");
            }
            if($("#has_warning").text() == '0') {
                $("#exception_warn").attr("checked", "checked");
            }
            if($("#custom_credits").text() != -1) {
                var this_credits =$("#custom_credits").text();
                $("#exception_credit").attr("value",this_credits);
            } else {
                $("#exception_credit").attr("value","Credits");
            }
            if($("#has_general_grade").text() == 0) {
                $("#note_streichen_checkbox").css("display", "none");
            } else {
                $("#note_streichen_checkbox").css("display", "table-row");
            }
        }/*,
                error: function(a,b,c){
                        alert(b);
                }*/
    });
}

var ajax_request_pool_module_info = function (modul_id){
    $.ajax({
        type : 'POST',
        url  : '/abfragen/get_pool_module_info',
        async: false,
        dataType:'text',
        contentType: 'application/x-www-form-urlencoded',
        data :"module_id="+modul_id+"&"+authenticityTokenParameter(),
        success : function(html){
            $("#info_box #box_info").append(html);
        }
    });
}

var ajax_serverupdate_add = function (modul_id,semester,cat_id){
    $.ajax({
        type: 'POST',
        url  : 'abfragen/add_module_to_selection',
        cache:false,
        dataType:'text',
        async :false,
        data  : "mod_id="+modul_id+"&"+"sem_count="+semester+"&"+"cat_id="+cat_id+"&"+authenticityTokenParameter(),
        contentType:'application/x-www-form-urlencoded'
    });//ende Ajax
}

var ajax_serverupdate_remove = function (modul_id){
    $.ajax({
        type: 'POST',
        url  : 'abfragen/remove_module_from_selection',
        cache:false,
        dataType:'text',
        async :false,
        data  : "mod_id="+modul_id+"&"+authenticityTokenParameter(),
        contentType:'application/x-www-form-urlencoded'/*,
        error :  function (a,b,c){
            alert("problem with remove_module_from_selection");
        }*/
    });//ende Ajax
}// ende

var ajax_serverupdate_remove_semester = function (sem_count){
    //alert("sem_count="+sem_count);
    $.ajax({
			
        type: 'POST',
        url : 'abfragen/remove_semester_from_selection',
        dataType:'text',
        cache : false,
        async : false,
        data  : "sem_count="+sem_count+"&"+authenticityTokenParameter(),
        contentType:'application/x-www-form-urlencoded'/*,
        error : function (a,b,c){
            alert("problem with abfragen/remove_semester_from_selection");
        }*/
		
    });
    ueberblick();
	
}

var ajax_serverupdate_add_grade = function(module_id) {
    $.ajax({
        type:"POST",
        url:"abfragen/add_grade",
        dataType:"text",
        cache:false,
        async:true,
        data:"mod_id="+module_id+"&"+authenticityTokenParameter(),
        contentType:"application/x-www-form-urlencoded"
    });
};

var ajax_serverupdate_remove_grade = function(module_id) {
    $.ajax({
        type: "POST",
        url: "abfragen/remove_grade",
        dataType: "text",
        cache: false,
        async: true,
        data: "mod_id="+module_id+"&"+authenticityTokenParameter(),
        contentType: "application/x-www-form-urlencoded"
    });
};

var ajax_serverupdate_add_warning = function(module_id) {
    $.ajax({
        type: "POST",
        url: "abfragen/add_warning",
        dataType: "text",
        cache: false,
        async: true,
        data: "mod_id="+module_id+"&"+authenticityTokenParameter(),
        contentType: "application/x-www-form-urlencoded"
    });
};

var ajax_serverupdate_remove_warning = function(module_id) {
    $.ajax({
        type: "POST",
        url: "abfragen/remove_warning",
        dataType: "text",
        cache: false,
        async: true,
        data: "mod_id="+module_id+"&"+authenticityTokenParameter(),
        contentType: "application/x-www-form-urlencoded"
    });
};

var ajax_serverupdate_set_category = function(module_id, category_id) {
    //		alert("POST main/set_category: mod_id="+module_id+"&cat_id="+category_id+"&"+authenticityTokenParameter());
    if(category_id != undefined) {
        $.ajax({
            type: "POST",
            url: "main/set_category",
            dataType: "text",
            cache: false,
            async: false,
            data: "mod_id="+module_id+"&cat_id="+category_id+"&"+authenticityTokenParameter(),
            contentType: "application/x-www-form-urlencoded"
        });
    };
};

var ajax_serverupdate_grade = function(modul_id,grade){
    $.ajax({
        type:"POST",
        url :"abfragen/save_module_grade",
        dataType:"text",
        cache:false,
        async:false,
        data:"mod_id="+modul_id+"&"+"grade="+grade+"&"+authenticityTokenParameter(),
        contentType:'application/x-www-form-urlencoded'/*,
        error : function(a,b,c){
            alert ("AJAX-Fehler: save_module_grade");
        }*/
    });
}



function ajax_request_combobox(mod_id){
    $("#box_info_combobox").empty();
    $("#box_info,#box_info_pool,#box_info_exception,#box_info_overview").hide();
    $.ajax({
        type:"POST",
        url :"main/combo_category",
        dataType:"text",
        cache:false,
        async:true,
        data:"mod_id="+mod_id+"&"+authenticityTokenParameter(),
        contentType:'application/x-www-form-urlencoded',
        success:function(html){
            $("#semester-content").find(".semester").each(function(){
                $(this).find(">.subsemester").children().not("h5").each(function(){
                    var this_mod_id = $(this).attr("id");
                    if(this_mod_id == mod_id){
                        var ourmenu = $(this).find("> p.drop_down_menu");
                        ourmenu.show().append(html);
                        ourmenu = ourmenu.find("select");
                        ourmenu.change(function() {
                            // alert("Dropdown-Menü verändert zu: "+ourmenu.find(":selected").text()+", value="+String(ourmenu.val()));
                            ajax_serverupdate_set_category(this_mod_id,ourmenu.val());
                            ueberblick();
                        });
                    }
                });
            });
        },
        error : function(a,b,c){
            alert ("AJAX-Fehler: custom_checkbox");
        }
    });
}



//----------------------------


var ajax_request_grade = function(){
    $.ajax({
        type : 'GET',
        url  : '/abfragen/note',
        async: false,
        contentType: 'application/x-www-form-urlencoded',
        success : function(html){
            $("#die_note").empty();
            $("#die_note").append(html);
        },
        error: function(a,b,c){
            alert("AJAX-Fehler: note");
        }
    });
}

function ajax_serverupdate_add_custom(this_name,this_credit_point_float,category_id,custom_semester,custom_id){
    category_id = category_id.split("_");
    $.ajax({
        type:"POST",
        url :"abfragen/add_custom_module_to_selection",
        dataType:"text",
        cache:false,
        async:false,
        data:"name="+this_name+"&"+"credits="+this_credit_point_float+"&"+"sem_count="+custom_semester+"&"+"mod_id="+custom_id+"&"+"cat_id="+category_id[1]+"&"+authenticityTokenParameter(),
        contentType:'application/x-www-form-urlencoded',
        success: function(data){
            ueberblick();
        }
    });
}

// Diese Funktion wird scheinbar nicht mehr benutzt (OS)
function ajax_request_custom_checkbox(custom_id){
    $("#dummy_checkbox").empty();
    $.ajax({
        type:"POST",
        url :"main/_check_category",
        dataType:"text",
        cache:false,
        async:false,
        data:"mod_id="+custom_id+"&"+authenticityTokenParameter(),
        contentType:'application/x-www-form-urlencoded',
        success:function(html){
            $("#dummy_checkbox").append(html);
        },
        error : function(a,b,c){
            alert ("AJAX-Fehler: custom_checbox");
        }
    });
}

function ajax_serverupdate_custom_checkbox(custom_id,cat_id_array){
    cat_id_array = cat_id_array.split("_");
    $.ajax({
        type:"POST",
        url :"main/set_category",
        dataType:"text",
        cache:false,
        async:false,
        data:"mod_id="+custom_id+"&"+"cat_id="+cat_id_array[1]+"&"+authenticityTokenParameter(),
        contentType:'application/x-www-form-urlencoded',
        error : function(a,b,c){
            alert ("AJAX-Fehler: set_category");
        }
    });
}//ende

function ajax_serverupdate_change_credits(mod_id,credits){
    $.ajax({
        type:"POST",
        url :"abfragen/change_credits",
        dataType:"text",
        cache:false,
        async:false,
        data:"mod_id="+mod_id+"&"+"credits="+credits+"&"+authenticityTokenParameter(),
        contentType:'application/x-www-form-urlencoded',
        error : function(a,b,c){
            alert ("AJAX-Fehler: change_credits");
        }
    });
}

var check_error = function(error_id){
    var check=false;
    $("#middle #error_table").children().each(function(){
        if($(this).attr("id")==error_id){
            check=true;
        }
    });
    return check;
}//ende

var check_error_by_span = function(noten_input){
    var this_parent = $(noten_input).parent().get(0);
    var this_text = $(this_parent).find(">.is_error").text();
    return this_text == "ja";
}

var check_error_all_modul_in_selection = function(){
    $("#semester-content").find(".semester").each(function(){
        $(this).find(">.subsemester").children().not("h5").each(function(){
            var mod_id = $(this).attr("id");
            if (check_error("error_"+mod_id))
								flip_module_infoicon_on_event("error",this);
            else flip_module_infoicon_on_event("no_error",this);
        });
    });
}

var error_table_builder = function(root){
    $(root).children().each(function(){
        var mod_id = $(this).attr("id");
        //alert("error_id="+mod_id);
        //$("div#error_table").append("<div id='problem_"+mod_id+"'>"+mod_id+"</div>");
        $("#middle #error_table").append("<div id='error_"+mod_id+"'>"+mod_id+"</div>");
		
    });
	
    check_error_all_modul_in_selection();
}



function update_module_errors(){
	
    var XML =  $.ajax({
		
        type : 'GET',
        url  : '/abfragen/errors',
        async: false,
        contentType: 'application/x-www-form-urlencoded',
        success : function(xml){
        //alert(xml);
        },
        error: function(a,b,c){
            alert("AJAX-Fehler: /errors");
        }
    }).responseXML;
	
    // error_table aufbauen
	
    $("#middle #error_table").empty();
    var root = XML.documentElement;
    error_table_builder(root);
}


// DROP in Auswahl
var drop_in_auswahl = function(modul_id, modul_class, semester, ui_draggable, this_semester, ui_helper){
    $('<div class="quick-alert">' + warten_semester_animation + 'Bitte warten!</div>').appendTo($(this_semester)).fadeIn("fast").animate({
        opacity: 1.0
    }, 1000).fadeOut("fast", function(){
        $(this).remove();
    });
	
    var this_draggable_class = $(ui_draggable).attr("class");
    //    var kopf_modul_check = $(ui_draggable).find(".modul_parts").text();
    var kopf_modul_in_pool = $(ui_draggable).find(".head_modul_in_pool").text();
    var cat_id = $(ui_draggable).find(".cat_id").text();
    //    var additional_info = $(ui_draggable).find(".additional_info").text();
	
    // check ob das reingezogenem Modul aus POOL kommt.
    // Wenn ja dann ver�ndern inhalt, und versteck das Modul im POOL.
    // Wenn nein ( also bereits im Auswahl) dann remove per AJAX erstmal das Modul aus SESSION,
    // dann wieder add per AJAX
	
    if ((this_draggable_class == "pool_modul ui-draggable") || (this_draggable_class == "pool_modul")) {
        change_module_style_to_auswahl(ui_draggable);
        $(ui_draggable).find("span.inAuswahl").text("ja");
        $(ui_draggable).attr("class", "auswahl_modul");
		
        // Falls das Modul die "search_modul"-Eigenschaft hat, wird nat�rlich auch gerade gesucht,
        // die entspr. Abfrage er�brigt sich also.
        var this_category = $(ui_draggable).parent().parent();
        if ($(ui_draggable).parent().is(".search_modul")) {
            rekursiv_pool_by_out(this_category, 1);
        }
        else {
            if (number_of_visible_items_in_category(this_category) == 1) {
                flip_arrow_of_category("leer", this_category);
            }
        }
		
        // Die anderen gleichen Module verstecken (fast gleich zum Prozedere oben)
        $("." + modul_id + "_parent").each(function(){
            // ...falls das nicht das direkt verschobene Modul ist, denn der append-Befehl kommt
            // ja erst sp�ter (OS)
            if ($(this).find("span.inAuswahl").text() == "nein") {
                // inAuswahl-Tag setzen und Modul verstecken (OS):
                $(this).find("span.inAuswahl").text("ja");
                $(this).find(".pool_modul,.search_modul").css("display", "none");
                // hier ein parent() weniger als oben, weil wir ja schon surch die parent-Divs laufen (OS)
                var this_category = $(this).parent();
                if ($(this).is(".search_modul")) {
                    // alert("drop_in_auswahl(): Eine weitere Kopie muss raus...");
                    rekursiv_pool_by_out(this_category, 0);
                }
                else {
                    if (number_of_visible_items_in_category(this_category) == 1) {
                        flip_arrow_of_category("leer", this_category);
                    }
                }
            }
        });
    } else {
        ajax_serverupdate_remove(modul_id);
    }
	
    // append hier
    var this_subsemester = $(this_semester).find("div.subsemester");
    $(this_subsemester).append(ui_draggable);
	
    // DATEN mit modul_id und semester zum Server(action add_module_to_selection) schicken
    ajax_serverupdate_add(modul_id, semester, cat_id);
	
    if (kopf_modul_in_pool == "nein") {
        ueberblick();
    }
    else {
        $(ui_draggable).find(".head_modul_in_pool").text("nein");
        ajax_request_grade();
    }
    // check error-Regel
    if (check_error(modul_id)) {
				flip_module_infoicon_on_event("error",ui_draggable);
    }

    var additional_info = $(ui_draggable).find(".additional_info").text();
    if (additional_info == "true") {
        ajax_request_combobox(modul_id);
        $(ui_draggable).find(".additional_info").text("drop_down_schon_in_auswahl");
    }


}//ende drop in auswahl

//implement :   custom_modul_drop_in_auswahl---------------------------------------------

var custom_modul_drop_in_auswahl = function(modul_id,modul_class,semester,ui_draggable,this_semester,ui_helper){
	
    var check_open=false;
    var cat_id = $(ui_draggable).find(".cat_id").text();
    $("#custom_semester").attr("value",semester);
    $("#custom_id").attr("value",modul_id);
    $("#custom_cat_id").attr("value",cat_id);
	
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
        ajax_serverupdate_add(this_id,semester);
		
    });
    ueberblick();
	
}


//----Poolrekursive implementieren-------------------------------------------------------

// den Pool (d.h. das XML-Resultat der Pool-Anfrage) rekursiv durchgehen und Module und Kategorien
// in zugeklappter Form in den Pool einf�gen.
// Ob ein Modul in der Auswahl ist oder nicht spielt hier noch keine Rolle, das passiert erst sp�ter
// mit Hilfe der Funktion session_auswahl.
var poolrekursiv = function(XMLhandle){
    var appendString = '';
    $(XMLhandle).children().each(function(){
        //        var knoten_name=this.nodeName;
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
                parent_name = $(parent).attr("name");
                var parent_id   = $(parent).attr("category_id");
                //                var parent_a    = $("#pool #"+parent_id).find("a");
                //var parent_a_class = $(parent_a).attr("class");
                //                var parent_a_id= $(parent_a).attr("id");
                //alert(parent_a_class);

                var modul_name = $(this).find("name").text();
                var modul_mode = $(this).find("mode").text();
                var credits = $(this).find("credits").text();
                //                var modul_short = $(this).find("short").text();
                var modul_parts = $(this).find("parts").text();
				
				
				 
                var modul_id = $(this).attr("id");
                var modul_class=$(this).attr("class");
                //                var check_modul_partial=$(this).attr("partial");
                var additional_info = $(this).attr("additional_server_info");
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

                // hiet ist span.inAuswahl f�r die Besetzung eines Modul in Auswahl gedacht.
                //span.custom sagt, dass ein modul normal oder ein dummy-modul ist
                //span.custom_exist sagt, dass das dummy-modul bereits im pool ist
                var this_sel_name=$(this).find("add_sel_name").text();
                var pool_modul_class="pool_modul";
                var modul_parent_attr="nein";
                var partial_mod_name="";
                var kopf_modul_in_pool="nein";
                //
                if(modul_parts!="0"){
                    kopf_modul_in_pool="ja";
                }
				
                // Teil_modul_ name wird angeh�ngt
                if($(this).attr("parent") != ""){
                    pool_modul_class="partial_modul";
                    modul_parent_attr=$(this).attr("parent");
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
                    this_total_credits=total_credits;// f�r das KopfmodulModul, das wieder zur�ck in Pool ist
                    credits=total_credits;
                }
				
                appendString += "<div class='" + modul_id + "_parent ' rel='mod_parent'><div class='nichtleer'></div><div class='"+
                pool_modul_class+"' id='" + modul_id + "' >" +
                "<div class='icon_loeschen' style='display:none; cursor:pointer; float:right; width:12px;height:0px;overflow:visible;' onclick='modul_loeschen(" +
                modul_id +","+modul_id+")'>" +loeschenbild +"</div>" +
                "<span class='inAuswahl' style='display:none'>nein</span>" +
                "<span class='cat_id' style='display:none'>"+parent_id+"</span>"+
                "<span class='custom' style='display:none'>"+modul_class+"</span>"+
                "<span class='modul_id' style='display:none'>"+modul_id+"</span>"+
                "<span class='custom_exist' style='display:none'>nein</span>"+
                "<span class='custom_category' style='display:none'>"+custom_category+"</span>"+
                "<span class='additional_info' style='display:none'>"+additional_info+"</span>"+
                "<span class='head_modul_in_pool' style='display:none'>"+kopf_modul_in_pool+"</span>"+
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
                "<td class='modul_name' >"+modul_name+partial_mod_name+"</td>"+
					
                "<td style=' width:22px;display:table-cell' class='fragebild_td'>" +
                "<a style='cursor:pointer' onclick='javascript:info_box("+modul_id+");'>"+
                "<span class='fragebild' style='display:block;margin:0px 0px 0px 0px;' >"+fragebild+"</span>"+
                "</a>"+
                "</td>" +

                "<td style='width:25px;display:none;margin-right:0px;' class='noten_input_td' >" +
                "<span class='noten'>" +
                "<span class='modul_has_grade' style='display:none;'>"+has_grade+"</span>"+
                "<input class='noten_input' type='text' size='5' style='margin-right:5px;' rel='"+modul_id+"' value='Note' />"+
                "<span class='is_error' style='display:none'>nein</span>"+
                "</span>" +
                "</td>" +

                "<td style=' width:22px;display:none' class='ipunkt_td'>" +
                "<a style='cursor:pointer' onclick='javascript:info_box_selection("+modul_id+");'>"+
                "<span class='ipunkt' style='padding:1px 2px 0px 0px;'>"+gelber_ipunkt+"</span>"+
                "</a>"+
                "</td>" +

                "<td class='modul_credit' style='width:32px;text-align:right;font-weight:bold'>" +
                credits +" C" +
                "</td>" +
                "</tr>" + "</tbody>" + "</table>" +
                "<p class='drop_down_menu' style='display:none'></p>"+
                "<p class='credit-option' style='display:none'></p>"+
                "<p class='warnung-option' style='display:none'></p>"+
                "<p class='note-option' style='display:none'></p>"+
                "</div></div>";

                //kopieren das Modul in search_table  f�r die Suche
                $("#suche tbody").append("<tr class='"+modul_id+"'   rel='"+pool_modul_class+"' >"+"<td class='cat_check' rel='noCheck' >"+custom_category+"</td>"+"<td>"+modul_id+"</td>"+"<td class='td_custom_name'>"+modul_name+"</td>"+"</tr>");
				
            default:
                break;
        }
    });
    return appendString;
}//ende poolrekursiv


//POOL-Funktion gibt immer ganzen Module im POOL zur�ck, 
//und ruft AJAX auf  ------------------------------
var pool = function(){

    var XML = $.ajax({

        type: 'GET',
        url: 'abfragen/pool',
        async: false,
        contentType: 'application/x-www-form-urlencoded',
        error : function(a,b,c){
            alert("AJAX-Fehler: pool");
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
    custom_modul_in_the_search_table_rekursiv();
    custom_modul_rekursiv(this_pool);
    ueberblick();
	
	
}//ende pool

var search_is_active = function(){
    // Nicht besonders sch�n, funktioniert zum Beispiel nicht mehr, wenn man einen Start-
    // String im Such-Feld vorgibt. Reicht aber momentan. (OS)
    return ($("#qs").val() != "" );
}

var change_module_style_to_pool = function(handle){
    // style fuer Ausnahme-optionen
    $(handle).find("> p.credit-option").css("display","none").empty();
    $(handle).find("> p.warnung-option").css("display","none").empty();
    $(handle).find("> p.note-option").css("display","none").empty();
    $(handle).find("> div.icon_loeschen").css("display","none");
    
    //auf originale Credits setzen im Fall Credits-Veraenderung
    var original_credits = $(handle).find("> span.credits_in_selection").text();
    //    var hi =$(handle).find("> table tbody tr td.modul_credit").text();
    $(handle).find("> table tbody tr td.modul_credit").text(original_credits+" C");
   
    $(handle).find("> p.drop_down_menu").css("display","none").empty();
    if($(handle).find("> span.additional_info").text()=="drop_down_schon_in_auswahl"){
        $(handle).find("> span.additional_info").text("true");
    }
    
    // checke nach Dummy-Modul. Wenn ja dann den Name wieder auf den Standardname (hier: (sonstiges Modul)) setzen
    // und span.custom_exist=nein setzen und class=custom_modul, 
    // damit dieses Dummy nicht im Pool angezeigt wird(sonst mehr als 2 Dummies im pool vorkommen
    var dummy_name = $(handle).find("span.custom").text();
    if(dummy_name == "custom"){
        var dummy_standard_name=$(handle).find("span.modul_name_in_pool").text();
        $(handle).find("> table tbody tr td.modul_name").text(dummy_standard_name);
        $(handle).find("span.custom_exsit").text("nein");
        $(handle).attr("class","custom_modul");
        $(handle).hide();
    }
    // is_error auf "ja" setzen
    $(handle).find(".is_error").text("nein");
   	
    jQuery.each(jQuery.browser, function(i) {
        if($.browser.msie){
            $(handle).find(".fragebild_td").css("display","inline");
        }
        else{
            $(handle).find(".fragebild_td").css("display","table-cell");
        }
		
    });
    //$(handle).find(".ipunkt_td").html(gelber_ipunkt).css("display","none");
    $(handle).find(".ipunkt_td").css("display","none");
    $(handle).find(".ipunkt").html(gelber_ipunkt);
    $(handle).find(".noten_input_td").css("display","none");
	
    return 0;
}


var change_module_style_to_auswahl = function(handle){
    // style f�r option
    $(handle).find("p.credit-option").css("display","block");
    $(handle).find("p.warnung-option").css("display","block");
    $(handle).find("p.note-option").css("display","block");
    $(handle).find("div.icon_loeschen").css("display","block");
    $(handle).find(".fragebild_td").css("display","none");
	
    // Hack, da IE die CSS display-Art "table-cell" nicht unterstützt
		// Könnte man evtl. mit jQuery show() und hide() umgehen... (OS)
		jQuery.each(jQuery.browser, function(i) {
        if ($.browser.msie) {
            $(handle).find(".ipunkt_td").css("display","inline");
            // check ob unbenoten ist
            if ($(handle).find("span.modul_has_grade").text() != "nein")
            	$(handle).find(".noten_input_td").css("display", "inline");
        }
        else {
            $(handle).find(".ipunkt_td").css("display","table-cell");
            if ($(handle).find("span.modul_has_grade").text() != "nein")
            	$(handle).find(".noten_input_td").css("display", "table-cell");
        }
				flip_module_infoicon_on_event("init",handle);
    });
    return 0;
}

var module_div_present_in_parent = function(parent_handle){
    // recht uebler Hack (OS)
    var result = ($(parent_handle).text() != "")
    return result;
}
