/* Copyright 2009,2010 adiungi GmbH, http://www.adiungi.de
for licensing questions please refer to the README
Created by Christian Beulke, Van Quan Nguyen and Olav Stetter */

/*--------------------------------------------------------------------------------------
 *       diese Datei macht den POOL beweglich mit slideDown und slideUP           
 *     und schickt die Daten modulID und entsprechenem Semester zum Server      
 *       nachdem das gezogene Modul in Auswahl reingetan wurde                            
 *                semesterhinzu,custom_check
 *                Ergreinis bei DROP in Auswahl
 *                "Loeschen" bei SEMESTER wird geklick 
 *                mach unseres POOL droppable 
 *                mach ein pool_modul bei POOL draggable--    
 *                Noten eingeben und schicken bei (".semester").droppable
 *-------------------------------------------------------------------------------------*/




//function fuer Form-Check bei Custom-Moul
function updateTips(t,tips) {
    tips.text(t).effect("highlight",{},1500);
      
}

//---------------------------------------------------------

function isInteger(s) {
  return (s.toString().search(/^-?[0-9]+$/) == 0);
}
function isUnsignedInteger(s) {
  return (s.toString().search(/^[0-9]+$/) == 0);
}
var custom_check = function(name,credit,category,custom_semester,custom_id,tips,min,max){
    var cat_check=false;
    // Wir fangen mit einem Array-Element an, weil JavaScript bei nur einem Eintrag keinen
    // Array übergibt (OS)
    var cat_id_array= new Array(1);
    cat_id_array[0] = -1;
    
    $("#dummy_checkbox input[type='checkbox']").each(function(){
        if($(this).is(":checked")){
            //alert("ja, checked");
            cat_check = true;
            //alert("ID="+$(this).attr("id"));
            cat_id_array.push($(this).attr("value"));
        }
    });
  
    custom_semester=custom_semester.attr("value");
    custom_id=custom_id.attr("value");
    var category_id = category.attr("value");
  
    // Wenn keine Checkbox ausgewählt wird, wird die Kategorie übergeben, aus der das
    // Dummy-Modul kommt (OS)
    if (!cat_check) cat_id_array.push(category_id.split("_")[1]);

    // Ist das Modul benotet? (OS)
    var has_grade = "true";
    if ($("#hat_note input[type='checkbox']").is(":checked")) has_grade = "false";
    modPropChange(custom_id,"modul_has_grade",has_grade);
    
    var this_credit = credit.val();
    var this_name = name.val();
    var this_credit_float = parseFloat(this_credit);
  
  
    if (name.val().length < min){   
        name.addClass('ui-state-error');
        updateTips("Bitte geben Sie hier den Namen des Moduls ein.",tips);
        return false;
    }
    else this_name = "Sonstiges Modul: "+this_name;
  
    // if(this_credit.length < min || isNaN(this_credit_float) || this_credit_float < 0){
    if(!isUnsignedInteger(this_credit)){
        credit.addClass('ui-state-error');
        updateTips("Bitte geben Sie als Credits eine eine ganze, positive Zahl ein.",tips);
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
        name = $("#name");
        credit = $("#credit");
        var cre = credit.attr("value");
        $(cus_modul).attr("class","auswahl_modul ui-draggable");
        $(cus_modul).find(".modul_name").text(this_name);
        $(cus_modul).find(".modul_credit").text(cre+" C");
        modPropChange(custom_id,"credits_in_selection",cre);
        modPropChange(custom_id,"inAuswahl","true");
        $("#middle").find(".semester").each(function(){
            var this_id = $(this).attr("id");
            if(this_id == custom_semester){
                var this_subsemester = $(this).find(".subsemester");
                $(this_subsemester).append(cus_modul);
                //check Noten streichen
                // update_dummy_modul_in_selection(cus_modul);
            }
        
        })
        change_module_style_to_auswahl(custom_id,cus_modul);
        ajax_serverupdate_add_custom(this_name,this_credit_point_float,cat_id_array,custom_semester,custom_id,has_grade);
        ajax_serverupdate_grade_reset(custom_id);
        return true;
    }
};



//---------- Drag and Drop----------------------------------------------------------


//-----------------------------------------------------------------------------------
//  mach ein pool_modul bei POOL draggable, den Pool-Baum beweglich-- und Ergreinis bei DROP in POOL
//  also Pool_droppable. 
//-----------------------------------------------------------------------------------


