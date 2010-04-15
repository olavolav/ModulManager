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
//					modul_loeschen(),show_next_custom_modul_in_pool()
//
//--------------------------------------------------------------------------------------

// photo path
var wahlpflichtbild = "<img width='20' height='20' src='images/Wahlpflicht.png'>";
var pflichtbild = "<img width='20' height='20' src='images/Pflicht.png'>";
var wahlbild = "<img width='20' height='20' src='images/Wahl.png'>";
var unbekannter_modus_bild = "<img width='20' height='20' src='images/ModusUnbekannt.png'>";
	
var fragebild = "<img width='20' height='20' src='images/Fragezeichen.png'>";
var gruener_ipunkt = "<img width='20' height='20' src='images/iPunkt.png'>";
var gelber_ipunkt = "<img width='20' height='20' src='images/iPunktGelb.png'>";
var roter_ipunkt = "<img width='20' height='20' src='images/Ausrufezeichen.png'>";
	
var loeschenbild = "<img src='images/Loeschen.png' style='position:relative; top:-4px; left:8px;'>";
var formresetbild = "<img id='search_form_reset' alt='reset' src='images/Reset-Form.png'>";
var pfeil_rechts = "<img src='images/Pfeil-Rechts.png' style='padding-right:3px;'>";
var pfeil_unten = "<img src='images/Pfeil-Unten.png' style='padding-right:3px;'>";
var pfeil_leer = "<img src='images/Pfeil-Rechts-Leer.png' style='padding-right:3px;'>";
	
var warten_weiss = "<img width='16' height='16' src='images/Warten-HintergrundWeiss.gif' style='padding-right:3px;'>";
var warten_blau = "<img width='16' height='16' src='images/Warten-HintergrundGrau.gif' style='padding-right:3px;'>";
var warten_semester_animation = "<img width='16' height='16' src='images/Warten-HintergrundSemester.gif' style='padding-right:3px;'>";

// wenn der �berblick fertig geladen wurde, den Lade-Balken verschwinden lassen (OS)
$(document).ready(function(){
    // Klickbare Info-Buttons sollen beim dr�berfahren animiert werden (OS)
    // F�r das Analogon im �berblick siehe ueberblick.js
    $(".ipunkt_td, .fragebild").mouseenter(function(){
        $(this).animate({opacity: 0.4}, "fast");
        $(this).animate({opacity: 1.0}, "fast");
    });

		// Zur besseren Hervorhebung des Einführungs-Buttons für Neulinge (OS)
		$("#GetStartedImage").animate({opacity: 0.1}, "slow");
		$("#GetStartedImage").animate({opacity: 1.0}, "fast");
		$("#GetStartedImage").animate({opacity: 0.1}, "slow");
		$("#GetStartedImage").animate({opacity: 1.0}, "fast");
		$("#GetStartedImage").animate({opacity: 0.1}, "slow");
		$("#GetStartedImage").animate({opacity: 1.0}, "fast");
		$("#GetStartedImage").animate({opacity: 0.1}, "slow");
		$("#GetStartedImage").animate({opacity: 1.0}, "fast");
		$("#GetStartedImage").animate({opacity: 0.1}, "slow");
		$("#GetStartedImage").animate({opacity: 1.0}, "fast");
		
		/* Test-Code, falls man unwichtige Schaltflächen verschwinden lassen möchte (OS)
		$(".semester .icon_loeschen").hide();
		$(".auswahl_modul,.auswahl_modul_clone,.pool_modul,.custom_modul,.pool_modul_copy").mouseenter(function(){
			$(this).find(".icon_loeschen").show();
		});
		$(".auswahl_modul,.auswahl_modul_clone,.pool_modul,.custom_modul,.pool_modul_copy").mouseleave(function(){
			$(this).find(".icon_loeschen").hide();
		}); */
		
});

var change_fixation = function(type) {
	// alert("change_fixation: type="+type);
	
	switch(type) {
		case "ueberblick an":
	    $("#left").css("position","fixed");
			$("#ueberblick #ueberblick-pin-passiv").hide();
			$("#ueberblick #ueberblick-pin-aktiv").show();
			break;
			
		case "ueberblick aus":
	    $("#left").css("position","absolute");
			$("#ueberblick #ueberblick-pin-passiv").show();
			$("#ueberblick #ueberblick-pin-aktiv").hide();
			break;
			
		case "pool an":
	    $("#right").css("position","fixed");
			$("#right #pool-pin-passiv").hide();
			$("#right #pool-pin-aktiv").show();
			break;
			
		case "pool aus":
	    $("#right").css("position","absolute");
			$("#right #pool-pin-passiv").show();
			$("#right #pool-pin-aktiv").hide();
			break;
			
		default:
			alert("Fehler in change_fixation: Event-Typ '"+type+"' unbekannt!");
	}
};

var authenticityToken = function() {
    return $('#token').attr("content");
};
var authenticityTokenParameter = function(){
   return 'authenticity_token=' + encodeURIComponent(authenticityToken());
};

// Diese Funktion wird nur für Module aus Teilmodulen aufgerufen! (OS)
var change_TM_credit_and_add_name_in_selection = function(modul_id,handle){
    //credit �ndern
		var c_text = modProp(modul_id,"credits_in_selection");
    $(handle).find(".modul_credit").text(c_text+" C");
    //name hizuf�gen
		var n_text = modProp(modul_id,"add_sel_name_in_sel");
    $(handle).find(".modul_name").append(n_text);
	
    return 0;
};
var change_credit_and_remove_name_in_pool = function(modul_id,handle){
    //credit ï¿½ndern
    var c_text = modProp(modul_id,"credits");
    $(handle).find(".modul_credit").text(c_text+" C");
	
    //name remove
    // var n_text = $(handle).find(".modul_name_in_pool").text();
    var n_text = modProp(modul_id,"modul_name_in_pool");
    $(handle).find(".modul_name").text(n_text);
	
    return 0;	
};


// Diese Funktion ändert entgegen dem Namen nicht nur die Farbe des Info-Icons, sondern setzt auch
// den ".is_error"-Text des Moduls (OS)
// Fehlt möglicherweise noch: Ausnahme-Optionen-Verhalten
var flip_module_infoicon_on_event = function(type,modul_id,handle){
    // gefragt is handle zur Kategorie
    var this_class = $(handle).attr("class");
    if(!($(handle).hasClass("auswahl_modul_clone")||$(handle).hasClass("auswahl_modul")||$(handle).hasClass("custom_modul")||$(handle).hasClass("pool_modul"))) {
        alert("Fehler: Handle in flip_module_infoicon_on_event("+type+") ist kein Modul (class="+this_class+")!");
    }
	
    switch(type){
        // Die ersten beiden Events sollten optimiert sein, da die Fehler-Überprüfung bei jeder
        // Änderung aufgerufen wird. Bei den Noten-Events unten ist das nicht so wichtig.
				// Was hier noch fehlt ist die Auswirkung der "Warnung deaktivieren"-AO (OS)
        case "error":
						// alert("flip_module_infoicon_on_event: error event triggered.");
            // In dem Fall ist klar, was passieren muss, unabhängig von der Note wird das Icon auf
            // rot gesetzt, falls das nicht ohnehin schon der Fall ist:
	          if (modProp(modul_id,"error") != "true") {
								if(modProp(modul_id,"AO_disable_warning") != "true") {
									var icon = $(handle).find(".ipunkt");
	                $(icon).html(roter_ipunkt);

									if (modProp(modul_id,"error") != "unknown") {
										$(icon).animate({opacity: 0.1}, "fast");
										$(icon).animate({opacity: 1.0}, "fast");
										$(icon).animate({opacity: 0.1}, "fast");
										$(icon).animate({opacity: 1.0}, "fast");
										$(icon).animate({opacity: 0.1}, "fast");
										$(icon).animate({opacity: 1.0}, "fast");
									}
								}
								modPropChange(modul_id,"error","true");
            }
            break;
				
        case "no_error":
            if (modProp(modul_id,"error") != "false") {
                // Abhängig davon, ob das Modul benotet ist, wird das Icon auf gelb oder grün gesetzt
								var icon = $(handle).find(".ipunkt");
                if ((modProp(modul_id,"modul_has_grade")=="true")&&($(handle).find(".noten_input").val()=="Note"))
                    icon.html(gelber_ipunkt);
                else icon.html(gruener_ipunkt);

								if (modProp(modul_id,"error") != "unknown") {
									$(icon).animate({opacity: 0.1}, "fast");
									$(icon).animate({opacity: 1.0}, "fast");
									$(icon).animate({opacity: 0.1}, "fast");
									$(icon).animate({opacity: 1.0}, "fast");
									$(icon).animate({opacity: 0.1}, "fast");
									$(icon).animate({opacity: 1.0}, "fast");
								}
								modPropChange(modul_id,"error","false");
            }
            break;
				
        case "entered_grade":
            // Falls kein Fehler vorliegt, wird das Icon auf grün gesetzt
            if (modProp(modul_id,"error") == "false")
                $(handle).find(".ipunkt").html(gruener_ipunkt);
            break;
				
        case "invalid_grade":
            // Falls kein Fehler vorliegt, wird das Icon auf gelb gesetzt
            if (modProp(modul_id,"error") == "false")
                $(handle).find(".ipunkt").html(gelber_ipunkt);
            break;
			
        case "init":
            // Das ist für den Fall gedacht, wenn man ein Modul in die Auswahl zieht (oder beim Session
						// laden), und also alle anderen Event-Arten möglich sind
            // if ((modProp(modul_id,"error")=="false")||(modProp(modul_id,"AO_disable_warning") != "true")) {
                // Abhängig davon, ob das Modul benotet ist, wird das Icon auf gelb oder grün gesetzt
                if ((modProp(modul_id,"modul_has_grade")=="true") && (($(handle).find(".noten_input").val()!="Note")||($(handle).find(".noten_input").val()!="")))
                    $(handle).find(".ipunkt").html(gelber_ipunkt);
                else $(handle).find(".ipunkt").html(gruener_ipunkt);
            // }
            // else $(handle).find(".ipunkt").html(roter_ipunkt);
				
            break;
				
        default:
            alert("Fehler in flip_module_infoicon_on_event: Event-Typ "+type+" unbekannt!");
    }
};

