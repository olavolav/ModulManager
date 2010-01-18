
 /*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
 //  diese Funktion ueberblickrekursiv() gibt den Überblick in der linken Spalten.-//
 //  die gibt alle Fehlern und Warnungen aus.                                      //
 //  Und die Funktion ueberblick() ruft ueberblick-XML per AJAX auf                //
 //  check_error() gibt die Errors von action abfragen/errors in div-id #table_error aus
 /*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/


// wenn der Überblick fertig geladen wurde, den Lade-Balken verscheinden lassen (OS)
$(document).ready(function(){
	$("#pleasewait").hide("slow");
});

var get_modul_info_in_overview =  function(modul_id){
        $("#box_info").empty();
        $("#box_info_exception").hide();
        $("#box_info_pool").hide();
        $("#box_info_combobox").hide();
        $("#info_box").dialog('open');
        var html = $.ajax({

                type : 'POST',
                url  : "/abfragen/info/"+modul_id+"&"+authenticityTokenParameter(),
                async: false,
                contentType: 'application/x-www-form-urlencoded',
                success : function(html){

                        $("#box_info").empty();
                        $("#box_info").append(html);
                        //$("#box_info_exception").hide();
                //$("#box_info_pool").hide();
                        $("#box_info_overview").hide();




                },
                error: function(a,b,c){
                        alert("problem with /abfragen/info");
                }



        }).responseText;

}
var ueberblick = function(){

        var html = $.ajax({
                type : 'GET',
                url  : '/abfragen/ueberblick',
                async: false,
                contentType: 'application/x-www-form-urlencoded',
                success : function(html){

                        $("#ueberblick #ueberblick_baum").empty();
                        //$("#ueberblick #ueberblick_baum").html(html+"<script type='text/javascript'>bindThickBoxEvents();</script>");
						$("#ueberblick #ueberblick_baum").html(html);
                        ajax_to_server_by_get_grade();


                },
                error: function(a,b,c){
                        alert("problem with /abfragen/ueberblick");
                }


        }).responseText;

        // Test, ob man die Bildchen im Firefox zum Blinken bringt, wenn man die Bilder alle versteckt
        // und dann sofort wieder anzeigt (OS)
        //$("#ueberblick img").css("display","none");
        //$("#ueberblick img").css("display","inline");
		
		//check_error();
		ajax_error();
		

}// ende function
