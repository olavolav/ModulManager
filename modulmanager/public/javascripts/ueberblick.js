
 /*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
 //  diese Funktion ueberblickrekursiv() gibt den Überblick in der linken Spalten.-//
 //  die gibt alle Fehlern und Warnungen aus.                                      //
 //  Und die Funktion ueberblick() ruft ueberblick-XML per AJAX auf                //
 /*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/




var ueberblick_rekursiv = function(root){


        //alert(root.nodeName);
        $(root).children().each(function(){

                var knoten_name=this.nodeName;

                //check blatt rule

                if (knoten_name == "rule"){

                        var rule_name = $(this).find("name").text();
                        var rule_alert =$(this).find("alert").text();

                        var rule_id   = $(this).find("id").text();
                        var parent    = $(this).parent().get(0);
                        var parent_id = $(parent).attr("id");

                        //check bild
                        var bild;

                        if(rule_alert != ""){
                                bild = rote_ipunkt;
                                $("#ueberblick").append("<div id='"+rule_id+"' style='display:none'>"+rule_alert+"</div>");

                        }
                        else {
                                bild = ipunkt;
                        }

                        $("#ueberblick #"+parent_id).append("<div class='ueberblick_rule' style='margin-left:5px;' id='"+rule_id+"'>"
                                                                                                        +"<table style='width:100%'>"
                                                                                                                +"<tr>"
                                                                                                                        +"<td style='width:79%'>"
                                                                                                                                + rule_name
                                                                                                                        +"</td>"+"<td style='width:9%'></td>"
                                                                                                                        +"<td style='width:19%'>"
                                                                                                                                +"<a href='#TB_inline?height=300&width=600&inlineId="+rule_id+"' class='thickbox' >"
                                                                                                                                        +bild
                                                                                                                                +"</a>"
                                                                                                                        +"</td>"
                                                                                                                +"</tr>"
                                                                                                        +"</table>"
                                                                                                + "</div>");



                        return;
                }// ende if- Check blatt
                else if (knoten_name == "category"){

                        //check bild
                        var bild = ipunkt;


                        var category_name = $(this).attr("name");
                        var category_id   = $(this).attr("id");
                        var parent = $(this).parent().get(0);
                        var parent_name = parent.nodeName;

                        //check nach 1.te Ebene Category

                        if (parent_name == "rules") {
                                $("#ueberblick").append("<div class='ueberblick_category' id='" + category_id + "'>"
                                                                                        +"<table style='width:100%'>"
                                                                                                +"<tbody>"
                                                                                                        +"<tr>"
                                                                                                                +"<td style='width:79%'>"
                                                                                                                        + category_name
                                                                                                                +"</td>"+"<td style='width:1%'></td>"
                                                                                                                +"<td style='width:10%'>"
                                                                                                                        +"<a href='#TB_inline?height=300&width=600&inlineId=6' class='thickbox' >"
                                                                                                                                +bild
                                                                                                                    +"</a>"
                                                                                                                +"</td>"
                                                                                                        +"</tr>"
                                                                                                +"<tbody>"
                                                                                        +"</table>"
                                                                                 + "</div>");
                        }

                        else if (parent_name == "category"){

                                //suche parent_id in #ueberblick

                                var parent_id = $(parent).attr("id");
                                $("#ueberblick #"+parent_id).append("<div class='ueberblick_category' style='margin-left:5px;' id='"+category_id+"'>" + category_name + "</div>");


                        }

                //rekursiv
                ueberblick_rekursiv(this);

                }// ende else if -check category



        });// ende each




}//ende function






//----------------------------------------------------------------------------------
var  removeThickBoxEvents=function() {
        //alert("hallo remove");
        $('.thickbox').each(function(i) {
            $(this).unbind('click');
        });
}

var bindThickBoxEvents= function() {
        //alert("hallo bind");
        removeThickBoxEvents();
        tb_init('a.thickbox, area.thickbox, input.thickbox');
    }

var get_modul_info_in_overview =  function(modul_id){
        $("#box_info").empty();
        $("#box_info_exception").hide();
        $("#box_info_pool").hide();
        $("#box_info_combobox").hide();
        $("#info_box").dialog('open');
        var html = $.ajax({

                type : 'POST',
                url  : "/abfragen/info/"+modul_id,
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
                        $("#ueberblick #ueberblick_baum").html(html+"<script type='text/javascript'>bindThickBoxEvents();</script>");
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

}// ende function