var grade_input_check = function(input_noten){
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
	
    if((this_grade=="") || isNaN(this_float)){
        alert("Bitte geben Sie eine Zahl zwischen 1,0 und 4,0 ein.");
        $(input_noten).attr("value","Note");
        ajax_serverupdate_grade_reset(modul_id);
        flip_module_infoicon_on_event("invalid_grade",modul_id,module_handle);
        $("#note_berechnen").text("");
    } else {
        //suche nach ',' in String trim_grade dann verwandel es zum '.'
        var new_trim_grade  = trim_grade.replace(/,/,".");   //1,2-->1.2
        var new_float       = parseFloat(new_trim_grade);

        if(new_float == 0) {
            ajax_serverupdate_grade_reset(modul_id);
            $(input_noten).attr("value", "Note");
            flip_module_infoicon_on_event("invalid_grade",modul_id,module_handle);
            ajax_request_grade();
        }
        else if(new_float < 1 || new_float > 4 ){
            alert("Bitte geben Sie eine Zahl zwischen 1,0 und 4,0 ein.");
            flip_module_infoicon_on_event("invalid_grade",modul_id,module_handle);
            $(input_noten).attr("value","Note");
            ajax_serverupdate_grade_reset(modul_id);
            $("#note_berechnen").text("");
        } else {
            $(input_noten).attr("value",this_original);
            flip_module_infoicon_on_event("entered_grade",modul_id,module_handle);

            ajax_serverupdate_grade(modul_id,new_float);
            // hier kann man Note klicken
        }
        $("#note_berechnen").text("");
    }
		// Das Folgende wird jetzt direkt nach dem erfolgreichen Noten-Übermitteln aufgerufen (OS)
    // ajax_request_grade();
};

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
};

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
};

// Aendern der Schriftgrösse
function font_size(points){
    $("body,table").css("font-size",points+"px");
};


// Anzeigen bzw. verstecken der anfaenglichen Hilfe und der Navigations-Knoepfe
var show_navi = function(){
    $("#navi_optional").slideDown();
    $("#navimovedown").toggle();
    $("#navimoveup").show();
};
var hide_navi = function(){
    $("#navi_optional").slideUp();
    $("#navimovedown").show();
    $("#navimoveup").hide();
    $("#help_optional").hide();
    $("#helpmovedown").show();
};
var show_minihelp = function(){
    $("#help_optional").slideDown();
    $("#helpmovedown").hide();
};


// Fixieren bzw. 

var hide_partial_modul = function(){
    $("#pool .partial_modul").hide();
};

//--------CUSTOM-MODUL--------------------------------------------------------------------

