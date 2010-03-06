/*--------------------------------------------------------------------------------------
 *	     diese Datei macht den POOL beweglich mit slideDown und slideUP    				
 *		 und schickt die Daten modulID und entsprechenem Semester zum Server 			
 *       nachdem das gezogene Modul in Auswahl reingetan wurde                          	
 *								semesterhinzu,custom_check
 *								Ergreinis bei DROP in Auswahl
 *								"L�schen" bei SEMESTER wird geklick 
 *								mach unseres POOL droppable	
 *								mach ein pool_modul bei POOL draggable--		
 *								Noten eingeben und schicken bei (".semester").droppable
 *-------------------------------------------------------------------------------------*/






//function f�r Form-Check bei Custom-Moul
function updateTips(t,tips) {
    tips.text(t).effect("highlight",{},1500);
			
}

//---------------------------------------------------------


var custom_check = function(name,credit,category,custom_semester,custom_id,tips,min,max){
    var cat_check=false;
    var cat_id_array= new Array();
    $("#dummy_checkbox input[type='checkbox']").each(function(){
        if($(this).is(":checked")){
            //alert("ja, checked");
            cat_check = true;
            //alert("ID="+$(this).attr("id"));
            cat_id_array.push($(this).attr("id"));
        }
		
    });
	
	
	
    var custom_semester=custom_semester.attr("value");
    var custom_id=custom_id.attr("value");
    var category_id = category.attr("value");
	
    //ajax bei set_category
    if(cat_check){
        ajax_serverupdate_custom_checkbox(custom_id,cat_id_array);
    //alert("check"+cat_id_array[0]);
    }
    else{
		
        ajax_serverupdate_custom_checkbox(custom_id,category_id);
    //alert("nicht check"+category_id);
    }
	
	
    //alert("cat_id in custom_check="+category_id);
    var this_credit=credit.val();
    var this_name =name.val();
    var this_credit_float = parseFloat(this_credit);
	
	
    if(name.val().length < min){
		
        name.addClass('ui-state-error');
        updateTips("Bitte geben Sie ein Namen ein.",tips);
        return false;
    }
	
    if(this_credit.length < min || isNaN(this_credit_float)){
        credit.addClass('ui-state-error');
        updateTips("Bitte geben Sie als Credits eine eine ganze Zahl ein.",tips);
        return false;
    }
    else{
		
        var check_komma = this_credit.search(/,/);
        var this_credit_point=this_credit;
		
        if(check_komma != -1){
            this_credit_point = this_credit.replace(/\,/,".");
        }
        var this_credit_point_float = parseFloat(this_credit_point);
		
        //Das dummy in Auswahl stecken. Name und Credit anpassen
        // check das Note_streichen von Anfang an
        var cus_modul = $("#pool #"+custom_id);
        var name=$("#name");
        var credit=$("#credit");
        var na = name.attr("value");
        var cre = credit.attr("value");
        $(cus_modul).attr("class","auswahl_modul ui-draggable");
        //$(cus_modul).find("span.custom").text("non-custom");
        $(cus_modul).find(".modul_name").text(na);
        $(cus_modul).find(".modul_credit").text(cre+" C");
        change_module_style_to_auswahl(cus_modul);
        $(cus_modul).find("span.inAuswahl").text("ja");
        $("#middle").find(".semester").each(function(){
            var this_id = $(this).attr("id");
            if(this_id == custom_semester){
                var this_subsemester = $(this).find(".subsemester");
                $(this_subsemester).append(cus_modul);
                //check Noten streichen
                update_dummy_modul_in_selection(cus_modul);
            }
				
        })
        ajax_server_by_custom(this_name,this_credit_point_float,category_id,custom_semester,custom_id);
        return true;
    }
	
	
} 



//---------- Drag and Drop----------------------------------------------------------


//-----------------------------------------------------------------------------------
//  mach ein pool_modul bei POOL draggable, den Pool-Baum beweglich-- und Ergreinis bei DROP in POOL
//  also Pool_droppable. 
//-----------------------------------------------------------------------------------