$(function(){
    // teil Form-Check bei dummy Modul
    var name=$("#name");
    var credit=$("#credit");
    var category = $("#custom_cat_id");
    
    var custom_semester=$("#custom_semester");
    var custom_id=$("#custom_id");
    
    var tips =$("#validateTips");
    var allFields = $([]).add(name).add(credit);
    
    var AOCbox = $("#exception_credit");
                  
    $("#CacheDump").dialog({
        modal:true,
        height:400,
        width:550,
        position:'center',
        autoOpen:false,
                
        open:function(event,ui){
  
            $("#CacheDump").show();         
        },
        buttons:{
            "OK":function(){
                $("#CacheDump").dialog('close');
              
            }
        }
    });

    $("#CacheDump").dialog({
        modal:true,
        height:400,
        width:550,
        position:'center',
        autoOpen:false,
                
        open:function(event,ui){
  
            $("#CacheDump").show();         
        },
        buttons:{
            "OK":function(){
                $("#CacheDump").dialog('close');
              
            }
        }
    });
    
    
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
  
    // $("#vorratbox").droppable({
    //    
    //         hoverClass:'drophover',
    //         drop : function(event,ui){
    //             $(this).append(ui.draggable);
    //      
    //         }
    //     });
  
    // zur�ck in POOL , also mach #pool droppable
    $("#pool").droppable({
        accept     : '.auswahl_modul,.auswahl_modul_clone',// momentan gibt es nicht
        hoverClass : 'drophover',
        drop: function(event, ui){
            var ui_draggable = $(ui.draggable);
            var modul_id = $(ui.draggable).attr("id");
            var this_pool = $(this);
            $(ui.helper).remove();
            // neuerdings die gleiche Funktion wie wenn man auf den L�schen-Knopf klickt:
            modul_loeschen(modul_id,modul_id);
        }
    });
    
    //-------------semester-Droppable--------------------------------------//
    //                                     //
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
         
            var custom_text = modProp(modul_id,"custom");
            var parts_text  = modProp(modul_id,"modul_parts");         
            var parts_exist  = modProp(modul_id,"modul_parts_exist");
        
            if(custom_text == "non-custom") {
                //check nach Teil_modul
                if((parts_text!="0") && (parts_exist=="false")){
                    change_TM_credit_and_add_name_in_selection(modul_id,ui_draggable);
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
        "<a class='semesterloeschen btn' onClick='sem_loeschen("+n+");'>Semester entfernen</a>"+
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
         
                var custom_text = modProp(modul_id,"custom");
                var parts_text  = modProp(modul_id,"modul_parts");
                var parts_exist  = modProp(modul_id,"modul_parts_exist");
                if(custom_text == "non-custom") {
                    //check nach Teil_modul
                    if((parts_text!="0") && (parts_exist=="false")){
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
};//ende

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
                $(this).hide();
                modul_loeschen($(this).attr("id"),all_sem_destroy);
            });
            $(this_semester).remove();
            // Loeschen anzeigen.Wir suchen das vorletzten Semester.
            if (lint > 1) {
                $(".semester[id="+(lint-1)+"] .semesterloeschen").css("display","inline");
                //ajax aufrufen
                // wir rufen nur Ajax auf wenn es sich um ein nicht leer semester handelt.
                if (this_modules.length > 0) {
                    ajax_serverupdate_remove_semester(lint);
                }
            }
        } // ende confirm
    }
};//ende

var toggle_category = function(category_id){
    var handle = $("#pool").find("#"+category_id);
    var temparrow = which_arrow_is_visible(handle);
  
    switch (temparrow) {
        case "rechts":
            // Kategorie �ffnen
            var count = 0;
            $(handle).children().not("a, .nichtleer").each(function(){
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
                    // Folglich sind hier keine Kategorien, sondern Module (OS)
                    $(this).children().each(function(){
                        var modul_id = $(this).parent().attr("class").split("_")[0];
                        if (modProp(modul_id,"inAuswahl") == "false") {
                            if (search_is_active()) {
                                if ($(this).parent().is(".search_modul")) {
                                    if ($(this).attr("class") != "partial_modul") {
                                        $(this).show();
                                        count++;
                                    }
                                }
                            }
                            else {
                                // die folgende Abfrage ist n�tig, damit custom_modul-Divs nicht
                                // angezeigt werden (OS)
                                if ($(this).is(".pool_modul")) {
                                    $(this).show();
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
            $(handle).children().not("a, .nichtleer").each(function(){
                var this_class = $(this).attr("class");
                // Pr�fen, ob sich darunter Kategorien oder Module befinden
                if((this_class=="pool_category")||(this_class=="search_category"))
                    $(this).css("display","none");
                else $(this).find(">*").css("display","none");
            });
            break;
        case "leer":
            // Bei leerer Kategorie passiert einfach nichts.
            break;
        default:
            alert("Fehler: Ungueltiger Pfeil-Wert in toggle_category().");
    
    }
};

var number_of_visible_items_in_category = function(handle){
    // gefragt is handle zur Kategorie
    var this_class = $(handle).attr("class");
    if(!((this_class=="pool_category")||(this_class=="search_category"))) {
        alert("Fehler: Handle in number_of_visible_items_in_category() ist keine Kategorie!");
    }
    
    var count = 0;
    $(handle).children().not("a, .nichtleer").each(function(){
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
            $(this).children().not(".auswahl_modul_moving").each(function(){
                // Leider ein wenig unschön, aber geht (OS)
                if ((modProp($(this).parent().attr("class").split("_")[0],"inAuswahl")=="false")&&($(this).is(".pool_modul"))) {
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
    // alert("number_of_visible_items_in_category: count="+count);
    return (count);
};

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
};

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
};