var display_only_first_custom_module_on_init = function (handle){
    //    var handle_id = $(handle).attr("id");
    $(handle).children().not("a,.nichtleer").each(function(){
        
        var this_class  = $(this).attr("class");
        var this_rel    = $(this).attr("rel");
			
        if (this_class == "pool_category") {
            display_only_first_custom_module_on_init(this);
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
};

// Funktion umbenannt, war früher get_custom (OS)
var show_next_custom_modul_in_pool = function(category_id){
    // alert("hallo show_next_custom_modul_in_pool mit "+category_id);
    // die Funktion zeigt nur ein display_none Custom_modul in einem Category im  Pool an
	
    var this_cat = $("#pool").find("#"+category_id);
    var the_first = $(this_cat).find(".custom_modul").filter(function(index){
        return index==0;
    });
	
    // class ver�ndern. custom-->pool_modul. Damit wird nur ein custom_modul im Pool ist
    if(search_is_active()){
        var father = $(the_first).parent().get(0);
        $(father).addClass("search_modul");
    }
    $(the_first).removeClass("custom_modul").addClass("pool_modul ui-draggable");
    $(the_first).show();
	
};//ende show_next_custom_modul_in_pool

var update_search_table_on_adding_custom_module_into_selection = function(modul_id,new_name,cat_id){
	
    var this_tr = $("#suche").find("."+modul_id);
		$(this_tr).attr("rel","custom_modul");
    // $(this_tr).find(">.td_custom_name").text(new_name); macht keinen Sinn (OS)
    //get the first custom modul
    var the_first = $("#suche").find("tr[rel='custom_modul']").filter(function(index){
        var this_text = $(this).find(">.cat_check").text();
        if(this_text==cat_id){
            return this;
        }
    }).eq(0);
    $(the_first).attr("rel","pool_modul").show();
};


var enter_only_first_custom_module_into_search_table_on_init = function(){
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
};

///////////////////MODULLOESCHEN loeschen////////////////////////
/// bei Click auf <div class="modul_loeschen">
/// neuerdings auch beim Ziehen zum Pool (OS)
var partial_modul_loeschen = function (modul_id,all_sem_destroy){
    // alert("partial_modul_loeschen");
    //alert("hallo sub "+all_sem_destroy);
    //suche teil-Module
    $("#middle div.subsemester").find("div").each(function(){
				var this_id = $(this).attr("id");
        if ((this_id != "") && (modProp(this_id,"id_of_parent_modul") == modul_id)) {            
						// alert ("partial_modul_loeschen: jetzt Aufruf von sub_modul_loeschen mit modul_id="+this_id);
            sub_modul_loeschen(this,this_id,all_sem_destroy);
        }
    });
    ueberblick();
};

var modul_loeschen = function (modul_id,all_sem_destroy){
    // Die Schleife hier sollte eigentlich unnoetig sein, wenn jedes Modul nur 1x in der
    // Auswahl sein kann, ausser bei Drop in den Pool, dann 2x: (OS)
    // Letzteres sollte man vielleicht nochmal anschauen irgendwann. (OS)
    // if ($("#semester-content div.semester").find("div#"+modul_id).length > 1)
    //alert("Warnung: Dieses Modul (ID "+modul_id+") ist in der Auswahl: "+$("#semester-content div.semester").find("div#"+modul_id).length+"-mal enthalten!");
	
    //alert("sem_detroy="+all_sem_destroy);
    //$("#semester-content div.semester").find("div#"+modul_id).each(function(){
    $("#middle div.semester").find("div#"+modul_id).each(function(){
		
        var this_mod_parts = modProp(modul_id,"modul_parts");
        var this_mod_parent_id = modProp(modul_id,"id_of_parent_modul");
        //check nach Teil-Modul
        if((this_mod_parts != "0") || (this_mod_parent_id !="false")){
            var check = confirm("Dieses Modul besteht aus mehreren Teilmodulen - wenn Sie es entfernen, werden alle weiteren Teile ebenfalls entfernt.");
            if(check == true){
				
                if(this_mod_parent_id != "false"){
										// alert ("modul_loeschen: Modul mit mehreren Teilmodulen - dies ist einer der untergeordneten Teile.");
                    //hier ist Teil-modul
                    //such nach head-modul-->l�schen
                    var head_modul = $("#middle div.semester").find("div#"+this_mod_parent_id);
                    change_credit_and_remove_name_in_pool(this_mod_parent_id,head_modul);
										
                    sub_modul_loeschen(head_modul,this_mod_parent_id,all_sem_destroy);
                    partial_modul_loeschen(this_mod_parent_id,all_sem_destroy);
										modPropChange(this_mod_parent_id,"head_modul_in_pool","true");
                }
                else{
										// alert ("modul_loeschen: Modul mit mehreren Teilmodulen - dies ist der Kopf.");
                    //hier ist head-Modul
                    // setzen "true" beim span.head_modul_in_pool (wegen AJAX)
										modPropChange(modul_id,"head_modul_in_pool","true");
                    change_credit_and_remove_name_in_pool(modul_id,this);
                    sub_modul_loeschen(this,modul_id,all_sem_destroy);
                    partial_modul_loeschen(modul_id,all_sem_destroy);
                }
            }
        }
        else{
            sub_modul_loeschen(this,modul_id,all_sem_destroy);
        }
    });

    

};//ende modul_loeschen


var sub_modul_loeschen = function (this_mod,modul_id,all_sem_destroy){

    // alert("sub_modul_loeschen: id="+modul_id+", class="+$(this_mod).attr("class"));
    // aendere CSS style
    change_module_style_to_pool(modul_id,this_mod);
    var kopf_modul_check = modProp(modul_id,"modul_parts");
    var parent_attr_check = modProp(modul_id,"id_of_parent_modul");

    // Modul-Class wieder für den Pool richtig setzen (OS)
		var pool_modul = "pool_modul";
    if ($(this_mod).attr("class")=="auswahl_modul partial_modul") pool_modul = "partial_modul";
		if (modProp(modul_id,"custom")=="custom") pool_modul = "custom_modul";
    $(this_mod).attr("class",pool_modul);

    if (modProp(modul_id,"modul_parts_exist")=="true") modPropChange(modul_id,"modul_parts_exist","false");

    var this_id = $(this_mod).attr("id");
    var this_modul = $(this_mod);
    var modul_itself_has_not_been_moved = true;
    // ersmal hide
    $(this_modul).hide();
		modPropChange(modul_id,"error","unknown");

    // suche nach modul_id_parent im Pool		
    // alert("Dieses Modul (bzw. dessen Parent) kommt im Pool "+($("#pool ."+this_id+"_parent").length)+" mal vor.");					
    $("#pool ."+this_id+"_parent").each(function(){

        var arrow_type = which_arrow_is_visible($(this).parent());
        // alert("arrow_type: "+arrow_type);
			
        var the_father = $(this).parent();
        // alert("the_father class: "+the_father.attr("class"));
        if(!module_div_present_in_parent($(this))){
          	alert("Modul ist nicht im Pool");
			
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
                        if (modProp(modul_id,"custom") != "custom")
                            $(this).find("#"+modul_id).show();
                    }
                }
            		// else $(this).find("#"+modul_id).css("display","none");

	              /* //if ((!(search_is_active())) || $(this).is(".search_modul")) {
								$(this).find("#"+modul_id).hide();
                if (pool_modul != "partial_modul") {
	            		if (!(search_is_active())) {
	                  //alert("pool_modul = "+pool_modul);
	                  //check nach dummy.
	                  if (modProp(modul_id,"custom") != "custom")
	                    $(this).find("#"+modul_id).show();
	                }
									else if($(this).is(".search_modul"))
										$(this).find("#"+modul_id).show();
	              }
            		// else $(this).find("#"+modul_id).css("display","none");
								else if(modProp(modul_id,"custom") == "custom")
									$(this).find("#"+modul_id).removeClass("auswahl_modul").addClass("custom_modul"); */
            }
				
        }// ende if leer
			
        else { // Modul ist schon im Pool, nur versteckt
            alert("Modul ist schon im Pool, nur versteckt");
            // check den Vater-Kategory, ob der gerade offen ist (neu, OS)
            if (arrow_type == "leer")
                flip_arrow_of_category("rechts",$(this).parent());
            else if (arrow_type == "unten") {
                if ((!search_is_active()) || $(this).is(".search_modul")) {
                	
                    if (modProp(modul_id,"custom") != "custom")
                        $(this).find("#"+modul_id).css("display","block");
                //else alert("na, hier bist du wieder ein dummy");
                // alert("test: 1");
                }
            }
        }

        // inAuswahl-Tag setzen (OS)
        modPropChange(modul_id,"inAuswahl","false");
        // alert("inAuswahl gesetzt auf (OS): "+$(this).find("#"+modul_id+" span.inAuswahl").text());
			
        if (search_is_active() && $(this).is(".search_modul") &&
            ((which_arrow_is_visible($(this).parent())!="rechts")||($(the_father).is(".pool_category")))) {
            var this_mod = $(this).find("#"+modul_id).eq(0);
            if(($(this_mod).attr("class")!="partial_modul")||($(this_mod).attr("class")!="partial_modul ui-draggable")){
                if (modProp(modul_id,"custom") != "custom") $(this_mod).show();
                // else alert("ich bin da das Dummy in search-active");
            }
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
		// alert("sub_modul_loeschen: ajax_serverupdate_remove("+modul_id+")");
    ajax_serverupdate_remove(modul_id);
    if((kopf_modul_check == "0")&&(parent_attr_check=="false")&&(all_sem_destroy!="10000")){
        ueberblick();
    }
};//ende sub_modul_loeschen

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
		
};

var info_box = function(modul_id){
    $("#box_info").empty();
    $("#box_info_exception").hide();
    $("#box_info_combobox").hide();
    $("#box_info_overview").hide();
    $("#box_info_pool").show();
        
    ajax_request_pool_module_info(modul_id);
    $("#info_box").dialog('open');
};

// Diese Funktion wird nach der Auswahl-Info-Box aufgerufen und enthält die entspr. Auswirkungen (OS)
var update_modul_in_selection = function (){
    //checken ob das Modul in Vorratbox
    var modul_in_vorratbox = false;
    //check, ob man etwas in Ausnahme veraendert hat
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
	
    var any_AO_changed = false;
    var warn_checked = ($("#exception_warn:checked").val()=="checkbox");
    var note_checked = ($("#exception_note:checked").val()=="checkbox");
    // var this_credit =$(this_modul).find("p.credit-option");
		
		// Ausnahme-Optionen im Cache aktualisieren: Note steichen
		if ((modProp(modul_id,"AO_ignore_grade")=="true") != note_checked) {
			any_AO_changed = true;
			if (note_checked) {
				modPropChange(modul_id,"AO_ignore_grade","true");
				$(this_modul).find("p.note-option").show();
				ajax_serverupdate_remove_grade(modul_id);
			}
			else {
				modPropChange(modul_id,"AO_ignore_grade","false");
				$(this_modul).find("p.note-option").hide();
				ajax_serverupdate_add_grade(modul_id);
			}
		}

		// Ausnahme-Optionen im Cache aktualisieren: Warnung deaktivieren
		if ((modProp(modul_id,"AO_disable_warning")=="true") != warn_checked) {
			any_AO_changed = true;
			if (warn_checked) {
				modPropChange(modul_id,"AO_disable_warning","true");
				$(this_modul).find("p.warnung-option").show();
				ajax_serverupdate_remove_warning(modul_id);
			}
			else {
				modPropChange(modul_id,"AO_disable_warning","false");
				$(this_modul).find("p.warnung-option").hide();
				ajax_serverupdate_add_warning(modul_id);
			}
		}

		var v=$("#exception_credit").val();
		// alert("update_modul_in_selection: Inhalt von #exception_credit: "+v);
		var entered_a_number = isUnsignedInteger(v); // (v!="")&&(!isNaN(v))&&(parseInt(v)>=0);
		var credits_input_is_valid = (v=="Credits")||(v=="")||entered_a_number;
		// alert("update_modul_in_selection: credits_input_is_valid="+credits_input_is_valid+", entered_a_number="+entered_a_number+", parseInt(v)="+parseInt(v));
		
		if ((modProp(modul_id,"custom")=="non-custom") && credits_input_is_valid) {
			if (
				// Abfrage, ob überhaupt AO-Credits eingegeben sind oder waren
				((modProp(modul_id,"AO_custom_credits")!="false") != entered_a_number)
				// Falls Credits eingegeben sind, sind sie gleich dem gespeicherten Wert?
				|| ((modProp(modul_id,"AO_custom_credits")!="false")&&(modProp(modul_id,"AO_custom_credits")!=v))
				)	
			{
			
				any_AO_changed = true;
				if (entered_a_number) {
					modPropChange(modul_id,"AO_custom_credits",v);
	        $(this_modul).find(".modul_credit").text(v+" C");
					$(this_modul).find("p.credit-option").show();
		      ajax_serverupdate_change_credits(modul_id,v);
				}
				else {
					modPropChange(modul_id,"AO_custom_credits","false");
	        $(this_modul).find(".modul_credit").text(modProp(modul_id,"credits")+" C");
					$(this_modul).find("p.credit-option").hide();
		      ajax_serverupdate_credits_reset(modul_id);
				}
			}
		}
		
		if (any_AO_changed) ueberblick();
};

var change_custom_in_selection_by_session_load = function(auswahl_modul_clone,custom_name,custom_credit){
	
    //alert("hi change custom");
    // alert("change_custom_in_selection_by_session_load: custom_name="+custom_name);
    $(auswahl_modul_clone).find(".modul_name").text(custom_name);
    $(auswahl_modul_clone).find(".modul_credit").text(custom_credit+" C");
    $(auswahl_modul_clone).attr("class","pool_modul ui-draggable");
		modPropChange($(auswahl_modul_clone).attr("id"),"custom_exist","true");

    return 0;
};

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
            var modul_id = $(this).attr("id");
            var mod_grade = $(this).attr("grade");
            //has_general_grade:Das zeit an, ob dieses Modul normalerweise benotet ist.
            //momentan has_general_grade noch nicht benutzt. Es soll set_mod_has_grade_to_no(auswahl_modul_clone) benuztz werden, 
            //damit Noten_feld weg ist.
            //Has_grade zeigt an, ob das Modul derzeit benotet ist, d.h. die Note gestrichen wurde.
            var mod_has_grade=$(this).attr("has_grade");
            // var mod_credit=$(this).attr("credits");
						// var mod_credit = modProp(modul_id,"credits");
						var mod_custom_credit = $(this).attr("custom_credits");
            var mod_has_warning=$(this).attr("has_warning");
            var modul_im_pool = $("#pool").find("div#"+modul_id);
            var das_erste = $(modul_im_pool).eq(0);

            // var modul_has_additional_info = $("#pool").find("div#"+modul_id).find(".additional_info").eq(0).text();
            var modul_has_additional_info = modProp(modul_id,"additional_info");
            // alert("ModID="+modul_id+", AddInfo="+modul_has_additional_info);
			
            // die originalen Module verstecken
            //und den span.inAuswahl auf "true" setzen
            //und alle vor dem Clone
            var auswahl_modul_clone=$(das_erste).clone(true);
            $(modul_im_pool).each(function(){
                $(this).hide();
                modPropChange(modul_id,"inAuswahl","true");
            });
            //custom_modul laden: Name und credit ver�ndern
            // if ($(this).attr("class") == "custom") {
            if (modProp(modul_id,"custom") == "custom") {
                // alert("Inserting custom module into selection...");
                var custom_name = $(this).attr("name");
                var custom_credit    = $(this).attr("credits");
								modPropChange(modul_id,"modul_has_grade",$(this).attr("has_general_grade"));
                change_custom_in_selection_by_session_load(auswahl_modul_clone,custom_name,custom_credit);
            }
			
            // ver�ndern erstmal die interne im Modul bei dem Clone
            //besonders hat die Klone die class "auswahl_modul_clone"
            //zur Indentifizierung bei alle erster Ver�nderung im Auswahl
			
            // check ob die Note derzeit gestrichen wurde.
            if(mod_has_grade=="false"){
                $(auswahl_modul_clone).find("p.note-option").show();
								modPropChange(modul_id,"AO_ignore_grade","true");
            }

            $(auswahl_modul_clone).attr("class","auswahl_modul_clone");
            change_module_style_to_auswahl(modul_id,auswahl_modul_clone);
            //geaenderte Credits? und Warnung deaktivieren?
            //wenn ja dann die entsprechenen Meldungen anzeigen
            if(mod_custom_credit != "false") {
								// if ($(this).attr("class") != "custom") {
								if (modProp(modul_id,"custom") != "custom") {
                	$(auswahl_modul_clone).find("p.credit-option").show();
									modPropChange(modul_id,"AO_custom_credits",mod_custom_credit);
								}
                $(auswahl_modul_clone).find("td.modul_credit").text(mod_custom_credit+" C");
            }

            if(mod_has_warning=="false"){
                $(auswahl_modul_clone).find("p.warnung-option").show();
								modPropChange(modul_id,"AO_disable_warning","true");
            }
            // Noten setzen, Note von 0 wird nicht gewertet (OS)
            if((mod_grade != "" )&&(parseFloat(mod_grade) > 0.5)){
                var this_noten=$(auswahl_modul_clone).find(".noten_input");
                var this_grade = mod_grade;
                //set comma
                var check_komma = mod_grade.search(/./);
                if(check_komma != -1){
                    this_grade = mod_grade.replace(/\./,",");
                }
                $(this_noten).val(this_grade);
                flip_module_infoicon_on_event("entered_grade",modul_id,auswahl_modul_clone);
            }

						modPropChange(modul_id,"inAuswahl","true");
            //check nach Kopfmodul. Wenn ja dann credit name und head_modul_in_pool ver�ndern
            if(modProp(modul_id,"modul_parts") != "0"){
                modPropChange(modul_id,"head_modul_in_pool","false");
                change_TM_credit_and_add_name_in_selection(modul_id,auswahl_modul_clone);
                modPropChange(modul_id,"modul_parts_exist","true");
            }

            //check nach Teil-Modul
            if(modProp(modul_id,"id_of_parent_modul") != "false") $(auswahl_modul_clone).show();

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
                ajax_request_combobox(modul_id);
                modPropChange(modul_id,"additional_info","drop_down_schon_in_auswahl");
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
                    "</div>" +
                    "<a style='display:none;' class='semesterloeschen' onClick='sem_loeschen(" +
                    sem_id +
                    ");'>Semester entfernen</a>" +
                    "</div>");
            }
        }// ende else if
        session_auswahl_rekursiv(this);
    });//ende each
};//ende 