$(function(){
    // teil Form -Check bei dummy Modul
    var name=$("#name");
    var credit=$("#credit");
    var category = $("#custom_cat_id");
		
    var custom_semester=$("#custom_semester");
    var custom_id=$("#custom_id");
		
    var tips =$("#validateTips");
    var allFields = $([]).add(name).add(credit);
		
    $("#custom_dialog").dialog({
        modal:true,
        height:300,
        width:500,
        autoOpen:false,
        open : function(event,ui){
            name.attr("value","");
            credit.attr("value","");
            ajax_request_custom_checkbox($(custom_id).attr("value"));
				
				
        },
        buttons:{
            "Fertig":function(){
					
                var iValid=false;
                allFields.removeClass('ui-state-error');

                iValid = custom_check(name,credit,category,custom_semester,custom_id,tips,1,4);
					
                if (iValid) {
						
                    var na = name.attr("value");
                    var cre = credit.attr("value");
                    var cat = category.attr("value");
                    var cus_sem=custom_semester.attr("value");
                    var cus_id=custom_id.attr("value");
						
                    var cus_modul = $("#pool #"+cus_id);
                    // custom_modul soll auch in VorratBox sein
						
                    var this_exsit = $(cus_modul).find("span.custom_exist").text();
                    var cus_cat_id=$(cus_modul).find(".custom_category").text();
                    if(this_exsit=="nein"){
                        $(cus_modul).find("span.custom_exist").text("ja");
                        get_custom_modul(cus_cat_id);
                        //get_custom_modul_in_the_search_table();
                        get_and_change_custom_modul_in_the_table(cus_id,na,cus_cat_id);
							
                    }
						
                    $(this).dialog('close');
						
                }
					
					
            }
        }
			
			
    });
		
		
    // check Noten_streichen fuer Dummy_modul
    // da wird #exception_change als SpeicherOrt f�r das Ankreuzen benutzt
    //$("#custom_dialog #note_streichen").click(function(){
    //	 $("#exception_change").attr("value","true");
    //die Funktion update_dummy_modul_in_selection check das exception_change
			 
    // })
			
    ////Ausname-Optionen checken. Bei jeder Ver�nderung wird dann die Funktion �berblick erneut geladen.
    // exception_change ist fuer Note streichen und Warnung deaktivieren verantwortlich
    // credit_exception_change ist extra fuer Credit-Zahl-Aenderung
		
    $("#exception_credit").click(function(){
        $(this).attr("value","");
    })
		 
    $("#exception_credit").keydown(function(){
        $("#credit_exception_change").attr("value","true");
    })
    $("#exception_warn,#exception_note").click(function(){
        $("#exception_change").attr("value","true");
    })
		 
		 
		 			
    // info_box------------------------------------------------------------
			
		 
		 
    $("#info_box").dialog({
        modal:true,
        height:400,
        width:550,
        position:'center',
        autoOpen:false,
                
        open:function(event,ui){
			 		
            //$("#exception_credit") wird in ajax_to_server_by_get_module_info behandelt.
            $("#box_info").show();
					
            //Ob Note streichen gecheckt
            if($("#exception_note").is(":checked")){
                //alert("Aha, du bist schon beim Note streichen gecheckt");
                $("#exception_note").attr("checked","checked");
            }
            else{
                $("#exception_note").attr("checked","");
            }
            // Ob Warning gecheckt
            if($("#exception_warn").is(":checked")){
                //alert("Aha, du bist schon beim Warning gecheckt");
                $("#exception_warn").attr("checked","checked");
            }
            else {
                $("#exception_warn").attr("checked","");
            }
					
        },
        buttons:{
            "OK":function(){
                if ($("#box_info_exception").css("display") == "block") {
                    update_modul_in_selection();
                }
                $("#info_box").dialog('close');
							
            }
        }
    });

		
		
    // pool();
		
    $(".auswahl_modul,.auswahl_modul_clone,.auswahl_modul.ui-draggable,.partial_modul,.auswahl_modul.partial_modul.ui-draggable").draggable({
			
        revert : "invalid",
        helper : "clone",
        cursorAt:{
            right:125,
            top:13
        }
			
    });
		
		
		
		
		
		
    $(".pool_modul,.custom_modul").draggable({
							
        revert : "invalid",
        helper : "clone",
        cursorAt:{
            left:120,
            top:13
        }
				
    });
		
		
	   
		
    // am Anfang beim Seite-Laden alle Pool-modul verstecken.
    // danach dynamisch auf- und zu machen.

	
    $("#pool .pool_modul").hide();
	
    $("#voratbox").droppable({
		
        hoverClass:'drophover',
        drop : function(event,ui){
            $(this).append(ui.draggable);
			
        }
    });
	
    // zur�ck in POOL , also mach #pool droppable
    $("#pool").droppable({
        accept     : '.auswahl_modul,.auswahl_modul_clone',// momentan gibt es nicht
        hoverClass : 'drophover',
        drop: function(event, ui){
            var ui_draggable = $(ui.draggable);
            var mod_id = $(ui.draggable).attr("id");
            var this_pool = $(this);
            $(ui.helper).remove();
            // neuerdings die gleiche Funktion wie wenn man auf den L�schen-Knopf klickt:
            modul_loeschen(mod_id);
        }
    });
		
    //-------------semester-Droppable--------------------------------------//
    //																	   //
    /////////////////////////////////////////////////////////////////////////
		
    $(".semester").droppable({
        hoverClass : 'drophover',
        accept     : '.pool_modul ,.auswahl_modul,.auswahl_modul_clone,.custom_modul',
        drop: function(event, ui){
            // id von reingezogenem Modul und entsprechendem Semester holen
            var ui_draggable = $(ui.draggable);
            var ui_helper = $(ui.helper);
            var this_semester = $(this);
            var semester = $(this).attr("id");
            var modul_id = $(ui.draggable).attr("id");
            var modul_class = $(ui.draggable).attr("class");
				 
            var custom_text = $(ui.draggable).find("span.custom").text();
            var parts_text  = $(ui.draggable).find("span.modul_parts").text();
				 
            var parts_exsit  = $(ui.draggable).find("span.modul_parts_exsit").html();
				
            if(custom_text == "non-custom") {
                //check nach Teil_modul
                if((parts_text!="0") && (parts_exsit=="nein")){
                    change_credit_and_add_name_in_selection(ui_draggable);
                    drop_in_auswahl(modul_id,modul_class,semester,ui_draggable,this_semester,ui_helper);
                    partial_modul_drop_in_auswahl(modul_id,modul_class,semester,ui_draggable,this_semester,ui_helper);
                } else {
                    drop_in_auswahl(modul_id,modul_class,semester,ui_draggable,this_semester,ui_helper);
                }
            } else {
                // hier sind custom_module
                if (modul_class == "auswahl_modul ui-draggable" || modul_class == "auswahl_modul" || modul_class == "auswahl_modul_clone ui-draggable") {
                    drop_in_auswahl(modul_id, modul_class, semester, ui_draggable, this_semester, ui_helper);
                } else {
                    //von pool her
                    custom_modul_drop_in_auswahl(modul_id, modul_class, semester, ui_draggable, this_semester, ui_helper);
                }
            }
				
        //hier check nach dummy modul und normales Modul
        //und check nach gesuchtes Modul.D.h: check modul_id_parent im Pool und
        //guck ob das class search_modul hat. Wenn Ja dann aktualisiere Live Pool
        }
    // ende drop
    });//ende droppable
		
    // hier ist die Note im input________________________NOTEN__________________________________________
    // bei Focus: die Note eingeben
    // beim Focus-Verlassen : die Event Change schickt die Note und Modul_ID per Ajax zum Server
    // Note berechnen
		
    var check_change=true;
    $("input.noten_input").focus(function(e){
        check_change=true;
        // da wird der Click bei 'Note berechen' deaktiviert
        if($(this).val()=="Note"){
            $(this).attr("value"," ");
        }
        $(this).select();
        $("#note_berechnen").text("Note wird bearbeitet");
    });
    //onChange oder Enter dr�cken
    $("input.noten_input").bind("keypress",function(e){
        if(e.keyCode == 13){
            $(this).trigger('change');
            $("#enter_trick").trigger('focus');
            check_change=false;
        }
    });
    $("input.noten_input").change(function(e){
        if (check_change) {
            e.preventDefault();
            selection_input_check(this);
        }
    });
});//ende

