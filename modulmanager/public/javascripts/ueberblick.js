/*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
//  diese Funktion ueberblickrekursiv() gibt den �berblick in der linken Spalten.-//
//  die gibt alle Fehlern und Warnungen aus.                                      //
//  Und die Funktion ueberblick() ruft ueberblick-XML per AJAX auf                //
//  check_error() gibt die Errors von action abfragen/errors in div-id #table_error aus
/*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

var info_box_overview =  function(modul_id){
    $("#box_info").empty();
    $("#box_info_exception").hide();
    $("#box_info_pool").show();
    $("#box_info_combobox").hide();
    $("#info_box").dialog('open');
    var html = $.ajax({
        type : 'POST',
        url  : '/abfragen/info/'+modul_id,
        data:authenticityTokenParameter(),
        async: false,
        contentType: 'application/x-www-form-urlencoded',
        success : function(html){
            $("#box_info").empty();
            $("#box_info").append(html);
            $("#box_info_overview").hide();
        },
        error: function(a,b,c){
            alert("problem with /abfragen/info");
        }
    }).responseText;
}

var ueberblick = function(){
    $("#ueberblick #ueberblick-wird-aktualisiert").show();
    var html = $.ajax({
        type : 'GET',
        url  : '/abfragen/ueberblick',
        async: false,
        contentType: 'application/x-www-form-urlencoded',
        success : function(html){
            $("#ueberblick #ueberblick_baum").empty();
            $("#ueberblick #ueberblick_baum").html(html);
            ajax_request_grade();
        },
        error: function(a,b,c){
            alert("problem with /abfragen/ueberblick");
        }
    }).responseText;
    //check_error();
    update_module_errors();
    // Klickbare Info-Buttons sollen beim dr�berfahren animiert werden, wie schon in global_javascript.js (OS)
    $(".ueberblick_info_box").mouseenter(function(){
        $(this).animate({
            opacity: 0.4
        }, "fast");
        $(this).animate({
            opacity: 1.0
        }, "slow");
    });
}// ende function