//session_auswahl-----------------------------------------------------------------------

var session_auswahl = function (){
    var XML = $.ajax({
        type : 'GET',
        url  : 'abfragen/auswahl',
				cache: false,
        async: false,
        contentType: 'application/x-www-form-urlencoded',
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					ajax_serverupdate_on_AJAX_warning("textStatus="+textStatus+",fn=session_auswahl");
				}
    }).responseXML;
    var root = XML.documentElement;
    // rekursiv aufrufen
    $("semester-content").empty();
    $("#middle").find("#semesterBOX .subsemester").empty(); // VoratBOX
    session_auswahl_rekursiv(root);
    // Loeschen anzeigen.Wir suchen das letzten Semester.
    var last_semester = $("#semester-content div.semester:last");
    $(last_semester).find("a.semesterloeschen").css("display","block");
};//ende 

//   AJAX zum Server---------------------------------------------------------------------	

var ajax_request_module_info = function (modul_id){
    $.ajax({
        type : 'POST',
        url  : '/abfragen/get_module_info',
        cache: false,
        async: false,
        dataType:'text',
        contentType: 'application/x-www-form-urlencoded',
        data :"module_id="+modul_id+"&"+authenticityTokenParameter(),
        success : function(html){
						// alert("ajax_request_module_info: html="+html);

            // alle Ausnahme-Option ersmal auf Null setzen
            // $("#exception_credit").attr("checked", "");
            $("#exception_credit").attr("value", "Credits");
            $("#exception_warn").attr("checked", "");
            $("#exception_note").attr("checked", "");
            $("#info_box #box_info").append(html);

						// alert("ajax_request_module_info: AO im Cache: AO_ignore_grade="+modProp(modul_id,"AO_disable_warning")+", AO_custom_credits="+modProp(modul_id,"AO_custom_credits")+", AO_ignore_grade="+modProp(modul_id,"AO_ignore_grade"));
            // Mein Versuch, die Checkboxen zu selektieren, wenn die entsprechenden Optionen gesetzt sind...
            // if(($("#has_grade").text() == '0')&&(modProp(modul_id,"modul_has_grade") == "true")) {
            if(modProp(modul_id,"AO_ignore_grade") == "true") {
	 							if (modProp(modul_id,"modul_has_grade") != "true")
									alert("ajax_request_module_info: Warnung: Unbenotetes Modul hat \"Note streichen\"-Option gesetzt");
                $("#exception_note").attr("checked", "checked");
            }
            // if($("#has_warning").text() == '0') {
            if(modProp(modul_id,"AO_disable_warning") == "true") {
                $("#exception_warn").attr("checked", "checked");
            }
            // if($("#custom_credits").text() != -1) {
            //     var this_credits =$("#custom_credits").text();
            //     $("#exception_credit").attr("value",this_credits);
            // }
            if(modProp(modul_id,"AO_custom_credits") != "false") {
                // var this_credits =$("#custom_credits").text();
                // $("#exception_credit").attr("value",this_credits);
                $("#exception_credit").attr("value",modProp(modul_id,"AO_custom_credits"));
            }
            // if($("#has_general_grade").text() == 0) {
						if(modProp(modul_id,"modul_has_grade") != "true") {
                $("#note_streichen_checkbox").hide();
            } else {
                $("#note_streichen_checkbox").show();
            }
						// Vorläufig kann man Dummy-Modul-Credits nur beim Erstellen ändern (OS)
            // if($("#semester-content").find("#"+modul_id+" span.custom").text() == "custom") {
						if (modProp(modul_id,"custom") == "custom") {
                $("#credits_aendern_checkbox").hide();
            } else {
                $("#credits_aendern_checkbox").show();
            }
        },
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					ajax_serverupdate_on_AJAX_warning("textStatus="+textStatus+",fn=ajax_request_module_info");
				}
    });
};