//////////////////////semesterhinzu////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////

var sem_hinzu = function(){
    $(function(){
        var n = $('#semester-content div.semester').length+1;
        var neu = "<div class='semester' id='"+n+"'>"+
        "<div class='subsemester'><h5>"
        +n+" .Semester"+
        "</h5>"+
        "</div>"+
        "<a class='semesterloeschen' onClick='sem_loeschen("+n+");'>Semester entfernen</a>"+
        "</div>";
			
        $("#semester-content").append(neu);
		
        // "L�schen" wird immer in dem letzen Semester hinzuf�gen
        // d.h: andere ""L�schen" werden weggemacht.
        $(".semester[id="+(n-1)+"] .semesterloeschen").css("display","none");
        $(".semester[id="+n+"] .semesterloeschen").css("display","inline");
			
        // ein Modul reinziehn
        $(".semester").droppable({
            hoverClass:'drophover',
            drop: function(event, ui){
                // id von reingezogenem Modul und entsprechendem Semester holen
                var ui_draggable = $(ui.draggable);
                var ui_helper = $(ui.helper);
                var this_semester = $(this);
                var semester = $(this).attr("id");
                var modul_id = $(ui.draggable).attr("id");
                var modul_class = $(ui.draggable).attr("class");
				 
                var custom_text = $(ui.draggable).find("span.custom").text();
                var parts_text  = $(ui.draggable).find("span.modul_parts").text();
                var parts_exsit  = $(ui.draggable).find("span.modul_parts_exsit").html();
                if(custom_text == "non-custom") {
                    //check nach Teil_modul
                    if((parts_text!="0") && (parts_exsit=="nein")){
                        partial_modul_drop_in_auswahl(modul_id,modul_class,semester,ui_draggable,this_semester,ui_helper);
                    }
                    drop_in_auswahl(modul_id,modul_class,semester,ui_draggable,this_semester,ui_helper);
                }
                else{// hier sind custom_module
                    if (modul_class == "auswahl_modul ui-draggable" || modul_class == "auswahl_modul" || modul_class == "auswahl_modul_clone ui-draggable") {
                        drop_in_auswahl(modul_id, modul_class, semester, ui_draggable, this_semester, ui_helper);
                    }
                    else {
                        custom_modul_drop_in_auswahl(modul_id, modul_class, semester, ui_draggable, this_semester, ui_helper);
                    }
                }
            //hier check nach dummy modul und normales Modul
            //und check nach gesuchtes Modul.D.h: check modul_id_parent im Pool und
            //guck ob das class search_modul hat. Wenn Ja dann aktualisiere Live Pool
            }// ende drop
        });//droppable
    });//ende function
}//ende