var ajax_request_pool_module_info = function (modul_id){
		// alert("ajax_request_pool_module_info: modul_id="+modul_id);
    $.ajax({
        type : 'POST',
        url  : '/abfragen/get_pool_module_info',
        cache: false,
        async: false,
        dataType:'text',
        contentType: 'application/x-www-form-urlencoded',
        data :"module_id="+modul_id+"&"+authenticityTokenParameter(),
        success : function(html){
	
						// alert("ajax_request_pool_module_info: html="+html);
            $("#info_box #box_info").append(html);
        },
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					ajax_serverupdate_on_AJAX_warning("textStatus="+textStatus+",fn=ajax_request_pool_module_info");
				}
    });
};

var ajax_serverupdate_add = function (modul_id,semester,cat_id){
		// alert("ajax_serverupdate_add: modul_id="+modul_id+", semester="+semester+", cat_id="+cat_id);
    $.ajax({
        type: 'POST',
        url  : 'abfragen/add_module_to_selection',
        cache:false,
        dataType:'text',
        async :false,
        data  : "mod_id="+modul_id+"&"+"sem_count="+semester+"&"+"cat_id="+cat_id+"&"+authenticityTokenParameter(),
        contentType:'application/x-www-form-urlencoded',
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					ajax_serverupdate_on_AJAX_warning("textStatus="+textStatus+",fn=ajax_serverupdate_add");
				}

    });//ende Ajax
};

var ajax_serverupdate_remove = function (modul_id){
    $.ajax({
        type: 'POST',
        url  : 'abfragen/remove_module_from_selection',
        cache:false,
        dataType:'text',
        async :false,
        data  : "mod_id="+modul_id+"&"+authenticityTokenParameter(),
        contentType:'application/x-www-form-urlencoded',
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					ajax_serverupdate_on_AJAX_warning("textStatus="+textStatus+",fn=ajax_serverupdate_remove");
				}
    });//ende Ajax
};// ende

var ajax_serverupdate_remove_semester = function (sem_count){
    //alert("sem_count="+sem_count);
    $.ajax({
			
        type: 'POST',
        url : 'abfragen/remove_semester_from_selection',
        dataType:'text',
        cache : false,
        async : false,
        data  : "sem_count="+sem_count+"&"+authenticityTokenParameter(),
        contentType:'application/x-www-form-urlencoded',
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					ajax_serverupdate_on_AJAX_warning("textStatus="+textStatus+",fn=ajax_serverupdate_remove_semester");
				}
		
    });
    ueberblick();
	
};

var ajax_serverupdate_add_grade = function(module_id) {
    $.ajax({
        type:"POST",
        url:"abfragen/add_grade",
        dataType:"text",
        cache: false,
        async: false,
        data:"mod_id="+module_id+"&"+authenticityTokenParameter(),
        contentType:"application/x-www-form-urlencoded",
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					ajax_serverupdate_on_AJAX_warning("textStatus="+textStatus+",fn=ajax_serverupdate_add_grade");
				}

    });
};

var ajax_serverupdate_remove_grade = function(module_id) {
    $.ajax({
        type: "POST",
        url: "abfragen/remove_grade",
        dataType: "text",
        cache: false,
        async: false,
        data: "mod_id="+module_id+"&"+authenticityTokenParameter(),
        contentType: "application/x-www-form-urlencoded",
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					ajax_serverupdate_on_AJAX_warning("textStatus="+textStatus+",fn=ajax_serverupdate_remove_grade");
				}

    });
};

var ajax_serverupdate_add_warning = function(module_id) {
    $.ajax({
        type: "POST",
        url: "abfragen/add_warning",
        dataType: "text",
        cache: false,
        async: false,
        data: "mod_id="+module_id+"&"+authenticityTokenParameter(),
        contentType: "application/x-www-form-urlencoded",
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					ajax_serverupdate_on_AJAX_warning("textStatus="+textStatus+",fn=ajax_serverupdate_add_warning");
				}

    });
};

var ajax_serverupdate_remove_warning = function(module_id) {
    $.ajax({
        type: "POST",
        url: "abfragen/remove_warning",
        dataType: "text",
        cache: false,
        async: false,
        data: "mod_id="+module_id+"&"+authenticityTokenParameter(),
        contentType: "application/x-www-form-urlencoded",
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					ajax_serverupdate_on_AJAX_warning("textStatus="+textStatus+",fn=ajax_serverupdate_remove_warning");
				}

    });
};

var ajax_serverupdate_set_category = function(module_id, category_id) {
    //		alert("POST main/set_category: modul_id="+module_id+"&cat_id="+category_id+"&"+authenticityTokenParameter());
    if(category_id != undefined) {
        $.ajax({
            type: "POST",
            url: "main/set_category",
            dataType: "text",
            cache: false,
            async: true,
            data: "mod_id="+module_id+"&cat_id="+category_id+"&"+authenticityTokenParameter(),
            contentType: "application/x-www-form-urlencoded",
						success: function() {
							ueberblick();
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) {
							ajax_serverupdate_on_AJAX_warning("textStatus="+textStatus+",fn=ajax_serverupdate_set_category");
						}
        });
    };
};

var ajax_serverupdate_on_AJAX_warning = function(text){
		// alert("ajax_serverupdate_on_AJAX_warning: start, text="+text);
    $.ajax({
        type: "POST",
        url : "abfragen/submit_AJAX_warning_to_log",
        dataType: "text",
        cache: false,
        async: true,
				timeout: 2500,
        data:"text="+text+"&"+authenticityTokenParameter(),
        contentType:'application/x-www-form-urlencoded',
				success: function() {
					alert("AJAX-Warnung: Die letzte Aktion konnte nicht gespeichert werden. "+
						"Das ModulManager-Team wurde unterrichtet, und wir werden uns so schnell "+
						"wie möglich um das Problem kümmern.");
					alert("debug="+text);
				},
        error: function(XMLHttpRequest, textStatus, errorThrown){
            alert ("AJAX-Fehler: Die Verbindung mit dem Server ist fehl geschlagen. "+
							"Bitte überprüfen Sie Ihre Netzwerk-Verbindung.");
						alert("debug="+text+", textStatus="+textStatus);	
        }
    });
};

var ajax_serverupdate_grade = function(modul_id,grade){
    $.ajax({
        type:"POST",
        url :"abfragen/save_module_grade",
        dataType:"text",
        cache:false,
        async:true,
        data:"mod_id="+modul_id+"&"+"grade="+grade+"&"+authenticityTokenParameter(),
        contentType:'application/x-www-form-urlencoded',
				success: function() {
					ajax_request_grade();
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					ajax_serverupdate_on_AJAX_warning("textStatus="+textStatus+",fn=ajax_serverupdate_grade");
				}
    });
};

var ajax_serverupdate_grade_reset = function(modul_id) {
    // Nicht schön, funktioniert aber. (OS)
    ajax_serverupdate_grade(modul_id, "");
};


function ajax_request_combobox(modul_id){
    $("#box_info_combobox").empty();

    $.ajax({
        type: "POST",
        url : "main/combo_category",
        dataType: "text",
        cache: false,
        async: false,
        data: "mod_id="+modul_id+"&"+authenticityTokenParameter(),
        contentType: 'application/x-www-form-urlencoded',
        success:function(html){
            $("#semester-content").find(".semester").each(function(){
                $(this).find(">.subsemester").children().not("h5").each(function(){
                    var this_modul_id = $(this).attr("id");
                    if(this_modul_id == modul_id){
                        var ourmenu = $(this).find("> p.drop_down_menu");
                        ourmenu.show().append(html);
                        ourmenu = ourmenu.find("select");
                        ourmenu.change(function() {
                            // alert("Dropdown-Menü verändert zu: "+ourmenu.find(":selected").text()+", value="+String(ourmenu.val()));
                            ajax_serverupdate_set_category(this_modul_id,ourmenu.val());
														// Im Zuge des Umbaus hin zu Asynchronen Transfers wird der Überblick jetzt direkt
														// in der Funktion ajax_serverupdate_set_category aktualisiert (OS)
                            // ueberblick();
                        });
                    }
                });
            });
        },
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					ajax_serverupdate_on_AJAX_warning("textStatus="+textStatus+",fn=ajax_request_combobox");
				}
    });
};



//----------------------------


var ajax_request_grade = function(){
    $.ajax({
        type : 'GET',
        url  : '/abfragen/note',
        async: true,
				cache: false,
        contentType: 'application/x-www-form-urlencoded',
        success : function(html){
            $("#die_note").empty();
            $("#die_note").append(html);
        },
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					ajax_serverupdate_on_AJAX_warning("textStatus="+textStatus+",fn=ajax_request_grade");
				}
    });
};

function ajax_serverupdate_add_custom(this_name,this_credit_point_float,cat_id_array,custom_semester,custom_id,has_grade){
		// Wie in custom_check angemerkt, müssen wir erst den ersten Array-Eintrag löschen (OS)
		cat_id_array.shift();
		// alert("ajax_serverupdate_custom_checkbox: cat_id_array="+(cat_id_array.join(","))+", has_grade="+has_grade);
    $.ajax({
        type:"POST",
        url :"abfragen/add_custom_module_to_selection",
        dataType:"text",
        cache:false,
        async:false,
        data:"name="+this_name+"&"+"credits="+this_credit_point_float+"&"+"sem_count="+custom_semester+"&"+"mod_id="+custom_id+"&"+"cat_id="+cat_id_array.join(",")+"&"+"has_grade="+has_grade+"&"+authenticityTokenParameter(),
        contentType:'application/x-www-form-urlencoded',
        success: function(data){
            ueberblick();
        },
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					ajax_serverupdate_on_AJAX_warning("textStatus="+textStatus+",fn=ajax_serverupdate_add_custom");
				}

    });
};

function ajax_serverupdate_move_module_within_selection(modul_id,sem_id) {
		// alert("ajax_serverupdate_move_module_within_selection: modul_id="+modul_id+", sem_id="+sem_id);
    $.ajax({
        type:"POST",
        url :"abfragen/change_semester_for_module",
        dataType:"text",
        cache:false,
        async:false,
        data:"mod_id="+modul_id+"&"+"sem_count="+sem_id+"&"+authenticityTokenParameter(),
        contentType:'application/x-www-form-urlencoded',
        success: function(data){
            ueberblick();
        },
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					ajax_serverupdate_on_AJAX_warning("textStatus="+textStatus+",fn=ajax_serverupdate_move_module_within_selection");
				}

    });
};

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
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					ajax_serverupdate_on_AJAX_warning("textStatus="+textStatus+",fn=ajax_request_custom_checkbox");
				}
    });
};

function ajax_serverupdate_change_credits(modul_id,credits){
    $.ajax({
        type:"POST",
        url :"abfragen/change_credits",
        dataType:"text",
        cache:false,
        async:false,
        data:"mod_id="+modul_id+"&"+"credits="+credits+"&"+authenticityTokenParameter(),
        contentType:'application/x-www-form-urlencoded',
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					ajax_serverupdate_on_AJAX_warning("textStatus="+textStatus+",fn=ajax_serverupdate_change_credits");
				}
    });
};
function ajax_serverupdate_credits_reset(modul_id){
	// Absprache mit CB steht noch aus (OS)
	ajax_serverupdate_change_credits(modul_id,"false");
};

function update_module_errors(){
	
    var XML =  $.ajax({
		
        type : 'GET',
        url  : '/abfragen/errors',
        async: true,
				cache: false,
        contentType: 'application/x-www-form-urlencoded',
        success : function(xml){

			    // error_table aufbauen, war früher die Funktion error_table_builder (OS)
			    $("#middle #error_table").empty();
			    var root = xml.documentElement;
					var HTMLstring = "";
			    $(root).children().each(function(){
			        var modul_id = $(this).attr("id");
			        //alert("error_id="+modul_id);
			        HTMLstring += "<div id='error_"+modul_id+"'>"+modul_id+"</div>";
			    });
					$("#middle #error_table").append(HTMLstring);

			    // Fehler-Einträge auswerten; war früher die Funktion check_error_all_modul_in_selection (OS)
					$("#semester-content").find(".semester").each(function(){
							// Das mit "h5" ist noch unschön (OS)
			        $(this).find(">.subsemester").children().not("h5").each(function(){
			            var modul_id = $(this).attr("id");
									// Wie dort beschrieben, setzt die Funktion flip_module_infoicon_on_event auch die
									// jCache-"error"-Werte - somit kann überprüft werden, ob sich der Fehler-Wert verändert
									// hat und ggf. eine Animation angezeigt werden (OS)
			            if (check_error_on_init("error_"+modul_id))
										flip_module_infoicon_on_event("error",modul_id,this);
			            else flip_module_infoicon_on_event("no_error",modul_id,this);
			        });
			    });		

        },
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					ajax_serverupdate_on_AJAX_warning("textStatus="+textStatus+",fn=update_module_errors");
				}
    }).responseXML;
	
};
var check_error_on_init = function(error_id){
		// alert ("check_error: error_id="+error_id);
    var check=false;
    $("#middle #error_table").children().each(function(){
        if($(this).attr("id")==error_id){
            check=true;
        }
    });
    return check;
};//ende