///////////////////////////////////////////////////////////////////////////////////
// "L�schen" bei SEMESTER wird geklick -------------------------------------------
//   sem_loeschen()
///////////////////////////////////////////////////////////////////////////////////

var sem_loeschen = function(l){
	
    lint = parseInt(l);
    var all_sem_destroy="10000";// das sorgt daf�r,dass nur ein Ajax-Aufruf beim Semester-L�schen mit meheren Module auftritt

    // confirm nur beim Semester >=2
    if (parseInt(l) != "1") {
			
        var this_semester = $(".semester[id="+lint+"]");
        var this_modules = $(this_semester).find(".auswahl_modul,.auswahl_modul_clone");
			
        // Abfrage erfolgt nur falls sich mind. ein Modul im Semster befindet
        var bestaetigen = false
        if (this_modules.length == 0) {
            bestaetigen = true
        }
        else {
            bestaetigen = confirm("Wollen Sie das Semester komplett entfernen?");
        }

        if (bestaetigen == true) {
            //erstmal hide(), aber noch nicht remove()
            $(this_semester).hide();
            // Module wieder im Pool anzeigen (keine Ahnung wo das passiert, OS)
            this_modules.each(function(){
                $(this).css("display","none");
                modul_loeschen($(this).attr("id"),all_sem_destroy);
            });
            $(this_semester).remove();
            // Loeschen anzeigen.Wir suchen das vorletzten Semester.
            if (lint > 1) {
                $(".semester[id="+(lint-1)+"] .semesterloeschen").css("display","inline");
                //ajax aufrufen
                // wir rufen nur Ajax auf wenn es sich um ein nicht leer semester handelt.
                if (this_modules.length > 0) {
                    ajax_to_server_by_remove_semester(lint);
                }
            }
        } // ende confirm
    }
}//ende