// DROP in Auswahl
var drop_in_auswahl = function(modul_id, modul_class, semester, ui_draggable, this_semester, ui_helper){
    $('<div class="quick-alert">' + warten_semester_animation + 'Bitte warten!</div>').appendTo($(this_semester)).fadeIn("fast").animate({
        opacity: 1.0
    }, 1000).fadeOut("fast", function(){
        $(this).remove();
    });
	
    var this_draggable_class = $(ui_draggable).attr("class");
    var kopf_modul_in_pool = modProp(modul_id,"head_modul_in_pool");
    var cat_id = modProp(modul_id,"cat_id");
    //    var additional_info = $(ui_draggable).find(".additional_info").text();
	
    // check ob das reingezogenem Modul aus POOL kommt.
    // Wenn ja dann ver�ndern inhalt, und versteck das Modul im POOL.
    // Wenn nein ( also bereits im Auswahl) dann remove per AJAX erstmal das Modul aus SESSION,
    // dann wieder add per AJAX
	
    if ((this_draggable_class == "pool_modul ui-draggable") || (this_draggable_class == "pool_modul")) {
				// Folglich kommt das Modul aus dem Pool (OS)
        change_module_style_to_auswahl(modul_id,ui_draggable);
        modPropChange(modul_id,"inAuswahl","true");
        $(ui_draggable).attr("class", "auswahl_modul_moving");
		
        // Falls das Modul die "search_modul"-Eigenschaft hat, wird nat�rlich auch gerade gesucht,
        // die entspr. Abfrage er�brigt sich also.
        var this_category = $(ui_draggable).parent().parent();
        if ($(ui_draggable).parent().is(".search_modul")) {
            rekursiv_pool_by_out(this_category, 1);
        }
        else {
            if (number_of_visible_items_in_category(this_category) == 0) {
                flip_arrow_of_category("leer", this_category);
            }
        }
		
        // Die anderen gleichen Module verstecken (fast gleich zum Prozedere oben)
        $("." + modul_id + "_parent").not(".auswahl_modul_moving").each(function() {
						var here_module_id = $(this).attr("id");
            // ...falls das nicht das direkt verschobene Modul ist, denn der append-Befehl kommt
            // ja erst sp�ter (OS)
            // if ($(this).find("span.inAuswahl").text() == "false") {
            // if (modProp(modul_id,"inAuswahl") == "false") {
                // inAuswahl-Tag setzen und Modul verstecken (OS):
                // $(this).find("span.inAuswahl").text("true");
                // modPropChange(here_module_id,"inAuswahl","true");
                $(this).find(".pool_modul,.search_modul").css("display", "none");
                // hier ein parent() weniger als oben, weil wir ja schon surch die parent-Divs laufen (OS)
                var this_category = $(this).parent();
                if ($(this).is(".search_modul")) {
                    // alert("drop_in_auswahl(): Eine weitere Kopie muss raus...");
                    rekursiv_pool_by_out(this_category, 0);
                }
                else {
										// alert("number_of_visible_items_in_category = "+number_of_visible_items_in_category(this_category));
                    if (number_of_visible_items_in_category(this_category) == 0) {
                        flip_arrow_of_category("leer", this_category);
                    }
                }
            // }
        });
				$(ui_draggable).attr("class", "auswahl_modul");
        
		    // DATEN mit modul_id und semester zum Server(action add_module_to_selection) schicken
		    ajax_serverupdate_add(modul_id, semester, cat_id);
    }
		else {
			// Folglich wird das Modul nur innerhalb der Auswahl verschoben(OS)
			ajax_serverupdate_move_module_within_selection(modul_id,semester);
    }
	
    // append hier
    var this_subsemester = $(this_semester).find("div.subsemester");
    $(this_subsemester).append(ui_draggable);
	
	
    if (kopf_modul_in_pool == "false") {
        ueberblick();
    }
    else {
        // $(ui_draggable).find(".head_modul_in_pool").text("false");
        modPropChange(modul_id,"head_modul_in_pool","false");
        ajax_request_grade();
    }

    // var additional_info = $(ui_draggable).find(".additional_info").text();
    var additional_info = modProp(modul_id,"additional_info");
    if (additional_info == "true") {
        ajax_request_combobox(modul_id);
        modPropChange(modul_id,"additional_info","drop_down_schon_in_auswahl");
    }

};//ende drop in auswahl

//implement :   custom_modul_drop_in_auswahl---------------------------------------------

var custom_modul_drop_in_auswahl = function(modul_id,modul_class,semester,ui_draggable,this_semester,ui_helper){
	
    var check_open=false;
    var cat_id = modProp(modul_id,"cat_id");
    $("#custom_semester").attr("value",semester);
    $("#custom_id").attr("value",modul_id);
    $("#custom_cat_id").attr("value",cat_id);
	
    $('#custom_dialog').dialog('open');
};

var partial_modul_drop_in_auswahl = function(modul_id,modul_class,semester,ui_draggable,this_semester,ui_helper){
    //parts_exit  aus "true" setzen
    modPropChange(modul_id,"modul_parts_exist","true");
	
    var this_sub = $(this_semester).find("div.subsemester");
    var this_vater = $(ui_draggable).parent().get(0);
	
    // bring  partial-modul ins Auswahl
    var the_first=$("#pool").find("."+modul_id+"_parent").eq(0);

    // alert("partial_modul_drop_in_auswahl: Suche nach Sub-Modulen");
		var partial_module = $(the_first).nextAll().each(function(index){
				// Das .children().eq(1) ist ein Hack, um nicht das "nichtleer"-Div auszuwählen (OS)
				this_id = $(this).children().eq(1).attr("id");
				// alert("partial_modul_drop_in_auswahl: this_id="+this_id+", class="+$(this).children().eq(1).attr("class"));
				
        if ((this_id!="") && (modProp(this_id,"id_of_parent_modul") == modul_id)) {
					// alert("partial_modul_drop_in_auswahl: Sub-Modul gefunden: modul_id="+this_id);
	        var this_child = $(this).children().eq(1);
	        $(this_child).attr("class","auswahl_modul partial_modul");
	        // var this_id = $(this_child).attr("id");
	        $(this_child).show();
	        change_module_style_to_auswahl(this_id,this_child);
	        $(this_sub).append(this_child);
	        ajax_serverupdate_add(this_id,semester);
	
				}
    });
    ueberblick();
	
};


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
								var modul_id = $(this).attr("id");
                parent_name = $(parent).attr("name");
                var parent_id   = $(parent).attr("category_id");
                //                var parent_a    = $("#pool #"+parent_id).find("a");
                //var parent_a_class = $(parent_a).attr("class");
                //                var parent_a_id= $(parent_a).attr("id");
                //alert(parent_a_class);

                var modul_name = $(this).find("name").text();
                var modul_mode = $(this).find("mode").text();
                var credits = $(this).find("credits").text();
                // var modul_short = $(this).find("short").text();
                var modul_parts = $(this).find("parts").text();
				
				
				 
                var modul_class=$(this).attr("class");
                // var check_modul_partial=$(this).attr("partial");
                var additional_info = $(this).attr("additional_server_info");
                var has_grade="true";
                var modul_has_grade=$(this).attr("has_grade");
                if(modul_has_grade == "false"){
                    has_grade = "false";
                }

                //check Modul_ART : Pflicht? WP?
                var bild;
                switch (modul_mode) {
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
                }

                // hiet ist span.inAuswahl f�r die Besetzung eines Modul in Auswahl gedacht.
                //span.custom sagt, dass ein modul normal oder ein dummy-modul ist
                //span.custom_exist sagt, dass das dummy-modul bereits im pool ist
                var this_sel_name=$(this).find("add_sel_name").text();
                var pool_modul_class="pool_modul";
                var id_of_parent_modul="false";
                var partial_mod_name="";
                var kopf_modul_in_pool="false";
              
                if(modul_parts!="0"){
                    kopf_modul_in_pool="true";
                }
				
                // Teil_modul_ name wird angeh�ngt
                if($(this).attr("parent") != ""){
                    pool_modul_class="partial_modul";
                    id_of_parent_modul=$(this).attr("parent");
                    //check nach Teil_Modul_Name add_sel_name
                    partial_mod_name = this_sel_name;
                }

                var custom_category="false";
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
				
								// Modul-Eigenschaften im jCache setzen (OS)
								// Wir benutzten hier nicht modPropChange, da manchen Module (und damit Modul-IDs)
								// ja in mehreren Kategorien vor kommen können. Diese Redundanz könnte man mit Blick
								// auf Geschwindigkeits-Optimierung später beheben, falls nötig.
								modPropForce(modul_id,"name",modul_name);
								modPropForce(modul_id,"modul_has_grade",has_grade);
								modPropForce(modul_id,"class",modul_class);
								modPropForce(modul_id,"category_name",parent_name);
								modPropForce(modul_id,"category_id",category_id);
								modPropForce(modul_id,"mode",modul_mode);
								modPropForce(modul_id,"credits",credits);
								modPropForce(modul_id,"short",$(this).find("short").text());
								modPropForce(modul_id,"add_sel_name",this_sel_name);

								modPropForce(modul_id,"inAuswahl","false");
								modPropForce(modul_id,"cat_id",parent_id);
								modPropForce(modul_id,"custom",modul_class);
								modPropForce(modul_id,"custom_exist","false");
								modPropForce(modul_id,"custom_category",custom_category);
								modPropForce(modul_id,"additional_info",additional_info);
								modPropForce(modul_id,"head_modul_in_pool",kopf_modul_in_pool);
								modPropForce(modul_id,"modul_parts",modul_parts);
								modPropForce(modul_id,"modul_parts_exist","false");
								modPropForce(modul_id,"id_of_parent_modul",id_of_parent_modul);
								modPropForce(modul_id,"add_sel_name_in_sel",this_sel_name);
								modPropForce(modul_id,"modul_name_in_pool",modul_name);
								// Dies wird bei Modulen aus Teilmodulen benötigt (OS)
								modPropForce(modul_id,"credits_in_pool",this_total_credits);
								modPropForce(modul_id,"credits_in_selection",credits_in_selection);

								modPropForce(modul_id,"error","unknown");

								modPropForce(modul_id,"AO_custom_credits","false");
								modPropForce(modul_id,"AO_disable_warning","false");
								modPropForce(modul_id,"AO_ignore_grade","false");

                appendString += "<div class='" + modul_id + "_parent ' rel='mod_parent'><div class='nichtleer'></div><div class='"+
                pool_modul_class+"' id='" + modul_id + "' >" +
                "<div class='icon_loeschen' style='display:none;' onclick='modul_loeschen(" +
                modul_id +","+modul_id+")'>" +loeschenbild +"</div>" +
                "<span class='modul_id' style='display:none'>"+modul_id+"</span>"+
				
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
                "<input class='noten_input' type='text' size='5' style='margin-right:5px;' rel='"+modul_id+"' value='Note' />"+
                "</span>" +
                "</td>" +

                "<td style=' width:22px;display:none' class='ipunkt_td'>" +
                "<a style='cursor:pointer' onclick='javascript:info_box_selection("+modul_id+");'>"+
                "<span class='ipunkt' style='padding:1px 2px 0px 0px;'>"+gelber_ipunkt+"</span>"+
                "</a>"+
                "</td>" +

                "<td class='modul_credit' style='width:29px;text-align:right;font-weight:bold'>" +
                credits +" C" +
                "</td>" +
                "</tr>" + "</tbody>" + "</table>" +
                "<p class='drop_down_menu' style='display:none'></p>"+
                // Ausnahme-Options-Hinweise verstecken
                "<p class='note-option' style='display:none'>Note gestrichen</p>"+
								"<p class='credit-option' style='display:none'>Ausnahme: Credit-Anzahl wurde verändert</p>"+
                "<p class='warnung-option' style='display:none'>Ausnahme: Warnungen deaktiviert</p>"+
                "</div></div>";

                //kopieren das Modul in search_table  f�r die Suche
                $("#suche tbody").append("<tr class='"+modul_id+"'   rel='"+pool_modul_class+"' >"+"<td class='cat_check' rel='noCheck' >"+custom_category+"</td>"+"<td>"+modul_id+"</td>"+"<td class='td_custom_name'>"+modul_name+"</td>"+"</tr>");
				
            default:
                break;
        }
    });
    return appendString;
};//ende poolrekursiv