var toggle_category = function(category_id){
    var handle = $("#pool").find("#"+category_id);
    var temparrow = which_arrow_is_visible(handle);
	
    switch (temparrow) {
        case "rechts":
            // Kategorie �ffnen
            var count = 0;
            $(handle).children().not("a, .nichtleer, .inAuswahl").each(function(){
                var this_class = $(this).attr("class");
                // Pr�fen, ob sich darunter Kategorien oder Module befinden
                if((this_class=="pool_category")||(this_class=="search_category")) {
                    if (!search_is_active()) {
                        $(this).css("display","block");
                        count++;
                        // Schleife um Icon auf Pfeil-Leer zu setzen, falls n�tig, sollte aber nicht (OS)
                        if (number_of_visible_items_in_category(this) == 0) flip_arrow_of_category("leer",this);
                    }
                    else if (this_class=="search_category") {
                        if ($(this).attr("class") != "partial_modul") {
                            $(this).css("display", "block");
                            count++;
                        }
                        else $(this).hide();
                    }
                }
                else {
                    $(this).children().each(function(){
                        if ($(this).find(">span.inAuswahl").text()=="nein") {
                            if (search_is_active()) {
                                if ($(this).parent().is(".search_modul")) {
                                    if ($(this).attr("class") != "partial_modul") {
                                        //alert("hier bist du ");
                                        $(this).css("display", "block");
                                        count++;
                                    }
                                }
                            }
                            else {
                                // die folgende Abfrage ist n�tig, damit custom_modul-Divs nicht
                                // angezeigt werden (OS)
                                if ($(this).is(".pool_modul")) {
                                    $(this).css("display","block");
                                    count++;
                                }
                            }
                        }
                        // das Folgende k�nnte auch unn�tig sein, aber schaden kann's wohl nicht (OS)
                        else $(this).css("display","none");
                    });
                }
            });
            // falls kein Element angezeigt wird, entspr. Icon anzeigen
            if (count == 0) {
                flip_arrow_of_category("leer",handle);
            }
            else {
                flip_arrow_of_category("unten",handle);
            }
            break;
        case "unten":
            // Kategorie schlie�en
            flip_arrow_of_category("rechts",handle);
            // Elemente darunter verstecken
            $(handle).children().not("a, .nichtleer, .inAuswahl").each(function(){
                var this_class = $(this).attr("class");
                // Pr�fen, ob sich darunter Kategorien oder Module befinden
                if((this_class=="pool_category")||(this_class=="search_category"))
                    $(this).css("display","none");
                else $(this).find(">*").css("display","none")
            });
            break;
        case "leer":
            // Bei leerer Kategorie passiert einfach nichts.
            break;
        default:
            alert("Fehler: Ungueltiger Pfeil-Wert in toggle_category().");
		
    }
}

var number_of_visible_items_in_category = function(handle){
    // gefragt is handle zur Kategorie
    var this_class = $(handle).attr("class");
    if(!((this_class=="pool_category")||(this_class=="search_category"))) {
        alert("Fehler: Handle in number_of_visible_items_in_category() ist keine Kategorie!");
    }
		
    var count = 0;
    $(handle).children().not("a, .nichtleer, .inAuswahl").each(function(){
        this_class = $(this).attr("class");
        // Zun�chst Pr�fen, ob sich darunter Kategorien oder Module befinden
        if((this_class=="pool_category")||(this_class=="search_category")) {
            // also geht es um eine Kategorie
            if (search_is_active()) {
                if (this_class=="search_category") {
                    count++;
                }
            }
            else count++;
        } else { // also geht es um Module
            $(this).children().each(function(){
                if (($(this).find(">span.inAuswahl").text()=="nein")&&($(this).is(".pool_modul"))) {
                    if (search_is_active()) {
                        if ($(this).parent().is(".search_modul")) {
                            count++;
                        }
                    }
                    else {
                        count++;
                    }
                }
            });
        }
    });
    return (count);
}

var flip_arrow_of_category = function(type,handle){
    // gefragt is handle zur Kategorie
    var this_class = $(handle).attr("class");
	
    switch(type){
        case "rechts":
            $(handle).find(">a .pfeil_unten").css("display","none");
            $(handle).find(">a .pfeil_rechts").css("display","inline");
            $(handle).find(">a .pfeil_leer").css("display","none");
            break;
        case "unten":
            $(handle).find(">a .pfeil_unten").css("display","inline");
            $(handle).find(">a .pfeil_rechts").css("display","none");
            $(handle).find(">a .pfeil_leer").css("display","none");
            break;
        case "leer":
            $(handle).find(">a .pfeil_unten").css("display","none");
            $(handle).find(">a .pfeil_rechts").css("display","none");
            $(handle).find(">a .pfeil_leer").css("display","inline");
            break;
        default:
            alert("Fehler in flip_arrow_of_category: Typ "+type+" unbekannt!");
    }
}

var which_arrow_is_visible = function(handle){
    // gefragt is handle zur Kategorie
    var this_class = $(handle).attr("class");
    if(!((this_class=="pool_category")||(this_class=="search_category")))
        alert("Fehler: Handle in which_arrow_is_visible() ist keine Kategorie!");

    var result = "unbekannt";
    if ($(handle).find(">a .pfeil_unten").css("display") == "inline") result = "unten";
    else {
        if ($(handle).find(">a .pfeil_rechts").css("display") == "inline") result = "rechts";
        else if ($(handle).find(">a .pfeil_leer").css("display") == "inline") result = "leer";
    }
    return result;
}