//POOL-Funktion gibt immer ganzen Module im POOL zur�ck, 
//und ruft AJAX auf  ------------------------------
var pool = function(){
	
		// testweise (OS)
		clear_cache();

    var XML = $.ajax({

        type: 'GET',
        url: 'abfragen/pool',
        async: false,
				cache: false,
        contentType: 'application/x-www-form-urlencoded',
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					ajax_serverupdate_on_AJAX_warning("textStatus="+textStatus+",fn=pool");
				}
    }).responseXML; //ende AJAX

    var root = XML.documentElement;
    var this_pool = $("#pool");
    $("#pool").empty();
	
    // Pool anzeigen
    $("#pool").append(poolrekursiv(root));	
   
    hide_partial_modul();
    session_auswahl();

    enter_only_first_custom_module_into_search_table_on_init();
    display_only_first_custom_module_on_init(this_pool);
    ueberblick();	
	
};//ende pool

var search_is_active = function(){
    // Nicht besonders sch�n, funktioniert zum Beispiel nicht mehr, wenn man einen Start-
    // String im Such-Feld vorgibt. Reicht aber momentan. (OS)
		// alert("search_is_active: search_is_active="+($("#qs").val() != ""))
    return ($("#qs").val() != "");
};

var change_module_style_to_pool = function(modul_id,handle){

    $(handle).find("> p.credit-option").css("display","none");
    $(handle).find("> p.warnung-option").css("display","none");
    $(handle).find("> p.note-option").css("display","none");
		modPropForce(modul_id,"AO_custom_credits","false");
		modPropForce(modul_id,"AO_disable_warning","false");
		modPropForce(modul_id,"AO_ignore_grade","false");

    $(handle).find("> div.icon_loeschen").css("display","none");
    
    //auf originale Credits setzen im Fall Credits-Veraenderung
		var original_credits = modProp(modul_id,"credits");
    $(handle).find("> table tbody tr td.modul_credit").text(original_credits+" C");
   
    $(handle).find("> p.drop_down_menu").css("display","none").empty();
	  if(modProp(modul_id,"additional_info") == "drop_down_schon_in_auswahl")
				modPropChange(modul_id,"additional_info","true");
    
    // checke nach Dummy-Modul. Wenn ja dann den Name wieder auf den Standardname (hier: "(Sonstiges Modul)") setzen
    // und span.custom_exist=nein setzen und class=custom_modul, 
    // damit dieses Dummy nicht im Pool angezeigt wird(sonst mehr als 2 Dummies im pool vorkommen
		var dummy_name = modProp(modul_id,"custom");
    if(dummy_name == "custom"){
				var dummy_standard_name = modProp(modul_id,"modul_name_in_pool");
        $(handle).find("> table tbody tr td.modul_name").text(dummy_standard_name);
				modPropChange(modul_id,"custom_exist","false");
        $(handle).attr("class","custom_modul");
        $(handle).hide();
    }
    // is_error auf "true" setzen
    // $(handle).find(".is_error").text("false");
		modPropChange(modul_id,"error","false");
   	
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
};


var change_module_style_to_auswahl = function(modul_id,handle){

    $(handle).find("div.icon_loeschen").css("display","block");
    $(handle).find(".fragebild_td").css("display","none");
	
    //auf richtige Credits setzen (=normale Credits falls keine Teilmodule)
		var credits_for_display = modProp(modul_id,"credits_in_selection");
		if (modProp(modul_id,"AO_custom_credits") != "false")
			credits_for_display = modProp(modul_id,"AO_custom_credits");
		// alert("change_module_style_to_auswahl: credits="+modProp(modul_id,"credits")+", credits_in_selection="+modProp(modul_id,"credits_in_selection")+", credits_in_pool="+modProp(modul_id,"credits_in_pool"));
    $(handle).find("> table tbody tr td.modul_credit").text(credits_for_display+" C");

    // Hack, da IE die CSS display-Art "table-cell" nicht unterstützt
    // Könnte man evtl. mit jQuery show() und hide() umgehen... (OS)
    jQuery.each(jQuery.browser, function(i) {
        if ($.browser.msie) {
            $(handle).find(".ipunkt_td").css("display","inline");
            // check ob unbenoten ist
						if (modProp(modul_id,"modul_has_grade") != "false")
                $(handle).find(".noten_input_td").css("display", "inline");
        }
        else {
            $(handle).find(".ipunkt_td").css("display","table-cell");
						if (modProp(modul_id,"modul_has_grade") != "false")
                $(handle).find(".noten_input_td").css("display", "table-cell");
        }
        flip_module_infoicon_on_event("init",modul_id,handle);
    });
    return 0;
};

var module_div_present_in_parent = function(parent_handle){
    // recht uebler Hack (OS)
    var result = ($(parent_handle).text() != "")
    return result;
};


// New jCache functions: (OS)
var modPropForce = function(module_id,property,value) {
	// alert("Setting property ("+property+") of module ("+module_id+") to value ("+value+")");
	$.jCache.setItem("m"+module_id+"::"+property, value);
};
var modPropCreate = function(module_id,property,value) {
	// alert("Setting property ("+property+") of module ("+module_id+") to value ("+value+")");
	$.jCache.createItem("m"+module_id+"::"+property, value);
};
var modPropChange = function(module_id,property,value) {
	// alert("Setting property ("+property+") of module ("+module_id+") to value ("+value+")");
	$.jCache.changeItem("m"+module_id+"::"+property, value);
};
var modProp = function(module_id,property) {
	return $.jCache.getItem("m"+module_id+"::"+property);
};

var display_cache = function() {
	text = $.jCache.dumpCache();
	$("#CacheDump").empty().append(text);
	$('#CacheDump').dialog('open');
};
var clear_cache = function() {
	$.jCache.clear();
};
